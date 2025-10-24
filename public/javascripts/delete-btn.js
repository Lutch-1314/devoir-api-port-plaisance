// delete-btn.js
function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.style.display = 'block';
}

export function setupDeleteButtons(tableSelector = '.editable-table.reservations') {
  document.querySelectorAll(`${tableSelector} .delete-btn`).forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const row = btn.closest('tr');
      const reservationId = row.dataset.id;
      const catwayNumber = row.querySelector('td.catway').innerText;

      if (!confirm(`Supprimer la réservation de ${row.querySelector('td.clientName').innerText} (${row.querySelector('td.boatName').innerText}) ?`)) return;

      try {
        const response = await fetch(`/api/catways/${catwayNumber}/reservations/${reservationId}`, { method: 'DELETE' });
        if (response.ok) {
          row.remove();
          showMessage('Réservation supprimée !', 'success');
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
