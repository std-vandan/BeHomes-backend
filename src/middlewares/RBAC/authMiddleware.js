const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

    // let token = req.header("Authorization")?.split(" ")[1]; // Get token from headers



    // if (!token && req.cookies?.token) {
    //     token = req.cookies.token; // Get token from cookies if available
    // }
    try {

        let token = req.cookies.token
        console.log(token);
        let date = new Date()
        // console.log(date);
        
        if (!token) return res.status(401).json({ message: "Please Login OR Register to access this protected routes!" });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded
        console.log(decoded);

        next();
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err.name });
    }
};

module.exports = authMiddleware;


