document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-btn');
  const addForm = document.querySelector('.add-form');
  const cancelBtn = addForm.querySelector('.cancel-btn');

  if (!addBtn || !addForm) return;

  // --- Afficher le formulaire ---
  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addForm.classList.remove('hidden');
    addBtn.classList.add('hidden');
  });

  // --- Annuler ---
  cancelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addForm.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });

  // --- Cacher le formulaire si on clique ailleurs ---
  document.addEventListener('click', (e) => {
    if (!addForm.contains(e.target) && e.target !== addBtn) {
      if (!addForm.classList.contains('hidden')) {
        addForm.classList.add('hidden');
        addBtn.classList.remove('hidden');
      }
    }
  });

  // --- Soumission AJAX du formulaire ---
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(addForm);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        alert(result.message || 'Erreur lors de l’ajout');
        return;
      }

      // Redirige pour rafraîchir la page avec message de succès
      window.location.href = '/users?message=Utilisateur ajouté avec succès&messageType=success';

    } catch (err) {
      console.error('🔥 Erreur AJAX:', err);
      alert('Erreur lors de l’ajout de l’utilisateur.');
    }
  });
});
