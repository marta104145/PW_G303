document.addEventListener('DOMContentLoaded', () => {
    carregarOcorrenciasAceites();
    carregarAuditoriasRealizadas();
  });
  
  function carregarOcorrenciasAceites() {
    const tabelaAceites = document.querySelector('#ocorrenciasAceites tbody');
    const aceites = JSON.parse(localStorage.getItem('ocorrenciasAceites')) || [];
  
    tabelaAceites.innerHTML = '';
  
    aceites.forEach((ocorrencia) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ocorrencia.tipo}</td>
        <td>${ocorrencia.morada}</td>
        <td>${ocorrencia.userName}</td>
        <td>${new Date(ocorrencia.data).toLocaleDateString()}</td>
        <td><button onclick="abrirFormulario(this)">Realizar Auditoria</button></td>
      `;
      tabelaAceites.appendChild(row);
    });
  }
  
  function abrirFormulario(btn) {
    document.getElementById('modalFormulario').style.display = 'flex';
    document.body.classList.add('modal-open');
    window.ocorrenciaClicada = btn.closest('tr');
    carregarMateriais();
  }
  
  function fecharFormulario() {
    document.getElementById('modalFormulario').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('formAuditoria').reset();
  }
  
  function carregarAuditoriasRealizadas() {
    const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
    auditorias.forEach(adicionarAuditoriaNaTabela);
  }
  
  function adicionarAuditoriaNaTabela(dados) {
    const tbody = document.querySelector('#auditoriasRealizadas tbody');
  
    const linha = document.createElement('tr');
    linha.classList.add('audit-row');
    linha.innerHTML = `
      <td>${dados.nome}</td>
      <td>${dados.local_nome}</td>
      <td>${dados.equipa}</td>
      <td>${dados.dataFormatada}</td>
      <td onclick="toggleDetails(this)" class="expand-btn">▸</td>
    `;
  
    const detalhes = document.createElement('tr');
    detalhes.classList.add('details');
    detalhes.innerHTML = `
      <td colspan="5">
        <strong>Descrição:</strong><br>${dados.descricao}<br><br>
        <strong>Materiais:</strong><br>
        <ul style="padding-left: 20px; margin-top: 5px;">
          ${dados.materiais.map(m => `<li>${m.nome}: ${m.quantidade}</li>`).join('')}
        </ul><br>
        <strong>N.º de Profissionais Necessários:</strong> ${dados.nr_profissionais}<br><br>
        <strong>Duração Estimada:</strong> ${dados.duracao} horas<br><br>
        <div class="actions">
          <button class="remove" onclick="removerAuditoria(this)">Remover</button>
          <button class="concluir" onclick="concluirAuditoria(this)">Concluir</button>
        </div>
      </td>
    `;
  
    tbody.appendChild(linha);
    tbody.appendChild(detalhes);
  }
  
  function toggleDetails(el) {
    const row = el.closest('tr');
    row.classList.toggle('expanded');
  }
  
  function carregarMateriais() {
    const container = document.getElementById("materiaisContainer");
    const materiais = JSON.parse(localStorage.getItem("materiais")) || [];
    container.innerHTML = "";
  
    materiais.forEach((material, index) => {
      const div = document.createElement("div");
      div.style.marginBottom = "10px";
  
      div.innerHTML = `
        <label style="font-weight: bold;">${material.nome} (${material.quantidade} disponíveis):</label>
        <input type="number" name="materiais[${index}].quantidade" 
            max="${material.quantidade}" min="0" value="0" 
            data-nome="${material.nome}" 
            placeholder="0" style="width: 60px; margin-left: 10px;">
      `;
  
      container.appendChild(div);
    });
  }
  