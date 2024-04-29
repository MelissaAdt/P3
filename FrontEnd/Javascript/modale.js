
document.addEventListener("DOMContentLoaded", function () {


    // Fonctions pour ouvrir et fermer les modales

   const openModal1 = function () {
    const modal1 = document.getElementById("modal1");
    modal1.style.display = "flex";
    modal1.removeAttribute("aria-hidden");
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
        resetModalInputs();
        target.style.display = "none";
        target.setAttribute("aria-hidden", "true");
    };

        // Fonction pour vérifier si l'utilisateur est connecté
        function isUserLoggedIn() {
            const token = localStorage.getItem("token");
            return token !== null && token !== undefined;
        }


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

    function resetModalInputs() {
   
        const photoInput = document.getElementById("inpFile");
        const formPhotoDiv = document.getElementById('formPhoto');
        const photoPreview = document.querySelector('#formPhoto img');
        const photoParagraph = document.querySelector(".p-photo");

       
        if (photoPreview) {
            photoPreview.remove();
        }

        if (photoInput) {
            photoInput.value = "";
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

    function displayImagePreview(file) {
        
        const imageUrl = URL.createObjectURL(file);
        const photoPreview = document.createElement('img');
        photoPreview.src = imageUrl;
        photoPreview.style.maxWidth = '40%';
        photoPreview.style.maxHeight = '100%';
        const formPhotoDiv = document.getElementById('formPhoto');

        
        while (formPhotoDiv.firstChild && formPhotoDiv.firstChild.tagName !== 'INPUT') {
            formPhotoDiv.removeChild(formPhotoDiv.firstChild);
        }

       
        formPhotoDiv.appendChild(photoPreview);
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

    // Appel de la fonction pour charger les catégories au chargement de la page
    fetchCategories();

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

        document.getElementById("inpFile").addEventListener("change", function () {
            const photoInput = this.files[0];
            if (photoInput) {
                // Vérifier le type de fichier et la taille
                if ((photoInput.type === "image/jpeg" || photoInput.type === "image/png") && photoInput.size <= 4194304) {
                    displayImagePreview(photoInput);
                    console.log("Contenu de photoInput :", photoInput); 
                } else {
                    
                    window.alert("Le fichier doit être au format JPEG ou PNG et ne doit pas dépasser 4 Mo.");
                    
                    this.value = "";
                }
            }
        });

        
       // Écouteur d'événement pour le formulaire
       document.getElementById("submitButton").addEventListener("click", function () {

    

        const endPoint = "http://localhost:5678/api/works";
        const formData = new FormData();

        formData.append("image", formPhotoInput.files[0]); 
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

                   
                    removePreviewImage();
                    resetModalInputs();
                    addInput();

                    window.alert("Photo ajoutée à la galerie !");

                    // Recharge les travaux depuis l'API
                    return fetchData();

                } else {
                    console.error('Échec de l\'envoi de la photo');

                    window.alert("Veuillez renseigner tous les champs.")

                }

            }).catch((error) => {
                console.error('Erreur lors de la requête:', error);
            });
    

});
        
        
        
       

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

       // Gestionnaire d'événement pour le bouton de retour à la modale 1
    backButtonModal2.addEventListener("click", function() {
        closeModal2(); // Fermer la modale 2
        openModal1({ preventDefault: () => {} }); // Passer un objet d'événement factice
    });

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
    }

});
