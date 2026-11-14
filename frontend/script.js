
// ======================================
// SMART INVENTORY DASHBOARD
// ======================================

const API_URL = "http://127.0.0.1:5000";

// HTML elements
const productForm = document.getElementById("productForm");
const productTable = document.getElementById("productTable");

// Chart variables
let stockChart = null;
let demandChart = null;

// Convert product data into a consistent format
function formatProduct(product) {
    if (Array.isArray(product)) {
        return {
            id: product[0],
            name: product[1],
            category: product[2],
            quantity: Number(product[3]),
            price: Number(product[4])
        };
    }

    return {
        id: product.id,
        name: product.name,
        category: product.category,
        quantity: Number(product.quantity),
        price: Number(product.price)
    };
}

// ======================================
// LOAD PRODUCTS
// ======================================

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/api/products`);

        if (!response.ok) {
            throw new Error("Unable to load products");
        }

        const data = await response.json();
        const products = data.map(formatProduct);

        displayProducts(products);
        updateDashboard(products);

    } catch (error) {
        console.error("Backend error:", error);
        alert("Cannot connect to backend. Please check Flask.");
    }
}

// ======================================
// DISPLAY PRODUCT TABLE
// ======================================

function displayProducts(products) {
    productTable.innerHTML = "";

    if (products.length === 0) {
        productTable.innerHTML =
            `<tr><td colspan="5">No products available</td></tr>`;
        return;
    }

    products.forEach(product => {
        productTable.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>₹${product.price.toFixed(2)}</td>
            </tr>
        `;
    });
}

// ======================================
// UPDATE DASHBOARD CARDS
// ======================================

function updateDashboard(products) {

    const totalProducts = products.length;

    const totalStock = products.reduce(
        (sum, product) => sum + product.quantity, 0
    );

    const inventoryValue = products.reduce(
        (sum, product) =>
            sum + product.quantity * product.price, 0
    );

    const lowStock = products.filter(
        product => product.quantity < 10
    ).length;

    document.getElementById("totalProducts").textContent =
        totalProducts;

    document.getElementById("totalStock").textContent =
        totalStock;

    document.getElementById("inventoryValue").textContent =
        "₹" + inventoryValue.toFixed(2);

    document.getElementById("lowStock").textContent =
        lowStock;

    updateCharts(products);
}

// ======================================
// UPDATE DASHBOARD CHARTS
// ======================================

function updateCharts(products) {

    // Stock by category
    const categoryStock = {};

    products.forEach(product => {
        categoryStock[product.category] =
            (categoryStock[product.category] || 0)
            + product.quantity;
    });

    const categories = Object.keys(categoryStock);
    const quantities = Object.values(categoryStock);

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(
        document.getElementById("stockChart"),
        {
            type: "bar",
            data: {
                labels: categories,
                datasets: [{
                    label: "Available Stock",
                    data: quantities,
                    backgroundColor: "#38bdf8",
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: "#ffffff" }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: "#ffffff" },
                        grid: { color: "#26364f" }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: "#ffffff" },
                        grid: { color: "#26364f" }
                    }
                }
            }
        }
    );

    // Product quantity overview
    if (demandChart) {
        demandChart.destroy();
    }

    demandChart = new Chart(
        document.getElementById("demandChart"),
        {
            type: "doughnut",
            data: {
                labels: products.map(p => p.name),
                datasets: [{
                    label: "Current Quantity",
                    data: products.map(p => p.quantity),
                    backgroundColor: [
                        "#38bdf8",
                        "#818cf8",
                        "#34d399",
                        "#fbbf24",
                        "#f472b6",
                        "#a78bfa"
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: "bottom",
                        labels: { color: "#ffffff" }
                    }
                }
            }
        }
    );
}

// ======================================
// ADD NEW PRODUCT
// ======================================

productForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const product = {
        name: document.getElementById("name").value.trim(),
        category: document.getElementById("category").value.trim(),
        quantity: Number(document.getElementById("quantity").value),
        price: Number(document.getElementById("price").value)
    };

    try {
        const response = await fetch(`${API_URL}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(product)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Product could not be added");
        }

        alert(result.message || "Product added successfully!");

        productForm.reset();

        await loadProducts();

    } catch (error) {
        alert("Error: " + error.message);
    }
});

// ======================================
// START DASHBOARD
// ======================================

loadProducts();
