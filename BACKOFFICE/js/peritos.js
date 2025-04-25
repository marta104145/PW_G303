document.addEventListener("DOMContentLoaded", function () {
    const tbody = document.getElementById("peritos-tbody");
    const contador = document.getElementById("contador-peritos");
  
    // Simula paginação de 5 por página
    const porPagina = 5;
  
    // Obter lista do localStorage
    const peritos = JSON.parse(localStorage.getItem("peritos")) || [];
  
    function renderTabela(peritos) {
      tbody.innerHTML = "";
      let mostrar = peritos.slice(0, porPagina);
      mostrar.forEach(p => {
        let linha = document.createElement("tr");
        linha.innerHTML = `
          <td>${p.nome}</td>
          <td>${p.nascimento}</td>
          <td>${p.email}</td>
          <td>${p.telemovel}</td>
          <td>${p.especialidade}</td>
          <td>${p.morada}</td>
          <td class="action-icons">👁️</td>
          <td class="action-icons">✏️</td>
        `;
        tbody.appendChild(linha);
      });
  
      contador.textContent = `1 - ${mostrar.length} of ${peritos.length}`;
    }
  
    renderTabela(peritos);
  });
  