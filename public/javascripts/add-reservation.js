function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.style.display = 'block';
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addReservationForm');
  const cancelBtn = form.querySelector('.cancel-btn');
  const addBtn = document.querySelector('.show-add-form-btn'); // ton bouton principal "Ajouter une réservation"

  // 🔹 Montrer le formulaire quand on clique sur "Ajouter une réservation"
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      form.classList.remove('hidden');
      addBtn.classList.add('hidden');
    });
  }

  // 🔹 Cacher le formulaire quand on clique sur "Annuler"
  cancelBtn.addEventListener('click', () => {
    form.classList.add('hidden');
    if (addBtn) addBtn.classList.remove('hidden');
    form.reset();
  });

  // 🔹 Soumettre le formulaire en AJAX
  form.addEventListener('submit', async e => {
    e.preventDefault();

    const catwayNumber = form.catwayNumber.value;
    const clientName = form.clientName.value;
    const boatName = form.boatName.value;
    const startDate = form.startDate.value;
    const endDate = form.endDate.value;

    try {
      const response = await fetch(`/api/catways/${catwayNumber}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          catwayNumber,
          clientName,
          boatName,
          startDate,
          endDate
        })
      });

      if (response.ok) {
        showMessage('Réservation ajoutée avec succès', 'success');
        form.reset();
        form.classList.add('hidden');
        if (addBtn) addBtn.classList.remove('hidden');

        // Recharger la page pour afficher la nouvelle ligne
        window.location.reload();
      } else {
        const err = await response.json();
        showMessage(err.message || 'Erreur lors de l’ajout', 'error');
      }
    } catch (error) {
      console.error(error);
      showMessage('Erreur de connexion au serveur', 'error');
    }
  });
});