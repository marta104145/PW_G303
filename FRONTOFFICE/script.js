// --------- GUARDA UMA NOVA AUDITORIA NO LOCALSTORAGE ---------
function adicionarAuditoria(nome, descricao, data, lat, lng, tipo, local) {
  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]");
  auditorias.push({ nome, descricao, data, lat, lng, tipo, local });
  localStorage.setItem("auditorias", JSON.stringify(auditorias));
  alert("Nova auditoria guardada!");
}

document.addEventListener("DOMContentLoaded", () => {
  const auditoriasList = document.getElementById("auditorias-list");
  const auditoriasData = localStorage.getItem("auditorias");
  auditoriasList.innerHTML = "";

  if (auditoriasData) {
    const auditorias = JSON.parse(auditoriasData);
    auditorias.forEach((auditoria) => {
      const li = document.createElement("li");
      li.classList.add("auditoria-item");

      const strong = document.createElement("strong");
      const data = auditoria.data ? auditoria.data : "dd/mm/aaaa";
      const nome = auditoria.nome ? auditoria.nome : "Auditoria sem nome";
      strong.textContent = `${nome} - ${data}`;
      li.appendChild(strong);

      const p = document.createElement("p");
      p.textContent = auditoria.descricao || "Sem descrição.";
      li.appendChild(p);

      // Tooltip container
      const tooltip = document.createElement("div");
      tooltip.classList.add("tooltip");
      tooltip.innerHTML = `
        <p><strong>Nome:</strong> ${auditoria.nome || "Sem nome"}</p>
        <p><strong>Data:</strong> ${auditoria.data || "Sem data"}</p>
        <p><strong>Tipo:</strong> ${auditoria.tipo || "Sem tipo"}</p>
        <p><strong>Local:</strong> ${auditoria.local || "Sem local"}</p>
        <p><strong>Descrição:</strong> ${auditoria.descricao || "Sem descrição."}</p>
        ${auditoria.lat && auditoria.lng ? `<p><strong>Localização:</strong> ${auditoria.lat}, ${auditoria.lng}</p>` : ""}
      `;
      li.appendChild(tooltip);

      auditoriasList.appendChild(li);
    });

    initAuditoriasMap(auditorias);
  } else {
    const li = document.createElement("li");
    li.textContent = "Sem auditorias registadas no localStorage.";
    auditoriasList.appendChild(li);
  }
});

// --------- INICIALIZA O MAPA E ADICIONA MARCADORES ---------
function initAuditoriasMap(auditorias) {
  const map = new google.maps.Map(document.getElementById("auditoria-map"), {
    center: { lat: 41.55, lng: -8.43 }, // Braga por exemplo
    zoom: 8
  });

  auditorias.forEach((auditoria) => {
    if (auditoria.lat && auditoria.lng) {
      const marker = new google.maps.Marker({
        position: { lat: auditoria.lat, lng: auditoria.lng },
        map,
        title: auditoria.nome || "Auditoria"
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 250px;">
            <p><strong>Nome:</strong> ${auditoria.nome || "Sem nome"}</p>
            <p><strong>Data:</strong> ${auditoria.data || "Sem data"}</p>
            <p><strong>Tipo:</strong> ${auditoria.tipo || "Sem tipo"}</p>
            <p><strong>Local:</strong> ${auditoria.local || "Sem local"}</p>
            <p><strong>Descrição:</strong> ${auditoria.descricao || "Sem descrição"}</p>
          </div>
        `
      });

      marker.addListener("click", () => {
        info.open({
          anchor: marker,
          map,
          shouldFocus: false
        });
      });
    }
  });
}

// --------- BOTÕES DA HERO SECTION ---------
function scrollToSobre() {
  const sobre = document.getElementById("sobre");
  sobre.scrollIntoView({ behavior: "smooth" });
}

// --------- POPUP DE OCORRÊNCIAS ---------
function filtrarOcorrencias(tipo) {
  if (tipo === 'em aberto') {
    document.getElementById("popup").style.display = "flex";
  } else if (tipo === 'em análise') {
    document.getElementById("popup-analise").style.display = "flex";
  } else if (tipo === 'concluídas') {
    document.getElementById("popup-concluidas").style.display = "flex";
  }
}

function fecharPopup(id) {
  const popup = document.getElementById(id);
  if (popup) {
    popup.style.display = "none";
  }
}
