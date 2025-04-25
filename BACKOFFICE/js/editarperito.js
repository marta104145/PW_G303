document.addEventListener("DOMContentLoaded", () => {
    const perito = JSON.parse(localStorage.getItem("peritoSelecionado"));

    if (!perito) {
        alert("Nenhum perito selecionado.");
        window.location.href = "peritos.html";
        return;
    }

    document.getElementById("foto-perito").src = perito.imagem || "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    document.getElementById("nome").value = perito.nome;
    document.getElementById("morada").value = perito.morada;
    document.getElementById("nascimento").value = perito.nascimento;
    document.getElementById("email").value = perito.email;
    document.getElementById("telemovel").value = perito.telemovel;
    document.getElementById("especialidade").value = perito.especialidade;

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
                imagem: perito.imagem
            };

            localStorage.setItem("peritos", JSON.stringify(peritos));
            localStorage.setItem("toastMessage", "Alterações guardadas com sucesso!");
            window.location.href = "peritos.html";

        } else {
            alert("Erro ao guardar. Perito não encontrado.");
        }
    });
});
