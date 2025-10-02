export function setupDeleteButtons(tableSelector = '.editable-table') {
  document.querySelectorAll(`${tableSelector} .delete-btn`).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const row = btn.closest('tr');
      const catwayNumber = row.querySelector('td').innerText;

      if (confirm(`Êtes-vous sûr de vouloir supprimer le catway ${catwayNumber} ?`)) {
        const form = row.querySelector('.delete-form');
        if (form) form.submit();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupDeleteButtons();
});