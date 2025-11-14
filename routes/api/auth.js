const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Email incorrect" });

    const isValid = await user.comparePassword(password);
    if (!isValid) return res.status(401).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { username: user.username, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: "24h" }
    );

    return res.json({ token });
  } catch (err) {
    console.error("❌ Login API Error :", err);
    res.status(500).json({ message: "Erreur interne" });
  }
});

module.exports = router;