document.addEventListener("DOMContentLoaded", () => {
    const mensagem = localStorage.getItem("toastMessage");
  
    if (mensagem) {
      const toast = document.getElementById("toast");
      toast.textContent = mensagem;
      toast.className = "toast show";
  
      setTimeout(() => {
        toast.className = "toast";
        localStorage.removeItem("toastMessage");
      }, 2000);
    }
  });
  