const updateGallery = async (filter = null) => {
    const reponse = await fetch("http://localhost:5678/api/works");
    const projets = await reponse.json();

    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = "";

    const filteredWorks = filter
        ? projets.filter((projet) => projet.category.name === filter)
        : projets;

    filteredWorks.forEach((projet) => {
        const elementTravail = document.createElement("div");
        elementTravail.classList.add("travail");

        elementTravail.innerHTML =
        '<figcaption>' + projet.title + '</figcaption>' +
        '<img src="' + projet.imageUrl + '" alt="' + projet.title + '">';

        galleryContainer.appendChild(elementTravail);
    });
};

updateGallery();

async function fetchCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories");
    const categories = await reponse.json();

    console.log(categories)

    createFilterButtons(categories);
};

fetchCategories()

// Fonctions pour mettre à jour le DOM
const createFilterButtons = (categories) => {
    const filtersContainer = document.querySelector(".filters");
    filtersContainer.innerHTML = "";

    const allButton = createButton("Tous", () => updateGallery());
    filtersContainer.appendChild(allButton);

    categories.forEach((category) => {
        const button = createButton(category.name, () =>
        updateGallery(category.name)
        );
        filtersContainer.appendChild(button);
    });
    // Affiche tous les travaux dès le chargement
    allButton.click();
};

// Création Bouton et appel gallery//////
const createButton = (text, clickHandler) => {
    const button = document.createElement("button");
    button.textContent = text;
    button.addEventListener("click", clickHandler);
    return button;
};

// Redirection vers la page login.html lorsque l'utilisateur clique sur le lien "login"
const loggedLink = document.getElementById('loginLink');
loggedLink.addEventListener('click', function() {
    window.location.href = "/FrontEnd/login.html";
});



/// Code pour le mode édition

// Vérification si le token est enregistré dans le session Storage
const token = sessionStorage.getItem("token");
const modifierParagraph = document.getElementById("modif");
const modeEditionBanner = document.getElementById("mode_edition");

// Si un token est présent, l'utilisateur est connecté, exécutez le script loggedInScript.js
if (token) {
    const script = document.createElement("script");
    script.src = "/FrontEnd/Javascript/loggedInScript.js";
    document.head.appendChild(script);
}


if (token) {
  modifierParagraph.textContent = "modifier";
} else {
  // Supprimer le paragraphe "modifier" s'il existe
  if (modifierParagraph) {
      modifierParagraph.remove();
  }
}

// Si un token est présent, afficher la bannière "mode édition", sinon la supprimer
if (token) {
    // Afficher la bannière "mode édition"
    modeEditionBanner.style.display = "flex";
} else {
    // Supprimer la bannière "mode édition"
    if (modeEditionBanner) {
        modeEditionBanner.remove();
    }
}
