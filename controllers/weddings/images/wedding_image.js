const Images = require("../../../models/images");
const Weddings = require("../../../models/weddings");

const createWeddingImage = async (req, res) => {
    try {
        const { description, wedding_id } = req.body;
        const images = req.files;

        const wedding = await Weddings.findOne({
            where: {
                uuid: wedding_id,
                user_id: req.user
            }
        });

        if (!wedding) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk menambahkan gambar pada ke pernikahan ini!");
        }

        for (const image of images) {
            await Images.create({
                image_url: `/public/assets/images/${image.filename}`,
                description: description || "",
                wedding_id: wedding_id
            });
        res.status(201).responseWithData(201, true, "Gambar berhasil ditambahkan!"); 
        }
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createWeddingImage
}