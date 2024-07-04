const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../../models/users");

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const result = await Users.findOne({
            where: {
                email: email
            }
        });

        if (!result)
        return res.status(400).responseNoData(400, false, "Email yang dimasukkan tidak terdaftar!");

        const match = await bcrypt.compare(password, result.password);
        if (!match)
        return res.status(400).responseNoData(400, false, "Password yang Anda masukkan salah!");

        if (result.role !== role)
            return res.status(403).responseNoData(403, false, "Role yang Anda masukkan tidak sesuai!");

        req.session.userId = result.uuid;
        const userId = result.id;
        const uuid = result.uuid;
        const emailId = result.email;
        const roleId = result.role;

        const accessToken = jwt.sign({
            userId,
            uuid,
            emailId,
            roleId
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.EXPIRES_IN
        });

        res.setHeader("X-Access-Token", accessToken);
        res.status(200).responseWithData(200, true, "Anda berhasil login!", { expiresIn: process.env.EXPIRES_IN });
    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

const me = async (req, res) => {
    try {
        const result = await Users.findOne({
            attributes: ["uuid", "username", "email", "full_name", "phone"],
            where : {
                uuid: req.user
            }
        });

        if (!result) {
            return res.status(404).responseNoData(404, false, "Akun tidak ditemukan!");
        }

         res.status(200).responseWithData(200, true, "Akun berhasil diambil!", result);
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

const changePass = async (req, res) => {
    const { currentPassword, password, newPassword } = req.body;
    
    try {
        const result = await Users.findOne({
            where: {
                uuid: req.session.userId
            }
        });

        if (!result) return res.status(404).responseNoData(404, false, "Akun tidak ditemukan!");

        const isPasswordValid = await bcrypt.compare(currentPassword, result.password);
      
        if (!isPasswordValid) {
             res.status(400).responseNoData(400, false, "Password yang Anda masukkan salah!");
        }
        
        if (password !== newPassword) {
             res.status(400).responseNoData(400, false, "Password dan konfirmasi password tidak cocok!");
        }

        const salt = bcrypt.genSaltSync();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.update({
            password: hashPassword,
        }, {
            where: {
                uuid: req.session.userId
            }
        });

         res.status(200).responseNoData(200, true, "Password berhasil diubah!");
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(400).responseNoData(400, false, "Anda tidak dapat logout!");
            res.removeHeader("X-Access-Token");
            res.status(200).responseNoData(200, true, "Anda berhasil logout!");
        });
    } catch (error) {
         res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = { login, me, changePass, logout };