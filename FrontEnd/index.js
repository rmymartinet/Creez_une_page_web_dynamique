//Fonction récupère Image de l'API
function galleryWorksApi() {
  fetch("http://localhost:5678/api/works", {
    method: "get",
    headers: {
      "Content-type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des œuvres.");
      }
      return response.json();
    })
    .then((data) => {
      addWorkToGallery(data);
    })
    .catch((error) => {
      console.error(error);
    });
}
//Fonction qui ajoute les images à la gallerie
function addWorkToGallery(works) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  works.forEach((work) => {
    const workElement = createWorkElement(work);
    gallery.appendChild(workElement);
  });
}
//Création work qui regoupe les images
function createWorkElement(work) {
  const workElement = document.createElement("div");
  workElement.classList.add("work");

  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  workElement.appendChild(imageElement);

  const titleElement = document.createElement("p");
  titleElement.innerText = work.title;
  workElement.appendChild(titleElement);

  workElement.setAttribute("data-work-id", work.id);
  workElement.setAttribute("data-user-id", work.userId);
  workElement.setAttribute("data-category-id", work.categoryId);
  workElement.setAttribute("data-category-name", work.category.name);

  return workElement;
}
galleryWorksApi();

//Mise en place des filtres
const btnTous = document.querySelector("[data-btn-0]");
const btnObject = document.querySelector("[data-btn-1]");
const btnAppart = document.querySelector("[data-btn-2]");
const btnHotel = document.querySelector("[data-btn-3]");

btnTous.addEventListener("click", () => {
  const works = document.getElementsByClassName("work");
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const categoryId = work.getAttribute("data-category-id");
    if (categoryId === "1" || categoryId === "2" || categoryId === "3") {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  }
});
btnObject.addEventListener("click", () => {
  const works = document.getElementsByClassName("work");
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const categoryName = work.getAttribute("data-category-name");
    if (categoryName === "Objets") {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  }
});
btnAppart.addEventListener("click", () => {
  const works = document.getElementsByClassName("work");
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const categoryName = work.getAttribute("data-category-name");
    if (categoryName === "Appartements") {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  }
});
btnHotel.addEventListener("click", () => {
  const works = document.getElementsByClassName("work");
  for (let i = 0; i < works.length; i++) {
    const work = works[i];
    const categoryName = work.getAttribute("data-category-name");
    if (categoryName === "Hotels & restaurants") {
      work.style.display = "block";
    } else {
      work.style.display = "none";
    }
  }
});

//Mode edition activé si l'utilisateur est connecté
const log = document.querySelector(".log");
const banner = document.querySelector(".banner-edition");
const modifications = document.querySelector(".change");
const filtres = document.querySelector(".filters");
const editBtn = document.querySelectorAll(".edit");
const editIcon = document.querySelectorAll(".fa-regular");

//Mode édition
function editionActive() {
  if (localStorage.login) {
    log.innerText = "logout";
    banner.style = "display:flex;";
    filtres.style = "display:none";
    editBtn.forEach((button) => {
      button.classList.remove("hidden");
    });
    editIcon.forEach((icon) => {
      icon.classList.remove("hidden");
    });
  } else {
    banner.style = "display:none;";
    modifications.style = "display:none;";
    container.style = "display:none";
    editBtn.forEach((button) => {
      button.classList.add("hidden");
    });
    editIcon.forEach((icon) => {
      icon.classList.add("hidden");
    });
  }
}
editionActive();

//Désactivation du mode logout au click
log.addEventListener("click", () => {
  localStorage.removeItem("login");
  localStorage.removeItem("token");
  log.innerText = "login";
  localStorage.clear;
});

//Ouverture fenetre modal sur chaque clic de modifier
const editionsActivate = document.querySelectorAll(".edit");
const modal1 = document.querySelector(".modal1");
const modal2 = document.querySelector(".modal2");
const closeButton = document.querySelectorAll(".close-button");
const modalDisplay = document.querySelector(".modal-add");

editionsActivate.forEach((element) => {
  element.addEventListener("click", (e) => {
    e.preventDefault();
    modal1.style.display = "block";
  });
});
closeButton.forEach((element) => {
  element.addEventListener("click", () => {
    modal1.style.display = "none";
    modal2.style.display = "none";
  });
});

modalDisplay.addEventListener("click", (e) => {
  e.preventDefault();
  modal2.style.display = "block";
  modal1.style.display = "none";
});

//Flèche de retour en arrière
const arrowBack = document.querySelector(".arrow-back");
arrowBack.addEventListener("click", (e) => {
  e.preventDefault();
  modal2.style.display = "none"; // Ferme modal2
  modal1.style.display = "block";
});

const imageContainer = document.querySelector(".image-list");
const token = localStorage.token;

//Suppression images
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    imageContainer.innerHTML = "";

    data.forEach((image) => {
      const imageContent = document.createElement("div");
      const imageElement = document.createElement("img");
      const iconElement = document.createElement("div");
      const trashIcon = document.createElement("i");
      const moveIcon = document.createElement("i");
      const editerText = document.createElement("p");

      //Editer la photo
      editerText.innerText = "editer";
      editerText.classList.add("img-editer");
      editerText.setAttribute("data-id", image.id);
      imageContent.appendChild(editerText);

      //Mettre les images en plcae dans la modal
      imageElement.src = image.imageUrl;
      imageElement.draggable = true;
      imageContent.appendChild(imageElement);
      imageElement.classList.add("img-element");

      //Mise en place du logo Trash
      iconElement.classList.add("icon-modal1");
      iconElement.appendChild(imageContent);
      trashIcon.classList.add("fa-regular", "fa-trash-can");
      trashIcon.setAttribute("data-id", image.id);
      imageContent.appendChild(trashIcon);

      //Mise en place de l'icon de déplacement image
      moveIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right");
      moveIcon.setAttribute("data-id", image.id);
      imageContent.appendChild(moveIcon);

      imageContainer.classList.add("image-container");
      imageContainer.appendChild(imageContent);
      imageContent.appendChild(imageElement);
    });

    //Suppresion image
    const deleteIcons = document.querySelectorAll(".fa-trash-can");
    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const imageIndex = event.target.getAttribute("data-id");
        deleteWorks(imageIndex);
        icon.parentElement.remove();
      });
    });
  });

