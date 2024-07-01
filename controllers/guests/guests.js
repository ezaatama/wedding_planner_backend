const Guests = require("../../models/guests");
const Weddings = require("../../models/weddings");

const createGuests = async (req, res) => {
    try {
        const { guest_name, email, phone, address, rsvp_status, wedding_id } = req.body;

        if (!guest_name || !wedding_id) {
            return res.status(400).responseNoData(400, false, "Tamu undangan wajib diisi!");
        }

        const validGuests = ["pending", "accepted", "declined"];
        if (!validGuests.includes(rsvp_status)) {
            return res.status(400).responseNoData(400, false, "Status reservasi harus berupa 'pending', 'accepted' atau 'declined'!");
        }

        const wedding = await Weddings.findOne({
            where: {
                uuid: wedding_id,
                user_id: req.user
            }
        });

        if (!wedding) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk menambahkan tamu ke pernikahan ini!");
        }

        const result = await Guests.create({
            guest_name: guest_name,
            email: email,
            phone: phone,
            address: address,
            rsvp_status: rsvp_status,
            wedding_id: wedding_id
        })
        res.status(201).responseWithData(201, true, "Tamu berhasil didaftarkan!", result); 
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

const findGuests = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const role = req.role;
        const userId = req.user;

        // Jika role bukan admin, cari wedding_id berdasarkan user_id
        let whereCondition = {};

        if (role !== "admin") {
            const wedding = await Weddings.findOne({
                attributes: ["uuid"],
                where: { user_id: userId }
            });

            if (!wedding) {
                return res.status(404).responseNoData(404, false, 'Data wedding tidak ditemukan!');
            }

            whereCondition = { wedding_id: wedding.uuid };
        }

        // Query untuk mendapatkan data tamu
        const result = await Guests.findAndCountAll({
            attributes: ["id", "guest_name", "email", "phone", "address", "rsvp_status", "wedding_id"],
            limit,
            offset,
            where: whereCondition,
            include: [
                {
                    model: Weddings,
                    attributes: ["groom_name", "bride_name", "wedding_date", "venue", "detail_venue", "address"],
                    as: 'wedding'
                }
            ]
        });

        const totalItems = result.count;
        const totalPages = Math.ceil(totalItems / limit);

        if (page > totalPages) {
            return res.status(204).end();
        }

        const response = {
            code: 200,
            status: true,
            message: "Data tamu berhasil diambil!",
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
        console.error('Error:', error);
        res.status(500).json({ code: 500, status: false, message: error.message });
    }
}

const findGuestById = async (req, res) => {
    try {
        const guestName = req.query.kepada || "";
        const role = req.role;
        const userId = req.user;

        // Jika role bukan admin, cari wedding_id berdasarkan user_id
        let whereCondition = { guest_name: guestName };

        if (role !== "admin") {
            const wedding = await Weddings.findOne({
                attributes: ["uuid"],
                where: { user_id: userId }
            });

            if (!wedding) {
                return res.status(404).json({ code: 404, status: false, message: 'Data wedding tidak ditemukan!' });
            }

            whereCondition.wedding_id = wedding.uuid;
        }

        const result = await Guests.findOne({
            attributes: ["id", "guest_name"],
            where: whereCondition,
            include: [
                {
                    model: Weddings,
                    attributes: ["groom_name", "bride_name", "wedding_date", "venue", "detail_venue", "address"],
                    as: 'wedding'
                }
            ]
        });

        if (!result) {
            return res.status(404).responseNoData(404, false, 'Data guests tidak ditemukan!');
        }

        res.status(200).json({
            code: 200,
            status: true,
            message: 'Data guest berhasil ditemukan!',
            data: result
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ code: 500, status: false, message: error.message });
    }
}

const updateGuest = async (req, res) => {
    try {
        const role = req.role;
        const userId = req.user;

        // Default nilai wedding_id yang akan digunakan untuk validasi
        let weddingIdToUpdate;

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

        // Cari guest berdasarkan id
        const guest = await Guests.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!guest) {
            return res.status(404).responseNoData(404, false, 'Data guests tidak ditemukan!');
        }

        // Jika bukan admin, pastikan guest terhubung dengan wedding_id yang terkait dengan user
        if (role !== "admin" && guest.wedding_id !== weddingIdToUpdate) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk mengubah guest ini!");
        }

        const { guest_name, email, phone, address, rsvp_status } = req.body;
        let updateFields = {};

        if (guest_name !== undefined) updateFields.guest_name = guest_name;
        if (email !== undefined) updateFields.email = email;
        if (phone !== undefined) updateFields.phone = phone;
        if (address !== undefined) updateFields.address = address;
        if (rsvp_status !== undefined) {
            const validRsvp = ["pending", "accepted", "declined"];
            if (!validRsvp.includes(rsvp_status)) {
                return res.status(400).responseNoData(400, false, "Rsvp status harus berupa 'pending', 'accepted, atau 'declined'!");
            }
            updateFields.rsvp_status = rsvp_status;
        }

        await Guests.update(updateFields, {
            where: {
                id: req.params.id
            }
        });

        res.status(200).responseNoData(200, true, "Guest berhasil diubah!");

    } catch (error) {
        console.error('Error:', error);
        res.status(500).responseNoData( 500, false, error.message);
    }
}

const deleteGuests = async (req, res) => {
    try {
        const role = req.role;
        const userId = req.user;

        // Default nilai wedding_id yang akan digunakan untuk validasi
        let weddingIdToUpdate;

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

        // Cari guest berdasarkan id
        const guest = await Guests.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!guest) {
            return res.status(404).responseNoData(404, false, 'Data guests tidak ditemukan!');
        }

        // Jika bukan admin, pastikan guest terhubung dengan wedding_id yang terkait dengan user
        if (role !== "admin" && guest.wedding_id !== weddingIdToUpdate) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk menghapus guest ini!");
        }
        await Guests.destroy({
            where: {
                id: req.params.id
            }
        });

        res.status(200).responseNoData(200, true, "Guest berhasil dihapus!");
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createGuests,
    findGuests,
    findGuestById,
    updateGuest,
    deleteGuests
}