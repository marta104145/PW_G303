document.addEventListener('DOMContentLoaded', () => {
    carregarOcorrenciasAceites();
    carregarAuditoriasRealizadas();
  });
  
  function carregarOcorrenciasAceites() {
    const tabelaAceites = document.querySelector('#ocorrenciasAceites tbody');
    const aceites = JSON.parse(localStorage.getItem('ocorrenciasAceites')) || [];
  
    tabelaAceites.innerHTML = '';
  
    aceites.forEach((ocorrencia, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${ocorrencia.tipo}</td>
        <td>${ocorrencia.morada}</td>
        <td>${ocorrencia.userName}</td>
        <td>${new Date(ocorrencia.data).toLocaleDateString()}</td>
        <td>${ocorrencia.prioridade}</td>
        <td><button onclick="abrirFormulario(this, ${index})">Realizar Auditoria</button></td>
      `;
      tabelaAceites.appendChild(row);
    });
  }
  
function abrirFormulario(btn, index) {
  document.getElementById('modalFormulario').style.display = 'flex';
  document.body.classList.add('modal-open');

  // Busca as ocorrências aceites
  const aceites = JSON.parse(localStorage.getItem('ocorrenciasAceites')) || [];
  const ocorrencia = aceites[index];
  window.ocorrenciaClicada = btn.closest('tr');
  window.ocorrenciaSelecionada = ocorrencia; // Guarda para usar depois se quiseres

  carregarMateriais();
  carregarPeritos();

  // Preencher os campos do formulário com base na ocorrência aceite
  document.querySelector('#formAuditoria [name="descricao"]').value = ocorrencia.descricao || '';
  document.querySelector('#formAuditoria [name="tipo"]').value = ocorrencia.tipo || '';
  document.querySelector('#formAuditoria [name="local_nome"]').value = ocorrencia.morada || '';
  document.querySelector('#formAuditoria [name="local_tipo"]').value = ocorrencia.codigoPostal || '';
  document.querySelector('#formAuditoria [name="data"]').value = new Date().toISOString().slice(0,16);
  document.getElementById('peritosSelect').selectedIndex = 0;
}


  
  function fecharFormulario() {
    document.getElementById('modalFormulario').style.display = 'none';
    document.body.classList.remove('modal-open');
    document.getElementById('formAuditoria').reset();
  }
  
  function carregarAuditoriasRealizadas() {
    const tbody = document.querySelector('#auditoriasRealizadas tbody');
    tbody.innerHTML = ''; //limpar antes de adicionar
    const auditorias = JSON.parse(localStorage.getItem('auditorias')) || [];
    auditorias.forEach(adicionarAuditoriaNaTabela);
  }
  
  function adicionarAuditoriaNaTabela(dados) {
  const tbody = document.querySelector('#auditoriasRealizadas tbody');

  const linha = document.createElement('tr');
  linha.classList.add('audit-row');
  linha.innerHTML = `
    <td>${dados.nome}</td>
    <td>${dados.tipo || '-'}</td> <!-- MOSTRA O TIPO -->
    <td>${dados.local_nome}</td>
    <td>${dados.equipa}</td>
    <td>${dados.dataFormatada}</td>
    <td>${dados.prioridade || '-'}</td>
    <td onclick="toggleDetails(this)" class="expand-btn">▸</td>
  `;

  const detalhes = document.createElement('tr');
  detalhes.classList.add('details');
  detalhes.innerHTML = `
    <td colspan="7">
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

  function carregarPeritos() {
  const select = document.getElementById('peritosSelect');
  select.innerHTML = '<option value="">-- Selecionar --</option>';
  const peritos = JSON.parse(localStorage.getItem('peritos')) || [];
  peritos.forEach(p => {
    const option = document.createElement('option');
    option.value = p.nome;
    option.textContent = p.nome;
    select.appendChild(option);
  });
}

  