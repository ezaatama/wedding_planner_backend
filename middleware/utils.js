const replaceSpacesMiddleware = (req, res, next) => {
    if (req.params.groomBride) {
      req.params.groomBride = req.params.groomBride.replace(/\s/g, '+');
    }
    if (req.query.kepada) {
      req.query.kepada = req.query.kepada.replace(/\s/g, '+');
    }
    next();
  };

module.exports = replaceSpacesMiddleware;