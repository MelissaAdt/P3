

// Attendez que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function() {
    

    const openModal1 = function (e) { 
        console.log("Modal clicked");
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute("href"));
        console.log("Target:", target);
        target.style.display = block;
        target.removeAttribute("aria-hidden");
    };

    async function modalWorks() {
        const response = await fetch("http://localhost:5678/api/works");
        const projets = await response.json();

        const modalGallery = document.getElementById("travaux-modal1");

        projets.forEach(projet => {
            const img = document.createElement("img");
            img.src = projet.imageUrl;
            modalGallery.appendChild(img);
        });

        // Attacher l'événement de clic une fois que les éléments du DOM sont chargés
        document.getElementById("js-modal").addEventListener("click", openModal1);
    }

    // Appeler la fonction pour charger les projets de l'API
    modalWorks();
});

