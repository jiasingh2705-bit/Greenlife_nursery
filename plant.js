document.addEventListener("DOMContentLoaded", function () {

    const params = new URLSearchParams(window.location.search);

    const plantId = params.get("id");

    const container = document.getElementById("plantDetails");

    if (!plantId) {
        container.innerHTML = `
            <div class="plant-not-found">
                <h2>Plant not found 🌱</h2>
                <p>Please go back and select a plant.</p>
                <a href="index.html" class="back-button">
                    ← Back to Home
                </a>
            </div>
        `;
        return;
    }


    const plants = JSON.parse(
        localStorage.getItem("greenlifePlants") || "[]"
    );


    const plant = plants.find(function (item) {

        return String(item.id) === String(plantId);

    });


    if (!plant || plant.active === false) {

        container.innerHTML = `
            <div class="plant-not-found">

                <div class="not-found-icon">🌱</div>

                <h2>Plant Not Found</h2>

                <p>
                    This plant may have been removed or is currently unavailable.
                </p>

                <a href="index.html" class="back-button">
                    ← Browse Plants
                </a>

            </div>
        `;

        return;
    }


    const stockAvailable = Number(plant.stock || 0) > 0;


    container.innerHTML = `

        <div class="plant-breadcrumb">

            <a href="index.html">Home</a>

            <span>›</span>

            <a href="category.html?category=${encodeURIComponent(plant.category)}">
                ${escapePlantText(plant.category)}
            </a>

            <span>›</span>

            <span>${escapePlantText(plant.name)}</span>

        </div>


        <section class="plant-detail-card">


            <!-- IMAGE -->

            <div class="plant-detail-image">

                ${
                    plant.image
                    ?
                    `<img
                        src="${plant.image}"
                        alt="${escapePlantText(plant.name)}"
                    >`
                    :
                    `<div class="no-image">
                        🌱
                    </div>`
                }

            </div>


            <!-- INFORMATION -->

            <div class="plant-detail-info">

                ${
                    plant.popular
                    ?
                    `<span class="detail-badge">
                        ⭐ Popular Plant
                    </span>`
                    :
                    ""
                }


                <p class="detail-category">
                    ${escapePlantText(plant.category)}
                </p>


                <h1>
                    ${escapePlantText(plant.name)}
                </h1>


                <div class="detail-rating">
                    ★★★★★
                    <span>GreenLife Nursery</span>
                </div>


                <div class="detail-price">

                    ₹${Number(plant.price || 0).toLocaleString("en-IN")}

                </div>


                <div class="detail-stock">

                    ${
                        stockAvailable
                        ?
                        `✓ In Stock — ${plant.stock} available`
                        :
                        `✕ Currently Out of Stock`
                    }

                </div>


                <div class="plant-description">

                    <h3>About this plant</h3>

                    <p>
                        Add natural beauty and freshness to your home
                        with this carefully selected plant from
                        GreenLife Nursery.
                    </p>

                </div>


                <div class="plant-actions">

                   ${
    stockAvailable
    ?
    `<button
        class="detail-cart-btn"
        onclick="addToCart('${plant.id}')"
    >
        🛒 Add to Cart
    </button>`
    :
    `<button
        class="notify-btn"
        onclick="notifyWhenAvailable('${plant.id}')"
    >
        🔔 Notify Me When Available
    </button>`
}

                    <button
                        class="continue-btn"
                        onclick="location.href='index.html'"
                    >

                        Continue Shopping

                    </button>

                </div>


                <div class="plant-benefits">

                    <div>
                        🌱
                        <span>
                            <b>Healthy Plants</b>
                            <small>Carefully selected</small>
                        </span>
                    </div>

                    <div>
                        🚚
                        <span>
                            <b>Safe Delivery</b>
                            <small>Carefully packed</small>
                        </span>
                    </div>

                    <div>
                        ₹
                        <span>
                            <b>Affordable</b>
                            <small>Fair prices</small>
                        </span>
                    </div>

                </div>

            </div>

        </section>

    `;

});


function escapePlantText(value) {

    return String(value ?? "").replace(
        /[&<>"']/g,
        function (match) {

            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"

            }[match];

        }
    );

}
function notifyWhenAvailable(plantId) {

    const email = localStorage.getItem("greenlifeCurrentUser");

    if (!email) {
        alert("Please login first to receive stock notifications.");
        window.location.href = "login.html";
        return;
    }

    let notifications = JSON.parse(
        localStorage.getItem("greenlifeStockNotifications") || "[]"
    );

    const alreadyAdded = notifications.some(function (item) {
        return item.plantId === plantId &&
               item.user === email;
    });

    if (alreadyAdded) {
        alert("You are already subscribed for this plant.");
        return;
    }

    notifications.push({
        plantId: plantId,
        user: email,
        date: new Date().toISOString()
    });

    localStorage.setItem(
        "greenlifeStockNotifications",
        JSON.stringify(notifications)
    );

    alert("🔔 You will be notified when this plant is back in stock!");
}