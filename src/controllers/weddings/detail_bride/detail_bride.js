const DetailBride = require("../../../models/detail_bride");
const Weddings = require("../../../models/weddings");

const createDetailBride = async (req, res) => {
    try {
        const { groom_to, bride_to, groom_parent, 
            bride_parent, groom_no_rek, groom_name_rek, 
            groom_bank_rek, bride_no_rek, bride_name_rek, 
            bride_bank_rek, send_gift_address, wedding_id } = req.body;

        const wedding = await Weddings.findOne({
            where: {
                uuid: wedding_id,
                user_id: req.user
            }
        });

        if (!wedding) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk menambahkan detail undangan ke pernikahan ini!");
        }

        const result = await DetailBride.create({
            groom_to: groom_to || '',
            bride_to: bride_to || '',
            groom_parent: groom_parent || '',
            bride_parent: bride_parent || '',
            groom_no_rek: groom_no_rek || '',
            groom_name_rek: groom_name_rek || '',
            groom_bank_rek: groom_bank_rek || '',
            bride_no_rek: bride_no_rek || '',
            bride_name_rek: bride_name_rek || '',
            bride_bank_rek: bride_bank_rek || '',
            send_gift_address: send_gift_address || '',
            wedding_id: wedding_id
        });
        res.status(201).responseWithData(201, true, "Detail bride berhasil ditambahkan!", result); 
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createDetailBride
}