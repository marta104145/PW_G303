document.addEventListener("DOMContentLoaded", () => {
    const perito = JSON.parse(localStorage.getItem("peritoSelecionado"));

    if (!perito) {
        alert("Nenhum perito selecionado.");
        window.location.href = "peritos.html";
        return;
    }

    const fotoPerito = document.getElementById("foto-perito");
    const uploadImg = document.getElementById("upload-img");

    fotoPerito.src = perito.imagem || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    document.getElementById("nome").value = perito.nome;
    document.getElementById("morada").value = perito.morada;
    document.getElementById("nascimento").value = perito.nascimento;
    document.getElementById("email").value = perito.email;
    document.getElementById("telemovel").value = perito.telemovel;
    document.getElementById("especialidade").value = perito.especialidade;

    let novaImagem = null;

    uploadImg.addEventListener("change", e => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                novaImagem = e.target.result;
                fotoPerito.src = novaImagem;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById("guardar-alteracoes").addEventListener("click", () => {
        const peritos = JSON.parse(localStorage.getItem("peritos")) || [];
        const index = peritos.findIndex(p => p.email === perito.email);

        if (index !== -1) {
            peritos[index] = {
                ...peritos[index],
                nome: document.getElementById("nome").value,
                morada: document.getElementById("morada").value,
                nascimento: document.getElementById("nascimento").value,
                email: document.getElementById("email").value,
                telemovel: document.getElementById("telemovel").value,
                especialidade: document.getElementById("especialidade").value,
                imagem: novaImagem || perito.imagem
            };

            localStorage.setItem("peritos", JSON.stringify(peritos));
            alert("Alterações guardadas com sucesso!");
            window.location.href = "peritos.html";
        } else {
            alert("Erro ao guardar. Perito não encontrado.");
        }
    });
});
