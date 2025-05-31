// --------- LISTA DE CIDADES E INTERVALOS DE CÓDIGOS POSTAIS ---------
const cidadesBraga = [
  { nome: "Barcelos", intervalos: [[4750, 4770]] },
  { nome: "Braga", intervalos: [[4700, 4715]] },
  { nome: "Guimarães", intervalos: [[4800, 4835]] },
  { nome: "Vila Nova de Famalicão", intervalos: [[4760, 4775]] },
  { nome: "Vila Verde", intervalos: [[4730, 4745]] },
  { nome: "Fafe", intervalos: [[4820, 4830]] },
  { nome: "Póvoa de Lanhoso", intervalos: [[4830, 4840]] },
  { nome: "Amares", intervalos: [[4720, 4720]] },
  { nome: "Vieira do Minho", intervalos: [[4850, 4850]] },
  { nome: "Celorico de Basto", intervalos: [[4890, 4890]] },
  { nome: "Terras de Bouro", intervalos: [[4840, 4840]] },
  { nome: "Cabeceiras de Basto", intervalos: [[4860, 4860]] },
  { nome: "Esposende", intervalos: [[4740, 4745]] },
  { nome: "Vizela", intervalos: [[4815, 4815]] },
]

// --------- FUNÇÃO PARA OBTER CIDADE PELO CÓDIGO POSTAL ---------
function obterCidadePorCodigoPostal(codigoPostal) {
  if (!codigoPostal) {
    return null
  }

  // Converter para string e extrair apenas os primeiros 4 dígitos
  const codigoStr = String(codigoPostal).replace(/\D/g, "") // Remove caracteres não numéricos
  const codigo = Number.parseInt(codigoStr.substring(0, 4)) // Pega os primeiros 4 dígitos

  if (isNaN(codigo)) {
    return null
  }

  console.log("Código postal recebido:", codigoPostal, "-> processado:", codigo)

  for (const cidade of cidadesBraga) {
    for (const intervalo of cidade.intervalos) {
      if (codigo >= intervalo[0] && codigo <= intervalo[1]) {
        console.log("Cidade encontrada:", cidade.nome)
        return cidade.nome
      }
    }
  }

  console.log("Cidade não encontrada para código:", codigo)
  return null
}

// --------- FUNÇÃO PARA ATUALIZAR AUDITORIAS EXISTENTES COM CÓDIGOS POSTAIS ---------
function atualizarAuditoriasComCodigosPostais() {
  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]")
  let atualizadas = false

  // Códigos postais de exemplo para as auditorias existentes
  const codigosExemplo = ["4710", "4800", "4750", "4730", "4820", "4740"]

  auditorias.forEach((auditoria, index) => {
    // Se a auditoria não tem código postal, adicionar um
    if (!auditoria.codigoPostal) {
      const codigoPostal = codigosExemplo[index % codigosExemplo.length]
      auditoria.codigoPostal = codigoPostal
      auditoria.local = obterCidadePorCodigoPostal(codigoPostal)
      atualizadas = true
      console.log(`Auditoria "${auditoria.nome}" atualizada com código ${codigoPostal} -> ${auditoria.local}`)
    }
  })

  if (atualizadas) {
    localStorage.setItem("auditorias", JSON.stringify(auditorias))
    console.log("Auditorias atualizadas com códigos postais!")
  }

  return auditorias
}

// --------- GUARDA UMA NOVA AUDITORIA NO LOCALSTORAGE ---------
function adicionarAuditoria(nome, descricao, data, lat, lng, tipo, codigoPostal) {
  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]")
  const local = obterCidadePorCodigoPostal(codigoPostal) || "Local não especificado"
  auditorias.push({ nome, descricao, data, lat, lng, tipo, local, codigoPostal })
  localStorage.setItem("auditorias", JSON.stringify(auditorias))
  alert("Nova auditoria guardada!")
}

// --------- FUNÇÃO PARA TESTAR CÓDIGOS POSTAIS ---------
function testarCodigosPostais() {
  console.log("=== TESTE DE CÓDIGOS POSTAIS ===")
  const testes = ["4710", "4800", "4750", "4730", "4820", "4740", "9999"]
  testes.forEach((codigo) => {
    console.log(`${codigo} -> ${obterCidadePorCodigoPostal(codigo) || "Não encontrado"}`)
  })
}

