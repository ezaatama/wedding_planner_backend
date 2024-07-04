const responseMiddleware = (req, res, next) => {
    res.responseNoData = (code, status, message) => {
        res.status(code).json({
            "code": code,
            "status": status,
            "message": message
        });
    };

    res.responseWithData = (code, status, message, data) => {
        res.status(code).json({
            "code": code,
            "status": status,
            "message": message,
            "data": data
        });
    }

    next();
};

module.exports = responseMiddleware;