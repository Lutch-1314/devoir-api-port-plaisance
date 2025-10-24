function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addUserForm');
  const addBtn = document.querySelector('.add-btn');
  const cancelBtn = form.querySelector('.cancel-btn');

  // Afficher le formulaire
  addBtn?.addEventListener('click', () => {
    form.classList.remove('hidden');
    addBtn.classList.add('hidden');
  });

  // Annuler
  cancelBtn?.addEventListener('click', () => {
    form.classList.add('hidden');
    addBtn.classList.remove('hidden');
    form.reset();
  });

  // Validation mot de passe
  function validatePassword(password, confirmPassword) {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regex.test(password)) return 'Le mot de passe doit contenir au moins 8 caractères, 1 majuscule, 1 chiffre et 1 caractère spécial.';
    if (password !== confirmPassword) return 'Les mots de passe ne correspondent pas.';
    return null;
  }

  // Soumission AJAX
  form?.addEventListener('submit', async e => {
    e.preventDefault();

    const username = form.querySelector('[name="username"]').value;
    const email = form.querySelector('[name="email"]').value;
    const password = form.querySelector('[name="password"]').value;
    const confirmPassword = form.querySelector('[name="confirmPassword"]').value;

    // Validation côté client
    const validationError = validatePassword(password, confirmPassword);
    if (validationError) {
      showMessage(validationError, 'error');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        showMessage('Utilisateur ajouté avec succès !', 'success');

        // Ajouter directement l'utilisateur dans le tableau
        const tbody = document.querySelector('.editable-table.users tbody');
        const newRow = document.createElement('tr');
        newRow.dataset.email = data.user.email;
        newRow.innerHTML = `
          <td>${data.user.username}</td>
          <td>${data.user.email}</td>
          <td>
            <button type="button" class="edit-btn">Modifier</button>
            <button type="button" class="delete-btn" data-type="user">Supprimer</button>
          </td>
        `;
        tbody.appendChild(newRow);

        form.reset();
        form.classList.add('hidden');
        addBtn.classList.remove('hidden');
      } else {
        const err = await response.json();
        showMessage(err.message || 'Erreur lors de l’ajout', 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  });
});
