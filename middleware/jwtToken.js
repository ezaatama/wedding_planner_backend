const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return res.status(401).json({ message: "Unauthorized"});
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(401).responseNoData(401, false, "Sesi Anda Telah Habis!");
        req.email = decoded.email;
        req.user = decoded.uuid;
        req.role = decoded.role;

        next();
    });
};

module.exports = verifyToken;