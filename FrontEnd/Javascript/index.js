

document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");

    
    /**
     * Générer les travaux depuis l'API
     * @param {*} filter 
     */
        window.updateGallery = async (filter = null) => {
        const response = await fetch("http://localhost:5678/api/works");
        const projets = await response.json();

        const galleryContainer = document.querySelector(".gallery");
        const modal1Gallery = document.getElementById('travaux-modal1');
        galleryContainer.innerHTML = "";
        modal1Gallery.innerHTML ="";


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

            // Ajout des éléments à la galerie dans #travaux-modal1
            const modalArticle = document.createElement("article");
            modalArticle.setAttribute("data-work-id", projet.id);
            const modalImg = document.createElement("img");
            modalImg.src = projet.imageUrl;
            modalArticle.appendChild(modalImg);

            const trashIcon = window.createTrashIcon(projet.id);
            modalArticle.appendChild(trashIcon);

            modal1Gallery.appendChild(modalArticle);
        });
    };


    window.updateGallery();


    // Fonction pour générer les catégorie et filtrer les travaux
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



    const allButton = createButton("Tous", () => window.updateGallery());
    filtersContainer.appendChild(allButton);


     // Créer les boutons de filtre 
        categories.forEach((category) => {
            const button = createButton(category.name, () =>
                window.updateGallery(category.name)
            );
            filtersContainer.appendChild(button);
        });

        allButton.click();
    };

    /**
     * Créer un bouton en générant le nom des catégories et les filtrent au clic
     * @param {*} text 
     * @param {*} clickHandler 
     * @returns 
     */
    const createButton = (text, clickHandler) => {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", clickHandler);
        return button;
    };

    // Redirection vers la page login.html 
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