async function updateGallery() {
  try {
    const response = await fetch("http://localhost:5678/api/works/");
    const data = await response.json();

    // Effacer les éléments actuels dans la galerie
    gallery.innerHTML = "";

    // Parcourir les données et ajouter les images à la galerie
    data.forEach((work) => {
      const figure = document.createElement("figure");
      const image = document.createElement("img");
      image.src = work.imageUrl;
      const caption = document.createElement("figcaption");
      caption.textContent = work.title;

      figure.appendChild(image);
      figure.appendChild(caption);
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la galerie", error);
  }
}

//Suppresion d'une image de la gallerie
async function deleteWorks(workId) {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      // Supprimer l'élément de la galerie principale
      const galleryItem = document.querySelector(`[data-work-id="${workId}"]`);
      if (galleryItem) {
        galleryItem.remove();
      }

      // Mettre à jour la galerie principale
      await updateGallery();
    } else {
      console.error("Erreur lors de la suppression de l'image");
    }
  } catch (error) {
    console.error("Erreur lors de la requête de suppression", error);
  }
}
// Déplacement des images
const draggable = document.querySelectorAll(".img-element");
const containers = document.querySelectorAll(".image-container");

draggable.forEach((draggable) => {
  draggable.addEventListener("dragstart", () => {
    draggable.classList.add("dragging");
  });
  draggable.addEventListener("dragend", () => {
    draggable.classList.remove("dragging");
  });
});

containers.forEach((container) => {
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggable = document.querySelector(".dragging");
    if (afterElement == null) {
      container.appendChild(draggable);
    } else {
      container.insertBefore(draggable, afterElement);
    }
  });
});

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".img-element:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

const newPicmodale = document.querySelector(".input-newPicture"); // Sélectionne l'élément d'entrée pour la nouvelle image
const preview = document.querySelector(".importImg"); // Sélectionne l'élément d'aperçu de l'image
const addTitle = document.querySelector(".input-title"); // Sélectionne l'élément d'entrée pour le titre
const newCategorie = document.querySelector(".category"); // Sélectionne l'élément de la nouvelle catégorie
const submitProject = document.querySelector(".validate"); // Sélectionne le bouton de soumission du projet
const form2 = document.querySelector(".formModal"); // Sélectionne le formulaire 2
const editionSubmitBtn = document.querySelector(".btn2"); // Sélectionne le bouton de soumission pour l'édition

let imgPreview;
let inputTitle;
let inputCategory;

function addPicture() {
  newPicmodale.addEventListener("change", (e) => {
    // Événement déclenché lorsque la valeur de l'élément d'entrée pour la nouvelle image change
    imgPreview = e.target.files[0]; // Récupère le fichier de l'élément d'entrée
    preview.src = URL.createObjectURL(newPicmodale.files[0]); // Définit l'URL de prévisualisation de l'image
    preview.style.visibility = "visible"; // Rend l'élément d'aperçu de l'image visible

    addTitle.addEventListener("input", (e) => {
      // Événement déclenché lorsque la valeur de l'élément d'entrée pour le titre change
      inputTitle = e.target.value; // Récupère la valeur du titre
    });

    newCategorie.addEventListener("change", (e) => {
      // Événement déclenché lorsque la valeur de l'élément de la nouvelle catégorie change
      inputCategory = e.target.selectedIndex; // Récupère l'index de la catégorie sélectionnée
    });

    form2.addEventListener("change", () => {
      // Événement déclenché lorsque la valeur du formulaire 2 change
      submitProject.style.background =
        imgPreview && inputTitle && inputCategory ? "#1d6154" : ""; // Définit la couleur de fond du bouton de soumission en fonction de la présence de l'image, du titre et de la catégorie
    });

    submitProject.addEventListener("click", async (e) => {
      // Événement déclenché lors du clic sur le bouton de soumission du projet
      e.preventDefault();

      if (imgPreview && inputTitle && inputCategory) {
        // Vérifie si l'image, le titre et la catégorie sont présents
        const formData = new FormData(); // Crée un objet FormData pour envoyer les données du formulaire
        formData.append("image", imgPreview); // Ajoute l'image au formulaire
        formData.append("title", inputTitle); // Ajoute le titre au formulaire
        formData.append("category", inputCategory); // Ajoute la catégorie au formulaire
        newDataSubmit(formData);
        async function newDataSubmit(formData) {
          const response = await fetch("http://localhost:5678/api/works", {
            method: "post",
            headers: {
              accept: "application/json",
              authorization: `Bearer ${token}`,
            },
            body: formData,
          });
          const dataResponse = await response.json();
          console.log(dataResponse);
        }
      }
    });
  });
}
addPicture();
editionSubmitBtn.addEventListener("click", () => {
  location.reload(); // Recharge la page lors du clic sur le bouton de soumission pour l'édition
});
