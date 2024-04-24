

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");

    // Générer la galerie de travaux 
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


    updateGallery();


    // Création de la fonction pour les filtres 
    async function fetchCategories() {
        const response = await fetch("http://localhost:5678/api/categories");
        const categories = await response.json();

        if (!token) {
            createFilterButtons(categories);
        }
    }

    if (!token) {
        fetchCategories();
    }

    const createFilterButtons = (categories) => {
        const filtersContainer = document.querySelector(".filters");

        if (!filtersContainer) {
            console.error("Element .filters not found");
            return;
        }

        filtersContainer.innerHTML = "";



    const allButton = createButton("Tous", () => updateGallery());
    filtersContainer.appendChild(allButton);


     // Créer les boutons de filtre uniquement si l'utilisateur n'est pas connecté
        categories.forEach((category) => {
            const button = createButton(category.name, () =>
                updateGallery(category.name)
            );
            filtersContainer.appendChild(button);
        });

        allButton.click();
    };

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
        
        if (modifierParagraph) {
            modifierParagraph.remove();
        }
        if (modeEditionBanner) {
            modeEditionBanner.remove();
        }
    }
});