document.addEventListener("DOMContentLoaded", () => {
  // Executar teste de códigos postais
  testarCodigosPostais()

  const auditoriasList = document.getElementById("auditorias-list")

  if (!auditoriasList) {
    console.error("Elemento auditorias-list não encontrado!")
    return
  }

  auditoriasList.innerHTML = ""

  // Atualizar auditorias existentes com códigos postais se necessário
  const auditorias = atualizarAuditoriasComCodigosPostais()

  if (auditorias && auditorias.length > 0) {
    console.log("Auditorias carregadas:", auditorias)

    auditorias.forEach((auditoria, index) => {
      const li = document.createElement("li")
      li.classList.add("auditoria-item")

      const strong = document.createElement("strong")
      const data = auditoria.data ? auditoria.data : "dd/mm/aaaa"
      const nome = auditoria.nome ? auditoria.nome : `Auditoria ${index + 1}`
      strong.textContent = `${nome} - ${data}`
      li.appendChild(strong)

      const p = document.createElement("p")
      p.textContent = auditoria.descricao || "Sem descrição."
      li.appendChild(p)

      // Determinar o local
      let local = auditoria.local

      // Se não tem local mas tem código postal, calcular
      if ((!local || local === "Local não especificado") && auditoria.codigoPostal) {
        local = obterCidadePorCodigoPostal(auditoria.codigoPostal)
        if (local) {
          // Atualizar a auditoria com o local correto
          auditoria.local = local
          localStorage.setItem("auditorias", JSON.stringify(auditorias))
        }
      }

      // Se ainda não tem local
      if (!local) {
        local = "Local não especificado"
      }

      // Tooltip container
      const tooltip = document.createElement("div")
      tooltip.classList.add("tooltip")
      tooltip.innerHTML = `
        <p><strong>Nome:</strong> ${auditoria.nome || "Sem nome"}</p>
        <p><strong>Data:</strong> ${auditoria.data || "Sem data"}</p>
        <p><strong>Tipo:</strong> ${auditoria.tipo || "Sem tipo"}</p>
        <p><strong>Local:</strong> ${local}</p>
        <p><strong>Código Postal:</strong> ${auditoria.codigoPostal || "Não especificado"}</p>
        <p><strong>Descrição:</strong> ${auditoria.descricao || "Sem descrição"}</p>
      `
      li.appendChild(tooltip)

      auditoriasList.appendChild(li)
    })

    // Inicializar o mapa das auditorias se a API do Google Maps estiver carregada
    if (window.google && window.google.maps) {
      initAuditoriasMap(auditorias)
    }
  } else {
    const li = document.createElement("li")
    li.textContent = "Sem auditorias registadas no localStorage."
    auditoriasList.appendChild(li)
  }
})

