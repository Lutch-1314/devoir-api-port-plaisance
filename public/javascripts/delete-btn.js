// javascripts/delete-btn.js
function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.classList.remove('hidden');
}

export function setupDeleteButtons(selector = '.delete-btn') {
  document.querySelectorAll(selector).forEach(btn => {
    btn.addEventListener('click', async () => {
      const row = btn.closest('tr');
      const type = btn.dataset.type; // 'user', 'catway', 'reservation'
      if (!type) return;

      let url;
      let confirmMsg;

      if (type === 'user') {
        const email = row.dataset.email;
        url = `/api/users/${email}`;
        confirmMsg = `Supprimer l'utilisateur ${email} ?`;
      } else if (type === 'catway') {
        const catwayNumber = row.dataset.id;
        url = `/api/catways/${catwayNumber}`;
        confirmMsg = `Supprimer le catway ${catwayNumber} ?`;
      } else if (type === 'reservation') {
        const reservationId = row.dataset.id;
        const catwayNumber = row.querySelector('td.catway').innerText;
        url = `/api/catways/${catwayNumber}/reservations/${reservationId}`;
        confirmMsg = `Supprimer cette réservation ?`;
      }

      if (!confirm(confirmMsg)) return;

      try {
        const response = await fetch(url, { method: 'DELETE' });
        if (response.ok || response.status === 204) {
          row.remove();
          showMessage('Suppression réussie', 'success');
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
document.addEventListener('DOMContentLoaded', () => setupDeleteButtons());
