// Initialize dark mode correctly on page load
let isDark = localStorage.getItem('recipeDark') === 'true';
if (isDark) document.body.classList.add('dark');

function toggleDark() {
    isDark = !isDark; // Flip the state first
    document.body.classList.toggle('dark');
    localStorage.setItem('recipeDark', isDark); // Save the new flipped state
}

async function getMeals() {
    const q = document.getElementById('search').value || 'salad';
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${q}`);
    const data = await res.json();
    
    document.getElementById('grid').innerHTML = data.meals 
        ? data.meals.map(m => `
            <div class="card" onclick="getRecipe('${m.idMeal}')">
                <img src="${m.strMealThumb}" alt="${m.strMeal.replace(/'/g, "\\'")}">
                <div class="info">
                    <h3>${m.strMeal}</h3>
                </div>
            </div>
        `).join('') 
        : '<p style="grid-column:1/-1;text-align:center;font-size:20px;">No meals found.</p>';
}

async function getRecipe(id) {
    const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
    const data = await res.json();
    const m = data.meals[0];
    
    let ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (m[`strIngredient${i}`]) {
            ingredients.push(`<li>${m[`strIngredient${i}`]} - ${m[`strMeasure${i}`]}</li>`);
        }
    }
    
    document.getElementById('modalContent').innerHTML = `
        <img src="${m.strMealThumb}" alt="${m.strMeal.replace(/'/g, "\\'")}">
        <div class="modal-body">
            <h2>${m.strMeal}</h2>
            <h3>Ingredients</h3>
            <ul>${ingredients.join('')}</ul>
            <h3>Instructions</h3>
            <p>${m.strInstructions}</p>
        </div>
    `;
    
    document.getElementById('modal').style.display = 'block';
    document.getElementById('closeBtn').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('closeBtn').style.display = 'none';
}

// Fetch default meals on load
getMeals();