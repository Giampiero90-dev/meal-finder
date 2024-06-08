const search = document.getElementById('search'),
    submit = document.getElementById('submit'),
    random = document.getElementById('random'),
    mealsEl = document.getElementById('meals'),
    resultHeading = document.getElementById('result-heading'),
    single_mealEl = document.getElementById('single-meal');
	
	// Display initial chicken meals
	searchMeal(null, 'chicken');

    // Search meal and fetch from API
    function searchMeal(e, term) {
		if(e) {
			e.preventDefault();
		}
        
        // Clear single meal
        single_mealEl.innerHTML = '';
        
        // Get search term
		if(e) {
			term = search.value;
		}
        
        // Check for empty
        if(term.trim()) {
            fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
                .then(res => res.json())
                .then(data => {
                    resultHeading.innerHTML = `<h2>Search results for '${term}':</h2>`;
                    
                    if(data.meals === null) {
                        resultHeading.innerHTML = `<p>There are no search results. Try again!</p>`
                    } else {
                        mealsEl.innerHTML = data.meals.map(meal => 
                            `<div class="meal">
                                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                                <div class="meal-info" data-meal-id="${meal.idMeal}">
                                    <h3>${meal.strMeal}</h3>
                                </div>
                            </div>`
                        ).join(" ");
                    }
                });
                // Clear search text
                search.value = '';
        } else {
            alert('Please enter a search term');
        }
    }
	
	// Fetch meal by ID
	function getMealById(mealID) {
		fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
			.then(res => res.json())
			.then(data => {
				const meal = data.meals[0];
				
				addMealToDom(meal);
			});
	}
	
	// Fetch random meal
	function getRandomMeal() {
		// Clear meals and heading
		mealsEl.innerHTML = '';
		resultHeading.innerHTML = '';
		fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
			.then(res => res.json())
			.then(data => {
				const meal = data.meals[0];
				addMealToDom(meal);
			})
	}
	
	// Add meal to DOM
	function addMealToDom(meal) {
		const ingredients = [];
				
		for (let index = 1; index <= 20; index++) {
			if(meal[`strIngredient${index}`]) {
				ingredients.push(`${meal[`strIngredient${index}`]} - ${meal[`strMeasure${index}`]}`);
			} else {
				break;
			}
		}
				
		single_mealEl.innerHTML = `
			<div class="single-meal">
				<h1>${meal.strMeal}</h1>
				<img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
				<div class="single-meal-info">
					${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
					${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
				</div>
				<div class="main">
					<p>${meal.strInstructions}</p>
					<h2>Ingredients</h2>
					<ul>
						${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
					</ul>
				</div>
			</div>
		`;
		
		single_mealEl.scrollIntoView({ behavior: "smooth" });
	}
     
    // Event listeners
    submit.addEventListener('submit', searchMeal);
    random.addEventListener('click', getRandomMeal);
	
	mealsEl.addEventListener('click', e => {
		
		const mealInfo = e.target.closest('.meal-info');
				
		if(mealInfo) {
			const mealID = mealInfo.getAttribute('data-meal-id');
			getMealById(mealID);
		}
	});
