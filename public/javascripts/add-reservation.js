// add-reservation.js — gestion uniquement de l'ajout d'une réservation

import { setupDeleteButtons } from './delete-btn.js';
import { setupEditableReservations } from './edit-reservation.js'; // on réactive les handlers après insertion

function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.classList.remove('hidden');
}

// Détermine le <tbody> cible (current / future / past)
function getTargetTbodyForReservation(reservation) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(reservation.startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(reservation.endDate);
  end.setHours(0, 0, 0, 0);

  if (end < today) return document.querySelector('#pastReservations tbody');
  if (start > today) return document.querySelector('#futureReservations tbody');
  return document.querySelector('#currentReservations tbody');
}

// Insère la paire (newRow, editRow) triée par startDate dans le tbody
function insertSortedRow(tbody, newRow, editRow, newReservation) {
  if (!tbody) {
    // fallback
    document.querySelector('.editable-table.reservations tbody')?.appendChild(newRow);
    document.querySelector('.editable-table.reservations tbody')?.appendChild(editRow);
    return;
  }

  const newStart = new Date(newReservation.startDate);
  const rows = Array.from(tbody.querySelectorAll('tr.reservation-row'));
  let inserted = false;

  for (const row of rows) {
    const dateCell = row.querySelector('.startDate');
    if (!dateCell) continue;

    // dateCell contient jj/mm/aaaa -> on convertit en yyyy-mm-dd pour comparaison
    const parts = dateCell.textContent.trim().split('/');
    if (parts.length !== 3) continue;
    const rowDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // yyyy-mm-dd
    rowDate.setHours(0, 0, 0, 0);

    if (newStart < rowDate) {
      tbody.insertBefore(newRow, row);
      // insère editRow juste après newRow (row peut être décalé après insertion, donc on prend newRow.nextSibling)
      tbody.insertBefore(editRow, newRow.nextSibling);
      inserted = true;
      break;
    }
  }

  if (!inserted) {
    tbody.appendChild(newRow);
    tbody.appendChild(editRow);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.show-add-form-btn');
  const addForm = document.querySelector('#addReservationForm');
  const cancelBtn = addForm.querySelector('.cancel-btn');

  // afficher formulaire
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      addForm.classList.remove('hidden');
      addBtn.classList.add('hidden');
    });
  }

  // annuler
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      addForm.classList.add('hidden');
      if (addBtn) addBtn.classList.remove('hidden');
      addForm.reset();
    });
  }

  // soumettre nouvel enregistrement
  addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(addForm));

    try {
      const response = await fetch(`/api/catways/${formData.catwayNumber}/reservations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const err = await response.json();
        showMessage(err.message || 'Erreur lors de l’ajout', 'error');
        return;
      }

      const newReservation = await response.json();

      // === créer la ligne principale (affichage) ===
      const newRow = document.createElement('tr');
      newRow.classList.add('reservation-row');
      newRow.dataset.id = newReservation._id;
      newRow.innerHTML = `
        <td class="catway display-only">${newReservation.catwayNumber}</td>
        <td class="clientName display-only">${newReservation.clientName}</td>
        <td class="boatName display-only">${newReservation.boatName}</td>
        <td class="startDate display-only">${new Date(newReservation.startDate).toLocaleDateString('fr-FR')}</td>
        <td class="endDate display-only">${new Date(newReservation.endDate).toLocaleDateString('fr-FR')}</td>
        <td>
          <div class="btn-container">
            <button type="button" class="edit-btn">Modifier</button>
            <button type="button" class="delete-btn" data-type="reservation">Supprimer</button>
          </div>
        </td>
      `;

      // === créer la ligne d'édition JUSTE APRÈS (catway visible, formulaire commence au client) ===
      const editRow = document.createElement('tr');
      editRow.classList.add('edit-row', 'hidden');
      editRow.dataset.id = newReservation._id;
      editRow.innerHTML = `
        <td class="catway">${newReservation.catwayNumber}</td>
        <td colspan="5">
          <form class="update-form" data-id="${newReservation._id}">
            <input type="text" name="clientName" value="${newReservation.clientName}" required>
            <input type="text" name="boatName" value="${newReservation.boatName}" required>
            <input type="date" name="startDate" value="${new Date(newReservation.startDate).toISOString().split('T')[0]}" required>
            <input type="date" name="endDate" value="${new Date(newReservation.endDate).toISOString().split('T')[0]}" required>
            <button type="submit">Sauvegarder</button>
            <button type="button" class="cancel-btn">Annuler</button>
          </form>
        </td>
      `;

      // === trouver le bon tbody et insérer trié ===
      const targetTbody = getTargetTbodyForReservation(newReservation) || document.querySelector('.editable-table.reservations tbody');
      insertSortedRow(targetTbody, newRow, editRow, newReservation);

      // reset form + message
      addForm.reset();
      addForm.classList.add('hidden');
      if (addBtn) addBtn.classList.remove('hidden');
      showMessage('Réservation ajoutée avec succès !', 'success');

      // réactiver les handlers pour la nouvelle ligne
      setupEditableReservations(); // branche les events d'édition (Modifier / Annuler / Submit)
      setupDeleteButtons('.delete-btn'); // branche les events de suppression (script central)

    } catch (err) {
      showMessage(err.message || 'Erreur de connexion au serveur', 'error');
    }
  });
});
