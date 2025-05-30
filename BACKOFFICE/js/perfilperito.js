// perfilperito.js - agora com lógica completa de mapa embutida
const perito = JSON.parse(localStorage.getItem("peritoSelecionado"));
const peritos = JSON.parse(localStorage.getItem("peritos")) || [];

// Variáveis globais para mapa e marcadores
let map;
let markers = [];

// Preencher dados do perfil
if (perito) {
    document.getElementById("perito-img").src = perito.imagem;
    document.getElementById("perito-nome").textContent = perito.nome;
    document.getElementById("perito-especialidade").textContent = perito.especialidade;
    document.getElementById("perito-morada").textContent = perito.morada;
    document.getElementById("perito-email").textContent = perito.email;
    document.getElementById("perito-telemovel").textContent = perito.telemovel;
    document.getElementById("perito-nascimento").textContent = perito.nascimento;
}

// Remoção e edição de perito
function confirmarRemocao() { document.getElementById("popup-remocao").style.display = "flex"; }
function fecharPopup()    { document.getElementById("popup-remocao").style.display = "none"; }
function removerPerito() {
    const novos = peritos.filter(p => p.email !== perito.email);
    localStorage.setItem("peritos", JSON.stringify(novos));
    localStorage.removeItem("peritoSelecionado");
    window.location.href = "peritos.html";
}
function editarPerito() { window.location.href = "editarperito.html"; }

// Carrega e lista auditorias atribuídas
function carregarAuditorias() {
    const lista = document.getElementById("lista-auditorias");
    const contador = document.getElementById("contador-auditorias");
    lista.innerHTML = "";

    const todas = JSON.parse(localStorage.getItem("auditorias")) || [];
    const minhas = todas.filter(a => a.equipa === perito.nome);

    minhas.forEach((aud, idx) => {
        const li = document.createElement("li");
        li.className = "audit-item";
        li.innerHTML = `
            <div class="audit-icon">${idx + 1}</div>
            <div class="audit-info">
                <div class="audit-type">${aud.nome || aud.tipo}</div>
                <div class="audit-location">${aud.local_nome}</div>
            </div>
            <div class="audit-date">${aud.dataFormatada || new Date(aud.data).toLocaleString()}</div>
            <div class="audit-status">Por Ler</div>
        `;
        lista.appendChild(li);
    });

    const total = minhas.length;
    contador.textContent = total > 0 ? `1 - ${total} de ${total}` : '0 - 0 de 0';

    return minhas;
}

// Adiciona marcadores ao mapa
function clearMarkers() {
    markers.forEach(m => m.setMap(null));
    markers = [];
}

function addMarker(aud, geocoder) {
    if (aud.lat && aud.lng) {
        const pos = { lat: aud.lat, lng: aud.lng };
        const marker = new google.maps.Marker({ map, position: pos, title: aud.nome || aud.tipo });
        markers.push(marker);
        const info = new google.maps.InfoWindow({ content: `<strong>${aud.nome || aud.tipo}</strong><br>${aud.local_nome}` });
        marker.addListener('click', () => info.open({ anchor: marker, map }));
    } else {
        // geocodificar
        let endereco = aud.local_nome || '';
        if (aud.local_tipo) endereco += `, ${aud.local_tipo}`;
        endereco += ', Portugal';
        geocoder.geocode({ address: endereco }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const marker = new google.maps.Marker({ map, position: results[0].geometry.location, title: aud.nome || aud.tipo });
                markers.push(marker);
                const info = new google.maps.InfoWindow({ content: `<strong>${aud.nome || aud.tipo}</strong><br>${aud.local_nome}` });
                marker.addListener('click', () => info.open({ anchor: marker, map }));
            }
        });
    }
}

// Inicializa o mapa e plota auditorias do perito
function initMap() {
    const center = { lat: 41.450491, lng: -8.294101 };
    map = new google.maps.Map(document.getElementById('map'), { center, zoom: 12 });
    const geocoder = new google.maps.Geocoder();

    const minhas = carregarAuditorias();
    clearMarkers();
    minhas.forEach(aud => addMarker(aud, geocoder));
}

// Setup de eventos
window.addEventListener('DOMContentLoaded', () => {
    carregarAuditorias();
});
// callback para a API Google Maps chamar
window.initMap = initMap;
