// ===============================
// GREENLIFE ADMIN PANEL
// ===============================

// Protect Admin page
if (localStorage.getItem("greenlifeAdmin") !== "true") {
    location.href = "admin-login.html";
}

// Shared plant data
let plants = JSON.parse(localStorage.getItem("greenlifePlants") || "[]");
let imageData = "";

const $ = (id) => document.getElementById(id);


// ===============================
// SAVE PLANTS
// ===============================

function save() {
    localStorage.setItem("greenlifePlants", JSON.stringify(plants));
}


// ===============================
// PANEL NAVIGATION
// ===============================

function showPanel(id) {

    document.querySelectorAll(".panel").forEach((panel) => {
        panel.classList.remove("active");
    });

    const selectedPanel = $(id);

    if (selectedPanel) {
        selectedPanel.classList.add("active");
    }

    document.querySelectorAll(".side").forEach((button) => {
        button.classList.remove("active");
    });

    if (window.event && window.event.currentTarget) {
        window.event.currentTarget.classList.add("active");
    }

    const titles = {
        dashboard: "Dashboard",
        plants: "Manage Plants",
        orders: "Orders",
        users: "Customers",
        reports: "Reports",
        settings: "Settings"
    };

    $("pageTitle").textContent = titles[id] || "Dashboard";

    if (id === "dashboard") renderDashboard();
    if (id === "plants") renderPlants();
    if (id === "orders") renderOrders();
    if (id === "users") renderUsers();
    if (id === "reports") renderReports();
}


// ===============================
// ADD PLANT FORM
// ===============================

function openPlantForm() {

    $("plantForm").classList.remove("hidden");

    $("editId").value = "";
    $("pName").value = "";
    $("pCategory").value = "Indoor Plants";
    $("pPrice").value = "";
    $("pCost").value = "";
    $("pStock").value = "";
    $("pDesc").value = "";

    $("pPopular").checked = false;
    $("pActive").checked = true;

    $("preview").innerHTML = "";

    $("pImage").value = "";

    imageData = "";
}


function closePlantForm() {
    $("plantForm").classList.add("hidden");
}


// ===============================
// IMAGE PREVIEW
// ===============================

$("pImage").addEventListener("change", function (e) {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {

        imageData = reader.result;

        $("preview").innerHTML = `
            <img
                src="${imageData}"
                style="
                    width:120px;
                    height:80px;
                    object-fit:cover;
                    border-radius:7px;
                    margin:10px 0;
                "
            >
        `;
    };

    reader.readAsDataURL(file);
});


// ===============================
// SAVE PLANT
// ===============================

function savePlant() {

    const name = $("pName").value.trim();
    const category = $("pCategory").value;
    const price = Number($("pPrice").value);
    const cost = Number($("pCost").value || 0);
    const stock = Number($("pStock").value);

    // Validation
    if (!name) {
        alert("Please enter plant name.");
        return;
    }

    if (!price || price <= 0) {
        alert("Please enter a valid selling price.");
        return;
    }

    if (stock < 0 || isNaN(stock)) {
        alert("Please enter valid stock.");
        return;
    }

    const id =
        $("editId").value ||
        "plant_" + Date.now();

    const oldPlant = plants.find((plant) => plant.id === id);

    const plant = {

        id: id,

        name: name,

        category: category,

        price: price,

        cost: cost,

        stock: stock,

        description: $("pDesc").value.trim(),

        popular: $("pPopular").checked,

        active: $("pActive").checked,

        image: imageData || oldPlant?.image || ""

    };

    // Edit existing plant
    if (oldPlant) {

        plants = plants.map((item) => {
            return item.id === id ? plant : item;
        });

    }

    // Add new plant
    else {

        plants.push(plant);

    }

    // Save to LocalStorage
    save();

    closePlantForm();

    renderPlants();

    renderDashboard();

    renderReports();

    alert("Plant saved successfully! 🌿");
}


// ===============================
// DISPLAY PLANTS
// ===============================

