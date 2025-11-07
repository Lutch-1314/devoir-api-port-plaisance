// edit-reservation.js — uniquement Modifier / Annuler / PUT + repositionnement

function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.style.display = 'block';
}

// Trouve le tbody correct pour une réservation donnée
function getTargetTbodyForReservation(reservation) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const start = new Date(reservation.startDate);
  start.setHours(0,0,0,0);

  const end = new Date(reservation.endDate);
  end.setHours(0,0,0,0);

  if (end < today) return document.querySelector('#pastReservations tbody');
  if (start > today) return document.querySelector('#futureReservations tbody');
  return document.querySelector('#currentReservations tbody');
}

// Insère la row triée par startDate
function insertSortedRow(tbody, row, editRow, reservation) {
  const newStart = new Date(reservation.startDate);
  const rows = Array.from(tbody.querySelectorAll('tr.reservation-row'));
  let inserted = false;

  for (const existingRow of rows) {
    const dateCell = existingRow.querySelector('.startDate');
    if (!dateCell) continue;
    const parts = dateCell.textContent.trim().split('/');
    if (parts.length !== 3) continue;
    const rowDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    rowDate.setHours(0,0,0,0);

    if (newStart < rowDate) {
      tbody.insertBefore(row, existingRow);
      tbody.insertBefore(editRow, row.nextSibling);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    tbody.appendChild(row);
    tbody.appendChild(editRow);
  }
}

export function setupEditableReservations(tableSelector = '.editable-table.reservations') {
  const rows = document.querySelectorAll(`${tableSelector} tr.reservation-row`);

  rows.forEach(row => {
    const editBtn = row.querySelector('.edit-btn');
    const deleteBtn = row.querySelector('.delete-btn');

    if (!editBtn) return;

    const editRow = row.nextElementSibling;
    if (!editRow || !editRow.classList.contains('edit-row')) return;

    const form = editRow.querySelector('.update-form');
    const cancelBtn = form?.querySelector('.cancel-btn');

    // CLIQUE SUR MODIFIER
    editBtn.addEventListener('click', e => {
      e.stopPropagation();
      row.style.display = 'none';
      editRow.classList.remove('hidden');
      if (deleteBtn) deleteBtn.classList.add('hidden');
    });

    // CLIQUE SUR ANNULER
    if (cancelBtn) {
      cancelBtn.addEventListener('click', e => {
        e.stopPropagation();
        editRow.classList.add('hidden');
        row.style.display = '';
        if (deleteBtn) deleteBtn.classList.remove('hidden');
      });
    }

    // ENVOI DU FORMULAIRE (PUT)
    if (form) {
      form.addEventListener('submit', async e => {
        e.preventDefault();

        const reservationId = row.dataset.id;
        const catwayNumberCell = row.querySelector('td.catway');
        const catwayNumber = catwayNumberCell ? catwayNumberCell.innerText.trim() : form.querySelector('[name="catwayNumber"]')?.value;
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

            // Mettre à jour l'affichage
            row.querySelector('td.clientName').innerText = updated.clientName;
            row.querySelector('td.boatName').innerText = updated.boatName;
            row.querySelector('td.startDate').innerText = new Date(updated.startDate).toLocaleDateString('fr-FR');
            row.querySelector('td.endDate').innerText = new Date(updated.endDate).toLocaleDateString('fr-FR');

            // ===== repositionner si besoin =====
            const targetTbody = getTargetTbodyForReservation(updated);
            if (targetTbody && targetTbody !== row.parentElement) {
              row.parentElement.removeChild(row);
              editRow.parentElement.removeChild(editRow);
            }
            insertSortedRow(targetTbody, row, editRow, updated);

            // Replier le formulaire
            editRow.classList.add('hidden');
            row.style.display = '';
            if (deleteBtn) deleteBtn.classList.remove('hidden');

            showMessage('Réservation mise à jour !', 'success');
          } else {
            const err = await response.json();
            showMessage(err.message || 'Erreur lors de la mise à jour', 'error');
          }
        } catch (err) {
          showMessage(err.message || 'Erreur de connexion', 'error');
        }
      });
    }
  });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  setupEditableReservations();
});
