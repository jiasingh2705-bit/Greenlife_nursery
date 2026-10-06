let plants = JSON.parse(localStorage.getItem("greenlifePlants") || "[]");
let cart = JSON.parse(localStorage.getItem("greenlifeCart") || "[]");
let currentCategory = "All";

const starterPlants = [
  {id:"demo1",name:"Rose Plant",category:"Flowering",price:99,stock:20,image:"images/red-rose.jpg",popular:true,active:true},
  {id:"demo2",name:"Money Plant",category:"Indoor",price:149,stock:15,image:"images/indoor.jpg",popular:true,active:true},
  {id:"demo3",name:"Tulsi Plant",category:"Medicinal",price:59,stock:30,image:"images/tulsi.jpg",popular:true,active:true},
  {id:"demo4",name:"Hibiscus Plant",category:"Flowering",price:129,stock:18,image:"images/hisbiscus.jpg",popular:true,active:true},
  {id:"demo5",name:"Snake Plant",category:"Indoor",price:199,stock:12,image:"images/snake.jpg",popular:true,active:true},
  {id:"demo6",name:"Areca Palm",category:"Outdoor",price:179,stock:14,image:"images/mogra.jpg",popular:true,active:true}
];
if (!plants.length) {
  plants = starterPlants;
  localStorage.setItem("greenlifePlants", JSON.stringify(plants));
}

function saveCart(){localStorage.setItem("greenlifeCart",JSON.stringify(cart));updateCart();}
function money(n){return "₹"+Number(n).toLocaleString("en-IN");}
function showToast(msg){const t=document.getElementById("toast");if(!t)return;t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200);}
function loggedIn(){return localStorage.getItem("greenlifeLoggedIn")==="true";}

function productCard(p){
  const badge=p.popular?'<span class="badge">Popular</span>':'';
  const stock=p.stock>0?`<span class="stock">${p.stock} left</span>`:'<span class="stock">Out of stock</span>';
  return `<article class="product-card">
    ${badge}<button class="wish" onclick="this.classList.toggle('liked')">♡</button>
    <img class="product-img" src="${p.image||'images/greenlife-hero.png'}" alt="${escapeHtml(p.name)}">
    <div class="product-body">
      <h3>${escapeHtml(p.name)}</h3>
      <p>${escapeHtml(p.category)} ${stock}</p>
      <div class="price">${money(p.price)}</div>
      <button class="add" ${p.stock<=0?'disabled':''} onclick="addToCart('${p.id}')">${p.stock>0?'Add to Cart':'Out of Stock'}</button>
    </div>
  </article>`;
}
function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

