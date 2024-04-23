

document.addEventListener("DOMContentLoaded", function () {
    const openModal1 = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute("href"));
        target.style.display = "flex";
        target.removeAttribute("aria-hidden");

        // Ajouter un gestionnaire d'événement pour fermer la modale en cliquant en dehors d'elle
        const modalBackground = document.querySelector('.modal');
        modalBackground.addEventListener('click', function(event) {
            if (event.target === modalBackground) {
                closeModal1(event);
            }
        });
    };

    const closeModal1 = function () {
        const target = document.getElementById("modal1"); // Cibler directement l'élément de la modale
        target.style.display = "none";
        target.setAttribute("aria-hidden", "true");
    };

    // Gestionnaire d'événements pour le bouton "Ajouter une photo"
    const ajouterPhotoButton = document.querySelector('.ajouter_photo');
    ajouterPhotoButton.addEventListener('click', function() {
        // Réinitialiser le contenu de la modale
        const modalContent = document.getElementById('travaux-modal1');
        modalContent.innerHTML = ''; // Effacer le contenu existant de la modale

    // Créer le bouton de retour
    const retourButton = document.createElement("button");
    retourButton.classList.add("retour-button");
    retourButton.setAttribute("aria-label", "Retour à la modale précédente");

    // Créer l'icône de la flèche et l'ajouter au bouton
    const retourIcon = document.createElement("i");
    retourIcon.classList.add("fa-solid", "fa-arrow-left");
    retourButton.appendChild(retourIcon);



    // Ajouter le bouton à la modale
    document.querySelector("#modal1 .modal-wrapper").prepend(retourButton);


         // Ajouter les champs "Titre" et "Catégorie"
    modalContent.innerHTML += `
    <div id="div_ajout_photo_form">
    <form id="ajoutPhotoForm">
            <label for="titre">Titre</label>
            <input type="text" id="titre" name="titre">
            <label for="categorie">Catégorie</label>
            <select id="categorie" name="categorie">
                <option value="objets">Objets</option>
                <option value="appartements">Appartements</option>
                <option value="hotels">Hôtels et restaurants</option>
            </select>
        </form>
   </div>
    `;

       // Modifier le texte de la modale
       const modalTitle = document.querySelector('#modal1 h3');
       modalTitle.textContent = "Ajout photo"; // Modifier le texte du titre de la modale

       // Modifier le texte et la classe du bouton "Ajouter une photo"
       ajouterPhotoButton.textContent = "Valider";
       ajouterPhotoButton.classList.add('valider'); // Ajouter une classe au bouton

       // Afficher la modale
       openModal1({ target: { getAttribute: () => "#modal1" } }); // Appeler la fonction openModal1 avec un objet simulé pour l'événement
   });
    

    async function modalWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const modalGallery = document.getElementById("travaux-modal1");

        works.forEach(work => {
            const article = document.createElement("article");
            article.setAttribute("data-work-id", work.id);
            const img = document.createElement("img");
            img.src = work.imageUrl;
            article.appendChild(img);

            // Créer l'icône poubelle
            const trashIcon = createTrashIcon(work.id);
            article.appendChild(trashIcon);

            modalGallery.appendChild(article);
        });

        // Créer l'élément avec l'ID "js-modal" et attacher l'événement
        const jsModal = document.createElement("a");
        jsModal.id = "js-modal";
        jsModal.href = "#modal1";
        jsModal.textContent = "modifier ";

        // Créer et ajouter l'icône FontAwesome à côté du texte "modifier"
        const icon = document.createElement("i");
        icon.classList.add("fa-regular", "fa-pen-to-square");
        jsModal.appendChild(icon);

        document.querySelector(".projets").appendChild(jsModal);
        jsModal.addEventListener("click", openModal1);

        // Attacher l'événement de clic pour fermer la modale en cliquant en dehors d'elle
        const modalBackground = document.querySelector('.modal');
        modalBackground.addEventListener('click', function(event) {
            if (event.target === modalBackground) {
                closeModal1(event);
            }
        });

        // Ajouter la croix en haut à droite de la modale et attacher l'événement pour fermer la modale
        const closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.setAttribute("aria-label", "Fermer la modale");
        closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeButton.addEventListener("click", closeModal1);
        document.querySelector("#modal1 .modal-wrapper").prepend(closeButton);
    }

    // Appeler la fonction pour charger les projets de l'API
    modalWorks();

    function createTrashIcon(workId) {
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fa-solid", "fa-trash-can");
        trashIcon.addEventListener("click", async (e) => {
            e.preventDefault();
            if (confirm("Voulez-vous vraiment supprimer ce projet ?\nCette action est irréversible.")) {
                try {
                    await deleteElement(workId);
                    const articleToRemove = trashIcon.parentElement;
                    articleToRemove.remove();
                } catch (error) {
                    console.error("Erreur lors de la suppression du projet :", error);
                }
            }
        });
        return trashIcon;
    }

    async function deleteElement(workId) {
        try {
            const response = await fetch("http://localhost:5678/api/works/" + workId, {
                method: "DELETE"
            });
            if (!response.ok) {
                throw new Error("La suppression du projet a échoué");
            } else {
                // Supprimer l'élément correspondant de la modale
                const articleToRemove = document.querySelector('#travaux-modal1 article[data-work-id="' + workId + '"]');
                if (articleToRemove) {
                    articleToRemove.remove();
                }
            }
        } catch (error) {
            throw new Error("Erreur lors de la suppression du projet");
        }
    }
});
