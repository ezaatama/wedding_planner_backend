const Weddings = require("../../models/weddings");
const moment = require('moment-timezone');

const createWeddings = async (req, res) => {
    try {
        const { groom_name, bride_name, wedding_date, venue, address, user_id } = req.body

        if (!groom_name || !bride_name || !wedding_date || !venue || !address || !user_id) {
            return res.status(400).responseNoData(400, false, "Semua field wajib diisi!");
        }

        if (user_id !== req.user) {
             return res.status(403).responseNoData(403, false, "Input data tidak sesuai dengan user yang login!");
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
            address: address,
            user_id: req.session.userId
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
                attributes: ["id", "groom_name", "bride_name", "wedding_date", "venue", "address"],
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
                attributes: ["id", "groom_name", "bride_name", "wedding_date", "venue", "address"],
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
            attributes: ["id", "groom_name", "bride_name", "wedding_date", "venue", "address"],
            where: {
                id: req.params.id,
                ...(role !== "admin" && {
                    user_id: req.user
                })
            }
        });

        if (!result) {
            const weddingExists = await Weddings.findOne({
                where: { 
                    id: req.params.id 
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

module.exports = {
    createWeddings,
    findWedding,
    findWeddingById
}