const Weddings = require("../../models/weddings");
const Guests = require("../../models/guests");
const Reservations = require("../../models/reservations");

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
    updateReservation
}