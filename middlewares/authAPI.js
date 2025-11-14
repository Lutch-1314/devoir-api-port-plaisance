const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function authApi(req, res, next) {
  // Récupération du token dans l'en-tête Authorization : Bearer xxx
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error("JWT invalide :", err.message);
    return res.status(403).json({ message: "Token invalide" });
  }
}

module.exports = authApi;