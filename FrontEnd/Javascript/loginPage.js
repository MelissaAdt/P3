const form = document.getElementById("form");
const email = document.getElementById("email");
const password = document.getElementById("password");

form.addEventListener("submit", handleFormSubmit);


// Fonction pour gérer la soumission du formulaire
async function handleFormSubmit(e) {
    e.preventDefault(); 

    const isValid = await validateInputs();
    if (isValid) {
        const { emailValue, passwordValue } = getFormValues();

        try {
            const response = await authenticateUser(emailValue, passwordValue);

            if (response.ok) {
                const tokenData = await response.json();
                const token = tokenData.token;

                if (token) {
                    saveToken(token); 
                    redirectToIndexPage();
                } else {
                    console.error('Le token récupéré est invalide.');
                }
            } else {
                displayError("Erreur dans l’identifiant ou le mot de passe");
            }
        } catch (error) {
            console.error("Erreur lors de l'authentification :", error);
        }
    }
}

// Fonction pour valider les champs du formulaire
async function validateInputs() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    const errors = {};
    errors.email = !emailValue ? "Veuillez entrer votre e-mail" : !isValidEmail(emailValue) ? "Veuillez entrer une adresse e-mail valide" : "";
    errors.password = !passwordValue ? "Veuillez entrer votre mot de passe" : "";

    displayError(email, errors.email);
    displayError(password, errors.password);

    return Object.values(errors).every(error => !error);
}


function getFormValues() {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    return { emailValue, passwordValue };
}

function displayError(field, message) {
    const errorDisplay = field.nextElementSibling;
    errorDisplay.innerText = message;
}

function isValidEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
}

// Fonction pour authentifier l'utilisateur en envoyant une requête au serveur
async function authenticateUser(email, password) {
    try {
        return await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    } catch (error) {
        console.error("Erreur lors de l'authentification :", error);
        throw error;
    }
}


function saveToken(token) {
    if (token) {
        const tokenString = typeof token === 'object' ? JSON.stringify(token) : token;
        localStorage.setItem("token", tokenString); 
        console.log('Token enregistré dans le localStorage:', tokenString);
    } else {
        console.error('Le token est vide ou invalide.');
    }
}

function redirectToIndexPage() {
    window.location.href = "/FrontEnd/index.html";
}