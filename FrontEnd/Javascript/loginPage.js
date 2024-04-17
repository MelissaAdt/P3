const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", handleFormSubmit);

// Fonction de gestion de la soumission du formulaire
async function handleFormSubmit(e) {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Validation des champs du formulaire
    const isValid = await validateInputs();
    if (isValid) {
        // Récupération des valeurs du formulaire
        const { emailValue, passwordValue } = getFormValues();
        
        // Authentification de l'utilisateur
        const response = await authenticateUser(emailValue, passwordValue);
        
        if (response.ok) {
            // Récupération du token depuis la réponse
            const token = await response.json();
            // Stockage du token
            saveToken(token);
            // Redirection vers la page d'accueil
            redirectToIndexPage();
        } else {
            // Affichage d'une erreur si l'authentification échoue
            displayError("Erreur dans l’identifiant ou le mot de passe");
        }
    }
}

// Validation des champs du formulaire
// Affichage des erreurs
async function validateInputs() {
    // Récupération des valeurs des champs email et password
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    // Validation des valeurs des champs
    const errors = {};
    errors.email = !emailValue ? "Veuillez entrer votre e-mail" : !isValidEmail(emailValue) ? "Veuillez entrer une adresse e-mail valide" : "";
    errors.password = !passwordValue ? "Veuillez entrer votre mot de passe" : "";

    // Affichage des erreurs sous les éléments correspondants
    displayError(email, errors.email);
    displayError(password, errors.password);

    // Vérification si tous les champs sont valides
    return Object.values(errors).every(error => !error);
}


// Récupération des valeurs du formulaire
function getFormValues() {
    // Récupération des valeurs des champs email et password
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    return { emailValue, passwordValue };
}

// Affichage des erreurs
function displayError(field, message) {
    // Récupération de l'élément d'affichage des erreurs correspondant au champ
    const errorDisplay = field.nextElementSibling;
    // Affichage du message d'erreur
    errorDisplay.innerText = message;
}


// Validation de l'adresse e-mail
function isValidEmail(email) {
    // Expression régulière pour valider l'adresse e-mail
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Authentification de l'utilisateur
async function authenticateUser(email, password) {
    try {
        // Envoi de la requête d'authentification au serveur
        return await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }), // Envoi des données au format JSON
        });
    } catch (error) {
        // Affichage d'une erreur en cas d'échec de la requête
        console.error("Erreur lors de l'authentification :", error);
        throw error;
    }
}

// Stockage du token
function saveToken(token) {
    // Stockage du token dans le localStorage du navigateur
    sessionStorage.setItem("token", token);
    console.log('Token enregistré dans le localStorage:', token); // Affichage du token enregistré
}

// Redirection vers la page d'accueil
function redirectToIndexPage() {
    // Redirection vers la page d'accueil du site
    window.location.href = "/FrontEnd/index.html";
}