// --------- INICIALIZA O MAPA E ADICIONA MARCADORES ---------
function initAuditoriasMap(auditorias) {
  const mapElement = document.getElementById("auditoria-map")
  if (!mapElement) {
    console.error("Elemento auditoria-map não encontrado!")
    return
  }

  const google = window.google

  if (!google) {
    console.error("Google Maps API não carregada!")
    return
  }

  const map = new google.maps.Map(mapElement, {
    center: { lat: 41.55, lng: -8.43 }, // Braga por exemplo
    zoom: 9,
  })

  auditorias.forEach((auditoria) => {
    if (auditoria.lat && auditoria.lng) {
      // Determinar o local
      let local = auditoria.local
      if ((!local || local === "Local não especificado") && auditoria.codigoPostal) {
        local = obterCidadePorCodigoPostal(auditoria.codigoPostal) || "Local não especificado"
      }

      const marker = new google.maps.Marker({
        position: { lat: auditoria.lat, lng: auditoria.lng },
        map,
        title: auditoria.nome || "Auditoria",
      })

      const info = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 250px;">
            <p><strong>Nome:</strong> ${auditoria.nome || "Sem nome"}</p>
            <p><strong>Data:</strong> ${auditoria.data || "Sem data"}</p>
            <p><strong>Tipo:</strong> ${auditoria.tipo || "Sem tipo"}</p>
            <p><strong>Local:</strong> ${local}</p>
            <p><strong>Código Postal:</strong> ${auditoria.codigoPostal || "Não especificado"}</p>
            <p><strong>Descrição:</strong> ${auditoria.descricao || "Sem descrição"}</p>
          </div>
        `,
      })

      marker.addListener("click", () => {
        info.open({
          anchor: marker,
          map,
          shouldFocus: false,
        })
      })
    }
  })
}

// --------- BOTÕES DA HERO SECTION ---------
function scrollToSobre() {
  const sobre = document.getElementById("sobre")
  sobre.scrollIntoView({ behavior: "smooth" })
}

// --------- POPUP DE OCORRÊNCIAS ---------
function filtrarOcorrencias(tipo) {
  if (tipo === "em aberto") {
    const popup = document.getElementById("popup")
    const listaContainer = document.getElementById("lista-ocorrencias-abertas")
    listaContainer.innerHTML = "" // Limpa a lista

    const ocorrencias = JSON.parse(localStorage.getItem("ocorrenciasAceites") || "[]")

    if (ocorrencias.length === 0) {
      const mensagem = document.createElement("p")
      mensagem.textContent = "Sem ocorrências registadas."
      listaContainer.appendChild(mensagem)
    } else {
      ocorrencias.forEach((ocorrencia, index) => {
        const card = document.createElement("div")
        card.className = "ocorrencia-card"

        // FORMATAR DATA
        let dataFormatada = "dd/mm/aaaa"
        if (ocorrencia.data) {
          const dataObj = new Date(ocorrencia.data)
          const dia = String(dataObj.getDate()).padStart(2, "0")
          const mes = String(dataObj.getMonth() + 1).padStart(2, "0")
          const ano = dataObj.getFullYear()
          dataFormatada = `${dia}/${mes}/${ano}`
        }

        // TEXTO DA OCORRÊNCIA COM MAIS INFORMAÇÕES
        const texto = document.createElement("div")
        texto.className = "texto"
        texto.innerHTML = `
          <p><span class="verde">Ocorrência ${index + 1}</span> - ${dataFormatada}</p>
          ${ocorrencia.nome ? `<p><strong>Utilizador:</strong> ${ocorrencia.nome}</p>` : ""}
          <p><strong>Tipo:</strong> ${ocorrencia.tipo || "Sem tipo"}</p>
          <p><strong>Local:</strong> ${ocorrencia.morada || "Local não especificado"}</p>
          ${ocorrencia.codigoPostal ? `<p><strong>Código Postal:</strong> ${ocorrencia.codigoPostal}</p>` : ""}
          ${ocorrencia.prioridade ? `<p><strong>Prioridade:</strong> ${ocorrencia.prioridade}</p>` : ""}
          <p><strong>Relato:</strong> ${ocorrencia.descricao || "Sem descrição."}</p>
          ${ocorrencia.contacto ? `<p><strong>Contacto:</strong> ${ocorrencia.contacto}</p>` : ""}
        `

        card.appendChild(texto)
        listaContainer.appendChild(card)
      })
    }

    popup.style.display = "flex"
  }

  if (tipo === "concluídas") {
    filtrarOcorrenciasConcluidas()
  }
}

// --------- BOTÃO: VER OCORRÊNCIAS CONCLUÍDAS ---------
function filtrarOcorrenciasConcluidas() {
  const popup = document.getElementById("popup-concluidas")
  const listaContainer = document.getElementById("lista-ocorrencias-concluidas")
  listaContainer.innerHTML = ""

  // Buscar ocorrências resolvidas do localStorage (vem da página de auditorias)
  const ocorrenciasResolvidas = JSON.parse(localStorage.getItem("resolvidas") || "[]")

  if (!ocorrenciasResolvidas || ocorrenciasResolvidas.length === 0) {
    const mensagem = document.createElement("p")
    mensagem.textContent = "Sem ocorrências concluídas registadas."
    listaContainer.appendChild(mensagem)
  } else {
    ocorrenciasResolvidas.forEach((ocorrencia, index) => {
      const card = document.createElement("div")
      card.classList.add("ocorrencia-card")

      // FORMATAR DATA - usar dataFormatada se existir, senão tentar formatar
      let dataFormatada = "dd/mm/aaaa"
      if (ocorrencia.dataFormatada) {
        dataFormatada = ocorrencia.dataFormatada
      } else if (ocorrencia.data) {
        const dataObj = new Date(ocorrencia.data)
        const dia = String(dataObj.getDate()).padStart(2, "0")
        const mes = String(dataObj.getMonth() + 1).padStart(2, "0")
        const ano = dataObj.getFullYear()
        dataFormatada = `${dia}/${mes}/${ano}`
      }

      // TEXTO DA OCORRÊNCIA COM MAIS INFORMAÇÕES
      const texto = document.createElement("div")
      texto.className = "texto"
      texto.innerHTML = `
        <p><span class="verde">Ocorrência ${index + 1}</span> - ${dataFormatada}</p>
        <p><strong>Nome:</strong> ${ocorrencia.nome || "Sem nome"}</p>
        <p><strong>Tipo:</strong> ${ocorrencia.tipo || "Sem tipo"}</p>
        <p><strong>Local:</strong> ${ocorrencia.local_nome || "Sem localização"}</p>
        <p><strong>Perito Responsável:</strong> ${ocorrencia.equipa || "Não especificado"}</p>
        ${ocorrencia.prioridade ? `<p><strong>Prioridade:</strong> ${ocorrencia.prioridade}</p>` : ""}
        <p>Estado: <strong style="color: #2c5f2d;">Concluída</strong></p>
      `

      card.appendChild(texto)
      listaContainer.appendChild(card)
    })
  }

  popup.style.display = "flex"
}

// --------- FECHAR POPUP ---------
function fecharPopup(id) {
  const popup = document.getElementById(id)
  if (popup) {
    popup.style.display = "none"
  }
}

// --------- FUNÇÕES UTILITÁRIAS PARA DEBUG ---------
function adicionarCodigoPostalManual(nomeAuditoria, codigoPostal) {
  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]")
  const auditoria = auditorias.find((a) => a.nome.includes(nomeAuditoria))

  if (auditoria) {
    auditoria.codigoPostal = codigoPostal
    auditoria.local = obterCidadePorCodigoPostal(codigoPostal) || "Local não especificado"
    localStorage.setItem("auditorias", JSON.stringify(auditorias))
    console.log(`Código postal ${codigoPostal} adicionado à auditoria "${auditoria.nome}" -> ${auditoria.local}`)
    location.reload()
  } else {
    console.log("Auditoria não encontrada!")
  }
}

function listarAuditorias() {
  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]")
  console.log("=== AUDITORIAS NO LOCALSTORAGE ===")
  auditorias.forEach((auditoria, index) => {
    console.log(
      `${index}: ${auditoria.nome} - CP: ${auditoria.codigoPostal || "Sem CP"} - Local: ${auditoria.local || "Sem local"}`,
    )
  })
}

function limparDados() {
  localStorage.removeItem("auditorias")
  location.reload()
}

// --------- FUNÇÕES PARA TESTAR OCORRÊNCIAS CONCLUÍDAS (DEBUG) ---------
function listarOcorrenciasConcluidas() {
  const ocorrencias = JSON.parse(localStorage.getItem("resolvidas") || "[]")
  console.log("=== OCORRÊNCIAS CONCLUÍDAS ===")
  ocorrencias.forEach((ocorrencia, index) => {
    console.log(`${index}: ${ocorrencia.nome} - ${ocorrencia.tipo} - ${ocorrencia.local_nome}`)
  })
}

// --------- ADICIONAR OCORRÊNCIAS DE TESTE (PARA DEBUG) ---------
function adicionarOcorrenciasTesteResolvidas() {
  const ocorrenciasExemplo = [
    {
      nome: "Limpeza do Parque Central",
      tipo: "Gestão de Resíduos",
      local_nome: "Parque Central de Braga",
      equipa: "João Silva",
      dataFormatada: "15/12/2024",
      prioridade: '<span class="prioridade-badge prioridade-4">4 ★★★★☆</span>',
    },
    {
      nome: "Poda de Árvores",
      tipo: "Árvores em Risco",
      local_nome: "Avenida da Liberdade",
      equipa: "Maria Santos",
      dataFormatada: "10/12/2024",
      prioridade: '<span class="prioridade-badge prioridade-5">5 ★★★★★</span>',
    },
    {
      nome: "Manutenção de Jardim",
      tipo: "Manutenção de Jardins",
      local_nome: "Jardim de Santa Bárbara",
      equipa: "Pedro Costa",
      dataFormatada: "08/12/2024",
      prioridade: '<span class="prioridade-badge prioridade-2">2 ★★☆☆☆</span>',
    },
  ]

  localStorage.setItem("resolvidas", JSON.stringify(ocorrenciasExemplo))
  console.log("Ocorrências de teste adicionadas!")
}

// --------- ADICIONAR OCORRÊNCIAS DE TESTE PARA "EM ABERTO" (PARA DEBUG) ---------
function adicionarOcorrenciasTesteAbertas() {
  const ocorrenciasExemplo = [
    {
      nome: "João Silva",
      tipo: "Parque Vandalizado",
      morada: "Parque da Cidade, Braga",
      codigoPostal: "4710-229",
      prioridade: "Alta",
      descricao: "Equipamentos do parque foram vandalizados durante a noite",
      contacto: "joao.silva@email.com",
      data: "2025-05-19",
    },
    {
      nome: "Maria Santos",
      tipo: "Árvore em Risco",
      morada: "Rua da Liberdade, Guimarães",
      codigoPostal: "4800-123",
      prioridade: "Muito Alta",
      descricao: "Árvore com risco de queda próximo à escola",
      contacto: "maria.santos@email.com",
      data: "2025-05-18",
    },
    {
      nome: "Pedro Costa",
      tipo: "Lixo Abandonado",
      morada: "Avenida Central, Barcelos",
      codigoPostal: "4750-111",
      prioridade: "Média",
      descricao: "Acumulação de lixo na via pública",
      contacto: "pedro.costa@email.com",
      data: "2025-05-17",
    },
  ]

  localStorage.setItem("ocorrenciasAceites", JSON.stringify(ocorrenciasExemplo))
  console.log("Ocorrências de teste (em aberto) adicionadas!")
}

// Inicializar o mapa das ocorrências quando a página carregar
window.addEventListener("load", () => {
  // Verificar se o mapa das ocorrências existe
  const ocorrenciasMapElement = document.getElementById("ocorrencias-map")
  if (ocorrenciasMapElement && window.google && window.google.maps) {
    // Inicializar o mapa das ocorrências
    const google = window.google
    const ocorrenciasMap = new google.maps.Map(ocorrenciasMapElement, {
      center: { lat: 41.55, lng: -8.43 }, // Coordenadas de Braga
      zoom: 9,
    })

    // Adicionar alguns marcadores de exemplo
    const marcadores = [
      { lat: 41.55, lng: -8.43, titulo: "Ocorrência 1" },
      { lat: 41.5, lng: -8.4, titulo: "Ocorrência 2" },
      { lat: 41.6, lng: -8.45, titulo: "Ocorrência 3" },
    ]

    marcadores.forEach((pos) => {
      new google.maps.Marker({
        position: { lat: pos.lat, lng: pos.lng },
        map: ocorrenciasMap,
        title: pos.titulo,
      })
    })
  }
})
function initAuditoriasMap() {
  const centro = { lat: 41.55, lng: -8.43 }; // Ajusta o centro que quiseres
  const map = new google.maps.Map(
    document.getElementById("auditoria-map"),
    { center: centro, zoom: 12 }
  );
  const geocoder = new google.maps.Geocoder();

  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]");
  auditorias.forEach(aud => {
    if (aud.lat != null && aud.lng != null) {
      // Usa coordenadas já disponíveis
      placeMarker({ lat: aud.lat, lng: aud.lng }, aud, map);
    } else {
      // Geocodifica a localização
      let endereco = aud.local_nome || aud.morada || "";
      if (aud.local_tipo) endereco += `, ${aud.local_tipo}`;
      endereco += ", Portugal";
      geocoder.geocode({ address: endereco }, (results, status) => {
        if (status === "OK" && results[0]) {
          placeMarker(results[0].geometry.location, aud, map);
        }
      });
    }
  });
}

function placeMarker(position, aud, map) {
  const marker = new google.maps.Marker({
    position, map, title: aud.nome || aud.tipo
  });
  const infow = new google.maps.InfoWindow({
    content: `
      <div>
        <strong>${aud.nome || "Sem nome"}</strong><br>
        <em>${aud.data || ""}</em><br>
        <p>${aud.descricao || ""}</p>
      </div>
    `
  });
  marker.addListener("click", () => infow.open(map, marker));
}
