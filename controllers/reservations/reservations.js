const Weddings = require("../../models/weddings");
const Guests = require("../../models/guests");
const Reservations = require("../../models/reservations");

const findReservation = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const role = req.role;
        const userId = req.user;

        let whereCondition = {};

        if (role !== "admin") {
            const wedding = await Weddings.findOne({
                attributes: ["uuid"],
                where: {
                    user_id: userId
                }
            });

            if (!wedding) {
                return res.status(404).responseNoData(404, false, 'Data wedding tidak ditemukan!');
            }

            whereCondition = { wedding_id: wedding.uuid };
        }

        const result = await Reservations.findAndCountAll({
            limit,
            offset,
            where: whereCondition
        });

        const totalItems = result.count;
        const totalPages = Math.ceil(totalItems/limit);

        if (page > totalPages) {
            return res.status(204).end();
        }

        const response = {
            code: 200,
            status: true,
            message: "Data reservasi berhasil diambil!",
            data: result.rows,
            meta: {
                totalItems,
                totalPages,
                currentPage: page
            }
        };

        if (page > 1) {
            response.meta.prevPage = page - 1;
        }
        if (page < totalPages) {
            response.meta.nextPage = page + 1;
        }

        res.status(200).json(response);
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const updateReservation = async (req, res) => {
    try {
        const role = req.role;
        const userId = req.user;

        const { wedding_id, guest_id, response } = req.body;

        const validResponse = ["accepted", "declined"];
        if (!validResponse.includes(response)) {
            return res.status(400).responseNoData(400, false, "Response harus berupa 'accepted' atau 'declined'!");
        }

        let weddingIdToUpdate = wedding_id;

        if (role !== "admin") {
            const wedding = await Weddings.findOne({
                attributes: ["uuid"],
                where: { user_id: userId }
            });

            if (!wedding) {
                return res.status(404).responseNoData(404, false, 'Data wedding tidak ditemukan!');
            }

            weddingIdToUpdate = wedding.uuid;
        }

        // Validasi guest dan wedding
        const guest = await Guests.findOne({
            where: {
                id: guest_id,
                wedding_id: weddingIdToUpdate
            }
        });

        if (!guest) {
            return res.status(404).responseNoData(404, false, 'Guest tidak ditemukan untuk wedding ini!');
        }

        // Update status RSVP di tabel guests
        await Guests.update({ rsvp_status: response }, {
            where: { id: guest_id }
        });

        // Update atau insert di tabel reservations
        const [reservation, created] = await Reservations.upsert({
            wedding_id: weddingIdToUpdate,
            guest_id: guest_id,
            response: response
        }, {
            where: { wedding_id: weddingIdToUpdate, guest_id: guest_id }
        });

        if (created) {
            return res.status(201).responseWithData(201, true, 'Reservation created successfully', reservation);
        } else {
            return res.status(200).responseWithData(200, true, 'Reservation updated successfully', reservation);
        }

    } catch (error) {
        res.status(500).responseNoData(500, false,error.message);
    }
}

module.exports = {
    findReservation,
    updateReservation
}