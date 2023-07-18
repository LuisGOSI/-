// Script menu desplegable --------------------------------------------------------------------------------
const menuCheckbox = document.getElementById("menu");
const menuOptions = document.getElementById("menuOptions");

menuCheckbox.addEventListener("change", () => {
  if (menuCheckbox.checked) {
    menuOptions.style.display = "block";
  } else {
    menuOptions.style.display = "none";
  }
});


