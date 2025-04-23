document.addEventListener("DOMContentLoaded", () => {
    fetch("dados/ocorrencias.json")
      .then(res => res.json())
      .then(data => {
        const ulOcorrencias = document.querySelector(".bloco:nth-child(1) ul");
        const ulAuditorias = document.querySelector(".bloco:nth-child(2) ul");
        const pOcorrencias = document.querySelector(".bloco:nth-child(1) p");
        const pAuditorias = document.querySelector(".bloco:nth-child(2) p");

        // OCORRÊNCIAS
        data.ocorrencias.forEach(oc => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${oc.tipo}</strong> <span>${oc.local}</span><br><span>${oc.status}</span>`;
          ulOcorrencias.appendChild(li);
        });
  
        // AUDITORIAS
        data.auditorias.forEach(aud => {
          const li = document.createElement("li");
          li.innerHTML = `<strong>${aud.id}</strong> <span>${aud.utilizador}</span><br><span>${aud.titulo}</span>`;
          ulAuditorias.appendChild(li);
        });
  
        // Atualizar contadores
        pOcorrencias.innerHTML = `1 - ${data.ocorrencias.length} de ${data.ocorrencias.length} <a href="#">Carregar mais</a>`;
        pAuditorias.innerHTML = `1 - ${data.auditorias.length} de ${data.auditorias.length} <a href="#">Carregar mais</a>`;
      })
      .catch(err => console.error("Erro ao carregar JSON:", err));
  });
  