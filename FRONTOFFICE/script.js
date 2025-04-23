
document.addEventListener("DOMContentLoaded", () => {
  // Lista de auditorias
  const auditorias = [
    "Auditoria 1 - Avaliação do parque de São Mamede",
    "Auditoria 2 - Manutenção do Parque da Cidade",
    "Auditoria 3 - Verificação da erosão do solo",
    "Auditoria 4 - Árvores em Risco de Queda",
    "Auditoria 5 - Monitorização do solo"
  ];

  const auditoriasList = document.getElementById("auditorias-list");
  auditorias.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    auditoriasList.appendChild(li);
  });

  // Feedbacks
  const feedbacks = [
    "A plataforma facilitou o processo de denúncia de espaços verdes abandonados. Agora, a nossa praça está revitalizada e bem cuidada! – Ana F.",
    "Fiquei impressionado com a eficiência da plataforma. Reportei um jardim sem iluminação e, pouco tempo depois, já havia uma auditoria em andamento! – Luís C.",
    "Graças à EyesEverywhere, conseguimos identificar árvores em risco de queda no nosso parque local. A rápida resposta evitou acidentes! – Sofia R."
  ];

  const feedbackList = document.getElementById("feedback-list");
  feedbacks.forEach(msg => {
    const div = document.createElement("div");
    div.className = "box";
    div.textContent = msg;
    feedbackList.appendChild(div);
  });
});

// Botão da hero section
function scrollToSobre() {
  const sobre = document.getElementById("sobre");
  sobre.scrollIntoView({ behavior: "smooth" });
}

// Ocorrências
function filtrarOcorrencias(tipo) {
  alert("A filtrar ocorrências: " + tipo);
}