function renderPlants() {

    // Get latest plants from Admin/localStorage
    plants = JSON.parse(
        localStorage.getItem("greenlifePlants") || "[]"
    );

    const searchInput =
        document.getElementById("searchInput");

    const searchText =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const filtered = plants.filter(function (plant) {

        // Hide inactive plants
        if (plant.active === false) {
            return false;
        }

        // Category filter
        if (
            currentCategory !== "All" &&
            plant.category !== currentCategory
        ) {
            return false;
        }

        // Search by plant name OR category
        if (searchText !== "") {

            const name =
                String(plant.name || "").toLowerCase();

            const category =
                String(plant.category || "").toLowerCase();

            if (
                !name.includes(searchText) &&
                !category.includes(searchText)
            ) {
                return false;
            }
        }

        return true;

    });


    const grid =
        document.getElementById("productGrid");


    if (grid) {

        if (filtered.length === 0) {

            grid.innerHTML = `
                <div class="empty"
                     style="grid-column:1/-1;
                            text-align:center;
                            padding:50px;
                            color:#718078;">
                    No plants found 🌱
                </div>
            `;

        } else {

            grid.innerHTML =
                filtered.map(productCard).join("");

        }

    }


    // Popular Plants
    const popular =
        plants.filter(function (plant) {

            return (
                plant.active !== false &&
                plant.popular === true
            );

        });


    const popularBox =
        document.getElementById("popularPlants");


    if (popularBox) {

        popularBox.innerHTML =
            popular.length
                ? popular.map(productCard).join("")
                : `
                    <div style="padding:30px;color:#718078">
                        No popular plants available.
                    </div>
                  `;

    }

}
function filterCategory(c){
  currentCategory=c;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.textContent.trim()===c));
  renderPlants();
  document.getElementById("plants")?.scrollIntoView({behavior:"smooth"});
}
function addToCart(id){
  if(!loggedIn()){
    localStorage.setItem("greenlifePendingCart",id);
    location.href="register.html";
    return;
  }
  const p=plants.find(x=>x.id===id);if(!p||p.stock<=0)return;
  const item=cart.find(x=>x.id===id);
  if(item)item.qty++;
  else cart.push({id:p.id,name:p.name,price:p.price,image:p.image,qty:1});
  saveCart();showToast("Added to cart");
}
function updateCart(){
  const count=cart.reduce((a,b)=>a+b.qty,0);
  const cc=document.getElementById("cartCount");if(cc)cc.textContent=count;
  const box=document.getElementById("cartItems");if(!box)return;
  box.innerHTML=cart.length?cart.map((x,i)=>`<div class="cart-item"><div class="cart-item-info"><b>${escapeHtml(x.name)}</b><small>${money(x.price)} × ${x.qty}</small></div><button class="remove" onclick="removeCart(${i})">Remove</button></div>`).join(""):'<p style="padding:25px 0;color:#718078">Your cart is empty.</p>';
  const total=cart.reduce((a,b)=>a+b.price*b.qty,0);document.getElementById("cartTotal").textContent=money(total);
}
function removeCart(i){cart.splice(i,1);saveCart();}
function openCart(){document.getElementById("cartPanel").classList.add("open");updateCart();}
function closeCart(){document.getElementById("cartPanel").classList.remove("open");}
function checkout(){
  if(!cart.length)return showToast("Your cart is empty");
  const address=prompt("Enter delivery address:");
  if(!address)return;
  const method=prompt("Payment method: UPI / Cash / Card","UPI")||"UPI";
  const total=cart.reduce((a,b)=>a+b.price*b.qty,0);
  const orders=JSON.parse(localStorage.getItem("greenlifeOrders")||"[]");
  orders.push({
    id: "GL" + Date.now(),
    user: localStorage.getItem("greenlifeCurrentUser") || "Guest",
    userId: localStorage.getItem("greenlifeCurrentUserId") || "",
    items: cart,
    total: total,
    address: address,
    payment: method,
    status: "Pending",
    date: new Date().toLocaleString(),
    expectedDelivery: ""
});  localStorage.setItem("greenlifeOrders",JSON.stringify(orders));
  cart=[];saveCart();closeCart();showToast("Order placed successfully");
}
document.addEventListener("DOMContentLoaded", function () {

    const userEmail =
        localStorage.getItem("greenlifeCurrentUser");

    const userName =
        localStorage.getItem("greenlifeCurrentUserName");

    const accountLink =
        document.getElementById("accountLink");


    if (accountLink && loggedIn()) {

        accountLink.textContent =
            "♙ " + (userName || "My Account");

        accountLink.href = "#";

        accountLink.onclick = function (event) {

            event.preventDefault();

            openAccount();

        };

    }


    renderPlants();

    updateCart();

});/* =====================================================
   MY ACCOUNT
===================================================== */

function openAccount() {

    const panel =
        document.getElementById("accountPanel");

    if (!panel) return;

    panel.classList.add("open");

    loadAccountDetails();
}


function closeAccount() {

    const panel =
        document.getElementById("accountPanel");

    if (!panel) return;

    panel.classList.remove("open");

}


/* =====================================================
   LOAD USER DETAILS
===================================================== */

function loadAccountDetails() {

    const email =
        localStorage.getItem("greenlifeCurrentUser");

    if (!email) return;


    const users =
        JSON.parse(
            localStorage.getItem("greenlifeUsers") || "[]"
        );


    const user =
        users.find(function (u) {

            return String(u.email || "").toLowerCase() ===
                email.toLowerCase();

        });


    if (!user) return;


    document.getElementById("profileName").textContent =
        user.name || "GreenLife User";


    document.getElementById("profileEmail").textContent =
        user.email || "";


    document.getElementById("profileFullName").textContent =
        user.name || "-";


    document.getElementById("profileEmailDetail").textContent =
        user.email || "-";


    document.getElementById("profilePhone").textContent =
        user.phone || "-";


    updateAccountCartCount();

    updatePendingOrderCount();

}


