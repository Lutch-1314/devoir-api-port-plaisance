export function makeTablesEditable(tableSelector = '.editable-table') {
  document.querySelectorAll(tableSelector).forEach(table => {
    table.querySelectorAll('tr').forEach(row => {
      const editBtn = row.querySelector('.edit-btn');
      const stateText = row.querySelector('.state-text');
      const form = row.querySelector('.state-form');
      const cancelBtn = row.querySelector('.cancel-btn');

      if (!editBtn || !form || !stateText || !cancelBtn) return;

      editBtn.addEventListener('click', (e) => {
        e.stopPropagation(); 
        stateText.classList.add('hidden');
        form.classList.remove('hidden');
        editBtn.classList.add('hidden');
      });

      cancelBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        form.classList.add('hidden');
        stateText.classList.remove('hidden');
        editBtn.classList.remove('hidden');
      });
    });
  });

  document.addEventListener('click', (e) => {
    document.querySelectorAll('.editable-table tr').forEach(row => {
      const stateCell = row.querySelector('.state-cell');
      const stateText = row.querySelector('.state-text');
      const form = row.querySelector('.state-form');
      const editBtn = row.querySelector('.edit-btn');

      if (!form || !stateCell) return;

      // Si le clic est à l’intérieur de la cellule -> on ne fait rien
      if (stateCell.contains(e.target)) return;

      if (!form.classList.contains('hidden')) {
        form.classList.add('hidden');
        stateText.classList.remove('hidden');
        editBtn.classList.remove('hidden');
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.delete-form').forEach(form => {
    const deleteBtn = form.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
      e.preventDefault(); // empêche la soumission immédiate
      const row = form.closest('tr');
      const catwayNumber = row.querySelector('td').textContent.trim();

      const confirmDelete = confirm(`Êtes-vous sûr de vouloir supprimer le catway ${catwayNumber} ?`);
      if (confirmDelete) {
        form.submit(); // soumission seulement si confirmé
      }
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  makeTablesEditable();
});