const submit = document.querySelector("input[type=submit]");
const log = document.querySelector(".login");
//création d'un ecouteur d'evenement sur le bouton Submit
submit.addEventListener("click", function (e) {
  e.preventDefault();
  identification();
});
//création d'une fonction asynchrone qui va se declencher au click du bouton submit
async function identification() {
  //récuperation des valeurs des champs d'entrée qui seront stockées dans les constantes
  const mail = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    //envoie de la requete POST à l'api avec la methode fetch
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email: mail,
        password: password,
      }),
    });
    //Si l'indentification est réussie on renvoie à la page index
    if (response.ok) {
      window.location.href = "./index.html";
      //Création du token d'identification//
      const userData = await response.json();
      //Enregistrement du token dans le local storage//
      localStorage.setItem("token", userData.token);
      localStorage.setItem("login", true);
    }
    //Si l'identification échoue une alerte est affichée pour le signaler a l'utilisateur//
    else {
      localStorage.setItem("token", undefined);
      localStorage.setItem("login", undefined);
      alert(
        "Erreur d'identification, verifiez votre identifiant ou mot de passe."
      );
    }
  } catch (e) {
    //Si une erreur se produit elle est affichée dans la console
    console.error("An error occurred", e);
    console.error("Error message", e.message);
  }
}
