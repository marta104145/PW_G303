let ocorrencias = []; 

document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.getElementById('peritosTable').querySelector('tbody');
    const modalRemover = document.getElementById('modalRemover');
    const confirmarRemocao = document.getElementById('confirmarRemocao');
    const cancelarRemocao = document.getElementById('cancelarRemocao');
    let indexParaRemover = null;

    ocorrencias = JSON.parse(localStorage.getItem('ocorrencias')) || [];
    tabela.innerHTML = '';

    ocorrencias.forEach((ocorrencia, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;

        row.innerHTML = `
      <td>${ocorrencia.tipo}</td>
      <td>${ocorrencia.morada}</td>
      <td>${ocorrencia.codigoPostal}</td>
      <td><span class="estado ${classEstado(ocorrencia.estado)}">${ocorrencia.estado || 'Em espera'}</span></td>
      <td>${ocorrencia.prioridade || '-'}</td>
      <td>
        <button class="botao-verde-claro consultar-btn" data-index="${index}">
          <i class="fas fa-eye"></i> Consultar
        </button>
      </td>
      <td>
        <button class="lixo-btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;

        // Consultar
        row.querySelector('.consultar-btn').addEventListener('click', () => {
            const o = ocorrencias[index];
            const conteudo = `
<div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="margin: 0 0 20px 0; color:rgb(0, 0, 0); font-size: 28px; border-bottom: 2px solidrgb(0, 0, 0); padding-bottom: 10px;">${o.tipo}</h1>
    
    <div style="display: flex; gap: 30px; margin-bottom: 25px;">
        <!-- Coluna da Foto -->
        <div style="flex: 1; min-width: 300px;">
            <img src="${o.fotoBase64}" alt="Foto da ocorrência" style="width: 100%; height: auto; max-height: 350px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd;">

        </div>
        
        <!-- Coluna de Informações -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 15px;">
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 10px 0; font-size: 18px; color:rgb(0, 0, 0);">Localização</h2>
                <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Morada:</strong> ${o.morada}</p>
                <p style="margin: 0; font-size: 16px;"><strong>Código Postal:</strong> ${o.codigoPostal}</p>
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                <h2 style="margin: 0 0 10px 0; font-size: 18px; color:rgb(0, 0, 0);">Informação do Utilizador</h2>
                <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Nome:</strong> ${o.userName}</p>
                <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>Email:</strong> ${o.userEmail}</p>
                <p style="margin: 0; font-size: 16px;"><strong>Data do Report:</strong> ${new Date(o.data).toLocaleDateString('pt-PT', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        </div>
    </div>
    
    <!-- Área de Descrição Expandida -->
    <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 25px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h2 style="margin: 0 0 15px 0; font-size: 20px; color:rgb(0, 0, 0);">Descrição Detalhada</h2>
        <p style="margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-line;">${o.descricao}</p>
    </div>
    
    <!-- Ações -->
    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
        <button onclick="aceitar(${index})" style="padding: 12px 25px; border: none; border-radius: 6px; cursor: pointer; background-color: #27ae60; color: white; font-size: 16px; font-weight: bold; transition: all 0.3s;">
            <i class="fas fa-check"></i> Aceitar
        </button>
        <button onclick="devolver(${index})" style="padding: 12px 25px; border: 2px solidrgb(0, 0, 0); border-radius: 6px; cursor: pointer; background-color: white; color:rgb(0, 0, 0); font-size: 16px; font-weight: bold; transition: all 0.3s;">
            <i class="fas fa-arrow-right"></i> Devolver
        </button>
        <button onclick="rejeitar(${index})" style="padding: 12px 25px; border: none; border-radius: 6px; cursor: pointer; background-color: #e74c3c; color: white; font-size: 16px; font-weight: bold; transition: all 0.3s;">
            <i class="fas fa-times"></i> Rejeitar
        </button>
    </div>
</div>
`;

            document.getElementById('conteudoModal').innerHTML = conteudo;
            document.getElementById('detalhesModal').style.display = 'block';
        });

        // Remover
        row.querySelector('.lixo-btn').addEventListener('click', () => {
            indexParaRemover = index;
            modalRemover.style.display = 'block';
        });

        tabela.appendChild(row);
    });

    document.getElementById('fecharModal').onclick = () => {
        document.getElementById('detalhesModal').style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === document.getElementById('detalhesModal')) {
            document.getElementById('detalhesModal').style.display = 'none';
        }
        if (event.target === modalRemover) {
            modalRemover.style.display = 'none';
        }
    };

    confirmarRemocao.onclick = () => {
        ocorrencias.splice(indexParaRemover, 1);
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
        modalRemover.style.display = 'none';
        location.reload();
    };

    cancelarRemocao.onclick = () => {
        modalRemover.style.display = 'none';
    };
});

function classEstado(estado) {
    if (estado === 'Aceite') return 'aceite';
    if (estado === 'Não aceite') return 'nao-aceite';
    return 'em-espera';
}

// Atualizada: pede prioridade antes de aceitar
window.aceitar = (i) => {
    const prioridade = prompt("Atribua um grau de prioridade (Alta, Média, Baixa):", "Média");
    if (prioridade && ["Alta", "Média", "Baixa"].includes(prioridade)) {
        ocorrencias[i].estado = 'Aceite';
        ocorrencias[i].prioridade = prioridade;
        localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));

        const aceites = JSON.parse(localStorage.getItem('ocorrenciasAceites')) || [];
        aceites.push(ocorrencias[i]);
        localStorage.setItem('ocorrenciasAceites', JSON.stringify(aceites));

        location.reload();
    } else {
        alert("Por favor, escolha uma prioridade válida: Alta, Média ou Baixa.");
    }
};

window.rejeitar = (i) => {
    ocorrencias[i].estado = 'Não aceite';
    localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
    location.reload();
};

window.devolver = (i) => {
    ocorrencias[i].estado = 'Devolvido';
    localStorage.setItem('ocorrencias', JSON.stringify(ocorrencias));
    location.reload();
};
