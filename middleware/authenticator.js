const authMiddleware = {};

authMiddleware.setCurrentUser = (req, res, next) => {
  res.locals.currentUser = req.user;
  next();
};

authMiddleware.authenticate = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/log-in");
};

module.exports = authMiddleware;
