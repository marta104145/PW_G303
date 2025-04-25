const perito = JSON.parse(localStorage.getItem("peritoSelecionado"));
const peritos = JSON.parse(localStorage.getItem("peritos")) || [];

if (perito) {
    document.getElementById("perito-img").src = perito.imagem;
    document.getElementById("perito-nome").textContent = perito.nome;
    document.getElementById("perito-especialidade").textContent = perito.especialidade;
    document.getElementById("perito-morada").textContent = perito.morada;
    document.getElementById("perito-email").textContent = perito.email;
    document.getElementById("perito-telemovel").textContent = perito.telemovel;
    document.getElementById("perito-nascimento").textContent = perito.nascimento;
}

function confirmarRemocao() {
    document.getElementById("popup-remocao").style.display = "flex";
}

function fecharPopup() {
    document.getElementById("popup-remocao").style.display = "none";
}

function removerPerito() {
    const novos = peritos.filter(p => p.email !== perito.email);
    localStorage.setItem("peritos", JSON.stringify(novos));
    localStorage.removeItem("peritoSelecionado");
    window.location.href = "peritos.html";
}


function editarPerito() {
    alert("Funcionalidade de edição por implementar.");
}

function carregarAuditorias() {
    const lista = document.getElementById("lista-auditorias");
    const contador = document.getElementById("contador-auditorias");
    lista.innerHTML = "";

    const total = 5; // Simulação
    for (let i = 1; i <= total; i++) {
        const li = document.createElement("li");
        li.className = "audit-item";
        li.innerHTML = `
      <div class="audit-icon">${i}</div>
      <div class="audit-info">
        <div class="audit-type">Auditoria ${i}</div>
        <div class="audit-location">${perito.morada}</div>
      </div>
      <div class="audit-date">Hoje</div>
      <div class="audit-status">Por Ler</div>
    `;
        lista.appendChild(li);
    }

    contador.textContent = `1 - ${total} de ${total}`;
}

function initMap() {
    const local = { lat: 41.450491, lng: -8.294101 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: local,
    });
    new google.maps.Marker({ position: local, map: map });
}

document.addEventListener("DOMContentLoaded", carregarAuditorias);
