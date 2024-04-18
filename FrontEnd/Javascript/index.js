

document.addEventListener("DOMContentLoaded", function() {
    const token = sessionStorage.getItem("token");

    // Fonction pour mettre à jour la galerie
    const updateGallery = async (filter = null) => {
        const response = await fetch("http://localhost:5678/api/works");
        const projets = await response.json();

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

    // Appel initial pour mettre à jour la galerie
    updateGallery();

    async function fetchCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        // Appel createFilterButtons uniquement si l'utilisateur n'est pas connecté
        if (!token) {
            createFilterButtons(categories);
        }
    }

    // Appel fetchCategories uniquement si l'utilisateur n'est pas connecté
    if (!token) {
        fetchCategories();
    }

    // Fonction pour créer les boutons de filtre
    const createFilterButtons = (categories) => {
        const filtersContainer = document.querySelector(".filters");

        if (!filtersContainer) {
            console.error("Element .filters not found");
            return;
        }

        // Supprimez les filtres existants s'il y en a
        filtersContainer.innerHTML = "";




            // Ajoutez un bouton "Tous" pour afficher tous les travaux
    const allButton = createButton("Tous", () => updateGallery());
    filtersContainer.appendChild(allButton);

        // Créez les boutons de filtre uniquement si l'utilisateur n'est pas connecté
        categories.forEach((category) => {
            const button = createButton(category.name, () =>
                updateGallery(category.name)
            );
            filtersContainer.appendChild(button);
        });


        // Affiche tous les travaux dès le chargement
        allButton.click();
    };

    // Création du bouton et appel à updateGallery
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

    // Code pour le mode édition
    const modifierParagraph = document.getElementById("modif");
    const modeEditionBanner = document.getElementById("mode_edition");

    if (token) {
         modeEditionBanner.style.display = "flex";
        const script = document.createElement("script");
        script.src = "/FrontEnd/Javascript/loggedInScript.js";
        document.head.appendChild(script);
    } else {
        // Code à exécuter si l'utilisateur n'est pas connecté
        if (modifierParagraph) {
            modifierParagraph.remove();
        }
        if (modeEditionBanner) {
            modeEditionBanner.remove();
        }
    }
});
