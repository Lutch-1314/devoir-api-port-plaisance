function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.editable-table.catways tr').forEach(row => {
    const editBtn = row.querySelector('.edit-btn');
    const form = row.querySelector('.update-form');
    const cancelBtn = form?.querySelector('.cancel-btn');
    const stateText = row.querySelector('.state-text');

    if (!editBtn || !form) return;

    editBtn.addEventListener('click', () => {
      form.classList.remove('hidden');
      stateText.classList.add('hidden');
      editBtn.classList.add('hidden');
    });

    cancelBtn?.addEventListener('click', () => {
      form.classList.add('hidden');
      stateText.classList.remove('hidden');
      editBtn.classList.remove('hidden');
    });

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const id = form.dataset.id;
      const catwayState = form.querySelector('[name="catwayState"]').value;

      try {
        const response = await fetch(`/api/catways/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ catwayState })
        });

        if (response.ok) {
          const updated = await response.json();
          stateText.textContent = updated.catwayState;

          form.classList.add('hidden');
          stateText.classList.remove('hidden');
          editBtn.classList.remove('hidden');
          showMessage('Catway mis à jour !', 'success');
        } else {
          const err = await response.json();
          showMessage(err.message || 'Erreur lors de la mise à jour', 'error');
        }
      } catch (err) {
        showMessage(err.message, 'error');
      }
    });
  });
});
