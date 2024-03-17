// Check if the 'favouritesList' array exists in local storage, if not, create it
if (localStorage.getItem("favouritesList") == null) {
    localStorage.setItem("favouritesList", JSON.stringify([]));
}

// Async function to fetch meals from the API based on the URL and value provided
async function fetchMealsFromApi(url, value) {
    // Fetch data from the API using the provided URL and value
    const response = await fetch(`${url + value}`);
    // Convert the response to JSON format and return the meals
    const meals = await response.json();
    return meals;
}

// Function to display all meal cards in the main section based on the search input value
function showMealList() {
    // Get the search input value
    let inputValue = document.getElementById("my-search").value;
    // Get the favourites list from local storage
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    // Define the URL for fetching meals from the API
    let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    // Initialize an empty HTML string to store the meal cards
    let html = "";
    // Fetch meals from the API based on the URL and input value
    let meals = fetchMealsFromApi(url, inputValue);
    // Handle the fetched data
    meals.then(data => {
        // Check if meals data is available
        if (data.meals) {
            // Iterate through each meal in the data
            data.meals.forEach((element) => {
                // Initialize a variable to check if the meal is a favourite
                let isFav = false;
                // Iterate through the favourites list to check if the meal is in it
                for (let index = 0; index < arr.length; index++) {
                    if (arr[index] == element.idMeal) {
                        // Set isFav to true if the meal is a favourite
                        isFav = true;
                    }
                }
                // Construct HTML for the meal card based on whether it's a favourite or not
                if (isFav) {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                } else {
                    html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${element.strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${element.strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${element.idMeal})">More Details</button>
                            <button id="main${element.idMeal}" class="btn btn-outline-light" onclick="addRemoveToFavList(${element.idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
                }
            });
        } else {
            // Display a message if no meals are found
            html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                The meal you are looking for was not found.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }
        // Update the main section's HTML with the generated meal cards
        document.getElementById("main").innerHTML = html;
    });
}

// Async function to show full meal details in the main section
async function showMealDetails(id) {
    // Define the URL for fetching meal details from the API
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    // Initialize an empty HTML string to store the meal details
    let html = "";
    // Fetch meal details from the API based on the meal ID
    await fetchMealsFromApi(url, id).then(data => {
        // Construct HTML for displaying meal details
        html += `
          <div id="meal-details" class="mb-5">
            <div id="meal-header" class="d-flex justify-content-around flex-wrap">
              <div id="meal-thumbail">
                <img class="mb-2" src="${data.meals[0].strMealThumb}" alt="" srcset="">
              </div>
              <div id="details">
                <h3>${data.meals[0].strMeal}</h3>
                <h6>Category : ${data.meals[0].strCategory}</h6>
                <h6>Area : ${data.meals[0].strArea}</h6>
              </div>
            </div>
            <div id="meal-instruction" class="mt-3">
              <h5 class="text-center">Instruction :</h5>
              <p>${data.meals[0].strInstructions}</p>
            </div>
            <div class="text-center">
              <a href="${data.meals[0].strYoutube}" target="_blank" class="btn btn-outline-light mt-3">Watch Video</a>
            </div>
          </div>
        `;
    });
    // Update the main section's HTML with the generated meal details
    document.getElementById("main").innerHTML = html;
}

// Function to show all favourite meals in the favourites body
async function showFavMealList() {
    // Get the favourites list from local storage
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    // Define the URL for fetching meal details from the API
    let url = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
    // Initialize an empty HTML string to store the favourite meal cards
    let html = "";
    // Check if the favourites list is empty
    if (arr.length == 0) {
        // Display a message if no favourite meals are found
        html += `
            <div class="page-wrap d-flex flex-row align-items-center">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-md-12 text-center">
                            <span class="display-1 d-block">404</span>
                            <div class="mb-4 lead">
                                No meal added in your favourites list.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
    } else {
        // Iterate through each meal in the favourites list
        for (let index = 0; index < arr.length; index++) {
            // Fetch meal details from the API based on the meal ID in the favourites list
            await fetchMealsFromApi(url, arr[index]).then(data => {
                // Construct HTML for each favourite meal card
                html += `
                <div id="card" class="card mb-3" style="width: 20rem;">
                    <img src="${data.meals[0].strMealThumb}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${data.meals[0].strMeal}</h5>
                        <div class="d-flex justify-content-between mt-5">
                            <button type="button" class="btn btn-outline-light" onclick="showMealDetails(${data.meals[0].idMeal})">More Details</button>
                            <button id="main${data.meals[0].idMeal}" class="btn btn-outline-light active" onclick="addRemoveToFavList(${data.meals[0].idMeal})" style="border-radius:50%"><i class="fa-solid fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                `;
            });
        }
    }
    // Update the favourites body's HTML with the generated favourite meal cards
    document.getElementById("favourites-body").innerHTML = html;
}

// Function to add or remove meals from the favourites list
function addRemoveToFavList(id) {
    // Get the favourites list from local storage
    let arr = JSON.parse(localStorage.getItem("favouritesList"));
    // Initialize a variable to check if the meal is already in the favourites list
    let contain = false;
    // Iterate through the favourites list to check if the meal ID is already present
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            // Set contain to true if the meal ID is found in the favourites list
            contain = true;
        }
    }
    // Check if the meal is already in the favourites list
    if (contain) {
        // Remove the meal from the favourites list
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert("Your meal removed from your favourites list");
    } else {
        // Add the meal to the favourites list
        arr.push(id);
        alert("Your meal added to your favourites list");
    }
    // Update the favourites list in local storage
    localStorage.setItem("favouritesList", JSON.stringify(arr));
    // Update the displayed meal lists
    showMealList();
    showFavMealList();
}
