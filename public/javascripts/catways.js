const tableBody = document.getElementById('catways-body');
const addForm = document.getElementById('add-catway-form');
const messageDiv = document.getElementById('message');

// 📌 Afficher un message
function showMessage(text, type = 'success') {
  messageDiv.innerText = text;
  messageDiv.className = type;
  setTimeout(() => messageDiv.innerText = '', 3000);
}

// 📌 Charger tous les catways
async function loadCatways() {
  try {
    const res = await fetch('/api/catways');
    const catways = await res.json();
    tableBody.innerHTML = '';

    catways.forEach(catway => {
      const tr = document.createElement('tr');
      tr.id = `catway-row-${catway._id}`;
      tr.innerHTML = `
        <td>${catway.catwayNumber}</td>
        <td>${catway.catwayType}</td>
        <td>
          <select data-id="${catway._id}" class="state-select">
            <option value="libre" ${catway.catwayState === 'libre' ? 'selected' : ''}>Libre</option>
            <option value="occupé" ${catway.catwayState === 'occupé' ? 'selected' : ''}>Occupé</option>
            <option value="En rénovation, indisponible" ${catway.catwayState === 'En rénovation, indisponible' ? 'selected' : ''}>En rénovation</option>
          </select>
        </td>
        <td>
          <button data-id="${catway._id}" class="delete-btn">Supprimer</button>
        </td>
      `;
      tableBody.appendChild(tr);
    });

    // Événements sur select pour modifier l’état
    document.querySelectorAll('.state-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const id = e.target.dataset.id;
        const catwayState = e.target.value;

        try {
          const res = await fetch(`/api/catways/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ catwayState })
          });
          if (res.ok) showMessage('État mis à jour');
          else showMessage('Erreur lors de la mise à jour', 'error');
        } catch (err) {
          showMessage('Erreur serveur', 'error');
        }
      });
    });

    // Événements sur bouton Supprimer
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        if (!confirm('Voulez-vous vraiment supprimer ce catway ?')) return;

        try {
          const res = await fetch(`/api/catways/${id}`, { method: 'DELETE' });
          if (res.ok) {
            document.getElementById(`catway-row-${id}`).remove();
            showMessage('Catway supprimé avec succès !');
          } else {
            const error = await res.json();
            showMessage(`Erreur : ${error.message}`, 'error');
          }
        } catch (err) {
          showMessage('Erreur serveur', 'error');
        }
      });
    });

  } catch (err) {
    showMessage('Impossible de charger les catways', 'error');
  }
}

// 📌 Ajouter un catway
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/catways', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      addForm.reset();
      showMessage('Catway ajouté avec succès !');
      loadCatways(); // Recharger le tableau
    } else {
      const error = await res.json();
      showMessage(`Erreur : ${error.message}`, 'error');
    }
  } catch (err) {
    showMessage('Erreur serveur', 'error');
  }
});

// 📌 Charger les catways au démarrage
loadCatways();