function renderPlants() {

    if (!plants.length) {

        $("adminPlants").innerHTML = `
            <p>No plants available.</p>
        `;

        return;
    }

    $("adminPlants").innerHTML = plants.map((plant) => {

        const status = plant.active !== false
            ? "Active"
            : "Inactive";

        return `
            <div class="admin-plant">

                <img
                    src="${plant.image || "images/greenlife-hero.png"}"
                    alt="${plant.name}"
                >

                <div class="inside">

                    <h3>${plant.name}</h3>

                    <p>
                        ${plant.category}
                        • ₹${plant.price}
                    </p>

                    <p>
                        Stock: ${plant.stock}
                    </p>

                    <p>
                        Status: ${status}
                        ${plant.popular ? " • ⭐ Popular" : ""}
                    </p>

                    <div class="admin-actions">

                        <button
                            class="edit"
                            onclick="editPlant('${plant.id}')"
                        >
                            Edit
                        </button>

                        <button
                            class="danger"
                            onclick="deletePlant('${plant.id}')"
                        >
                            Delete
                        </button>

                    </div>

                </div>

            </div>
        `;

    }).join("");
}


// ===============================
// EDIT PLANT
// ===============================

function editPlant(id) {

    const plant = plants.find((item) => item.id === id);

    if (!plant) return;

    openPlantForm();

    $("editId").value = plant.id;

    $("pName").value = plant.name;

    $("pCategory").value = plant.category;

    $("pPrice").value = plant.price;

    $("pCost").value = plant.cost || "";

    $("pStock").value = plant.stock;

    $("pDesc").value = plant.description || "";

    $("pPopular").checked = !!plant.popular;

    $("pActive").checked =
        plant.active !== false;

    imageData = plant.image || "";

    if (plant.image) {

        $("preview").innerHTML = `
            <img
                src="${plant.image}"
                style="
                    width:120px;
                    height:80px;
                    object-fit:cover;
                    border-radius:7px;
                    margin:10px 0;
                "
            >
        `;

    }
}


// ===============================
// DELETE PLANT
// ===============================

function deletePlant(id) {

    const plant = plants.find((item) => item.id === id);

    if (!plant) return;

    const confirmDelete = confirm(
        `Delete "${plant.name}"?`
    );

    if (!confirmDelete) return;

    plants = plants.filter(
        (item) => item.id !== id
    );

    save();

    renderPlants();

    renderDashboard();

    renderReports();

    alert("Plant deleted successfully.");
}


// ===============================
// DASHBOARD
// ===============================

