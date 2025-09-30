const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("home", {
    username: req.user ? req.user.username : "Invité",
    routes: [
      { path: "/users", label: "👤 Utilisateurs" },
      { path: "/catways", label: "⚓ Catways" },
      { path: "/reservations", label: "🛥️ Réservations" }
    ]
  });
});

module.exports = router;