

const elementToDelete = document.getElementById("elementToDelete");
if (elementToDelete) {
    elementToDelete.remove();
}

// Vérifier si l'utilisateur est connecté (par exemple, en vérifiant l'existence du token)
const tokenPresent = sessionStorage.getItem("token");
const loginButton = document.getElementById("loginLink");
const logoutButton = document.querySelector(".logout_hidden");

// Modifier l'affichage du paragraphe "modifier" en fonction de la présence du token
const afficherModif = document.getElementById("modif");
if (tokenPresent) {
    afficherModif.textContent = "modifier";
} else {
    afficherModif.style.display = "none";
}

// Si un token est présent, affiche le bouton "logout" et cache le bouton "login", sinon fait l'inverse
if (tokenPresent) {
    loginButton.classList.add("logout_hidden");
    logoutButton.classList.remove("logout_hidden");
} else {
    loginButton.classList.remove("logout_hidden");
    logoutButton.classList.add("logout_hidden");
}

// Ajoute un gestionnaire d'événements au clic sur le bouton "logout"
logoutButton.addEventListener("click", () => {
    sessionStorage.removeItem("token");
    window.location.href = "/FrontEnd/index.html";
});