function renderDashboard() {

    const orders =
        JSON.parse(
            localStorage.getItem("greenlifeOrders") || "[]"
        );

    const users =
        JSON.parse(
            localStorage.getItem("greenlifeUsers") || "[]"
        );


    // Total sales
    const sales = orders.reduce(
        (total, order) =>
            total + Number(order.total || 0),
        0
    );


    // Total stock
    const totalStock = plants.reduce(
        (total, plant) =>
            total + Number(plant.stock || 0),
        0
    );


    // Low stock
    const lowStock = plants.filter(
        (plant) =>
            Number(plant.stock || 0) <= 5 &&
            plant.active !== false
    ).length;


    // Dashboard cards
    $("stats").innerHTML = `

        <div class="stat">
            <span>Total Sales</span>
            <b>₹${sales.toLocaleString("en-IN")}</b>
        </div>

        <div class="stat">
            <span>Total Orders</span>
            <b>${orders.length}</b>
        </div>

        <div class="stat">
            <span>Total Customers</span>
            <b>${users.length}</b>
        </div>

        <div class="stat">
            <span>Total Plants</span>
            <b>${plants.length}</b>
        </div>

        <div class="stat">
            <span>Total Stock</span>
            <b>${totalStock}</b>
        </div>

        <div class="stat">
            <span>Low Stock</span>
            <b>${lowStock}</b>
        </div>

    `;


    // ==========================
    // ORDER PIE CHART
    // ==========================

    const counts = {
        Pending: 0,
        Delivered: 0,
        Cancelled: 0
    };

    orders.forEach((order) => {

        const status = order.status || "Pending";

        counts[status] =
            (counts[status] || 0) + 1;

    });


    const orderTotal =
        Math.max(orders.length, 1);


    const pending =
        counts.Pending / orderTotal * 100;

    const delivered =
        pending +
        counts.Delivered / orderTotal * 100;


    $("orderPie").style.background =
        `conic-gradient(
            #238457 0 ${pending}%,
            #e2ad50 ${pending}% ${delivered}%,
            #d46d66 ${delivered}% 100%
        )`;


    $("orderLegend").innerHTML = `
        Pending: ${counts.Pending}
        • Delivered: ${counts.Delivered}
        • Cancelled: ${counts.Cancelled}
    `;


    // ==========================
    // CATEGORY PIE CHART
    // ==========================

    const categories = {};

    plants.forEach((plant) => {

        const category =
            plant.category || "Other";

        categories[category] =
            (categories[category] || 0) + 1;

    });


    const values =
        Object.values(categories);

    const totalCategories =
        values.reduce(
            (total, value) =>
                total + value,
            0
        ) || 1;


    let start = 0;

    const chartColors = [
        "#238457",
        "#4f9a72",
        "#e2ad50",
        "#d46d66",
        "#6c83b4",
        "#9b78b4"
    ];

    const parts = [];


    Object.entries(categories)
        .forEach(([category, value], index) => {

            const end =
                start +
                value / totalCategories * 100;

            parts.push(
                `${chartColors[index % chartColors.length]}
                ${start}% ${end}%`
            );

            start = end;

        });


    if (parts.length) {

        $("catPie").style.background =
            `conic-gradient(
                ${parts.join(",")}
            )`;

    }


    $("catLegend").textContent =
        Object.entries(categories)
            .map(
                ([category, count]) =>
                    `${category}: ${count}`
            )
            .join(" • ");


    // ==========================
    // RECENT ORDERS
    // ==========================

    $("recentOrders").innerHTML =

        orders
            .slice(-5)
            .reverse()
            .map(
                (order) => `

                <div class="table-row">

                    <span>${order.id || "-"}</span>

                    <span>${order.user || "Customer"}</span>

                    <span>
                        ₹${Number(order.total || 0)}
                    </span>

                    <span>
                        ${order.status || "Pending"}
                    </span>

                </div>

                `
            )
            .join("")

        ||

        "<p>No orders yet.</p>";
}


// ===============================
// ORDERS
// ===============================

function renderOrders() {

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    if (!orders.length) {
        $("ordersTable").innerHTML = `
            <div class="empty-orders">
                <div>📦</div>
                <h3>No orders yet</h3>
                <p>Customer orders will appear here.</p>
            </div>
        `;
        return;
    }

    $("ordersTable").innerHTML = `

        <div class="orders-list">

            ${orders.slice().reverse().map(function(order) {

                const status = order.status || "Pending";

                return `
                    <div class="admin-order-card">

                        <div class="order-main">

                            <div>
                                <span class="order-label">
                                    ORDER ID
                                </span>

                                <h3>${order.id || "-"}</h3>

                                <p>
                                    👤 ${order.user || "Customer"}
                                </p>

                                <small>
                                    ${order.date || "-"}
                                </small>
                            </div>

                            <div class="order-right">

                                <strong>
                                    ₹${Number(order.total || 0)
                                        .toLocaleString("en-IN")}
                                </strong>

                                <span class="order-status ${status
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}">
                                    ${status}
                                </span>

                                <button
                                    class="green-btn"
                                    onclick="viewOrderDetails('${order.id}')"
                                >
                                    View Details
                                </button>

                            </div>

                        </div>

                    </div>
                `;

            }).join("")}

        </div>
    `;
}


// ===============================
// CUSTOMERS
// ===============================

function renderUsers() {

    const users =
        JSON.parse(
            localStorage.getItem("greenlifeUsers") || "[]"
        );


    if (!users.length) {

        $("usersTable").innerHTML =
            "<p>No customers yet.</p>";

        return;
    }


    $("usersTable").innerHTML =

        users.map(
            (user) => `

            <div class="table-row">

                <span>
                    ${user.name || "-"}
                </span>

                <span>
                    ${user.email || "-"}
                </span>

                <span>
                    ${user.mobile || "-"}
                </span>

                <span>
                    Customer
                </span>

            </div>

            `
        ).join("");
}


// ===============================
// REPORTS
// ===============================