/* =====================================================
   CART COUNT
===================================================== */

function updateAccountCartCount() {

    const cart =
        JSON.parse(
            localStorage.getItem("greenlifeCart") || "[]"
        );


    const count =
        cart.reduce(function (total, item) {

            return total + Number(item.qty || 1);

        }, 0);


    const element =
        document.getElementById("accountCartCount");


    if (element) {

        element.textContent = count;

    }

}


/* =====================================================
   PENDING ORDERS
===================================================== */

function updatePendingOrderCount() {

    const currentUser =
        localStorage.getItem("greenlifeCurrentUser");


    const orders =
        JSON.parse(
            localStorage.getItem("greenlifeOrders") || "[]"
        );


    const pending =
        orders.filter(function (order) {

            return (
                order.user === currentUser &&
                order.status === "Pending"
            );

        });


    const element =
        document.getElementById("pendingOrderCount");


    if (element) {

        element.textContent =
            pending.length + " pending";

    }

}

/* =====================================================
   CUSTOMER ORDERS
===================================================== */

function showOrders() {
    renderMyOrders("all");
}

function showPendingOrders() {
    renderMyOrders("pending");
}

function showOrderHistory() {
    renderMyOrders("history");
}


/* =====================================================
   RENDER MY ORDERS
===================================================== */

