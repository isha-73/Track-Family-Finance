function isAuthorised(req, res, next) {
    if (req.session.user.position == "HEAD") {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
module.exports = isAuthorised;