function renderReports() {

    const orders =
        JSON.parse(
            localStorage.getItem("greenlifeOrders") || "[]"
        );

    const users =
        JSON.parse(
            localStorage.getItem("greenlifeUsers") || "[]"
        );


    const sales =
        orders.reduce(
            (total, order) =>
                total + Number(order.total || 0),
            0
        );


    const stock =
        plants.reduce(
            (total, plant) =>
                total + Number(plant.stock || 0),
            0
        );


    $("reportSales").textContent =
        "₹" +
        sales.toLocaleString("en-IN");


    $("reportOrders").textContent =
        orders.length;


    $("reportUsers").textContent =
        users.length;


    $("reportStock").textContent =
        stock;
}

// ===============================
// ORDER DETAILS
// ===============================

function viewOrderDetails(orderId) {

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    const order = orders.find(function(item) {
        return String(item.id) === String(orderId);
    });

    if (!order) {
        alert("Order not found.");
        return;
    }

    const users = JSON.parse(
        localStorage.getItem("greenlifeUsers") || "[]"
    );

    const customer = users.find(function(user) {
        return String(user.email || "").toLowerCase() ===
               String(order.user || "").toLowerCase();
    });

    const customerName =
        customer?.name || order.user || "Customer";

    const customerEmail =
        customer?.email || order.user || "-";

    const customerPhone =
        customer?.phone || customer?.mobile || "-";

    const items = order.items || [];

    const subtotal = items.reduce(function(total, item) {
        return total +
            Number(item.price || 0) *
            Number(item.qty || 1);
    }, 0);

    $("ordersTable").innerHTML = `

        <div class="order-details">

            <button
                class="back-orders"
                onclick="renderOrders()"
            >
                ← Back to Orders
            </button>


            <div class="order-detail-header">

                <div>
                    <span class="order-label">
                        ORDER DETAILS
                    </span>

                    <h2>${order.id || "-"}</h2>

                    <p>
                        Placed on ${order.date || "-"}
                    </p>
                </div>

                <span class="order-status ${
                    String(order.status || "Pending")
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                }">
                    ${order.status || "Pending"}
                </span>

            </div>


            <!-- CUSTOMER -->

            <div class="detail-box">

                <h3>👤 Customer Information</h3>

                <div class="customer-grid">

                    <div>
                        <small>Name</small>
                        <strong>${customerName}</strong>
                    </div>

                    <div>
                        <small>Email</small>
                        <strong>${customerEmail}</strong>
                    </div>

                    <div>
                        <small>Mobile</small>
                        <strong>${customerPhone}</strong>
                    </div>

                    <div>
                        <small>Payment Method</small>
                        <strong>${order.payment || "-"}</strong>
                    </div>

                </div>

            </div>


            <!-- DELIVERY -->

            <div class="detail-box">

                <h3>📍 Delivery Address</h3>

                <p class="delivery-address">
                    ${order.address || "Address not provided"}
                </p>

            </div>


            <!-- ITEMS -->

            <div class="detail-box">

                <h3>🌱 Ordered Plants</h3>

                <div class="ordered-items">

                    ${
                        items.length
                        ?
                        items.map(function(item) {

                            const plant = plants.find(function(p) {
                                return String(p.id) === String(item.id);
                            });

                            return `
                                <div class="ordered-item">

                                    <div class="ordered-item-info">

                                        ${
                                            item.image
                                            ?
                                            `<img
                                                src="${item.image}"
                                                alt="${item.name || "Plant"}"
                                            >`
                                            :
                                            `<div class="order-no-image">
                                                🌱
                                            </div>`
                                        }

                                        <div>
                                            <strong>
                                                ${item.name || "Plant"}
                                            </strong>

                                            <small>
                                                ${
                                                    plant?.category ||
                                                    "Plant"
                                                }
                                            </small>
                                        </div>

                                    </div>

                                    <div class="ordered-item-price">

                                        <span>
                                            Qty: ${item.qty || 1}
                                        </span>

                                        <strong>
                                            ₹${
                                                (
                                                    Number(item.price || 0) *
                                                    Number(item.qty || 1)
                                                ).toLocaleString("en-IN")
                                            }
                                        </strong>

                                    </div>

                                </div>
                            `;

                        }).join("")
                        :
                        "<p>No items found.</p>"
                    }

                </div>

            </div>


            <!-- TOTAL -->

            <div class="detail-box order-summary">

                <h3>💰 Order Summary</h3>

                <div class="summary-row">
                    <span>Subtotal</span>
                    <strong>
                        ₹${subtotal.toLocaleString("en-IN")}
                    </strong>
                </div>

                <div class="summary-row">
                    <span>Delivery</span>
                    <strong>
                        ₹${Number(order.deliveryCharge || 0)
                            .toLocaleString("en-IN")}
                    </strong>
                </div>

                <div class="summary-row">
                    <span>Discount</span>
                    <strong>
                        -₹${Number(order.discount || 0)
                            .toLocaleString("en-IN")}
                    </strong>
                </div>

                <div class="summary-total">
                    <span>Grand Total</span>
                    <strong>
                        ₹${Number(order.total || 0)
                            .toLocaleString("en-IN")}
                    </strong>
                </div>

            </div>


            <!-- STATUS -->

           <div class="detail-box">
    <h3>🚚 Expected Delivery</h3>

    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
        <input
            type="date"
            id="expectedDeliveryInput"
            value="${order.expectedDelivery || ''}"
            style="padding:11px 14px; border:1px solid #d8e2dc; border-radius:10px;"
        >

        <button
            onclick="saveExpectedDelivery('${order.id}')"
            style="padding:11px 18px; border:0; border-radius:10px; background:#145b3a; color:white; cursor:pointer;"
        >
            💾 Save Delivery Date
        </button>
    </div>

    <p style="margin-top:10px; color:#718078; font-size:13px;">
        Customer will see this date in My Orders.
    </p>
</div> <div class="detail-box">

                <h3>📦 Update Order Status</h3>

                <div class="order-status-actions">

                    <button
                        onclick="updateOrderStatus('${order.id}', 'Confirmed')"
                    >
                        ✓ Confirm
                    </button>

                    <button
                        onclick="updateOrderStatus('${order.id}', 'Processing')"
                    >
                        ⚙ Processing
                    </button>

                    <button
                        onclick="updateOrderStatus('${order.id}', 'Shipped')"
                    >
                        🚚 Shipped
                    </button>

                    <button
                        onclick="updateOrderStatus('${order.id}', 'Delivered')"
                    >
                        ✓ Delivered
                    </button>

                    <button
                        class="cancel-order-btn"
                        onclick="updateOrderStatus('${order.id}', 'Cancelled')"
                    >
                        ✕ Cancel Order
                    </button>

                </div>

            </div>

        </div>
    `;
}

