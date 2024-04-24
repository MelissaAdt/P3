

document.addEventListener("DOMContentLoaded", function () {


    // Fonction pour ouvrir la modale
    const openModal1 = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute("href"));
        target.style.display = "flex";
        target.removeAttribute("aria-hidden");

    
            // Ajouter la flèche de retour uniquement si c'est la deuxième modale qui est ouverte
        if (e.target.classList.contains("ajouter_photo")) {
            const retourButton = document.createElement("button");
            retourButton.classList.add("retour-button");
            retourButton.setAttribute("aria-label", "Retour à la modale précédente");
            const retourIcon = document.createElement("i");
            retourIcon.classList.add("fa-solid", "fa-arrow-left");
            retourButton.appendChild(retourIcon);
            document.querySelector("#modal1 .modal-wrapper").prepend(retourButton);
        
        }

    // Gestionnaire d'événement pour fermer la modale en cliquant en dehors d'elle
        const modalBackground = document.querySelector('.modal');
        modalBackground.addEventListener('click', function(event) {
            if (event.target === modalBackground) {
                closeModal1(event);
            }
        });
    };

    const closeModal1 = function () {
        const target = document.getElementById("modal1"); 
        target.style.display = "none";
        target.setAttribute("aria-hidden", "true");

      
};
    

    // Gestionnaire d'événements pour le bouton "Ajouter une photo"
    const ajouterPhotoButton = document.querySelector(".ajouter_photo");
    ajouterPhotoButton.addEventListener("click", function() {
       
        originalModalContent = document.getElementById("travaux-modal1").innerHTML;

    
        const modalContent = document.getElementById("travaux-modal1");
        modalContent.innerHTML = ''; 

        

   
        const retourButton = document.createElement("button");
        retourButton.classList.add("retour-button");
        retourButton.setAttribute("aria-label", "Retour à la modale précédente");
        const retourIcon = document.createElement("i");
        retourIcon.classList.add("fa-solid", "fa-arrow-left");
        retourButton.appendChild(retourIcon);
        document.querySelector("#modal1 .modal-wrapper").prepend(retourButton)



    
    document.querySelector("#modal1 .modal-wrapper").prepend(retourButton);


       
       const modalTitle = document.querySelector('#modal1 h3');
       modalTitle.textContent = "Ajout photo"; 

       
       ajouterPhotoButton.textContent = "Valider";
       ajouterPhotoButton.classList.add('valider'); 

       
       openModal1({ target: { getAttribute: () => "#modal1" } }); 
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

        
        const modalBackground = document.querySelector('.modal');
        modalBackground.addEventListener('click', function(event) {
            if (event.target === modalBackground) {
                closeModal1(event);
            }
        });

      
        const closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.setAttribute("aria-label", "Fermer la modale");
        closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeButton.addEventListener("click", closeModal1);
        document.querySelector("#modal1 .modal-wrapper").prepend(closeButton);
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