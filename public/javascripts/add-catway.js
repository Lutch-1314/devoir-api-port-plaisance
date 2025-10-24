function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;
  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.querySelector('.add-btn');
  const addForm = document.querySelector('#addCatwayForm');
  const cancelBtn = addForm.querySelector('.cancel-btn');
  const tableBody = document.querySelector('.editable-table.catways tbody');

  addBtn.addEventListener('click', () => {
    addForm.classList.remove('hidden');
    addBtn.classList.add('hidden');
  });

  cancelBtn.addEventListener('click', () => {
    addForm.classList.add('hidden');
    addBtn.classList.remove('hidden');
  });

  addForm.addEventListener('submit', async e => {
    e.preventDefault();
    const formData = Object.fromEntries(new FormData(addForm));

    try {
      const response = await fetch('/api/catways', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newCatway = await response.json();

        const newRow = document.createElement('tr');
        newRow.innerHTML = `
          <td>${newCatway.catwayNumber}</td>
          <td>${newCatway.catwayType === 'short' ? 'Court' : 'Long'}</td>
          <td class="state-cell">
            <span class="state-text">${newCatway.catwayState}</span>
            <form class="update-form hidden" data-id="${newCatway._id}">
              <select name="catwayState">
                <option value="libre" ${newCatway.catwayState === 'libre' ? 'selected' : ''}>Libre</option>
                <option value="occupé" ${newCatway.catwayState === 'occupé' ? 'selected' : ''}>Occupé</option>
                <option value="en maintenance" ${newCatway.catwayState === 'en maintenance' ? 'selected' : ''}>En maintenance</option>
              </select>
              <button type="submit">Sauvegarder</button>
              <button type="button" class="cancel-btn">Annuler</button>
            </form>
          </td>
          <td>
            <div class="btn-container">
              <button type="button" class="edit-btn">Modifier</button>
              <form class="delete-form" data-id="${newCatway._id}">
                <button type="submit" class="delete-btn">Supprimer</button>
              </form>
            </div>
          </td>
        `;
        tableBody.appendChild(newRow);
        addForm.reset();
        addForm.classList.add('hidden');
        addBtn.classList.remove('hidden');
        showMessage('Catway ajouté avec succès !', 'success');
      } else {
        const err = await response.json();
        showMessage(err.message || 'Erreur lors de l’ajout', 'error');
      }
    } catch (err) {
      showMessage(err.message, 'error');
    }
  });
});