// ===============================
// LOGOUT
// ===============================

function logoutAdmin() {

    localStorage.removeItem(
        "greenlifeAdmin"
    );

    location.href =
        "admin-login.html";
}


// ===============================
// START DASHBOARD
// ===============================

renderDashboard();
// ===============================
// UPDATE ORDER STATUS
// ===============================

function updateOrderStatus(orderId, status) {

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    const order = orders.find(function(order) {
        return String(order.id) === String(orderId);
    });

    if (!order) {
        alert("Order not found.");
        return;
    }

    // Change status
    order.status = status;

    // Save updated orders
    localStorage.setItem(
        "greenlifeOrders",
        JSON.stringify(orders)
    );

    // Refresh dashboard data
    renderDashboard();

    // Refresh reports
    renderReports();

    // Show updated order list
    renderOrders();

    alert("Order status updated to " + status + " ✓");
}
function saveExpectedDelivery(orderId) {

    const input = document.getElementById("expectedDeliveryInput");

    if (!input || !input.value) {
        alert("Please select an expected delivery date.");
        return;
    }

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    const order = orders.find(function(item) {
        return String(item.id) === String(orderId);
    });

    if (!order) {
        alert("Order not found.");
        return;
    }

    const selectedDate = new Date(input.value + "T00:00:00");

    order.expectedDelivery = selectedDate.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

    localStorage.setItem(
        "greenlifeOrders",
        JSON.stringify(orders)
    );

    alert("Expected delivery date saved successfully.");

    viewOrderDetails(orderId);
}