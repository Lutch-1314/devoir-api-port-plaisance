// delete-btn.js

/**
 * Affiche un message dans le div .message
 * @param {string} message - Texte à afficher
 * @param {string} type - 'success' ou 'error'
 */
function showMessage(message, type = 'success') {
  const msgDiv = document.querySelector('.message');
  if (!msgDiv) return;

  msgDiv.innerText = message;
  msgDiv.classList.remove('success', 'error');
  msgDiv.classList.add(type);
  msgDiv.style.display = 'block';
}

/**
 * Initialise les boutons de suppression pour un tableau donné avec Ajax
 * @param {string} tableSelector - sélecteur du tableau
 * @param {function} confirmMessage - fonction qui retourne le message de confirmation (row, btn) => string
 * @param {string} successText - message à afficher après suppression
 */
function setupDeleteButtons(tableSelector, confirmMessage, successText) {
  const buttons = document.querySelectorAll(`${tableSelector} .delete-btn`);
  buttons.forEach(btn => {
    const newBtn = btn.cloneNode(true);
    btn.replaceWith(newBtn);

    newBtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const row = newBtn.closest('tr');
  const message = confirmMessage(row, newBtn);
  if (!confirm(message)) return;

  const form = row.querySelector('.delete-form');
  if (!form) return;

  const action = form.getAttribute('action');
  const method = form.getAttribute('method') || 'POST';
  const formData = new FormData(form);

  try {
    const response = await fetch(action, {
      method: method.toUpperCase(),
      body: formData,
    });

    if (response.ok) {
      row.remove(); // supprime la ligne du tableau
      showMessage(successText, 'success'); // <-- utilisation dynamique ici
    } else {
      const errorText = await response.text();
      showMessage(`Erreur : ${errorText}`, 'error');
    }
  } catch (err) {
    showMessage(`Erreur : ${err.message}`, 'error');
  }
});

  }
  )}
// Initialisation quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {

  // Catways
  setupDeleteButtons('.editable-table.catways', (row) => {
    const catwayNumber = row.querySelector('td')?.innerText || '';
    return `Êtes-vous sûr de vouloir supprimer le catway ${catwayNumber} ?`;
  }, 'Catway supprimé avec succès');

  // Réservations
  setupDeleteButtons('.editable-table.reservations', (row) => {
    const clientName = row.querySelector('td:nth-child(2)')?.innerText || '';
    const boatName = row.querySelector('td:nth-child(3)')?.innerText || '';
    return `Supprimer la réservation de ${clientName} (${boatName}) ?`;
  }, 'Réservation supprimée avec succès');

  // Utilisateurs
  setupDeleteButtons('.editable-table.users', (row) => {
    const userName = row.querySelector('td')?.innerText || '';
    return `Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ?`;
  }, 'Utilisateur supprimé avec succès');
});