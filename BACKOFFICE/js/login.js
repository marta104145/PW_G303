function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  console.log("LOGIN COM GOOGLE:", data);

  // Guarda no localStorage apenas os dados que interessam
  const user = {
    name: data.name,
    givenName: data.given_name,
    familyName: data.family_name,
    email: data.email,
    picture: data.picture,
    token: response.credential
  };
  

  localStorage.setItem("user_google", JSON.stringify(user));

  // Mostra popup
  const popup = document.getElementById("popup-success");
  if (popup) {
    popup.classList.remove("hidden");
  }

  // Redireciona após 2 segundos
  setTimeout(() => {
    window.location.href = "home.html";
  }, 2000);
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "489122318578-mh2cd8k3s2quna67qfqn47a25dg33kdf.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
};
