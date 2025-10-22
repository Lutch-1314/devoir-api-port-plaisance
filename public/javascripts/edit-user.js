document.addEventListener('DOMContentLoaded', () => {
  const editButtons = document.querySelectorAll('.edit-btn');
  const updateForms = document.querySelectorAll('.update-form');

  if (!editButtons.length || !updateForms.length) return;

  editButtons.forEach((editBtn, index) => {
    const form = updateForms[index];
    const cancelBtn = form.querySelector('.cancel-btn');

    // Afficher le formulaire d'édition
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      form.classList.remove('hidden');
      editBtn.classList.add('hidden');
    });

    // Annuler la modification
    const resetPasswordFields = () => {
      form.querySelector('input[name="password"]').value = '';
      form.querySelector('input[name="confirmPassword"]').value = '';
    };

    cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      form.classList.add('hidden');
      editBtn.classList.remove('hidden');
      resetPasswordFields();
    });

    // Cacher le formulaire si on clique ailleurs
    document.addEventListener('click', (e) => {
      if (!form.contains(e.target) && e.target !== editBtn) {
        if (!form.classList.contains('hidden')) {
          form.classList.add('hidden');
          editBtn.classList.remove('hidden');
          resetPasswordFields();
        }
      }
    });

    // Vérification mot de passe avant envoi
    form.addEventListener('submit', (e) => {
      const password = form.querySelector('input[name="password"]').value;
      const confirmPassword = form.querySelector('input[name="confirmPassword"]').value;

      if (!password) return; // pas de mot de passe → rien à valider

      const errors = [];

      if (password !== confirmPassword) {
        errors.push('Les mots de passe ne correspondent pas.');
      }

      if (password.length < 8) {
        errors.push('Le mot de passe doit contenir au moins 8 caractères.');
      }

      const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/;
      if (!regex.test(password)) {
        errors.push('Le mot de passe doit contenir au moins une majuscule, un chiffre et un caractère spécial.');
      }

      if (errors.length) {
        e.preventDefault();
        alert(errors.join('\n'));
      }
    });
  });
});
