// edit-reservation.js
function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.style.display = 'block';
}

export function setupEditableReservations(tableSelector = '.editable-table.reservations') {
  document.querySelectorAll(`${tableSelector} tr`).forEach(row => {
    const editBtn = row.querySelector('.edit-btn');
    const form = row.querySelector('.update-form');
    const cancelBtn = row.querySelector('.cancel-btn');
    const displayCells = row.querySelectorAll('.display-only');

    if (!editBtn || !form) return;

   // Afficher formulaire
editBtn.addEventListener('click', e => {
  e.stopPropagation();
  form.classList.remove('hidden');
  editBtn.classList.add('hidden');
  displayCells.forEach(cell => cell.classList.add('hidden'));

  // 🗓️ Pré-remplit les inputs de date
  const startCell = row.querySelector('td.startDate')?.innerText.trim();
  const endCell = row.querySelector('td.endDate')?.innerText.trim();

  // Vérifie si le format est JJ/MM/AAAA avant de convertir
  if (startCell && startCell.includes('/')) {
    const [startDay, startMonth, startYear] = startCell.split('/');
    form.querySelector('[name="startDate"]').value = `${startYear}-${startMonth.padStart(2, '0')}-${startDay.padStart(2, '0')}`;
  }

  if (endCell && endCell.includes('/')) {
    const [endDay, endMonth, endYear] = endCell.split('/');
    form.querySelector('[name="endDate"]').value = `${endYear}-${endMonth.padStart(2, '0')}-${endDay.padStart(2, '0')}`;
  }
});


    // Annuler modification
    cancelBtn.addEventListener('click', e => {
      e.stopPropagation();
      form.classList.add('hidden');
      editBtn.classList.remove('hidden');
      displayCells.forEach(cell => cell.classList.remove('hidden'));
    });

    // Soumettre formulaire en AJAX
    form.addEventListener('submit', async e => {
      e.preventDefault();
      const reservationId = form.dataset.id;
      const catwayNumber = form.querySelector('[name="catwayNumber"]').value;
      const clientName = form.querySelector('[name="clientName"]').value;
      const boatName = form.querySelector('[name="boatName"]').value;
      const startDate = form.querySelector('[name="startDate"]').value;
      const endDate = form.querySelector('[name="endDate"]').value;

      try {
        const response = await fetch(`/api/catways/${catwayNumber}/reservations/${reservationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ catwayNumber, clientName, boatName, startDate, endDate })
        });

        if (response.ok) {
          const updated = await response.json();

          // 🔹 Mettre à jour les cellules visibles avec le format JJ/MM/AAAA
  row.querySelector('td.catway').innerText = updated.catwayNumber;
  row.querySelector('td.clientName').innerText = updated.clientName;
  row.querySelector('td.boatName').innerText = updated.boatName;
  row.querySelector('td.startDate').innerText = new Date(updated.startDate).toLocaleDateString('fr-FR');
  row.querySelector('td.endDate').innerText = new Date(updated.endDate).toLocaleDateString('fr-FR');

          form.classList.add('hidden');
          editBtn.classList.remove('hidden');
          displayCells.forEach(cell => cell.classList.remove('hidden'));

          showMessage('Réservation mise à jour !', 'success');
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
  setupEditableReservations();
});
