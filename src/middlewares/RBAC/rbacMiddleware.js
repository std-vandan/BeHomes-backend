const rbacMiddleware = (roles) => {
    return (req, res, next) => {
        console.log(req.user);
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: You do not have access" });
        }
        next();
    };
};

module.exports = rbacMiddleware;
