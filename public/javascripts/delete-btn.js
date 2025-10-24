function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.style.display = 'block';
}

export function setupDeleteButtons() {
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const row = btn.closest('tr');

      // Vérifie si c'est une réservation ou un catway
      const isReservation = row.classList.contains('reservation-row');
      const isCatway = row.classList.contains('catway-row');

      let confirmMsg = '';
      let url = '';
      let method = 'DELETE';

      if (isReservation) {
        const reservationId = row.dataset.id;
        const catwayNumber = row.querySelector('td.catway').innerText;
        const clientName = row.querySelector('td.clientName').innerText;
        const boatName = row.querySelector('td.boatName').innerText;

        confirmMsg = `Supprimer la réservation de ${clientName} (${boatName}) ?`;
        url = `/api/catways/${catwayNumber}/reservations/${reservationId}`;

      } else if (isCatway) {
        const catwayNumber = row.dataset.id;
        confirmMsg = `Confirmer la suppression du catway ${catwayNumber} ?`;
        url = `/api/catways/${catwayNumber}`;
      } else {
        return; // ni réservation ni catway
      }

      if (!confirm(confirmMsg)) return;

      try {
        const response = await fetch(url, { method });
        if (response.ok) {
          row.remove();
          showMessage(isReservation ? 'Réservation supprimée !' : `Catway ${row.dataset.id} supprimé !`, 'success');
        } else {
          const err = await response.json();
          showMessage(err.message || 'Erreur', 'error');
        }
      } catch (err) {
        showMessage(err.message, 'error');
      }
    });
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  setupDeleteButtons();
});
