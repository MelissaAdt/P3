

document.addEventListener("DOMContentLoaded", function () {
    
    const openModal1 = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute("href"));
        target.style.display = "flex";
        target.removeAttribute("aria-hidden");
    };

    
    const openModal2 = function () {
     
        closeModal1();
       
        const modal2 = document.getElementById("modal2");
        modal2.style.display = "flex";
        modal2.removeAttribute("aria-hidden");
    };

   
    const closeModal1 = function () {
        const target = document.getElementById("modal1");
        target.style.display = "none";
        target.setAttribute("aria-hidden", "true");
    };

    // Fonction pour fermer la modale 2
    const closeModal2 = function () {
        const target = document.getElementById("modal2");
        target.style.display = "none";
        target.setAttribute("aria-hidden", "true");
     };

        document.addEventListener('click', function (event) {
            if (event.target.classList.contains('modal')) {
                closeModal1();
                closeModal2();
            }
        });

    
   // Fonction asynchrone pour charger les projets de l'API dans la modale
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

           
            const trashIcon = createTrashIcon(work.id);
            article.appendChild(trashIcon);

            modalGallery.appendChild(article);
        });

        // Créer l'élément de lien modal et attacher l'événement pour ouvrir la modale
        const jsModal = document.createElement("a");
        jsModal.id = "js-modal";
        jsModal.href = "#modal1";
        jsModal.textContent = "modifier ";

        
        const icon = document.createElement("i");
        icon.classList.add("fa-regular", "fa-pen-to-square");
        jsModal.appendChild(icon);

        document.querySelector(".projets").appendChild(jsModal);
        jsModal.addEventListener("click", openModal1);

        // Gestionnaire d'événement pour ouvrir la modale 2 lorsque le bouton "Ajouter une photo" est cliqué
        const ajouterPhotoButton = document.getElementById("button_ajouter_photo");
        ajouterPhotoButton.addEventListener("click", function () {
    
        closeModal1();
        openModal2();
    });



        const closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.setAttribute("aria-label", "Fermer la modale");
        closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeButton.addEventListener("click", closeModal1);
        document.querySelector("#modal1 .modal-wrapper").prepend(closeButton);

        // Créer la croix de fermeture pour la modale 2
        const closeButtonModal2 = document.createElement("button");
        closeButtonModal2.classList.add("close-button");
        closeButtonModal2.setAttribute("aria-label", "Fermer la modale");
        closeButtonModal2.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeButtonModal2.addEventListener('click', closeModal2);
        document.querySelector("#modal2 .modal-wrapper").prepend(closeButtonModal2);
            
        // Créer la flèche de retour pour la modale 2
        const backButtonModal2 = document.createElement("button");
        backButtonModal2.classList.add("back-button");
        backButtonModal2.setAttribute("aria-label", "Retour à la modale 1");
        backButtonModal2.innerHTML = '<i class="fa-solid fa-arrow-left"></i>';
        document.querySelector("#modal2 .modal-wrapper").prepend(backButtonModal2);

        
            
        }

   
        
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
    
    // Fonction asynchrone pour supprimer un projet de l'API
    async function deleteElement(workId) {
        try {
           
            const token = localStorage.getItem("token");
            console.log("Token récupéré du localStorage:", token); 
    
            if (!token) {
                console.error("Le token d'authentification est manquant.");
                return;
            }
    
            
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
    
           
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Accès non autorisé : le token n'a pas les permissions nécessaires.");
                } else {
                    console.error("Erreur lors de la suppression du projet :", response.statusText);
                }
            } else {
                console.log("Projet supprimé avec succès.");
                
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du projet :", error.message);
        }

    }});