// --------- GUARDA UMA NOVA AUDITORIA NO LOCALSTORAGE ---------
function adicionarAuditoria(nome, descricao, data, lat, lng) {
  const auditorias = JSON.parse(localStorage.getItem("auditorias") || "[]");
  auditorias.push({ nome, descricao, data, lat, lng });
  localStorage.setItem("auditorias", JSON.stringify(auditorias));
  alert("Nova auditoria guardada!");
}

// --------- CARREGA AS AUDITORIAS NO HTML E NO MAPA ---------
document.addEventListener("DOMContentLoaded", () => {
  const auditoriasList = document.getElementById("auditorias-list");
  const auditoriasData = localStorage.getItem("auditorias");
  auditoriasList.innerHTML = "";

  if (auditoriasData) {
    const auditorias = JSON.parse(auditoriasData);
    auditorias.forEach((auditoria) => {
      const li = document.createElement("li");

      const strong = document.createElement("strong");
      const data = auditoria.data ? auditoria.data : "dd/mm/aaaa";
      const nome = auditoria.nome ? auditoria.nome : "Auditoria sem nome";
      strong.textContent = `${nome} - ${data}`;
      li.appendChild(strong);

      const p = document.createElement("p");
      p.textContent = auditoria.descricao || "Sem descrição.";
      li.appendChild(p);

      auditoriasList.appendChild(li);
    });

    // Inicia o mapa com as auditorias
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
          <div>
            <strong>${auditoria.nome || "Sem nome"}</strong><br>
            <em>${auditoria.data || "Sem data"}</em><br>
            <p>${auditoria.descricao || "Sem descrição"}</p>
          </div>
        `
      });

      marker.addListener("click", () => {
        info.open(map, marker);
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

// --------- INICIALIZA MAPA DE AUDITORIAS ---------
function initAuditoriasMap() {
    const centro = { lat: 41.55, lng: -8.43 }; // Centro inicial (p.ex. Braga)
    const map = new google.maps.Map(document.getElementById("auditoria-map"), {
        center: centro,
        zoom: 8,
    });
    globalMap = map;

    const geocoder = new google.maps.Geocoder();
    const auditorias = JSON.parse(localStorage.getItem('auditorias') || '[]');
    window._auditoriasOriginais = auditorias;

    renderAuditoriaMarkers(auditorias, map, geocoder);
}

// --------- FUNÇÃO PARA RENDERIZAR MARCADORES DE AUDITORIAS ---------
function renderAuditoriaMarkers(lista, map, geocoder) {
    globalMarkers.forEach(m => m.setMap(null));
    globalMarkers = [];

    lista.forEach(auditoria => {
        if (auditoria.lat && auditoria.lng) {
            addAuditoriaMarker({ lat: auditoria.lat, lng: auditoria.lng }, auditoria, map);
        } else if (auditoria.localidade || auditoria.morada) {
            const endereco = `${auditoria.morada || ''} ${auditoria.localidade || ''} Portugal`;
            geocoder.geocode({ address: endereco }, (results, status) => {
                if (status === 'OK' && results[0]) {
                    addAuditoriaMarker(results[0].geometry.location, auditoria, map);
                }
            });
        }
    });
}

function addAuditoriaMarker(position, auditoria, map) {
    const marker = new google.maps.Marker({
        map,
        position,
        icon: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        title: auditoria.nome || 'Auditoria'
    });
    globalMarkers.push(marker);

    const content = `
        <div style="max-width: 260px;">
            <strong>${auditoria.nome || 'Sem nome'}</strong><br>
            <em>${auditoria.data || 'Sem data'}</em><br>
            <p>${auditoria.descricao || 'Sem descrição'}</p>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({ content });
    marker.addListener('click', () => {
        infoWindow.open({ anchor: marker, map });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initAuditoriasMap();
});