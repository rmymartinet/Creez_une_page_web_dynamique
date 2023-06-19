const submit = document.getElementById("btn-submit");
const login = document.querySelector(".login");
const eField = document.querySelector(".email");
const eInput = document.querySelector("input[type='email']");
const pField = document.querySelector(".password");
const pInput = document.querySelector("input[type='password']");

login.onsubmit = (e) => {
  e.preventDefault(); //preventing from form submitting
  userValidation();
  //if email and password is blank then add shake class in it else call specified function
  eInput.value == "" ? eField.classList.add("shake", "error") : checkEmail();
  pInput.value == "" ? pField.classList.add("shake", "error") : checkPass();
  setTimeout(() => {
    //remove shake class after 500ms
    eField.classList.remove("shake");
    pField.classList.remove("shake");
  }, 500);
  eInput.onkeyup = () => {
    checkEmail();
  }; //calling checkEmail function on email input keyup
  pInput.onkeyup = () => {
    checkPass();
  }; //calling checkPassword function on pass input keyup
  function checkEmail() {
    //checkEmail function
    let pattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/; //pattern for validate email
    if (!eInput.value.match(pattern)) {
      //if pattern not matched then add error and remove valid class
      eField.classList.add("error");
      eField.classList.remove("valid");
      let errorTxt = eField.querySelector(".error-txt");
      //if email value is not empty then show please enter valid email else show Email can't be blank
      eInput.value != ""
        ? (errorTxt.innerText = "Enter a valid email address")
        : (errorTxt.innerText = "Email can't be blank");
    } else {
      //if pattern matched then remove error and add valid class
      eField.classList.remove("error");
      eField.classList.add("valid");
    }
  }
  function checkPass() {
    //checkPass function
    if (pInput.value == "") {
      //if pass is empty then add error and remove valid class
      pField.classList.add("error");
      pField.classList.remove("valid");
    } else {
      //if pass is empty then remove error and add valid class
      pField.classList.remove("error");
      pField.classList.add("valid");
    }
  }
  //if eField and pField doesn't contains error class that mean user filled details properly
  if (
    !eField.classList.contains("error") &&
    !pField.classList.contains("error")
  ) {
  }
};

async function userValidation() {
  const email = eInput.value;
  const password = pInput.value;
  try {
    const response = await fetch(
      "http://" + window.location.hostname + ":5678/api/users/login",
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      }
    );
    if (response.ok) {
      window.location.href = "./index.html";
      // Création du token d'identification
      const userData = await response.json();
      // Enregistrement du token dans le local storage
      localStorage.setItem("token", userData.token);
      localStorage.setItem("login", true);
    } else if (eInput.value !== "" && pInput.value !== "") {
      alert("Email ou mot de passe incorrect");
    }
  } catch (e) {
    // Si une erreur se produit, elle est affichée dans la console
    console.log(e);
  }
}
// const moveImages = document.querySelectorAll(
//   ".fa-arrows-up-down-left-right"
// );

// let selectedImage = null;
// moveImages.forEach((icon) => {
//   icon.addEventListener("click", (e) => {
//     const imageId = e.target.getAttribute("data-id");
//     selectedImage = document.querySelector(`[data-id="${imageId}"]`);
//     //pour effectuer le déplcement
//     selectedImage.parentElement.addEventListener("mousemove", moveImage);
//     selectedImage.parentElement.addEventListener("mouseup", stopMoveImage);

//     //Image Draggable
//     let initialX = 0;
//     let initialY = 0;
//     let offsetX = 0;
//     let offsetY = 0;

//     function moveImage(event) {
//       const { clientX, clientY } = event;
//       const containerRect = imageContainer.getBoundingClientRect();

//       if (initialX === 0 && initialY === 0) {
//         initialX = clientX;
//         initialY = clientY;
//         offsetX = clientX - selectedImage.offsetLeft;
//         offsetY = clientY - selectedImage.offsetTop;
//       }

//       const newX = clientX - containerRect.left - offsetX;
//       const newY = clientY - containerRect.top - offsetY;

//       selectedImage.style.transform = `translate(${newX}px, ${newY}px)`;
//     }

//     function stopMoveImage(event) {
//       initialX = 0;
//       initialY = 0;
//       offsetX = 0;
//       offsetY = 0;

//       selectedImage.parentElement.removeEventListener(
//         "mousemove",
//         moveImage
//       );
//       selectedImage.parentElement.removeEventListener(
//         "mouseup",
//         stopMoveImage
//       );
//     }
//   });
// });
