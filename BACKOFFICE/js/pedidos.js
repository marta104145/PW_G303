let ocorrencias = []
let indexParaAceitar = null
let prioridadeSelecionada = null

document.addEventListener("DOMContentLoaded", () => {
  const tabela = document.getElementById("peritosTable").querySelector("tbody")
  const modalRemover = document.getElementById("modalRemover")
  const modalPrioridade = document.getElementById("modalPrioridade")
  const confirmarRemocao = document.getElementById("confirmarRemocao")
  const cancelarRemocao = document.getElementById("cancelarRemocao")
  const confirmarPrioridade = document.getElementById("confirmarPrioridade")
  const cancelarPrioridade = document.getElementById("cancelarPrioridade")
  const fecharModalPrioridade = document.getElementById("fecharModalPrioridade")
  let indexParaRemover = null

  ocorrencias = JSON.parse(localStorage.getItem("ocorrencias")) || []
  console.log("Ocorrências carregadas:", ocorrencias)

  tabela.innerHTML = ""

  ocorrencias.forEach((ocorrencia, index) => {
    const row = document.createElement("tr")
    row.dataset.index = index

    // Mostrar prioridade com ícones visuais e cores
    let prioridadeDisplay = "-"
    if (ocorrencia.prioridade) {
      const nivel = Number.parseInt(ocorrencia.prioridade)
      if (!isNaN(nivel)) {
        const estrelas = "★".repeat(nivel) + "☆".repeat(5 - nivel)
        prioridadeDisplay = `<span class="prioridade-badge prioridade-${nivel}">${nivel} ${estrelas}</span>`
      } else {
        // Compatibilidade com o sistema antigo (Alta, Média, Baixa)
        const mapeamento = { Alta: 4, Média: 3, Baixa: 2 }
        const nivelNumerico = mapeamento[ocorrencia.prioridade] || 3
        const estrelas = "★".repeat(nivelNumerico) + "☆".repeat(5 - nivelNumerico)
        prioridadeDisplay = `<span class="prioridade-badge prioridade-${nivelNumerico}">${nivelNumerico} ${estrelas}</span>`
      }
    }

    row.innerHTML = `
      <td>${ocorrencia.tipo}</td>
      <td>${ocorrencia.morada}</td>
      <td>${ocorrencia.codigoPostal}</td>
      <td><span class="estado ${classEstado(ocorrencia.estado)}">${ocorrencia.estado || "Em espera"}</span></td>
      <td>${prioridadeDisplay}</td>
      <td class="acoes-cell">
        <button class="botao-verde-claro consultar-btn" data-index="${index}">
          <i class="fas fa-eye"></i> Consultar
        </button>
        <button class="lixo-btn" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `

    // Consultar
    row.querySelector(".consultar-btn").addEventListener("click", () => {
      const o = ocorrencias[index]
      const conteudo = `
<div style="max-width: 900px; margin: 0 auto; font-family: Arial, sans-serif; padding: 20px; background-color: #f8f9fa; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h1 style="margin: 0 0 20px 0; color:rgb(0, 0, 0); font-size: 28px; border-bottom: 2px solid rgb(0, 0, 0); padding-bottom: 10px;">${o.tipo}</h1>
    
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
                <p style="margin: 0; font-size: 16px;"><strong>Data do Report:</strong> ${new Date(o.data).toLocaleDateString("pt-PT", { day: "numeric", month: "long", year: "numeric" })}</p>
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
        <button onclick="devolver(${index})" style="padding: 12px 25px; border: 2px solid rgb(0, 0, 0); border-radius: 6px; cursor: pointer; background-color: white; color:rgb(0, 0, 0); font-size: 16px; font-weight: bold; transition: all 0.3s;">
            <i class="fas fa-arrow-right"></i> Devolver
        </button>
        <button onclick="rejeitar(${index})" style="padding: 12px 25px; border: none; border-radius: 6px; cursor: pointer; background-color: #e74c3c; color: white; font-size: 16px; font-weight: bold; transition: all 0.3s;">
            <i class="fas fa-times"></i> Rejeitar
        </button>
    </div>
</div>
`

      document.getElementById("conteudoModal").innerHTML = conteudo
      document.getElementById("detalhesModal").style.display = "block"
    })

    // Remover
    row.querySelector(".lixo-btn").addEventListener("click", () => {
      indexParaRemover = index
      modalRemover.style.display = "block"
    })

    tabela.appendChild(row)
  })

  // Event listeners para modal de prioridade
  document.querySelectorAll(".prioridade-option").forEach((option) => {
    option.addEventListener("click", () => {
      console.log("Prioridade selecionada:", option.dataset.prioridade)
      // Remover seleção anterior
      document.querySelectorAll(".prioridade-option").forEach((opt) => opt.classList.remove("selected"))
      // Adicionar seleção atual
      option.classList.add("selected")
      prioridadeSelecionada = Number.parseInt(option.dataset.prioridade)
    })
  })

  // Função para confirmar prioridade
  function confirmarPrioridadeFunc() {
    console.log("Confirmar prioridade clicado")
    console.log("Prioridade selecionada:", prioridadeSelecionada)
    console.log("Index para aceitar:", indexParaAceitar)

    if (prioridadeSelecionada && indexParaAceitar !== null) {
      try {
        // Obter a ocorrência atual
        const ocorrenciaAtual = ocorrencias[indexParaAceitar]
        console.log("Ocorrência a ser aceita:", ocorrenciaAtual)

        // Atualizar o estado e prioridade
        ocorrencias[indexParaAceitar].estado = "Aceite"
        ocorrencias[indexParaAceitar].prioridade = prioridadeSelecionada

        // Salvar as ocorrências atualizadas
        localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias))
        console.log("Ocorrências salvas no localStorage")

        // Obter ocorrências aceites existentes
        const aceites = JSON.parse(localStorage.getItem("ocorrenciasAceites")) || []
        console.log("Ocorrências aceites antes:", aceites)

        // Criar uma cópia da ocorrência para adicionar às aceites
        const ocorrenciaParaAceitar = { ...ocorrenciaAtual }
        ocorrenciaParaAceitar.estado = "Aceite"
        ocorrenciaParaAceitar.prioridade = prioridadeSelecionada

        // Verificar se já existe (usando ID se disponível, senão usar combinação de campos)
        const jaExiste = aceites.some((a) => {
          if (a.id && ocorrenciaParaAceitar.id) {
            return a.id === ocorrenciaParaAceitar.id
          }
          return (
            a.userEmail === ocorrenciaParaAceitar.userEmail &&
            a.tipo === ocorrenciaParaAceitar.tipo &&
            a.morada === ocorrenciaParaAceitar.morada &&
            Math.abs(new Date(a.data).getTime() - new Date(ocorrenciaParaAceitar.data).getTime()) < 1000
          )
        })

        if (!jaExiste) {
          aceites.push(ocorrenciaParaAceitar)
          localStorage.setItem("ocorrenciasAceites", JSON.stringify(aceites))
          console.log("Ocorrência adicionada às aceites:", ocorrenciaParaAceitar)
          console.log("Ocorrências aceites após adição:", aceites)
        } else {
          console.log("Ocorrência já existe nas aceites, não foi duplicada")
        }

        // Fechar modal e limpar variáveis
        modalPrioridade.style.display = "none"
        document.getElementById("detalhesModal").style.display = "none"

        // Limpar seleções
        document.querySelectorAll(".prioridade-option").forEach((opt) => opt.classList.remove("selected"))

        // Reset das variáveis
        indexParaAceitar = null
        prioridadeSelecionada = null

        // Mostrar mensagem de sucesso
        alert("Pedido aceito com sucesso! Prioridade " + ocorrenciaParaAceitar.prioridade + " atribuída.")

        // Recarregar a página
        setTimeout(() => {
          location.reload()
        }, 500)
      } catch (error) {
        console.error("Erro ao aceitar pedido:", error)
        alert("Erro ao aceitar pedido. Tente novamente.")
      }
    } else {
      alert("Por favor, selecione uma prioridade.")
    }
  }

  // Atribuir a função ao botão
  confirmarPrioridade.onclick = confirmarPrioridadeFunc

  cancelarPrioridade.onclick = () => {
    console.log("Cancelar prioridade clicado")
    modalPrioridade.style.display = "none"
    indexParaAceitar = null
    prioridadeSelecionada = null
    // Remover todas as seleções
    document.querySelectorAll(".prioridade-option").forEach((opt) => opt.classList.remove("selected"))
  }

  fecharModalPrioridade.onclick = () => {
    console.log("Fechar modal prioridade clicado")
    modalPrioridade.style.display = "none"
    indexParaAceitar = null
    prioridadeSelecionada = null
    document.querySelectorAll(".prioridade-option").forEach((opt) => opt.classList.remove("selected"))
  }

  document.getElementById("fecharModal").onclick = () => {
    document.getElementById("detalhesModal").style.display = "none"
  }

  window.onclick = (event) => {
    if (event.target === document.getElementById("detalhesModal")) {
      document.getElementById("detalhesModal").style.display = "none"
    }
    if (event.target === modalRemover) {
      modalRemover.style.display = "none"
    }
    if (event.target === modalPrioridade) {
      modalPrioridade.style.display = "none"
      indexParaAceitar = null
      prioridadeSelecionada = null
      document.querySelectorAll(".prioridade-option").forEach((opt) => opt.classList.remove("selected"))
    }
  }

  confirmarRemocao.onclick = () => {
    ocorrencias.splice(indexParaRemover, 1)
    localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias))
    modalRemover.style.display = "none"
    location.reload()
  }

  cancelarRemocao.onclick = () => {
    modalRemover.style.display = "none"
  }
})

