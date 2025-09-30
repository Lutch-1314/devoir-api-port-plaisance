const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

function checkJWT(req, res, next) {
  const token = req.cookies.token; // récupéré du cookie
  if (!token) return res.redirect("/home"); // pas connecté → retour accueil

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    req.user = {
      username: decoded.username,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error("JWT invalide :", err.message);
    return res.redirect("/");
  }
}

module.exports = checkJWT;  // ✅ export direct