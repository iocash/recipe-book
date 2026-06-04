const hamburger = document.getElementById("hamburger");
const nav = document.getElementById("nav");

hamburger.addEventListener("click", () => {
    nav.classList.toggle("open");
});

let recipes = [
{
id:1,
name:"Jollof Rice",
category:"dinner",
cuisine:"Nigerian",
emoji:"🍚",
ingredients:["Rice","Tomato Paste","Onions","Stock"],
instructions:"Cook and serve.",
isFavorite:false
},
{
id:2,
name:"Chicken Pasta",
category:"dinner",
cuisine:"Italian",
emoji:"🍝",
ingredients:["Pasta","Chicken","Cream"],
instructions:"Cook and serve.",
isFavorite:true
},
{
id:3,
name:"Chocolate Cake",
category:"dessert",
cuisine:"American",
emoji:"🎂",
ingredients:["Flour","Sugar","Cocoa"],
instructions:"Bake and serve.",
isFavorite:false
}
];

const recipeGrid = document.getElementById("recipeGrid");

function saveToStorage(){
    localStorage.setItem(
        "recipebookData",
        JSON.stringify(recipes)
    );
}

function loadFromStorage(){
    const data = localStorage.getItem("recipebookData");

    if(data){
        recipes = JSON.parse(data);
    }
}

function renderRecipes(list){

    recipeGrid.innerHTML = "";

    list.forEach(recipe=>{

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
        <div class="card-header">${recipe.emoji}</div>

        <div class="card-body">
            <h3>${recipe.name}</h3>
            <p>${recipe.cuisine}</p>
            <p>${recipe.category}</p>
        </div>

        <div class="card-actions">
            <button class="btn-delete" data-id="${recipe.id}">
                Delete
            </button>

            <button class="btn-shop" data-id="${recipe.id}">
                Shop
            </button>

            <button class="btn-favorite ${recipe.isFavorite ? 'active' : ''}"
            data-id="${recipe.id}">
                â¤
            </button>
        </div>
        `;

        recipeGrid.appendChild(card);
    });

    attachEvents();
}

function attachEvents(){

    document.querySelectorAll(".btn-delete")
    .forEach(btn=>{
        btn.addEventListener("click",function(){

            const id = Number(this.dataset.id);

            recipes = recipes.filter(r=>r.id!==id);

            saveToStorage();
            renderRecipes(recipes);
        });
    });

    document.querySelectorAll(".btn-favorite")
    .forEach(btn=>{
        btn.addEventListener("click",function(){

            const id = Number(this.dataset.id);

            const recipe = recipes.find(r=>r.id===id);

            recipe.isFavorite = !recipe.isFavorite;

            saveToStorage();
            renderRecipes(recipes);
        });
    });

    document.querySelectorAll(".btn-shop")
    .forEach(btn=>{
        btn.addEventListener("click",function(){

            const id = Number(this.dataset.id);

            openShoppingList(id);
        });
    });
}

const modalOverlay = document.getElementById("modalOverlay");
const openFormBtn = document.getElementById("openFormBtn");
const modalClose = document.getElementById("modalClose");
const saveRecipeBtn = document.getElementById("saveRecipeBtn");

openFormBtn.addEventListener("click",()=>{
    modalOverlay.classList.add("open");
});

modalClose.addEventListener("click",()=>{
    modalOverlay.classList.remove("open");
});

saveRecipeBtn.addEventListener("click",()=>{

    const name =
    document.getElementById("recipeName").value;

    const category =
    document.getElementById("recipeCategory").value;

    const cuisine =
    document.getElementById("recipeCuisine").value;

    const emoji =
    document.getElementById("recipeEmoji").value || "❤🤍";

    const ingredients =
    document.getElementById("recipeIngredients")
    .value
    .split("\n")
    .filter(Boolean);

    const instructions =
    document.getElementById("recipeInstructions").value;

    if(!name) return;

    recipes.push({
        id:Date.now(),
        name,
        category,
        cuisine,
        emoji,
        ingredients,
        instructions,
        isFavorite:false
    });

    saveToStorage();
    renderRecipes(recipes);

    modalOverlay.classList.remove("open");
});

const searchInput =
document.getElementById("searchInput");

const categoryFilter =
document.getElementById("categoryFilter");

function applyFilters(){

    const search =
    searchInput.value.toLowerCase();

    const category =
    categoryFilter.value;

    const filtered =
    recipes.filter(recipe=>{

        const matchesSearch =
        recipe.name.toLowerCase().includes(search)
        ||
        recipe.cuisine.toLowerCase().includes(search);

        const matchesCategory =
        category==="all"
        ||
        recipe.category===category;

        return matchesSearch && matchesCategory;
    });

    renderRecipes(filtered);
}

searchInput.addEventListener("input",applyFilters);
categoryFilter.addEventListener("change",applyFilters);

const shoppingPanel =
document.getElementById("shoppingPanel");

const shoppingItems =
document.getElementById("shoppingItems");

const closeShoppingPanel =
document.getElementById("closeShoppingPanel");

closeShoppingPanel.addEventListener("click",()=>{
    shoppingPanel.classList.remove("open");
});

function openShoppingList(id){

    const recipe =
    recipes.find(r=>r.id===id);

    if(!recipe) return;

    shoppingItems.innerHTML =
    `<h3>${recipe.name}</h3>` +
    recipe.ingredients.map(item =>
        `<div class="shopping-item">${item}</div>`
    ).join("");

    shoppingPanel.classList.add("open");
}

loadFromStorage();
renderRecipes(recipes);
