// delete-btn.js

/**
 * Initialise les boutons de suppression pour un tableau donné
 * @param {string} tableSelector - sélecteur du tableau
 * @param {function} confirmMessage - fonction qui retourne le message de confirmation (row, btn) => string
 */
function setupDeleteButtons(tableSelector, confirmMessage) {
  const buttons = document.querySelectorAll(`${tableSelector} .delete-btn`);
  buttons.forEach(btn => {
    // Supprime les anciens listeners pour éviter les doublons
    const newBtn = btn.cloneNode(true);
    btn.replaceWith(newBtn);

    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const row = newBtn.closest('tr');
      const message = confirmMessage(row, newBtn);
      if (confirm(message)) {
        const form = row.querySelector('.delete-form');
        if (form) form.submit();
      }
    });
  });
}

// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {

  // Catways
  setupDeleteButtons('.editable-table.catways', (row) => {
    const catwayNumber = row.querySelector('td')?.innerText || '';
    return `Êtes-vous sûr de vouloir supprimer le catway ${catwayNumber} ?`;
  });

  // Réservations
  setupDeleteButtons('.editable-table.reservations', (row) => {
    const clientName = row.querySelector('td:nth-child(2)')?.innerText || '';
    const boatName = row.querySelector('td:nth-child(3)')?.innerText || '';
    return `Supprimer la réservation de ${clientName} (${boatName}) ?`;
  });

  // Utilisateurs
  setupDeleteButtons('.editable-table.users', (row) => {
    const userName = row.querySelector('td')?.innerText || '';
    return `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`;
  });

});
