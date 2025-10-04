export function setupEditableReservations(tableSelector = '.editable-table') {
  document.querySelectorAll(`${tableSelector} tr`).forEach(row => {
    const editBtn = row.querySelector('.edit-btn');
    const form = row.querySelector('.update-form');
    const cancelBtn = row.querySelector('.cancel-btn');
    const displayCells = row.querySelectorAll('.display-only');

    if (!editBtn || !form) return;

    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      form.classList.remove('hidden');
      editBtn.classList.add('hidden');
      displayCells.forEach(cell => cell.classList.add('hidden'));
    });

    cancelBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      form.classList.add('hidden');
      editBtn.classList.remove('hidden');
      displayCells.forEach(cell => cell.classList.remove('hidden'));
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll(`${tableSelector} tr`).forEach(row => {
      const form = row.querySelector('.update-form');
      const editBtn = row.querySelector('.edit-btn');
      const displayCells = row.querySelectorAll('.display-only');

      if (form && !form.classList.contains('hidden')) {
        if (!form.contains(e.target) && e.target !== editBtn) {
          form.classList.add('hidden');
          editBtn.classList.remove('hidden');
          displayCells.forEach(cell => cell.classList.remove('hidden'));
        }
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupEditableReservations();
});