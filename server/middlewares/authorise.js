// function isAuthorised(req, res, next) {
//     if (req.session.user.position == "HEAD") {
//         next();
//     } else {
//         res.status(401).json({ message: 'Unauthorized' });
//     }
// }
// module.exports = isAuthorised;
function isAuthorised(req, res, next) {
    console.log(req.session); // Log the session object to debug
    if (req.session && req.session.user && req.session.user.position === "HEAD") {
        next();
    } else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
module.exports = isAuthorised;