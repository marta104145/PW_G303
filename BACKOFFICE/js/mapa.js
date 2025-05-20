// --------- LISTA DE CIDADES E INTERVALOS DE CÓDIGOS POSTAIS ---------
const cidadesBraga = [
    { nome: "Barcelos",     intervalos: [ [4750,4770] ] },
    { nome: "Braga",        intervalos: [ [4700,4715] ] },
    { nome: "Guimarães",    intervalos: [ [4800,4835] ] },
    { nome: "Vila Nova de Famalicão", intervalos: [ [4760,4775] ] },
    { nome: "Vila Verde",   intervalos: [ [4730,4745] ] },
    { nome: "Fafe",         intervalos: [ [4820,4830] ] },
    { nome: "Póvoa de Lanhoso", intervalos: [ [4830,4840] ] },
    { nome: "Amares",       intervalos: [ [4720,4720] ] },
    { nome: "Vieira do Minho", intervalos: [ [4850,4850] ] },
    { nome: "Celorico de Basto", intervalos: [ [4890,4890] ] },
    { nome: "Terras de Bouro", intervalos: [ [4840,4840] ] },
    { nome: "Cabeceiras de Basto", intervalos: [ [4860,4860] ] },
    { nome: "Esposende",    intervalos: [ [4740,4745] ] },
    { nome: "Vizela",       intervalos: [ [4815,4815] ] }
];

let globalMarkers = [];
let globalMap = null;

// --------- INICIALIZA MAPA E MARCADORES --------
function initMap() {
    const centro = { lat: 41.450491, lng: -8.294101 };
    const map = new google.maps.Map(document.getElementById("map"), {
        center: centro,
        zoom: 12,
    });
    globalMap = map;

    const geocoder = new google.maps.Geocoder();
    const ocorrencias = JSON.parse(localStorage.getItem('ocorrencias') || '[]');
    window._ocorrenciasOriginais = ocorrencias; // guarda para o filtro usar

    // Adiciona os marcadores ao mapa
    renderMarkers(ocorrencias, map, geocoder);
}

// --------- FUNÇÃO PARA RENDERIZAR MARCADORES COM FILTRO ---------
function renderMarkers(lista, map, geocoder) {
    // Remove todos os marcadores antigos do mapa
    globalMarkers.forEach(m => m.setMap(null));
    globalMarkers = [];

    // Ícones por estado
    const iconBase = "https://maps.google.com/mapfiles/ms/icons/";
    const icons = {
        'Aceite': iconBase + 'green-dot.png',
        'Não aceite': iconBase + 'red-dot.png',
        'Devolvido': iconBase + 'yellow-dot.png',
        '': iconBase + 'yellow-dot.png'
    };

    // Função para criar marcador + InfoWindow
    function addMarker(position, oc) {
        const iconUrl = icons[oc.estado || ''] || icons[''];
        const marker = new google.maps.Marker({
            map,
            position,
            icon: iconUrl,
            title: oc.tipo || 'Ocorrência'
        });
        globalMarkers.push(marker);

        // InfoWindow bonito
        const content = document.createElement('div');
        content.style.maxWidth = '260px';
        // Estado com badge colorido
        const badge = document.createElement('span');
        badge.textContent = oc.estado || '–';
        badge.style.padding = "3px 12px";
        badge.style.borderRadius = "8px";
        badge.style.color = "#fff";
        badge.style.fontWeight = "bold";
        badge.style.marginBottom = "7px";
        badge.style.display = "inline-block";
        badge.style.background = (
            oc.estado === "Aceite" ? "#4cbe55" :
            oc.estado === "Não aceite" ? "#e74848" :
            oc.estado === "Devolvido" ? "#ffc107" : "#b9b9b9"
        );
        content.appendChild(badge);

        // Tipo
        if (oc.tipo) {
            const h3 = document.createElement('h3');
            h3.textContent = oc.tipo;
            h3.style.margin = "4px 0 6px 0";
            h3.style.fontSize = "1.12em";
            content.appendChild(h3);
        }
        // Cidade
        if (oc.cidade || oc.localidade) {
            const pCid = document.createElement('div');
            pCid.innerHTML = `<i class="fas fa-map-marker-alt" style="color:#5fa12a;margin-right:5px"></i> ${(oc.cidade || oc.localidade)}`;
            pCid.style.fontSize = "0.97em";
            content.appendChild(pCid);
        }
        // Data
        if (oc.data) {
            const pData = document.createElement('div');
            const dt = new Date(oc.data);
            pData.innerHTML = `<i class="fas fa-calendar-alt" style="color:#82b7c5;margin-right:5px"></i> ${dt.toLocaleString()}`;
            pData.style.fontSize = "0.96em";
            content.appendChild(pData);
        }
        // Descrição
        if (oc.descricao) {
            const pDesc = document.createElement('div');
            pDesc.textContent = oc.descricao;
            pDesc.style.marginTop = "7px";
            pDesc.style.fontSize = "0.97em";
            content.appendChild(pDesc);
        }
        // Foto (base64)
        if (oc.fotoBase64) {
            const img = document.createElement('img');
            img.src = oc.fotoBase64;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.marginTop = '10px';
            img.style.borderRadius = '8px';
            img.style.boxShadow = "0 2px 8px #aaa5";
            content.appendChild(img);
        }

        // Cria InfoWindow
        const infoWindow = new google.maps.InfoWindow({ content });
        marker.addListener('click', () => {
            infoWindow.open({ anchor: marker, map });
        });
    }

    // Geocodifica se não houver lat/lng
    lista.forEach(o => {
        if (o.lat && o.lng) {
            addMarker({ lat: o.lat, lng: o.lng }, o);
            return;
        }
        // Morada, localidade ou código postal
        let endereco = "";
        if (o.morada || o.localizacao) {
            const parts = [];
            parts.push(o.morada || o.localizacao);
            if (o.codigoPostal) parts.push(o.codigoPostal);
            parts.push('Portugal');
            endereco = parts.join(', ');
        } else if (o.codigoPostal) {
            endereco = `${o.codigoPostal}, Portugal`;
        } else {
            return;
        }
        geocoder.geocode({ address: endereco }, (results, status) => {
            if (status === 'OK' && results[0]) {
                addMarker(results[0].geometry.location, o);
            }
        });
    });
}

