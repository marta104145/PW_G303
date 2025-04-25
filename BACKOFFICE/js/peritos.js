document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("modal-perito");
  const btnAbrir = document.getElementById("abrir-modal");
  const btnFechar = document.getElementById("fechar-modal");
  const form = document.getElementById("form-perito");
  const inputImg = document.getElementById("upload-img");
  const previewImg = document.getElementById("preview-img");
  const tbody = document.getElementById("peritos-tbody");
  const contador = document.getElementById("contador-peritos");
  const pesquisaInput = document.getElementById("pesquisa-perito");
  const headers = document.querySelectorAll("thead th");

  let peritos = JSON.parse(localStorage.getItem("peritos")) || [];
  let ordemAtual = { campo: null, crescente: true };

  function renderTabela(peritosMostrados = peritos) {
    tbody.innerHTML = "";
    const mostrar = peritosMostrados.slice(0, 5);

    mostrar.forEach(p => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="perito-nome" style="cursor:pointer">
          <img src="${p.imagem}" class="perito-foto">

          <span>${p.nome}</span>
        </td>
        <td>${p.nascimento}</td>
        <td>${p.email}</td>
        <td>${p.telemovel}</td>
        <td>${p.especialidade}</td>
        <td>${p.morada}</td>
      `;
      tr.querySelector(".perito-nome").addEventListener("click", () => {
        localStorage.setItem("peritoSelecionado", JSON.stringify(p));
        window.location.href = "perfildoperito.html";
      });
      tbody.appendChild(tr);
    });

    contador.textContent = `1 - ${mostrar.length} of ${peritosMostrados.length}`;
  }

  function ordenarTabela(campo) {
    if (ordemAtual.campo === campo) {
      ordemAtual.crescente = !ordemAtual.crescente;
    } else {
      ordemAtual.campo = campo;
      ordemAtual.crescente = true;
    }

    peritos.sort((a, b) => {
      const valorA = (a[campo] || "").toString().toLowerCase();
      const valorB = (b[campo] || "").toString().toLowerCase();

      if (valorA < valorB) return ordemAtual.crescente ? -1 : 1;
      if (valorA > valorB) return ordemAtual.crescente ? 1 : -1;
      return 0;
    });

    renderTabela();
  }

  headers.forEach((header, index) => {
    header.addEventListener("click", () => {
      switch (index) {
        case 0:
          ordenarTabela("nome");
          break;
        case 1:
          ordenarTabela("nascimento");
          break;
        case 2:
          ordenarTabela("email");
          break;
        case 3:
          ordenarTabela("telemovel");
          break;
        case 4:
          ordenarTabela("especialidade");
          break;
        case 5:
          ordenarTabela("morada");
          break;
        default:
          break;
      }
    });
  });

  // Modal toggle
  btnAbrir.addEventListener("click", () => modal.style.display = "block");
  btnFechar.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target == modal) modal.style.display = "none";
  });

  // Preview da imagem
  inputImg.addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => previewImg.src = e.target.result;
      reader.readAsDataURL(file);
    }
  });

  // Submeter formulário
  form.addEventListener("submit", e => {
    e.preventDefault();

    const novo = {
      nome: form.nome.value,
      morada: form.morada.value,
      nascimento: form.nascimento.value,
      email: form.email.value,
      telemovel: form.telemovel.value,
      especialidade: form.especialidade.value,
      imagem: previewImg.src || ""
    };

    peritos.push(novo);
    localStorage.setItem("peritos", JSON.stringify(peritos));
    modal.style.display = "none";
    form.reset();
    previewImg.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    renderTabela();
  });

  // Pesquisar por nome
  pesquisaInput.addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    const filtrados = peritos.filter(p => p.nome.toLowerCase().includes(termo));
    renderTabela(filtrados);
  });

  renderTabela();
});
