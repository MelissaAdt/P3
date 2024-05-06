

// Supprimer les filtres
const elementToDelete = document.getElementById("elementToDelete");
if (elementToDelete) {
    elementToDelete.remove();
}

// Vérifier si l'utilisateur est connecté 
const tokenPresent = localStorage.getItem("token");
console.log(tokenPresent)
const loginButton = document.getElementById("loginLink");
const logoutButton = document.querySelector(".logout_hidden");



// Si un token est présent, affiche le bouton "logout" et cache le bouton "login", sinon fait l'inverse
if (tokenPresent) {
    loginButton.classList.add("logout_hidden");
    logoutButton.classList.remove("logout_hidden");
} else {
    loginButton.classList.remove("logout_hidden");
    logoutButton.classList.add("logout_hidden");
}


logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "/FrontEnd/index.html";
});