// --------- AUTOCOMPLETE DE CIDADE (FILTRO) ---------
document.addEventListener('DOMContentLoaded', function() {
    const cidadeInput = document.getElementById('filter-cidade');
    const cityListDiv = document.getElementById('city-list');

    if (!cidadeInput || !cityListDiv) return;

    let cidades = cidadesBraga.map(c => c.nome);
    let currentFocus = -1;

    cidadeInput.addEventListener('input', function() {
        const val = this.value.toLowerCase();
        cityListDiv.innerHTML = '';
        let filtered = cidades.filter(c => c.toLowerCase().includes(val));
        if (filtered.length === 0) {
            cityListDiv.style.display = 'none';
            return;
        }
        filtered.forEach(cidade => {
            let div = document.createElement('div');
            div.textContent = cidade;
            div.className = 'city-item';
            div.onclick = function() {
                cidadeInput.value = cidade;
                cityListDiv.style.display = 'none';
            };
            cityListDiv.appendChild(div);
        });
        cityListDiv.style.display = 'block';
        currentFocus = -1;
    });

    cidadeInput.addEventListener('keydown', function(e) {
        let items = cityListDiv.getElementsByClassName('city-item');
        if (!items.length) return;
        if (e.key === 'ArrowDown') {
            currentFocus++;
            addActive(items);
        } else if (e.key === 'ArrowUp') {
            currentFocus--;
            addActive(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (currentFocus > -1 && items[currentFocus]) {
                items[currentFocus].click();
            }
        }
    });

    function addActive(items) {
        if (!items) return;
        removeActive(items);
        if (currentFocus >= items.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = items.length - 1;
        items[currentFocus].classList.add('selected');
    }
    function removeActive(items) {
        for (let i = 0; i < items.length; i++) {
            items[i].classList.remove('selected');
        }
    }

    // Fecha lista se clicar fora
    document.addEventListener('click', function(e) {
        if (e.target !== cidadeInput) {
            cityListDiv.style.display = 'none';
        }
    });
});

// ----------- FILTRO (INCLUINDO CIDADE E INTERVALOS CP) ------------
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('open-filter-menu');
    const modal = document.getElementById('filter-modal');
    const close = document.getElementById('close-filter');
    const apply = document.getElementById('apply-filter');

    btn.addEventListener('click', () => {
        modal.style.display = modal.style.display === 'block' ? 'none' : 'block';
    });
    close.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Aplica filtros e atualiza o mapa
    apply.addEventListener('click', () => {
        const dataDe = document.getElementById('filter-date-from').value;
        const dataAte = document.getElementById('filter-date-to').value;
        const estado = document.getElementById('filter-estado').value;
        const cidadeSelecionada = document.getElementById('filter-cidade').value.trim();

        // Filtra as ocorrências guardadas
        let ocorrencias = window._ocorrenciasOriginais || [];
        let filtradas = ocorrencias.filter(oc => {
            let ok = true;
            // Data
            if (dataDe) ok = ok && (oc.data && (new Date(oc.data) >= new Date(dataDe)));
            if (dataAte) ok = ok && (oc.data && (new Date(oc.data) <= new Date(dataAte + "T23:59:59")));
            // Estado
            if (estado) ok = ok && ((oc.estado || '').toLowerCase() === estado.toLowerCase());
            // Cidade/código postal
            if (cidadeSelecionada) {
                const objCidade = cidadesBraga.find(c => c.nome.toLowerCase() === cidadeSelecionada.toLowerCase());
                if (objCidade && oc.codigoPostal && oc.codigoPostal.length >= 4) {
                    const cp = parseInt(oc.codigoPostal.substring(0, 4));
                    let dentro = false;
                    for (const [start, end] of objCidade.intervalos) {
                        if (cp >= start && cp <= end) {
                            dentro = true;
                            break;
                        }
                    }
                    ok = ok && dentro;
                } else {
                    ok = false;
                }
            }
            return ok;
        });
        renderMarkers(filtradas, globalMap, new google.maps.Geocoder());
        modal.style.display = 'none';
    });

    // Fecha modal se clicar fora dele
    window.addEventListener('click', function(e){
        if (modal.style.display === 'block' && !modal.contains(e.target) && e.target !== btn) {
            modal.style.display = 'none';
        }
    });
});
