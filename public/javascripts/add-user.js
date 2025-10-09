// public/javascripts/add-user.js

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".add-btn");
  const addForm = document.querySelector(".add-form");
  const cancelBtn = addForm?.querySelector(".cancel-btn");

  // Si le bouton Ajouter est cliqué → afficher le formulaire
  if (addBtn && addForm) {
    addBtn.addEventListener("click", () => {
      addForm.classList.remove("hidden");
      addBtn.style.display = "none";
    });
  }

  // Si le bouton Annuler est cliqué → cacher le formulaire
  if (cancelBtn && addForm) {
    cancelBtn.addEventListener("click", () => {
      addForm.classList.add("hidden");
      addBtn.style.display = "inline-block";
      addForm.reset();
    });
  }

// Soumission du formulaire (AJAX vers /api/users)
if (addForm) {
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // ⚠️ Empêche le rechargement de la page

    console.log("🟢 Formulaire d'ajout soumis via AJAX");

    const data = Object.fromEntries(new FormData(addForm));
    const messageBox = document.querySelector(".message");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const json = await res.json();
        console.log("✅ Réponse serveur :", json);

        // Affiche un message
        if (messageBox) messageBox.textContent = "✅ Utilisateur créé avec succès !";

        // Vide et cache le formulaire
        addForm.reset();
        addForm.classList.add("hidden");
        addBtn.style.display = "inline-block";

      } else {
        const error = await res.json();
        if (messageBox) messageBox.textContent = "❌ Erreur : " + (error.message || "impossible d’ajouter l’utilisateur");
      }
    } catch (err) {
      console.error("Erreur réseau :", err);
      if (messageBox) messageBox.textContent = "❌ Erreur réseau ou serveur.";
    }
  });
}
});