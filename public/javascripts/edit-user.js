function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.editable-table.users tr').forEach(row => {
    const editBtn = row.querySelector('.edit-btn');
    const form = row.querySelector('.update-form');
    const cancelBtn = form?.querySelector('.cancel-btn');

    if (!editBtn || !form) return;

    const usernameCell = row.children[0];
    const emailCell = row.children[1];

    // Afficher le formulaire
    editBtn.addEventListener('click', () => {
      form.classList.remove('hidden');
      editBtn.classList.add('hidden');
    });

    // Annuler
    cancelBtn?.addEventListener('click', () => {
      form.classList.add('hidden');
      editBtn.classList.remove('hidden');
      form.reset();
    });

    // Validation mot de passe
    function validatePassword(password, confirmPassword) {
      if (!password && !confirmPassword) return null; // pas de mot de passe, pas de validation
      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!regex.test(password)) return 'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial.';
      if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas.';
      return null;
    }

    // Soumission AJAX
    form.addEventListener('submit', async e => {
      e.preventDefault();

      const emailOriginal = form.dataset.email;
      const username = form.querySelector('[name="username"]').value;
      const email = form.querySelector('[name="email"]').value;
      const password = form.querySelector('[name="password"]').value;
      const confirmPassword = form.querySelector('[name="confirmPassword"]').value;

      // Validation
      const validationError = validatePassword(password, confirmPassword);
      if (validationError) {
        showMessage(validationError, 'error');
        return;
      }

      const payload = { username, email };
      if (password) payload.password = password;

      try {
        const response = await fetch(`/api/users/${encodeURIComponent(emailOriginal)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const updatedUser = await response.json();
          usernameCell.textContent = updatedUser.username;
          emailCell.textContent = updatedUser.email;

          form.classList.add('hidden');
          editBtn.classList.remove('hidden');
          showMessage('Utilisateur mis à jour avec succès !', 'success');

          // Mettre à jour l'attribut data-email pour les prochaines modifications
          form.dataset.email = updatedUser.email;
        } else {
          const err = await response.json();
          showMessage(err.message || 'Erreur lors de la modification', 'error');
        }
      } catch (err) {
        showMessage(err.message, 'error');
      }
    });
  });
});
