const replaceSpacesMiddleware = (req, res, next) => {
    if (req.params.groomBride) {
      req.params.groomBride = req.params.groomBride.replace(/%20/g, ' ');
    }
    if (req.query.kepada) {
      req.query.kepada = req.query.kepada.replace(/%20/g, ' ');
    }
    next();
  };

module.exports = replaceSpacesMiddleware;