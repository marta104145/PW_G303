// js/mapa.js

function initMap() {
  // 1) Centro inicial em Guimarães
  const centro = { lat: 41.450491, lng: -8.294101 };
  const map = new google.maps.Map(document.getElementById("map"), {
    center: centro,
    zoom: 12,
  });

  // 2) Geocoder para códigos postais e endereços
  const geocoder = new google.maps.Geocoder();

  // 3) Lê todas as ocorrências do localStorage (key: 'ocorrencias')
  const ocorrencias = JSON.parse(
    localStorage.getItem('ocorrencias') || '[]'
  );

  // 4) Ícones por estado
  const iconBase = "https://maps.google.com/mapfiles/ms/icons/";
  const icons = {
    'Aceite':     iconBase + 'green-dot.png',   // verde
    'Não aceite': iconBase + 'red-dot.png',     // vermelho
    '':           iconBase + 'yellow-dot.png'   // vazio = amarelo
  };

  // 5) Função para adicionar marker + InfoWindow
  function addMarker(position, oc) {
    const iconUrl = icons[oc.estado || ''] || icons[''];
    const marker = new google.maps.Marker({
      map,
      position,
      icon: iconUrl,
      title: oc.tipo || 'Ocorrência'
    });

    // Conteúdo do InfoWindow: tipo, data, descrição, foto
    const content = document.createElement('div');
    content.style.maxWidth = '250px';
    // Título
    const h3 = document.createElement('h3');
    h3.textContent = oc.tipo || 'Ocorrência';
    content.appendChild(h3);
    // Data
    if (oc.data) {
      const pData = document.createElement('p');
      const dt = new Date(oc.data);
      pData.textContent = dt.toLocaleString();
      content.appendChild(pData);
    }
    // Descrição
    if (oc.descricao) {
      const pDesc = document.createElement('p');
      pDesc.textContent = oc.descricao;
      content.appendChild(pDesc);
    }
    // Foto (base64)
    if (oc.fotoBase64) {
      const img = document.createElement('img');
      img.src = oc.fotoBase64;
      img.style.width = '100%';
      img.style.height = 'auto';
      img.style.marginTop = '8px';
      content.appendChild(img);
    }

    // Cria InfoWindow e associa ao marker
    const infoWindow = new google.maps.InfoWindow({ content });
    marker.addListener('click', () => {
      infoWindow.open({ anchor: marker, map });
    });
  }

  // 6) Geocodifica e cria todos os markers
  ocorrencias.forEach(o => {
    // Se já tens lat/lng, usa diretamente
    if (o.lat && o.lng) {
      addMarker({ lat: o.lat, lng: o.lng }, o);
      return;
    }

    // Se tens morada ou localizacao, usa para geocode mais preciso
    if (o.morada || o.localizacao) {
      const parts = [];
      parts.push(o.morada || o.localizacao);
      if (o.codigoPostal) parts.push(o.codigoPostal);
      parts.push('Portugal');
      const endereco = parts.join(', ');

      geocoder.geocode({ address: endereco }, (results, status) => {
        if (status === 'OK' && results[0]) {
          addMarker(results[0].geometry.location, o);
        } else {
          console.warn('Geocode falhou para:', endereco, status);
        }
      });
      return;
    }

    // Fallback: apenas código postal
    if (o.codigoPostal) {
      const endereco = `${o.codigoPostal}, Portugal`;
      geocoder.geocode({ address: endereco }, (results, status) => {
        if (status === 'OK' && results[0]) {
          addMarker(results[0].geometry.location, o);
        } else {
          console.warn('Geocode falhou para o postal:', o.codigoPostal, status);
        }
      });
      return;
    }

    console.warn('Ocorrência sem dados de localização:', o);
  });
}

// Export initMap se usares módulos
// export { initMap };
