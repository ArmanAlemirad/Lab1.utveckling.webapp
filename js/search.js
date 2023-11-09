const urlParams = new URLSearchParams(window.location.search);
const username = localStorage.getItem("username");
const elWelcomeMessage = document.getElementById("welcomeMessage");
const memberButtons = document.querySelector("#login-buttons");

const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchBtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const closeBtn = document.querySelector(".recipe-close-btn");

const loginForm = document.getElementById("loginForm");
const loginCloseBtn = document.querySelector("login-close-btn");


let welcomeMessage = "";

if(username){
    welcomeMessage = "Hello, " + username;
} else {
    welcomeMessage  = "Recipe";
}

elWelcomeMessage.textContent = welcomeMessage;

if(username){
  memberButtons.style.display = 'none';
} else { 
  const logOut  = document.querySelector("#logout-btn")
  logOut.style.display = 'none';
  localStorage.removeItem("favorites");
}


const fetchRecipes = async (query) => {
  try {
    const data = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
    );
    const response = await data.json();

    recipeContainer.innerHTML = "";
    response.meals.forEach((meal) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      const username = localStorage.getItem("username");
      
      const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      const isFavorite = favorites.some(favorite => favorite.mealId == meal.idMeal);
      const likeImageSrc = isFavorite ? "img/liked.png" : "img/unlike.png";
      
      recipeDiv.innerHTML = `
          <img  src="${meal.strMealThumb}">
          <h3>${meal.strMeal}</h3>
          <p>Dish: <span>${meal.strCategory}</span></p> 
        ${username ? `<img src="${likeImageSrc}" alt="like-unlike" class="unlike-img" id="image" onclick="changeImage(event, ${meal.idMeal})">` : ""}
        `;


      const button = document.createElement("button");
      button.textContent = "View Recipe";
      recipeDiv.appendChild(button);
      recipeContainer.appendChild(recipeDiv);

      button.addEventListener("click", () => {
        openRecipePopup(meal);
      });

      const unlikeImage = document.createElement("img");
      unlikeImage.src = "img/unlike.png";
      unlikeImage.alt = "unlike";
      unlikeImage.classList.add("unlike-img");
      unlikeImage.addEventListener("click", changeImage);
    });
  } catch (error) {
    recipeContainer.innerHTML =
      "<h2> Recipe does not exist! Please try again = )</h2>";
  }
};

function changeImage(event, mealId) {
  const image = event.target;
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (image.src.match("unlike")) {
    image.src = "img/liked.png";

    if (!favorites.some(favorite => favorite.mealId === mealId)) {
      const mealToStore = {
        mealId: mealId,
        strMealThumb: image.src
      };
      favorites.push(mealToStore);
    }
  } else {
    image.src = "img/unlike.png";

    const index = favorites.findIndex(favorite => favorite.mealId === mealId);
    if (index !== -1) {
      favorites.splice(index, 1);
    }
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
}

const fetchIngredients = (meal) => {
  let ingredientList = "";
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    if (ingredient) {
      const measure = meal[`strMeasure${i}`];
      ingredientList += `<li>${measure} ${ingredient}</li>`;
    } else {
      break;
    }
  }
  return ingredientList;
};

const openRecipePopup = (meal) => {
  recipeDetailsContent.innerHTML = `
    <h2 class="recipeName">${meal.strMeal}</h2>
    <h3>Ingredients:</h3> 
    <ul class="ingredientList">${fetchIngredients(meal)}</ul>
    <div>
      <h3>Instructions</h3>
      <p class="recipeInstructions">${meal.strInstructions}</p>
    </div>`;

  recipeDetailsContent.parentElement.style.display = "block";
};

closeBtn.addEventListener("click", () => {
  recipeDetailsContent.parentElement.style.display = "none";
});

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  fetchRecipes(searchInput);
});

window.addEventListener("load", (e) => {
  e.preventDefault();
  const searchInput = searchBox.value.trim();
  fetchRecipes(searchInput);
});
