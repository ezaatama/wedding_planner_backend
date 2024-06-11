const Users = require("../../models/users");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
    const { username, email, password, confPassword, full_name, phone, role } = req.body;

    if (password !== confPassword)
        return res.status(400).responseNoData(400, false, "Password dan konfirmasi password tidak cocok");
        
    const salt = bcrypt.genSaltSync();
    const hashPassword = await bcrypt.hash(password, salt);

    try {
        const existingUser = await Users.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }]
            },
            paranoid: false // Sertakan entri yang dihapus dalam pencarian
        });

        if (existingUser && !existingUser.deletedAt) {
            return res.status(400).responseNoData(400, false, "Username atau email sudah terdaftar");
        }

        await Users.create({
            username: username,
            email: email,
            password: hashPassword,
            full_name: full_name,
            phone: phone,
            role: role
        });
        res.status(201).responseNoData(201, true, "Akun berhasil didaftarkan!");
    } catch (error) {
        res.status(400).responseNoData(400, false, error.message);
    }
}

const findAllUser = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    try {
        const accountId = req.role;
        
        if (accountId === "admin") {
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
        } else {
            res.status(403).responseNoData(403, false, "Anda tidak memiliki izin akses halaman ini!");
        }
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const findUserById = async (req, res) => {
    try {
          const response = await Users.findOne({
            attributes: ["uuid", "username", "email", "full_name", "phone"],
            where: {
                uuid: req.params.uuid
            }
        });
        if (!response) return res.status(404).responseNoData(404, false, "Data detail akun tidak ditemukan!");

        res.status(200).responseWithData(200, true, "Data detail akun berhasil diambil!", response);
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const updateUser = async (req, res) => {
     const result = await Users.findOne({
        where: {
            uuid: req.params.uuid
        }
    });

    if (!result) return res.status(404).responseNoData(404, false, "Data akun tidak ditemukan!");

    const { email, password, full_name, phone, role} = req.body;
    let hashPassword = result.password; // Default ke password lama

    if (password && password !== "") {
        const salt = bcrypt.genSaltSync();
        hashPassword = await bcrypt.hash(password, salt);
    }

    try {
        const accountId = req.role;

        if (accountId === "admin") {
            await Users.update({
                email: email,
                password: hashPassword,
                full_name: full_name,
                phone: phone,
                role: role
            }, {
                where: {
                    uuid: req.params.uuid
                }
            });
             res.status(201).responseNoData(201, true, "Akun berhasil diubah!");
        } else {
             res.status(403).responseNoData(403, false, "Tidak diizinkan mengubah akun!");
        }
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

const deleteUser = async (req, res) => {
    try {
        const result = await Users.findOne({
            where: {
                uuid: req.params.uuid || null
            }
        });

        if (!result) return res.status(404).responseNoData(404, false, "Data akun tidak ditemukan!");

        const accountId = req.role;

        if (accountId === "admin") {
            await Users.destroy({
                where: {
                  uuid: result.uuid,
                },
              });
             res.status(200).responseNoData(200, true, "Akun berhasil dihapus!");
        } else {
             res.status(403).responseNoData(403, false, "Tidak diizinkan menghapus data users!");
        }
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = {
    createUser,
    findAllUser,
    findUserById,
    updateUser,
    deleteUser
};