function renderMyOrders(filter) {

    const section = document.getElementById("myOrdersSection");

    if (!section) return;


    /* ---------- LOGIN CHECK ---------- */

    const currentUser =
        localStorage.getItem("greenlifeCurrentUser");

    if (!currentUser) {

        section.innerHTML = `
            <div class="orders-empty">

                <div class="empty-icon">🔐</div>

                <h3>Please Login</h3>

                <p>
                    Login to see your GreenLife orders.
                </p>

            </div>
        `;

        return;
    }


    /* ---------- GET ORDERS ---------- */

    const orders =
        JSON.parse(
            localStorage.getItem("greenlifeOrders") || "[]"
        );


    /* ---------- CURRENT USER ORDERS ---------- */

    let myOrders =
        orders.filter(function(order) {

            return String(order.user || "").toLowerCase() ===
                   String(currentUser).toLowerCase();

        });


    /* ---------- PENDING FILTER ---------- */

    if (filter === "pending") {

        myOrders =
            myOrders.filter(function(order) {

                const status =
                    order.status || "Pending";

                return ![
                    "Delivered",
                    "Cancelled"
                ].includes(status);

            });

    }


    /* ---------- HISTORY FILTER ---------- */

    if (filter === "history") {

        myOrders =
            myOrders.filter(function(order) {

                const status =
                    order.status || "";

                return [
                    "Delivered",
                    "Cancelled"
                ].includes(status);

            });

    }


    /* ---------- NEWEST FIRST ---------- */

    myOrders =
        myOrders.slice().reverse();


    /* ---------- NO ORDERS ---------- */

    if (!myOrders.length) {

        let message =
            "Your orders will appear here after you place an order.";

        if (filter === "pending") {

            message =
                "You don't have any pending orders.";

        }

        if (filter === "history") {

            message =
                "You don't have any completed orders yet.";

        }


        section.innerHTML = `
            <div class="orders-empty">

                <div class="empty-icon">📦</div>

                <h3>No Orders Found</h3>

                <p>${message}</p>

            </div>
        `;

        return;
    }


    /* =================================================
       ORDERS HEADING
    ================================================= */

    section.innerHTML = `

        <div class="orders-heading">

            <div>

                <span>GREENLIFE</span>

                <h2>
                    ${
                        filter === "pending"
                            ? "Pending Orders"
                            : filter === "history"
                                ? "Order History"
                                : "My Orders"
                    }
                </h2>

            </div>


            <div class="order-count">

                ${myOrders.length}

                <small>
                    Order${myOrders.length === 1 ? "" : "s"}
                </small>

            </div>

        </div>


        <div class="orders-list">

            ${
                myOrders.map(function(order) {

                    const status =
                        order.status || "Pending";


                    const statusClass =
                        status
                            .toLowerCase()
                            .replace(/\s+/g, "-");


                    /* ---------- ITEM COUNT ---------- */

                    const itemCount =
                        (order.items || []).reduce(
                            function(total, item) {

                                return total +
                                    Number(item.qty || 1);

                            },
                            0
                        );


                    /* ---------- RECEIPT BUTTON ---------- */

                    const showReceipt =
                        [
                            "Confirmed",
                            "Processing",
                            "Shipped",
                            "Delivered"
                        ].includes(status);


                    return `

                     

   
            
    

                            <!-- ORDER INFORMATION -->

                            <div class="customer-order-info">


                                <div>

                                    <small>
                                        Order Date
                                    </small>

                                    <strong>
                                        ${escapeHtml(order.date || "-")}
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        Items
                                    </small>

                                    <strong>
                                        ${itemCount}
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        Total Amount
                                    </small>

                                    <strong>
                                        ₹${Number(
                                            order.total || 0
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                </div>


                                <div>

                                    <small>
                                        Expected Delivery
                                    </small>

                                    <strong>
                                        ${
                                            order.expectedDelivery
                                                ? escapeHtml(
                                                    order.expectedDelivery
                                                  )
                                                : "Not updated yet"
                                        }
                                    </strong>

                                </div>


                            </div>


                            <!-- PLANTS -->

                            <div class="customer-order-plants">

                                ${
                                    (order.items || [])
                                        .map(function(item) {

                                            return `

                                                <div class="mini-order-item">

                                                    <span>
                                                        🌱
                                                    </span>

                                                    <div>

                                                        <strong>
                                                            ${escapeHtml(
                                                                item.name ||
                                                                "Plant"
                                                            )}
                                                        </strong>

                                                        <small>
                                                            Qty:
                                                            ${Number(
                                                                item.qty || 1
                                                            )}
                                                        </small>

                                                    </div>

                                                </div>

                                            `;

                                        })
                                        .join("")
                                }

                            </div>


                            <!-- ACTION BUTTONS -->

                            <div class="customer-order-actions">

    ${
        showReceipt
            ? `

                <button
                    class="receipt-btn"
                    onclick="generateCustomerReceipt('${String(order.id).replace(/'/g, "\\'")}')"
                >
                    📄 Download Receipt
                </button>
<button
    class="whatsapp-btn"
    onclick="sendOrderToWhatsApp('${String(order.id).replace(/'/g, "\\'")}')"
>
    💬 Send to WhatsApp
</button>
               
            `
            : ""
    }    ${
                                    order.expectedDelivery
                                        ? `

                                            <button
                                                class="track-order-btn"
                                                onclick="showCustomerOrderStatus('${String(order.id).replace(/'/g, "\\'")}')"
                                            >
                                                📦 Track Order
                                            </button>

                                        `
                                        : ""
                                }


                            </div>


                        </div>

                    `;

                }).join("")
            }

        </div>

    `;

}
/* =====================================================
   ORDER BUTTONS
===================================================== */


/* =====================================================
   LOGOUT
===================================================== */

function logoutUser() {

    const confirmLogout =
        confirm("Are you sure you want to logout?");


    if (!confirmLogout) return;


    localStorage.removeItem(
        "greenlifeLoggedIn"
    );

    localStorage.removeItem(
        "greenlifeCurrentUser"
    );

    localStorage.removeItem(
        "greenlifeCurrentUserName"
    );

    localStorage.removeItem(
        "greenlifeCurrentUserId"
    );


    closeAccount();

    window.location.href = "index.html";

}
/* =========================
   GREENLIFE SEARCH SUGGESTIONS
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchInput");
    const searchBox = document.querySelector(".search");

    if (!searchInput || !searchBox) return;

    // Create suggestion box automatically
    let suggestionBox = document.getElementById("searchSuggestions");

    if (!suggestionBox) {
        suggestionBox = document.createElement("div");
        suggestionBox.id = "searchSuggestions";
        suggestionBox.className = "search-suggestions";
        searchBox.appendChild(suggestionBox);
    }

    searchInput.addEventListener("input", function () {

        const text = searchInput.value.trim().toLowerCase();

        if (text === "") {
            suggestionBox.innerHTML = "";
            suggestionBox.classList.remove("show");
            return;
        }

        const allPlants = JSON.parse(
            localStorage.getItem("greenlifePlants") || "[]"
        );

        // Only active plants added by Admin
        const activePlants = allPlants.filter(function (plant) {
            return plant.active !== false;
        });

        const words = text.split(/\s+/);

        const matches = activePlants
            .map(function (plant) {

                const name = String(plant.name || "").toLowerCase();
                const category = String(plant.category || "").toLowerCase();

                let score = 0;

                // Exact name
                if (name === text) {
                    score += 100;
                }

                // Name starts with search
                if (name.startsWith(text)) {
                    score += 80;
                }

                // Name contains search
                if (name.includes(text)) {
                    score += 60;
                }

                // Category contains search
                if (category.includes(text)) {
                    score += 40;
                }

                // Multiple words
                words.forEach(function (word) {
                    if (word && name.includes(word)) {
                        score += 20;
                    }

                    if (word && category.includes(word)) {
                        score += 10;
                    }
                });

                return {
                    plant: plant,
                    score: score
                };
            })
            .filter(function (item) {
                return item.score > 0;
            })
            .sort(function (a, b) {
                return b.score - a.score;
            });

        // Remove duplicate plant names
        const unique = [];
        const usedNames = new Set();

        matches.forEach(function (item) {

            const name = String(item.plant.name || "");

            if (!usedNames.has(name.toLowerCase())) {
                usedNames.add(name.toLowerCase());
                unique.push(item.plant);
            }

        });

        const suggestions = unique.slice(0, 6);

        suggestionBox.innerHTML = "";

        if (suggestions.length === 0) {

            suggestionBox.innerHTML = `
                <div class="no-search-result">
                    🔍 No related plants found
                </div>
            `;

            suggestionBox.classList.add("show");
            return;
        }

        suggestions.forEach(function (plant) {

            const item = document.createElement("div");
            item.className = "search-suggestion";

            item.innerHTML = `
                <span class="suggestion-icon">🔍</span>
                <div class="suggestion-info">
                    <strong></strong>
                    <small></small>
                </div>
            `;

            item.querySelector("strong").textContent =
                plant.name || "Plant";

            item.querySelector("small").textContent =
                plant.category || "Plant";

            item.addEventListener("click", function () {

                // Open the selected plant on a separate page
                window.location.href =
                    "plant.html?id=" + encodeURIComponent(plant.id);

            });

            suggestionBox.appendChild(item);
        });

        suggestionBox.classList.add("show");
    });

    // Close suggestions when clicking somewhere else
    document.addEventListener("click", function (event) {

        if (!searchBox.contains(event.target)) {
            suggestionBox.classList.remove("show");
        }

    });

});
function renderMyOrders(filter) {
    const section = document.getElementById("myOrdersSection");

    if (!section) return;

    const currentUser = localStorage.getItem("greenlifeCurrentUser");

    if (!currentUser) {
        section.innerHTML = `
            <div class="orders-empty">
                <h3>🔐 Please login</h3>
                <p>Login to see your orders.</p>
            </div>
        `;
        return;
    }
function showOrders() {
    renderMyOrders("all");
}

function showPendingOrders() {
    renderMyOrders("pending");
}

function showOrderHistory() {
    renderMyOrders("history");
}
    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    let myOrders = orders.filter(function(order) {
        return String(order.user || "").toLowerCase() ===
               String(currentUser).toLowerCase();
    });

    if (filter === "pending") {
        myOrders = myOrders.filter(function(order) {
            return !["Delivered", "Cancelled"].includes(
                order.status || "Pending"
            );
        });
    }

    if (filter === "history") {
        myOrders = myOrders.filter(function(order) {
            return ["Delivered", "Cancelled"].includes(
                order.status || ""
            );
        });
    }

    myOrders = myOrders.slice().reverse();

    if (!myOrders.length) {
        section.innerHTML = `
            <div class="orders-empty">
                <div class="empty-icon">📦</div>
                <h3>No orders found</h3>
                <p>Your orders will appear here after you place an order.</p>
            </div>
        `;
        return;
    }

    section.innerHTML = `
        <div class="orders-heading">
            <div>
                <span>GREENLIFE</span>
                <h2>My Orders</h2>
            </div>
            <div class="order-count">
                ${myOrders.length}
                <small>Order${myOrders.length === 1 ? "" : "s"}</small>
            </div>
        </div>

        <div class="orders-list">
            ${myOrders.map(function(order) {

                const status = order.status || "Pending";

                const statusClass =
                    status.toLowerCase().replace(/\s+/g, "-");

                const itemCount = (order.items || []).reduce(
                    function(total, item) {
                        return total + Number(item.qty || 1);
                    },
                    0
                );

                return `
                    <div class="customer-order-card">

                        <div class="customer-order-top">
                            <div>
                                <span class="order-small-label">
                                    ORDER ID
                                </span>
                                <strong>${order.id || "-"}</strong>
                            </div>

                            <span class="customer-status ${statusClass}">
                                ${status}
                            </span>
                        </div>

                        <div class="customer-order-info">

                            <div>
                                <small>Order Date</small>
                                <strong>${order.date || "-"}</strong>
                            </div>

                            <div>
                                <small>Items</small>
                                <strong>${itemCount}</strong>
                            </div>

                            <div>
                                <small>Total Amount</small>
                                <strong>
                                    ₹${Number(order.total || 0)
                                        .toLocaleString("en-IN")}
                                </strong>
                            </div>

                            <div>
                                <small>Expected Delivery</small>
                                <strong>
                                    ${order.expectedDelivery ||
                                      "Not updated yet"}
                                </strong>
                            </div>

                        </div>

                        <div class="customer-order-plants">
                            ${(order.items || []).map(function(item) {
                                return `
                                    <div class="mini-order-item">
                                        <span>🌱</span>
                                        <div>
                                            <strong>
                                                ${item.name || "Plant"}
                                            </strong>
                                            <small>
                                                Qty: ${item.qty || 1}
                                            </small>
                                        </div>
                                    </div>
                                `;
                            }).join("")}
                        </div>

                       <div class="customer-order-actions">

    ${
        status === "Confirmed" ||
        status === "Processing" ||
        status === "Shipped" ||
        status === "Delivered"
        ?
        `
        <button
            class="receipt-btn"
            onclick="generateCustomerReceipt('${order.id}')">
            🧾 Download Receipt
        </button>
        `
        : ""
    }

    <button
        class="whatsapp-btn"
        onclick="sendOrderToWhatsApp('${order.id}')">
        📱 Send to WhatsApp
    </button>

    ${
        order.expectedDelivery
        ?
        `
        <button
            class="track-order-btn"
            onclick="showCustomerOrderStatus('${order.id}')">
            📦 Track Order
        </button>
        `
        : ""
    }

</div>
                    </div>
                `;
            }).join("")}
        </div>
    `;
}
function sendOrderToWhatsApp(orderId) {

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    const order = orders.find(function(o) {
        return o.id === orderId;
    });

    if (!order) {
        showToast("Order not found");
        return;
    }

    const items = (order.items || [])
        .map(function(item) {
            return "🌱 " + item.name + " × " + (item.qty || 1);
        })
        .join("\n");

    const message =
`🌿 GreenLife Nursery

📦 Order Details

Order ID: ${order.id}
Date: ${order.date || "-"}
Status: ${order.status || "Pending"}

🌱 Plants:
${items}

💰 Total: ₹${Number(order.total || 0).toLocaleString("en-IN")}

💳 Payment: ${order.payment || "-"}

📍 Delivery Address:
${order.address || "-"}

🚚 Expected Delivery:
${order.expectedDelivery || "Not updated yet"}

Thank you for shopping with GreenLife Nursery! 🌿`;

    const whatsappURL =
        "https://wa.me/?text=" + encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
}
// ===============================
// GREENLIFE CUSTOMER PDF RECEIPT
// ===============================

function generateCustomerReceipt(orderId) {

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    const order = orders.find(function (o) {
        return String(o.id) === String(orderId);
    });

    if (!order) {
        alert("Order not found");
        return;
    }

    // Check PDF library
    if (
        typeof window.jspdf === "undefined" ||
        !window.jspdf.jsPDF
    ) {
        alert("Receipt system is not loaded. Please refresh the page.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // ===============================
    // HEADER
    // ===============================

    doc.setFontSize(22);
    doc.setTextColor(20, 91, 58);

    doc.text(
        "GREENLIFE NURSERY",
        20,
        20
    );

    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);

    doc.text(
        "Plant Order Receipt",
        20,
        29
    );

    // ===============================
    // ORDER DETAILS
    // ===============================

    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);

    doc.text(
        "Order ID: " + (order.id || "-"),
        20,
        42
    );

    doc.text(
        "Date: " + (order.date || "-"),
        20,
        49
    );

    doc.text(
        "Status: " + (order.status || "Pending"),
        20,
        56
    );

    // ===============================
    // PLANT ITEMS
    // ===============================

    const rows = [];

    (order.items || []).forEach(function (item) {

        const qty = Number(item.qty || 1);
        const price = Number(item.price || 0);

        rows.push([
            item.name || "Plant",
            qty,
            "₹" + price.toLocaleString("en-IN"),
            "₹" + (price * qty).toLocaleString("en-IN")
        ]);

    });

    // ===============================
    // TABLE
    // ===============================

    doc.autoTable({
        startY: 65,

        head: [
            [
                "Plant",
                "Qty",
                "Price",
                "Amount"
            ]
        ],

        body: rows,

        theme: "grid",

        headStyles: {
            fillColor: [20, 91, 58],
            textColor: 255
        }
    });

    // ===============================
    // TOTAL
    // ===============================

    let y = doc.lastAutoTable.finalY + 15;

    doc.setFontSize(13);
    doc.setTextColor(20, 91, 58);

    doc.text(
        "Total Amount: ₹" +
        Number(order.total || 0).toLocaleString("en-IN"),
        20,
        y
    );

    // ===============================
    // PAYMENT
    // ===============================

    y += 10;

    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);

    doc.text(
        "Payment: " +
        (order.payment || "-"),
        20,
        y
    );

    // ===============================
    // ADDRESS
    // ===============================

    y += 10;

    doc.text(
        "Delivery Address:",
        20,
        y
    );

    y += 6;

    const addressLines = doc.splitTextToSize(
        order.address || "-",
        170
    );

    doc.text(
        addressLines,
        20,
        y
    );

    y += addressLines.length * 5 + 10;

    // ===============================
    // DELIVERY
    // ===============================

    doc.text(
        "Expected Delivery: " +
        (order.expectedDelivery || "Not updated yet"),
        20,
        y
    );

    // ===============================
    // THANK YOU
    // ===============================

    y += 15;

    doc.setTextColor(20, 91, 58);

    doc.text(
        "Thank you for shopping with GreenLife Nursery!",
        20,
        y
    );

    // ===============================
    // DOWNLOAD PDF
    // ===============================

    doc.save(
        "GreenLife-Receipt-" +
        order.id +
        ".pdf"
    );
}
// ===============================
// SEND ORDER TO WHATSAPP
// ===============================

function sendOrderToWhatsApp(orderId) {

    const orders = JSON.parse(
        localStorage.getItem("greenlifeOrders") || "[]"
    );

    const order = orders.find(function (o) {
        return String(o.id) === String(orderId);
    });

    if (!order) {
        alert("Order not found");
        return;
    }

    const items = (order.items || [])
        .map(function (item) {
            return "🌱 " + (item.name || "Plant") +
                   " × " + (item.qty || 1);
        })
        .join("\n");

    const message =
`🌿 GreenLife Nursery

📦 Order Details

Order ID: ${order.id}
Date: ${order.date || "-"}
Status: ${order.status || "Pending"}

🌱 Plants:
${items}

💰 Total: ₹${Number(order.total || 0).toLocaleString("en-IN")}

💳 Payment: ${order.payment || "-"}

📍 Delivery Address:
${order.address || "-"}

🚚 Expected Delivery:
${order.expectedDelivery || "Not updated yet"}

Thank you for shopping with GreenLife Nursery! 🌿`;

    const whatsappURL =
        "https://wa.me/?text=" +
        encodeURIComponent(message);

    window.open(whatsappURL, "_blank");
}