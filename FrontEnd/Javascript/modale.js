
document.addEventListener("DOMContentLoaded", function () {


    let selectedFile = null;

    const token = localStorage.getItem("token");


    /**
     * Fonction pour vérifier si l'utilisateur est connecté
     * @returns 
     */
    function isUserLoggedIn() {
        const token = localStorage.getItem("token");
        return token !== null && token !== undefined;
    }


    // Fonctions pour ouvrir et fermer les modales

    const openModal1 = function () {
    const modal1 = document.getElementById("modal1");
    modal1.style.display = "flex";
    modal1.removeAttribute("aria-hidden");
    addWorkForm.reset();
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

    const closeModal2 = function () {
        const target = document.getElementById("modal2");
        if ('selectedFile' in window) {
            delete window.selectedFile;
        }
        console.log('selectedFile après suppression de la référence window :', selectedFile);
        resetModalInputs();
        target.style.display = "none";
        target.setAttribute("aria-hidden", "true");
        addWorkForm.reset();
    };

 

        // Fonction pour créer l'élément de lien modal "modifier" et l'attacher à la page
        function createModalLink() {
        const loggedIn = isUserLoggedIn();

        if (loggedIn) {
            const jsModal = document.createElement("a");
            jsModal.id = "js-modal";
            jsModal.href = "#modal1";
            jsModal.textContent = "modifier ";

            const icon = document.createElement("i");
            icon.classList.add("fa-regular", "fa-pen-to-square");
            jsModal.appendChild(icon);

            document.querySelector(".projets").appendChild(jsModal);
            jsModal.addEventListener("click", openModal1);
        }
    }

        createModalLink();
   

        function resetSelectedFile() {
            selectedFile = null;
        }


        function resetModalInputs() {
   
        const photoInput = document.getElementById("inpFile");
        const formPhotoDiv = document.getElementById('formPhoto');
        const photoPreview = document.querySelector('#formPhoto img');
        const photoParagraph = document.querySelector(".p-photo");

        resetSelectedFile(); 
        console.log('Contenu de selectedFile après la réinitialisation :', selectedFile);
      
        if (photoPreview) {
            photoPreview.remove();
        }

        if (photoInput) {
            photoInput.value = null;
        }

       
        if (photoParagraph) {
            photoParagraph.textContent = "jpg, png : 4mo max";
        }

        
        if (formPhotoDiv) {
            formPhotoDiv.innerHTML = `
                <i class="fa-regular fa-image"></i>
                <label class="buttonAddPhoto">
                    + Ajouter photo    
                    <input type="file" class="js-photo" id="inpFile" accept="image/jpeg, image/png" size="4194304">
                </label>
                <p class="p-photo">jpg, png : 4mo max</p>
            `;
        }

        // Réinitialiser les champs titre et catégorie
        const titleInput = document.getElementById("inputTitle");
        const selectCategories = document.getElementById("categories");

        if (titleInput) {
            titleInput.value = "";
        }

        if (selectCategories) {
            selectCategories.selectedIndex = 0; 
        } 

        // Réinitialiser l'apparence du bouton de validation
        const submitButton = document.getElementById('submitButton');
        submitButton.style.backgroundColor = '';
        submitButton.setAttribute('disabled', true); 
    }
    


        function updateButtonState() {
        const titleInput = document.getElementById("inputTitle");
 
        if (!titleInput) {
            console.error("L'élément avec l'ID 'inputTitle' n'a pas été trouvé dans le document.");
            return;
        }

        const selectCategories = document.getElementById("categories");
        const submitButton = document.getElementById('submitButton');

        // Vérifier si un titre a été saisi et si une catégorie a été sélectionnée
        if (titleInput.value && selectCategories.value) {
            submitButton.style.backgroundColor = '#1D6154';
            submitButton.removeAttribute('disabled'); 
        } else {
            submitButton.style.backgroundColor = '';
            submitButton.setAttribute('disabled', true); 
        }
    }



/**
 * Fonction pour afficher l'image selectionée 
 * @param {*} file 
 */
    function displayImagePreview(file) {
    const imageUrl = URL.createObjectURL(file);
    const photoPreview = document.createElement('img');
    photoPreview.src = imageUrl;
    photoPreview.style.maxWidth = '40%';
    photoPreview.style.maxHeight = '100%';
    const formPhotoDiv = document.getElementById('formPhoto');

    // Vérifier s'il y a déjà une prévisualisation d'image à remplacer
    const existingPreview = formPhotoDiv.querySelector('img');
    if (existingPreview) {
        formPhotoDiv.replaceChild(photoPreview, existingPreview);
    } else {
        formPhotoDiv.appendChild(photoPreview);
    }
}

    // Chargement des catégories depuis l'API
    async function fetchCategories() {
        try {
            const response = await fetch('http://localhost:5678/api/categories');
            if (!response.ok) {
                throw new Error('Impossible de charger les catégories');
            }
            const categories = await response.json();
            const selectElement = document.getElementById('categories');
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                selectElement.appendChild(option);
            });
        } catch (error) {
            console.error('Erreur lors du chargement des catégories :', error.message);
        }
    }

    fetchCategories();

    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            closeModal1();
            closeModal2();
        }
    });

  
    // Fonction pour charger les projets de l'API dans la modale
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


    // Gestionnaire d'événement pour ouvrir la modale 2 lorsque le bouton "Ajouter une photo" est cliqué
        const ajouterPhotoButton = document.getElementById("button_ajouter_photo");
        ajouterPhotoButton.addEventListener("click", function () {
            closeModal1();
            openModal2();
        });

    // Boutons croix pour fermer les modales 
        const closeButton = document.createElement("button");
        closeButton.classList.add("close-button");
        closeButton.setAttribute("aria-label", "Fermer la modale");
        closeButton.innerHTML = '<i class="fa-solid fa-times"></i>';
        closeButton.addEventListener("click", closeModal1);
        document.querySelector("#modal1 .modal-wrapper").prepend(closeButton);

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


    // Gestionnaire d'événement pour le bouton de retour à la modale 1
        backButtonModal2.addEventListener("click", function() {
        closeModal2(); 
        openModal1({ preventDefault: () => {} }); 
    });

    }

 
    modalWorks();

    // Fonction pour mettre à jour la gallerie une fois un projet ajouté ou supprimé
    async function updateGallery() {
        try {
            const response = await fetch("http://localhost:5678/api/works");
            const works = await response.json();
            const gallery = document.querySelector('.gallery');
            const modal1Gallery = document.getElementById('travaux-modal1');
    
        
            gallery.innerHTML = '';
            modal1Gallery.innerHTML = '';
    
            
            works.forEach(work => {
                
                const galleryArticle = document.createElement("article");
                galleryArticle.setAttribute("data-work-id", work.id);
                const galleryImg = document.createElement("img");
                galleryImg.src = work.imageUrl;
                galleryArticle.appendChild(galleryImg);
                gallery.appendChild(galleryArticle);

             
                const galleryFigcaption = document.createElement("figcaption");
                galleryFigcaption.textContent = work.title;
                galleryArticle.appendChild(galleryFigcaption);

                gallery.appendChild(galleryArticle);
    
               
                const modalArticle = document.createElement("article");
                modalArticle.setAttribute("data-work-id", work.id);
                const modalImg = document.createElement("img");
                modalImg.src = work.imageUrl;
                modalArticle.appendChild(modalImg);
    
                
                const trashIcon = createTrashIcon(work.id);
                modalArticle.appendChild(trashIcon);
    
                modal1Gallery.appendChild(modalArticle);
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour de la galerie :', error);
        }
    }

    // Écouteurs d'événements pour les champs du formulaire
        const photoInput = document.getElementById("inpFile");
        const titleInput = document.getElementById("inputTitle");
        const selectCategories = document.getElementById("categories");

    photoInput.addEventListener('input', () => {
        updateButtonState();
    });

    titleInput.addEventListener('input', () => {
        updateButtonState();
    });

    selectCategories.addEventListener('change', () => {
        updateButtonState();
    });

    


    // Réinitialiser le formulaire d'ajout de projets 
        const addWorkForm = document.getElementById('addWorkForm');
    
        addWorkForm.addEventListener('submit', function(event) {
       
        event.preventDefault();
        
        addWorkForm.reset();
    console.log("Formulaire réinitialisé :", addWorkForm);
    });



    // Fonction pour la selection d'un fichier dans l'input 
        document.getElementById("inpFile").addEventListener("change", function () {
        
        selectedFile = this.files[0];
            
            if ((selectedFile.type === "image/jpeg" ||selectedFile.type === "image/png") && photoInput.size <= 4194304) {
                displayImagePreview(selectedFile);
                console.log("Contenu de selectedFile :", selectedFile); 
                
            } else {
                
                window.alert("Le fichier doit être au format JPEG ou PNG et ne doit pas dépasser 4 Mo.");
                
                this.value = "";
            }
        
    });

        

    
   // Écouteur d'événement pour le formulaire
        document.getElementById("submitButton").addEventListener("click", function () {

        if (selectedFile) {

        const endPoint = "http://localhost:5678/api/works";
        const formData = new FormData();

        formData.append("image", selectedFile); 
        formData.append("title", titleInput.value);
        formData.append("category", selectCategories.value);


        fetch(endPoint, {
            method: "POST",
            body: formData,
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
        .then((response) => {
            if (response.ok) {
                console.log('Photo envoyée avec succès');

                updateGallery();
                resetModalInputs();
                addWorkForm.reset(); 
                console.log("Formulaire réinitialisé :", addWorkForm);

                window.alert("Photo ajoutée à la galerie !");

                
                

            } else {
                console.error('Échec de l\'envoi de la photo');

                window.alert("Veuillez renseigner tous les champs.")

            }

        }).catch((error) => {
            console.error('Erreur lors de la requête:', error);
        });

    }
});

    /**
     * Fonction pour créer une îcone qui sert à supprimer un projet depuis la modale 1
     * @param {*} workId 
     * @returns 
     */
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

    /**
     * Fonction pour supprimer un projet de l'API
     * @param {*} workId 
     * @returns 
     */
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
                updateGallery();
                addWorkForm.reset();
                console.log("Formulaire réinitialisé :", addWorkForm);
               
            }
        } catch (error) {
            console.error("Erreur lors de la suppression du projet :", error.message);
        }
    }

});
