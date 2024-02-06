import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (token) {
    // console.log(token);
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      // console.log(decoded);
      // console.log('token', decoded.user._id);

      next();
    } catch (e) {
      return res.status(401).json({
        Status: false,
        message: 'Invalid Token',
      });
    }
  } else {
    return res.status(401).json({
      Status: false,
      message: 'No Token Provided',
    });
  }
};

const verifyUserAccess = (req, res, next) => {
  verifyToken(req, res, () => {
    const check2 = req.user.user.role;
    const id = req.params.id;
    console.log(id);
    console.log(req.user.user._id);
    if (req.user.user._id === id || check2 === 'admin') {
      next();
    } else {
      return res.status(403).json({
        Status: false,
        message: 'Not Allowed, Only User can access His Profile',
      });
    }
  });
};

const verifyAdmen = (req, res, next) => {
  verifyToken(req, res, () => {
    const check2 = req.user.user.role;
    console.log(check2);

    if (check2 === 'admin') {
      next();
    } else {
      return res.status(403).json({
        Status: false,
        message: 'Not Allowed, Only Admin',
      });
    }
  });
};

const verifyUserAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    const check2 = req.user.user.role;
    console.log(check2c);
    const { id } = req.params;
    if (check2 === 'admin' || req.user.user._id === id) {
      next();
    } else {
      return res.status(403).json({
        Status: false,
        message: 'Not Allowed, Only User can access His Profile or Admin',
      });
    }
  });
};
export { verifyToken, verifyAdmen, verifyUserAndAdmin, verifyUserAccess };
