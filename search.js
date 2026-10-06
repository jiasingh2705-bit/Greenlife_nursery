document.addEventListener("DOMContentLoaded", function () {

    const input = document.getElementById("searchPageInput");
    const resultsBox = document.getElementById("searchResults");
    const countBox = document.getElementById("searchCount");
    const heading = document.getElementById("searchHeading");
    const noResults = document.getElementById("noSearchResults");

    const plants = JSON.parse(
        localStorage.getItem("greenlifePlants") || "[]"
    );


    function escapeHtml(value) {

        return String(value || "").replace(/[&<>"']/g, function (char) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];

        });

    }


    function getSearchQuery() {

        const params =
            new URLSearchParams(window.location.search);

        return params.get("query") || "";

    }


    function searchPlants(query) {

        query = query.toLowerCase().trim();

        if (query === "") {
            return [];
        }


        const words = query.split(/\s+/);


        return plants.filter(function (plant) {

            if (plant.active === false) {
                return false;
            }


            const searchableText = (

                String(plant.name || "") +
                " " +
                String(plant.category || "")

            ).toLowerCase();


            /*
                Every searched word should have
                some match in the plant information.
            */

            return words.every(function (word) {

                return searchableText.includes(word);

            });

        });

    }


    function displayResults(query) {

        const results = searchPlants(query);


        heading.textContent =
            query
                ? 'Search results for "' + query + '"'
                : "Search Plants";


        countBox.textContent =
            results.length + " plants";


        if (results.length === 0) {

            resultsBox.innerHTML = "";

            noResults.style.display = "block";

            return;

        }


        noResults.style.display = "none";


        resultsBox.innerHTML = results.map(function (plant) {

            return `

                <div class="plant-card">

                    <div class="plant-image">

                        <img
                            src="${escapeHtml(
                                plant.image ||
                                "images/greenlife-hero.png"
                            )}"
                            alt="${escapeHtml(plant.name)}"
                        >

                    </div>


                    <div class="plant-info">

                        <h3>
                            ${escapeHtml(plant.name)}
                        </h3>


                        <p class="plant-category">
                            ${escapeHtml(plant.category)}
                        </p>


                        <div class="plant-bottom">

                            <strong>
                                ₹${Number(
                                    plant.price || 0
                                ).toLocaleString("en-IN")}
                            </strong>


                            <button
                                onclick="openPlant('${plant.id}')">

                                View Plant

                            </button>

                        </div>

                    </div>

                </div>

            `;

        }).join("");

    }


    /*
        When user types directly on the
        search page, update the URL and results.
    */

    input.addEventListener("input", function () {

        const query =
            input.value.trim();


        const newUrl =
            query
                ? "search.html?query=" +
                  encodeURIComponent(query)
                : "search.html";


        window.history.replaceState(
            {},
            "",
            newUrl
        );


        displayResults(query);

    });


    /*
        Open the exact plant.
    */

    window.openPlant = function (plantId) {

        window.location.href =
            "plant.html?id=" +
            encodeURIComponent(plantId);

    };


    /*
        Load search from homepage.
    */

    const initialQuery =
        getSearchQuery();


    if (initialQuery) {

        input.value = initialQuery;

        displayResults(initialQuery);

    }

});