function classEstado(estado) {
  if (estado === "Aceite") return "aceite"
  if (estado === "Não aceite") return "nao-aceite"
  if (estado === "Devolvido") return "devolvido"
  return "em-espera"
}

// Nova função aceitar com modal de prioridade
window.aceitar = (i) => {
  console.log("Função aceitar chamada com índice:", i)
  indexParaAceitar = i
  prioridadeSelecionada = null
  // Limpar seleções anteriores
  document.querySelectorAll(".prioridade-option").forEach((opt) => opt.classList.remove("selected"))
  // Mostrar modal
  document.getElementById("modalPrioridade").style.display = "block"
  console.log("Modal de prioridade aberto")
}

window.rejeitar = (i) => {
  ocorrencias[i].estado = "Não aceite"
  localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias))
  location.reload()
}

window.devolver = (i) => {
  if (
    confirm(
      "Tem a certeza que pretende devolver este pedido? O utilizador será notificado que o pedido foi devolvido por falta de informação.",
    )
  ) {
    ocorrencias[i].estado = "Devolvido"
    // Remover prioridade se existir
    delete ocorrencias[i].prioridade
    localStorage.setItem("ocorrencias", JSON.stringify(ocorrencias))

    alert("Pedido devolvido com sucesso. O utilizador poderá adicionar mais detalhes e reenviar.")
    location.reload()
  }
}
