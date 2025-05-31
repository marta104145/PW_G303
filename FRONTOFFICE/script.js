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

    initAuditoriasMap(auditorias)
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
    zoom: 8,
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
    document.getElementById("popup").style.display = "flex"
  } else if (tipo === "em análise") {
    document.getElementById("popup-analise").style.display = "flex"
  } else if (tipo === "concluídas") {
    document.getElementById("popup-concluidas").style.display = "flex"
  }
}

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

function filtrarOcorrencias(tipo) {
  if (tipo === "em aberto") {
    const popup = document.getElementById("popup");
    const listaContainer = document.getElementById("lista-ocorrencias-abertas");
    listaContainer.innerHTML = ""; // Limpa a lista

    const ocorrencias = JSON.parse(localStorage.getItem("ocorrenciasAceites") || "[]");

    if (ocorrencias.length === 0) {
      const mensagem = document.createElement("p");
      mensagem.textContent = "Sem ocorrências registadas.";
      listaContainer.appendChild(mensagem);
    } else {
      ocorrencias.forEach((ocorrencia, index) => {
        const card = document.createElement("div");
        card.className = "ocorrencia-card";

        // FORMATAR DATA
        let dataFormatada = "dd/mm/aaaa";
        if (ocorrencia.data) {
          const dataObj = new Date(ocorrencia.data);
          const dia = String(dataObj.getDate()).padStart(2, '0');
          const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
          const ano = dataObj.getFullYear();
          dataFormatada = `${dia}/${mes}/${ano}`;
        }

        // TEXTO DA OCORRÊNCIA
        const texto = document.createElement("div");
        texto.className = "texto";
        texto.innerHTML = `
          <p><span class="verde">Ocorrência ${index + 1}</span> - ${dataFormatada}</p>
          ${ocorrencia.nome ? `<p><strong>${ocorrencia.nome}</strong></p>` : ""}
          <p><strong>Tipo:</strong> ${ocorrencia.tipo || "Sem tipo"}</p>
          <p>Relato: ${ocorrencia.descricao || "Sem descrição."}</p>
        `;

        card.appendChild(texto);

        // IMAGEM DA OCORRÊNCIA
        const imagem = document.createElement("img");
        if (ocorrencia.imagem && ocorrencia.imagem.trim() !== "") {
          imagem.src = ocorrencia.imagem;
        } else {
          imagem.src = "imagens/sem-imagem.png";
        }
        imagem.alt = ocorrencia.nome || "Imagem da ocorrência";
        card.appendChild(imagem);

        listaContainer.appendChild(card);
      });
    }

    popup.style.display = "flex";
  }

  if (tipo === "concluídas") {
    document.getElementById("popup-concluidas").style.display = "flex";
  }
}

function filtrarOcorrencias(tipo) {
  if (tipo === "em aberto") {
    const popup = document.getElementById("popup");
    const listaContainer = document.getElementById("lista-ocorrencias-abertas");
    listaContainer.innerHTML = ""; // Limpa a lista

    const ocorrencias = JSON.parse(localStorage.getItem("ocorrenciasAceites") || "[]");

    if (ocorrencias.length === 0) {
      const mensagem = document.createElement("p");
      mensagem.textContent = "Sem ocorrências registadas.";
      listaContainer.appendChild(mensagem);
    } else {
      ocorrencias.forEach((ocorrencia, index) => {
        const card = document.createElement("div");
        card.className = "ocorrencia-card";

        // FORMATAR DATA
        let dataFormatada = "dd/mm/aaaa";
        if (ocorrencia.data) {
          const dataObj = new Date(ocorrencia.data);
          const dia = String(dataObj.getDate()).padStart(2, '0');
          const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
          const ano = dataObj.getFullYear();
          dataFormatada = `${dia}/${mes}/${ano}`;
        }

        // TEXTO DA OCORRÊNCIA
        const texto = document.createElement("div");
        texto.className = "texto";
        texto.innerHTML = `
          <p><span class="verde">Ocorrência ${index + 1}</span> - ${dataFormatada}</p>
          ${ocorrencia.nome ? `<p><strong>${ocorrencia.nome}</strong></p>` : ""}
          <p><strong>Tipo:</strong> ${ocorrencia.tipo || "Sem tipo"}</p>
          <p>Relato: ${ocorrencia.descricao || "Sem descrição."}</p>
        `;

        card.appendChild(texto);

        // IMAGEM DA OCORRÊNCIA
        const imagem = document.createElement("img");
        if (ocorrencia.imagem && ocorrencia.imagem.trim() !== "") {
          imagem.src = ocorrencia.imagem;
        } else {
          imagem.src = "imagens/sem-imagem.png";
        }
        imagem.alt = ocorrencia.nome || "Imagem da ocorrência";
        card.appendChild(imagem);

        listaContainer.appendChild(card);
      });
    }

    popup.style.display = "flex";
  }

  if (tipo === "concluídas") {
    const popupConcluidas = document.getElementById("popup-concluidas");
    const listaContainer = document.getElementById("lista-ocorrencias-concluidas");
    listaContainer.innerHTML = ""; // Limpa a lista

    const ocorrencias = JSON.parse(localStorage.getItem("ocorrenciasResolvidas") || "[]");

    if (ocorrencias.length === 0) {
      const mensagem = document.createElement("p");
      mensagem.textContent = "Sem ocorrências registadas.";
      listaContainer.appendChild(mensagem);
    } else {
      ocorrencias.forEach((ocorrencia, index) => {
        const card = document.createElement("div");
        card.className = "ocorrencia-card";

        // FORMATAR DATA
        let dataFormatada = "dd/mm/aaaa";
        if (ocorrencia.data) {
          const dataObj = new Date(ocorrencia.data);
          const dia = String(dataObj.getDate()).padStart(2, '0');
          const mes = String(dataObj.getMonth() + 1).padStart(2, '0');
          const ano = dataObj.getFullYear();
          dataFormatada = `${dia}/${mes}/${ano}`;
        }

        // TEXTO DA OCORRÊNCIA
        const texto = document.createElement("div");
        texto.className = "texto";
        texto.innerHTML = `
          <p><span class="verde">Ocorrência ${index + 1}</span> - ${dataFormatada}</p>
          ${ocorrencia.nome ? `<p><strong>${ocorrencia.nome}</strong></p>` : ""}
          <p><strong>Tipo:</strong> ${ocorrencia.tipo || "Sem tipo"}</p>
          <p>Relato: ${ocorrencia.descricao || "Sem descrição."}</p>
        `;

        card.appendChild(texto);

        // IMAGEM DA OCORRÊNCIA
        const imagem = document.createElement("img");
        if (ocorrencia.imagem && ocorrencia.imagem.trim() !== "") {
          imagem.src = ocorrencia.imagem;
        } else {
          imagem.src = "imagens/sem-imagem.png";
        }
        imagem.alt = ocorrencia.nome || "Imagem da ocorrência";
        card.appendChild(imagem);

        listaContainer.appendChild(card);
      });
    }

    popupConcluidas.style.display = "flex";
  }
}
