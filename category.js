document.addEventListener("DOMContentLoaded", function () {

    // Get category from URL
    const params = new URLSearchParams(window.location.search);
    const selectedCategory = params.get("category");

    // Get plants added by Admin
    const plants = JSON.parse(
        localStorage.getItem("greenlifePlants") || "[]"
    );

    const title = document.getElementById("categoryTitle");
    const description = document.getElementById("categoryDescription");
    const heading = document.getElementById("categoryHeading");
    const count = document.getElementById("plantCount");
    const grid = document.getElementById("plantsGrid");
    const noPlants = document.getElementById("noPlants");
    const search = document.getElementById("plantSearch");

    // Category information
    const categoryInfo = {
        "Indoor": {
            title: "Indoor Plants",
            description: "Beautiful plants to bring freshness and greenery into your home."
        },

        "Outdoor": {
            title: "Outdoor Plants",
            description: "Healthy plants perfect for gardens, balconies and outdoor spaces."
        },

        "Flowering": {
            title: "Flowering Plants",
            description: "Add colour and beauty to your home with beautiful flowering plants."
        },

        "Medicinal & Herbs": {
            title: "Medicinal & Herb Plants",
            description: "Useful herbs and medicinal plants for your home garden."
        },

        "Cactus": {
            title: "Cactus & Succulents",
            description: "Low-maintenance plants with unique shapes and natural beauty."
        },

        "Soil": {
            title: "Soil & Potting Mix",
            description: "Quality soil and potting mixes for healthy plant growth."
        }
    };

    // If category is not found
    if (!selectedCategory || !categoryInfo[selectedCategory]) {
        title.textContent = "Plants";
        description.textContent = "Discover beautiful plants for your home and garden.";
        heading.textContent = "Plants";
    } else {

        title.textContent = categoryInfo[selectedCategory].title;

        description.textContent =
            categoryInfo[selectedCategory].description;

        heading.textContent =
            categoryInfo[selectedCategory].title;
    }


    function displayPlants(searchText = "") {

        // ONLY plants added by Admin for this category
        let filteredPlants = plants.filter(function (plant) {

            return (
                plant.active !== false &&
                plant.category === selectedCategory
            );

        });


        // Search
        searchText = searchText.toLowerCase().trim();

        if (searchText !== "") {

            filteredPlants = filteredPlants.filter(function (plant) {

                return (
                    String(plant.name || "")
                        .toLowerCase()
                        .includes(searchText)
                );

            });

        }


        // Show count
        count.textContent =
            filteredPlants.length + " plants";


        // No plants
        if (filteredPlants.length === 0) {

            grid.innerHTML = "";

            noPlants.style.display = "block";

            return;
        }


        noPlants.style.display = "none";


        // Display Admin-added plants
        grid.innerHTML = filteredPlants.map(function (plant) {

            return `
                <div class="plant-card">

                    <div class="plant-image">

                        <img 
                            src="${plant.image || "images/greenlife-hero.png"}"
                            alt="${plant.name || "Plant"}"
                        >

                    </div>

                    <div class="plant-info">

                        <h3>${plant.name || "Unnamed Plant"}</h3>

                        <p class="plant-category">
                            ${plant.category}
                        </p>

                        <div class="plant-bottom">

                            <strong>₹${Number(plant.price || 0).toLocaleString("en-IN")}</strong>

                            <button 
                                onclick="addToCart('${plant.id}')"
                                ${Number(plant.stock) <= 0 ? "disabled" : ""}
                            >
                                ${Number(plant.stock) > 0
                                    ? "Add to Cart"
                                    : "Out of Stock"}
                            </button>

                        </div>

                    </div>

                </div>
            `;

        });

    }


    // Search plants
    if (search) {

        search.addEventListener("input", function () {

            displayPlants(search.value);

        });

    }


    // First display
    displayPlants();

});