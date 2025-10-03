export function setupDeleteReservationButtons(tableSelector = '.editable-table') {
  document.querySelectorAll(`${tableSelector} .delete-btn`).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const row = btn.closest('tr');
      const clientName = row.querySelector('td:nth-child(2)')?.innerText; 
      const boatName = row.querySelector('td:nth-child(3)')?.innerText;

      if (confirm(`Êtes-vous sûr de vouloir supprimer la réservation de ${clientName} (${boatName}) ?`)) {
        const form = row.querySelector('.delete-form');
        if (form) form.submit();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDeleteReservationButtons();
});