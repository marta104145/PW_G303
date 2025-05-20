// home.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Lista de pedidos (todas ocorrências)
  const pedidos = JSON.parse(localStorage.getItem('ocorrencias')) || [];
  const listaPedidos = document.getElementById('listaPedidos');
  pedidos.forEach(o => {
    let estadoClasse = "";
    let estadoTexto = (o.estado || 'Em espera');
    if (estadoTexto.toLowerCase() === 'aceite') estadoClasse = "estado-badge estado-aceite";
    else if (estadoTexto.toLowerCase() === 'devolvido') estadoClasse = "estado-badge estado-devolvido";
    else if (estadoTexto.toLowerCase() === 'não aceite' || estadoTexto.toLowerCase() === 'recusado') estadoClasse = "estado-badge estado-recusado";
    else estadoClasse = "estado-badge";
    
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${o.tipo}</strong> - ${o.codigoPostal} <span class="${estadoClasse}">[${estadoTexto}]</span></span>
      <div class="custom-tooltip">
        ${o.fotoBase64 ? `<img src="${o.fotoBase64}" alt="Foto Ocorrência">` : ''}
        <div><strong>Tipo:</strong> ${o.tipo}</div>
        <div><strong>Morada:</strong> ${o.morada || ''}</div>
        <div><strong>Descrição:</strong> ${o.descricao || ''}</div>
        <div><strong>Estado:</strong> ${estadoTexto}</div>
        <div><strong>Data:</strong> ${o.data ? new Date(o.data).toLocaleString('pt-PT') : ''}</div>
        <div><strong>Código Postal:</strong> ${o.codigoPostal}</div>
      </div>
    `;
    li.addEventListener('mousemove', function(e) {
      const tooltip = li.querySelector('.custom-tooltip');
      if (window.innerWidth > 900) {
        tooltip.style.top = (e.offsetY) + 'px';
      }
    });
    listaPedidos.appendChild(li);
  });

  // 2) Lista de ocorrências aceites
  const aceites = JSON.parse(localStorage.getItem('ocorrenciasAceites')) || [];
  const listaAceites = document.getElementById('listaAceites');
  aceites.forEach(o => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${o.tipo}</strong> - ${o.codigoPostal}</span>
      <div class="custom-tooltip">
        ${o.fotoBase64 ? `<img src="${o.fotoBase64}" alt="Foto Ocorrência">` : ''}
        <div><strong>Tipo:</strong> ${o.tipo}</div>
        <div><strong>Morada:</strong> ${o.morada || ''}</div>
        <div><strong>Descrição:</strong> ${o.descricao || ''}</div>
        <div><strong>Estado:</strong> ${o.estado || 'Aceite'}</div>
        <div><strong>Data:</strong> ${o.data ? new Date(o.data).toLocaleString('pt-PT') : ''}</div>
        <div><strong>Código Postal:</strong> ${o.codigoPostal}</div>
      </div>
    `;
    li.addEventListener('mousemove', function(e) {
      const tooltip = li.querySelector('.custom-tooltip');
      if (window.innerWidth > 900) {
        tooltip.style.top = (e.offsetY) + 'px';
      }
    });
    listaAceites.appendChild(li);
  });
});
