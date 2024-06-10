const Users = require("../../models/users");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    const { username, email, password, confPassword, full_name, phone, role } = req.body;

    if (password !== confPassword)
        return res.status(400).responseNoData(400, false, "Password dan konfirmasi password tidak cocok");
        
    const salt = bcrypt.genSaltSync();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const accountId = req.role;

        if (accountId === "admin") {
            await Users.create({
                username: username,
                email: email,
                password: hashPassword,
                full_name: full_name,
                phone: phone,
                role: role
            });
            res.status(201).responseNoData(201, true, "Akun berhasil didaftarkan!");
        } else {
            res.status(403).responseNoData(403, false, "Tidak diizinkan membuat akun!");
        }
    } catch (error) {
        res.status(400).responseNoData(400, false, error.message);
    }
}

const findAllUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {

        const result = await Users.findAndCountAll({
            attributes: ["uuid", "username", "email", "full_name", "phone"],
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
            message: "Data users berhasil diambil!",
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
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createUser,
    findAllUser
};