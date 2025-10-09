document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.edit-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const form = btn.nextElementSibling; // le <form> est juste après le bouton
      if (!form) return;

      // Masquer le bouton et afficher le formulaire
      btn.classList.add('hidden');
      form.classList.remove('hidden');
    });
  });

  document.querySelectorAll('.cancel-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const form = btn.closest('.update-form');
      const editBtn = form?.previousElementSibling;

      // Masquer le formulaire et réafficher le bouton "Modifier"
      form.classList.add('hidden');
      if (editBtn) editBtn.classList.remove('hidden');
    });
  });
});