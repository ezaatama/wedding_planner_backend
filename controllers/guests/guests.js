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
            return res.status(403).json({ success: false, message: "Anda tidak memiliki izin untuk menambahkan tamu ke pernikahan ini!" });
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

}

module.exports = {
    createGuests,
    findGuests
}