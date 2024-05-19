document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('btnSalvar').addEventListener('click', salvar);
});

function salvar() {
  const texto = document.querySelector('.textfield').value;
  const data = moment().format('DD/MM/YYYY [às] HH:mm');
  fetch('http://localhost:3000/inserir', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ texto, data })
  })
  .then(response => response.text())
  .then(message => {
    console.log(message);
    atualizarTabela();
  })
  .catch(error => console.error(error));
}

function atualizarTabela() {
  fetch('http://localhost:3000/registros')
  .then(response => response.json())
  .then(data => {
    const tabelaDinamica = document.getElementById('tabela-dinamica');
    tabelaDinamica.innerHTML = '';
    data.forEach(registro => {
      const tr = document.createElement('tr');
      const idFormatado = String(registro.id).padStart(3, '0');
      tr.innerHTML = `
        <td>${idFormatado}</td>
        <td>${registro.texto}</td>
        <td>${registro.data}</td>
        <td>
          <button class="btnApagar" data-id="${registro.id}">
            <i class="fas fa-trash-alt"></i>
          </button>
        </td>
      `;
      tabelaDinamica.appendChild(tr);
    });
    const botoesApagar = document.querySelectorAll('.btnApagar');
    botoesApagar.forEach(btn => {
      btn.addEventListener('click', function() {
        const id = this.getAttribute('data-id');
        apagarRegistro(id);
      });
    });
  })
  .catch(error => console.error(error));
}
function apagarRegistro(id) {
  fetch(`http://localhost:3000/apagar/${id}`, {
    method: 'DELETE'
  })
  .then(response => response.text())
  .then(message => {
    console.log(message);
    atualizarTabela();
  })
  .catch(error => console.error(error));
}
window.onload = atualizarTabela;