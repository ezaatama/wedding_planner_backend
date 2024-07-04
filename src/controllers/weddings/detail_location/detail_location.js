const DetailLocation = require("../../../models/detail_location");
const Weddings = require("../../../models/weddings");

const createDetailLocation = async (req, res) => {
    try {
        const { maps_akad, maps_resepsi, wedding_id } = req.body;

        const wedding = await Weddings.findOne({
            where: {
                uuid: wedding_id,
                user_id: req.user
            }
        });

        if (!wedding) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk menambahkan detail undangan ke pernikahan ini!");
        }

        const result = await DetailLocation.create({
            maps_akad: maps_akad || "",
            maps_resepsi: maps_resepsi || "",
            wedding_id: wedding_id
        });

        res.status(201).responseWithData(201, true, "Detail lokasi berhasil ditambahkan!", result); 
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createDetailLocation
}