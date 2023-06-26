//Fonction récupération images de l'API
function galleryWorksApi() {
  try {
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
      });
  } catch (error) {
    console.error(error);
  }
}

//Fonction qui ajoute les images à la gallerie
function addWorkToGallery(works) {
  const gallery = document.querySelector("[data-gallery]");
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
const log = document.querySelector("[data-log]");
const banner = document.querySelector("[data-banner-edition]");
const filtres = document.querySelector("[data-filters]");
const editActive = document.querySelectorAll("[data-edit]");
const editIcon = document.querySelectorAll("[data-icon-modification]");

//Mode édition
function editionActive() {
  if (localStorage.login) {
    log.innerText = "logout";
    banner.style = "display:flex;";
    filtres.style = "display:none";
    editActive.forEach((button) => {
      button.classList.remove("hidden");
    });
    editIcon.forEach((icon) => {
      icon.classList.remove("hidden");
    });
  } else {
    banner.style = "display:none;";
    editActive.forEach((button) => {
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
  localStorage.clear();
});

//Ouverture fenetre modal sur chaque clic de modifier
// const editionsActivate = document.querySelectorAll("[data-edit]");
const modal1 = document.querySelector("[data-modal-1]");
const modal2 = document.querySelector("[data-modal-2]");
const closeButton = document.querySelectorAll("[data-close-button]");
const addImagesBtn = document.querySelector("[data-btnAdd-images]");

editActive.forEach((element) => {
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

addImagesBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal2.style.display = "block";
  modal1.style.display = "none";
});

const imageContainer = document.querySelector("[data-images-list]");
const token = localStorage.token;

fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    imageContainer.innerHTML = "";

    data.forEach((image) => {
      const imageContent = document.createElement("div");
      const imageElement = document.createElement("img");
      const trashIcon = document.createElement("i");
      const moveIcon = document.createElement("i");
      const editerText = document.createElement("p");

      //Mettre les images en plcae dans la modal
      imageContent.classList.add("image-content");
      imageElement.classList.add("img-element");
      imageElement.src = image.imageUrl;
      imageContent.appendChild(imageElement);
      // Mise en place du texte "editer"
      editerText.classList.add("img-editer");
      editerText.setAttribute("data-id", image.id);
      editerText.innerText = "editer";
      imageContent.appendChild(editerText);

      //Mise en place du logo Trash
      trashIcon.classList.add("fa-regular", "fa-trash-can");
      trashIcon.setAttribute("data-id", image.id);
      imageContent.appendChild(trashIcon);

      //Mise en place de l'icon de déplacement image
      moveIcon.classList.add("fa-solid", "fa-arrows-up-down-left-right");
      moveIcon.setAttribute("data-id", image.id);
      imageContent.appendChild(moveIcon);

      imageContainer.classList.add("image-container");
      imageContainer.appendChild(imageContent);
      // imageContent.appendChild(imageElement);
    });

    //Suppresion image
    const deleteIcons = document.querySelectorAll(".fa-trash-can");
    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", (e) => {
        const imageIndex = e.target.getAttribute("data-id");
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
    const gallery = document.querySelector("[data-gallery]");
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
const deletedGallery = document.querySelector("[data-deleted-gallery]");
deletedGallery.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    for (const image of data) {
      await deleteWorks(image.id);
    }

    imageContainer.innerHTML = "";
  } catch (error) {
    console.error("Erreur lors de la suppression des images", error);
  }
});

const newPicmodale = document.querySelector("[data-input-newPicture]");
const preview = document.querySelector("[data-import-images]");
const addTitle = document.querySelector("[data-input-title]");
const newCategorie = document.querySelector("[data-category]");
const submitProject = document.querySelector("[data-validate]");
const form2 = document.querySelector("[data-form-modal]");
let imgPreview;
let inputTitle;
let inputCategory;
function addPicture() {
  //Ajout des images//
  newPicmodale.addEventListener("input", (e) => {
    console.log(newPicmodale.files[0]);
    imgPreview = e.target.files[0];
    const imgModale2 = URL.createObjectURL(newPicmodale.files[0]);
    preview.src = imgModale2;
    preview.style.visibility = "visible";
  });
  //Ajout des titres//
  addTitle.addEventListener("input", (e) => {
    inputTitle = e.target.value;
    console.log(inputTitle);
  });
  //ajout des categories//
  newCategorie.addEventListener("input", (e) => {
    inputCategory = e.target.selectedIndex;
    console.log(inputCategory);
    console.log(token);
  });
  //changement de la couleur du bouton si tout les élèments sont remplis pour la validation du projet//
  form2.addEventListener("change", () => {
    if (imgPreview && inputTitle && inputCategory) {
      submitProject.style.background = "#1d6154";
      submitProject.style.cursor = "pointer";
    } else {
      submitProject.style.background = "";
    }
  });
  //soumettre le projet//
  submitProject.addEventListener("click", (e) => {
    e.preventDefault();
    if (imgPreview && inputTitle && inputCategory) {
      //vérification taille de l'image
      if (imgPreview.size > 4 * 1024 * 1024) {
        alert("Erreur : la taille de l'image ne doit pas dépasser 4 Mo.");
        form2.reset(); // Réinitialiser le formulaire
        preview.src = ""; // Supprimer l'image de l'élément <img>
        preview.style.visibility = "hidden"; // Masquer l'élément <img>
        return;
      }

      // Vérifier le format de l'image
      const fileExtension = imgPreview.name.split(".").pop().toLowerCase();
      if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
        alert("Erreur : le format de l'image doit être JPEG ou PNG.");
        form2.reset(); // Réinitialiser le formulaire
        preview.src = ""; // Supprimer l'image de l'élément <img>
        preview.style.visibility = "hidden"; // Masquer l'élément <img>
        return;
      }

      //creer un fromData pour envoyer les données//
      const formData = new FormData();
      formData.append("image", imgPreview); //ajout de l'image//
      formData.append("title", inputTitle); //AJOUT DU TITRE//
      formData.append("category", inputCategory);
      console.log(formData);
      newDataSubmit(formData);

      async function newDataSubmit(formData) {
        try {
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
          // Ajouter la nouvelle image à la galerie sans recharger la page
          const workElement = createWorkElement(dataResponse);
          const gallery = document.querySelector("[data-gallery]");
          gallery.appendChild(workElement);
        } catch (error) {
          console.log("il y a eu une erreur sur le fetch");
        }
      }
    }
  });
}
addPicture();

const arrowBack = document.querySelector("[data-arrow-back]");
arrowBack.addEventListener("click", (e) => {
  e.preventDefault();
  modal2.style.display = "none";
  modal1.style.display = "block";
});

const editionSubmitBtn = document.querySelector("[data-publish]");
editionSubmitBtn.addEventListener("click", function () {
  quitterModeEdition();
});

function quitterModeEdition() {
  log.innerText = "logout";
  banner.style = "display:none;";
  filtres.style = "display:flex";

  editActive.forEach((button) => {
    button.classList.add("hidden");
  });
  editIcon.forEach((icon) => {
    icon.classList.add("hidden");
  });
}
