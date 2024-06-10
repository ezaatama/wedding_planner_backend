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

        req.session.userId = result.id;
        const userId = result.id;
        const emailId = result.email;
        const roleId = result.role;

        const accessToken = jwt.sign({
            userId,
            email: emailId,
            role: roleId
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.EXPIRES_IN
        });

        res.setHeader("X-Access-Token", accessToken);
        res.status(200).responseWithData(200, true, "Anda berhasil login!", { expiresIn: process.env.EXPIRES_IN });

    } catch (error) {
        res.status(500).responseNoData(500, false, error.message);
    }
}

module.exports = { login };