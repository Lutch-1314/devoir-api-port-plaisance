document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-btn');
  const addForm = document.querySelector('.add-form');
  const cancelBtn = addForm.querySelector('.cancel-btn');

  if (!addBtn || !addForm) return;

  addBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addForm.classList.remove('hidden');
    addBtn.classList.add('hidden');
  });

  cancelBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    addForm.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!addForm.contains(e.target) && e.target !== addBtn) {
      if (!addForm.classList.contains('hidden')) {
        addForm.classList.add('hidden');
        addBtn.classList.remove('hidden');
      }
    }
  });
});
