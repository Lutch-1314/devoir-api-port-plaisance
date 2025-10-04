// delete-btn.js
export function setupDeleteButtons({
  tableSelector = '.editable-table',
  confirmMessage = (row) => "Êtes-vous sûr de vouloir supprimer cet élément ?",
}) {
  document.querySelectorAll(`${tableSelector} .delete-btn`).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const row = btn.closest('tr');

      if (confirm(confirmMessage(row))) {
        const form = row.querySelector('.delete-form');
        if (form) form.submit();
      }
    });
  });
}

// Initialisation générique
document.addEventListener('DOMContentLoaded', () => {
  // Pour les catways
  setupDeleteButtons({
    tableSelector: '.editable-table.catways',
    confirmMessage: (row) => {
      const catwayNumber = row.querySelector('td')?.innerText;
      return `Êtes-vous sûr de vouloir supprimer le catway ${catwayNumber} ?`;
    }
  });

  // Pour les réservations
  setupDeleteButtons({
    tableSelector: '.editable-table.reservations',
    confirmMessage: (row) => {
      const clientName = row.querySelector('td:nth-child(2)')?.innerText;
      const boatName = row.querySelector('td:nth-child(3)')?.innerText;
      return `Supprimer la réservation de ${clientName} (${boatName}) ?`;
    }
  });
});
