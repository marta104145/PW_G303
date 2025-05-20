// home.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Lista de pedidos (todas ocorrências)
  const pedidos = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  const listaPedidos = document.getElementById('listaPedidos');
  pedidos.forEach(o => {
    const li = document.createElement('li');
    li.textContent = `${o.tipo} - ${o.codigoPostal} - ${o.estado || 'Em espera'}`;
    listaPedidos.appendChild(li);
  });

  // 2) Lista de ocorrências aceites
  const aceites = JSON.parse(localStorage.getItem('ocorrenciasAceites')) || [];
  const listaAceites = document.getElementById('listaAceites');
  aceites.forEach(o => {
    const li = document.createElement('li');
    li.textContent = `${o.tipo} - ${o.codigoPostal}`;
    listaAceites.appendChild(li);
  });
});
