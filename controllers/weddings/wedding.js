const Guests = require("../../models/guests");
const Weddings = require("../../models/weddings");
const moment = require('moment-timezone');

const createWeddings = async (req, res) => {
    try {
        const { groom_name, bride_name, wedding_date, venue, detail_venue, address, start_akad, end_akad, start_resepsi, end_resepsi, user_id } = req.body

        if (!groom_name || !bride_name || !wedding_date || !venue || !address || !start_akad || !end_akad || !start_resepsi || !end_resepsi || !user_id) {
            return res.status(400).responseNoData(400, false, "Semua field wajib diisi!");
        }

        if (user_id !== req.user) {
             return res.status(403).responseNoData(403, false, "Input data tidak sesuai dengan user yang login!");
        }

        const validVenues = ["aula", "rumah", "gedung"];
        if (!validVenues.includes(venue)) {
            return res.status(400).responseNoData(400, false, "Venue harus berupa 'aula', 'rumah' atau 'gedung'!");
        }

        // Memeriksa apakah user_id sudah ada di database
        const existingWedding = await Weddings.findOne({ where: { user_id: user_id } });

        if (existingWedding) {
            return res.status(409).responseNoData(
                409, false, "User ID ini sudah memiliki data wedding terdaftar!"
            );
        }

        // Ubah tanggal menjadi objek moment dengan format tertentu
        const momentDate = moment.utc(wedding_date, "DD-MM-YYYY");

        if (!momentDate.isValid()) {
            return res.status(400).responseNoData(400, false, "Format tanggal tidak valid!");
        }
   
        //CONVERT TANGGAL WIB
        const weddingDateInWIBTime = momentDate.tz('Asia/Jakarta').format();

        const result = await Weddings.create({
            groom_name: groom_name,
            bride_name: bride_name,
            wedding_date: weddingDateInWIBTime,
            venue: venue,
            detail_venue: detail_venue,
            address: address,
            start_akad: start_akad,
            end_akad: end_akad,
            start_resepsi: start_resepsi,
            end_resepsi: end_resepsi,
            user_id: req.user
        });

         res.status(201).responseWithData(201, true, "Wedding berhasil didaftarkan!", result); 
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

const findWedding = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const role = req.role;

        if (role === "admin") {
            const result = await Weddings.findAndCountAll({
                attributes: ["uuid", "groom_name", "bride_name", "wedding_date", "venue", "detail_venue", "address"],
                limit,
                offset
            });

            const totalItems = result.count;
            const totalPages = Math.ceil(totalItems / limit);

            if (page > totalPages) {
                // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
                return res.status(204).end();
            }

            const response = {
                code: 200,
                status: true,
                message: "Data wedding berhasil diambil!",
                data: result.rows,
                meta: {
                    totalItems,
                    totalPages,
                    currentPage: page
                }
            }

            if (page > 1) {
                response.meta.prevPage = page - 1;
            }
            if (page < totalPages) {
                response.meta.nextPage = page + 1;
            }
            res.status(200).json(response);
        } else {
            const result = await Weddings.findAndCountAll({
                attributes: ["uuid", "groom_name", "bride_name", "wedding_date", "venue", "detail_venue", "address"],
                where: {
                    user_id: req.user
                },
                limit,
                offset
            });

            const totalItems = result.count;
            const totalPages = Math.ceil(totalItems / limit);

            if (page > totalPages) {
                // Jika halaman yang diminta melebihi total halaman yang ada, kirim respons 204 (No Content).
                return res.status(204).end();
            }

            const response = {
                code: 200,
                status: true,
                message: "Data wedding berhasil diambil!",
                data: result.rows,
                meta: {
                    totalItems,
                    totalPages,
                    currentPage: page
                }
            }

            if (page > 1) {
                response.meta.prevPage = page - 1;
            }
            if (page < totalPages) {
                response.meta.nextPage = page + 1;
            }
            res.status(200).json(response);
        }        
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const findWeddingById = async (req, res) => {
    try {
        const role = req.role;
        const result = await Weddings.findOne({
            attributes: ["uuid", "groom_name", "bride_name", "wedding_date", "venue", "detail_venue", "address"],
            where: {
                uuid: req.params.uuid,
                ...(role !== "admin" && {
                    user_id: req.user
                })
            }
        });

        if (!result) {
            const weddingExists = await Weddings.findOne({
                where: { 
                    uuid: req.params.uuid
                }
            });

            if (weddingExists) {
                return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk melihat detail wedding ini!");
            }
            return res.status(404).responseNoData(404, false, "Data detail wedding tidak ditemukan!");
        }

        res.status(200).responseWithData(200, true, "Data detail wedding berhasil diambil!", result);
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const updateWedding = async (req, res) => {
    const role = req.role;
    const result = await Weddings.findOne({
        where: {
            uuid: req.params.uuid,
            ...(role !== "admin" && {
                    user_id: req.user
            })
        }
    });

    if(!result) {
        const weddingExists = await Weddings.findOne({
            where: { 
                uuid: req.params.uuid 
            }
        });

        if (weddingExists) {
            return res.status(403).responseNoData(403, false, "Anda tidak memiliki izin untuk melihat detail wedding ini!");
        }
        return res.status(404).responseNoData(404, false, "Data wedding tidak ditemukan!");
    }

    const { groom_name, bride_name, wedding_date, venue, detail_venue, address, start_akad, end_akad, start_resepsi, end_resepsi } = req.body;
    let updateFields = {};

    if (groom_name !== undefined) updateFields.groom_name = groom_name;
    if (bride_name !== undefined) updateFields.bride_name = bride_name;

    if (wedding_date !== undefined) {
        const momentDate = moment.utc(wedding_date, "DD-MM-YYYY");
        if (!momentDate.isValid()) {
            return res.status(400).responseNoData(400, false, "Format tanggal tidak valid!");
        }
        updateFields.wedding_date = momentDate.tz('Asia/Jakarta').format();
    }

    if (venue !== undefined) {
        const validVenues = ["aula", "rumah"];
        if (!validVenues.includes(venue)) {
            return res.status(400).responseNoData(400, false, "Venue harus berupa 'aula' atau 'rumah'!");
        }
        updateFields.venue = venue;
    }

    if (detail_venue !== undefined) updateFields.detail_venue = detail_venue;
    if (address !== undefined) updateFields.address = address;
    if (start_akad !== undefined) updateFields.start_akad = start_akad;
    if (end_akad !== undefined) updateFields.end_akad = end_akad;
    if (start_resepsi !== undefined) updateFields.start_resepsi = start_resepsi;
    if (end_resepsi !== undefined) updateFields.end_resepsi = end_resepsi;

    try {
        await Weddings.update(updateFields, {
            where: {
                uuid: req.params.uuid,
            }
        });

        res.status(201).responseNoData(201, true, "Wedding berhasil diubah!");
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const deleteWedding = async (req, res) => {
    try {
        const role = req.role;
        const result = await Weddings.findOne({
            where: {
                uuid: req.params.uuid || null,
                ...(role !== "admin" && {
                    user_id: req.user
                })
            }
        });

        if (!result) return res.status(404).responseNoData(404, false, "Data wedding tidak ditemukan!");

        await Weddings.destroy({
            where: {
                uuid: result.uuid
            }
        });

        res.status(200).responseNoData(200, true, "Wedding berhasil dihapus!");
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createWeddings,
    findWedding,
    findWeddingById,
    updateWedding,
    deleteWedding
}