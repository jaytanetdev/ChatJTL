const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // ดึง Token จาก Header Authorization

    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    jwt.verify(token, 'tanet_limsumangkolkun', (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid Token' });
        }
        req.user = decoded; // ถ้า Token ถูกต้อง ถอดรหัสข้อมูลและเก็บใน req.user
        next();
    });
}

module.exports = {
    authenticateToken: authenticateToken
};
