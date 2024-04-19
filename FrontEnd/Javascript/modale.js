

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
    

    async function modalWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        const works = await response.json();
        const modalGallery = document.getElementById("travaux-modal1");

        works.forEach(work => {
            const article = document.createElement("article");
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
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: "DELETE"
        });
        if (!response.ok) {
            throw new Error("La suppression du projet a échoué");
        }
    } catch (error) {
        throw new Error("Erreur lors de la suppression du projet");
    }
}
});
