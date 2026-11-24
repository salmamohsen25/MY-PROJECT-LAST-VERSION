const DEFAULT_USER = "admin";
const DEFAULT_PASS = "123456";
(function checkAuth() {
    const isLoginPage = window.location.pathname.endsWith("login.html");
    const isSalesPage = window.location.pathname.endsWith("sales.html");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userRole = localStorage.getItem("userRole");

    if (!isLoggedIn && !isLoginPage) {
        window.location.href = "login.html";
        return;
    }

    if (isLoggedIn && userRole === "cashier" && !isSalesPage && !isLoginPage) {
        alert("⚠️ غير مسموح للكاشير بالدخول لهذه الصفحة.");
        window.location.href = "sales.html";
    }
})();

function handleLogin(event) {
    event.preventDefault();

    let role = document.getElementById("userRole") ? document.getElementById("userRole").value : "admin";
    let usernameInput = document.getElementById("username").value;
    let passwordInput = document.getElementById("password").value;

    if (role === "admin" && usernameInput === DEFAULT_USER && passwordInput === DEFAULT_PASS) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", usernameInput);
        localStorage.setItem("userRole", "admin");
        window.location.href = "index.html";
    } else if (role === "cashier" && usernameInput === "cashier" && passwordInput === "123456") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("currentUser", usernameInput);
        localStorage.setItem("userRole", "cashier");
        window.location.href = "sales.html";
    } else {
        alert("اسم المستخدم أو كلمة المرور غير صحيحة ❌");
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userRole");
    window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "cashier") {
        document.querySelectorAll(".admin-only").forEach(el => el.style.display = "none");
    }
});

let products = JSON.parse(localStorage.getItem("products")) || [];

if (document.getElementById("productsTable")) {
    displayProducts();
}

function addProduct() {
    let name = document.getElementById("productName").value;
    let category = document.getElementById("productCategory").value;
    let code = document.getElementById("productCode").value;
    let buyPrice = document.getElementById("buyPrice").value;
    let sellPrice = document.getElementById("sellPrice").value;
    let quantity = document.getElementById("quantity").value;

    if (name === "" || category === "" || code === "" || buyPrice === "" || sellPrice === "" || quantity === "") {
        alert("من فضلك املئ جميع البيانات");
        return;
    }

    let product = {
        id: Date.now(),
        name: name,
        category: category,
        code: code,
        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        quantity: Number(quantity)
    };

    products.push(product);
    localStorage.setItem("products", JSON.stringify(products));

    displayProducts();

    document.getElementById("productName").value = "";
    document.getElementById("productCategory").value = "";
    document.getElementById("productCode").value = "";
    document.getElementById("buyPrice").value = "";
    document.getElementById("sellPrice").value = "";
    document.getElementById("quantity").value = "";
}

function displayProducts() {
    let table = document.getElementById("productsTable");
    if (!table) return;

    table.innerHTML = "";
    products.forEach(function (product, index) {
        table.innerHTML += `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.buyPrice} ج.م</td>
                <td>${product.sellPrice} ج.م</td>
                <td>
                    ${product.quantity === 0
                        ? '<span class="text-danger fw-bold">❌ نفد المخزون</span>'
                        : product.quantity <= 5
                            ? `<span class="text-warning fw-bold">⚠️ ${product.quantity} قليل</span>`
                            : product.quantity
                    }
                </td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">✏️ تعديل</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">🗑️ حذف</button>
                </td>
            </tr>
        `;
    });
}

function searchProducts() {
    let searchValue = document.getElementById("searchInput").value.toLowerCase();
    let table = document.getElementById("productsTable");
    if (!table) return;

    table.innerHTML = "";
    products.forEach(function (product, index) {
        if (product.name.toLowerCase().includes(searchValue) || product.code.toLowerCase().includes(searchValue)) {
            table.innerHTML += `
                <tr>
                    <td>${product.code}</td>
                    <td>${product.name}</td>
                    <td>${product.category}</td>
                    <td>${product.buyPrice} ج.م</td>
                    <td>${product.sellPrice} ج.م</td>
                    <td>${product.quantity}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProduct(${index})">✏️ تعديل</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">🗑️ حذف</button>
                    </td>
                </tr>
            `;
        }
    });
}

function editProduct(index) {
    let product = products[index];

    let newName = prompt("اسم المنتج:", product.name);
    if (newName === null) return;

    let newCategory = prompt("التصنيف:", product.category);
    if (newCategory === null) return;

    let newCode = prompt("الكود:", product.code);
    if (newCode === null) return;

    let newBuyPrice = prompt("سعر الشراء:", product.buyPrice);
    if (newBuyPrice === null) return;

    let newSellPrice = prompt("سعر البيع:", product.sellPrice);
    if (newSellPrice === null) return;

    let newQuantity = prompt("الكمية:", product.quantity);
    if (newQuantity === null) return;

    product.name = newName;
    product.category = newCategory;
    product.code = newCode;
    product.buyPrice = Number(newBuyPrice);
    product.sellPrice = Number(newSellPrice);
    product.quantity = Number(newQuantity);

    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
}

let saleProducts = JSON.parse(localStorage.getItem("products")) || [];
let invoice = [];

if (document.getElementById("saleProduct")) {
    loadSaleProducts();
}

function loadSaleProducts() {
    let select = document.getElementById("saleProduct");
    if (!select) return;

    saleProducts = JSON.parse(localStorage.getItem("products")) || [];
    select.innerHTML = `<option value="">اختار المنتج...</option>`;
    saleProducts.forEach(function (product, index) {
        if (product.quantity > 0) {
            select.innerHTML += `
                <option value="${index}">
                    ${product.name} - ${product.sellPrice} ج.م - (المتاح: ${product.quantity})
                </option>
            `;
        }
    });
}

function addToInvoice() {
    let productIndex = document.getElementById("saleProduct").value;
    let quantity = Number(document.getElementById("saleQuantity").value);

    if (productIndex === "") {
        alert("اختار المنتج أولًا");
        return;
    }

    if (quantity <= 0) {
        alert("أدخل كمية صحيحة");
        return;
    }

    let product = saleProducts[productIndex];

    if (quantity > product.quantity) {
        alert(`الكمية المتاحة فقط: ${product.quantity}`);
        return;
    }

    let existingIndex = invoice.findIndex(item => item.productIndex == productIndex);

    if (existingIndex > -1) {
        if (invoice[existingIndex].quantity + quantity > product.quantity) {
            alert(`الكمية الكلية المطلوبة تتجاوز المخزون!`);
            return;
        }
        invoice[existingIndex].quantity += quantity;
        invoice[existingIndex].total = invoice[existingIndex].quantity * invoice[existingIndex].sellPrice;
    } else {
        invoice.push({
            productIndex: productIndex,
            name: product.name,
            buyPrice: product.buyPrice,
            sellPrice: product.sellPrice,
            price: product.sellPrice,
            quantity: quantity,
            total: product.sellPrice * quantity
        });
    }

    displayInvoice();
}

function displayInvoice() {
    let table = document.getElementById("invoiceTable");
    if (!table) return;

    table.innerHTML = "";
    let total = 0;

    invoice.forEach(function (item, index) {
        total += item.total;
        table.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price} ج.م</td>
                <td>${item.quantity}</td>
                <td>${item.total} ج.م</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removeFromInvoice(${index})">🗑️ حذف</button>
                </td>
            </tr>
        `;
    });

    document.getElementById("invoiceTotal").textContent = total.toFixed(2);
}

function removeFromInvoice(index) {
    invoice.splice(index, 1);
    displayInvoice();
}

function completeSale() {
    if (invoice.length === 0) {
        alert("الفاتورة فارغة!");
        return;
    }
    invoice.forEach(function (item) {
        saleProducts[item.productIndex].quantity -= item.quantity;
    });

    let total = invoice.reduce((sum, item) => sum + item.total, 0);
    let sales = JSON.parse(localStorage.getItem("sales")) || [];
    let invoiceNumber = "INV-" + Math.floor(100000 + Math.random() * 900000);
    let currentDate = new Date().toLocaleString("ar-EG");

    let sale = {
        invoiceNumber: invoiceNumber,
        date: currentDate,
        items: invoice,
        total: total
    };

    sales.push(sale);
    localStorage.setItem("sales", JSON.stringify(sales));
    localStorage.setItem("products", JSON.stringify(saleProducts));
    if (document.getElementById("receiptModal")) {
        document.getElementById("receiptInvoiceNo").innerText = invoiceNumber;
        document.getElementById("receiptDate").innerText = currentDate;
        document.getElementById("receiptTotal").innerText = total.toFixed(2);

        let receiptItemsHTML = "";
        invoice.forEach(item => {
            receiptItemsHTML += `
                <tr>
                    <td>${item.name}</td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-end">${item.total.toFixed(2)} ج.م</td>
                </tr>
            `;
        });
        document.getElementById("receiptItems").innerHTML = receiptItemsHTML;

       
        let receiptModal = new bootstrap.Modal(document.getElementById("receiptModal"));
        receiptModal.show();
    } else {
        alert(`تم البيع بنجاح ✅\n\nرقم الفاتورة: ${invoiceNumber}\nالإجمالي: ${total} ج.م`);
    }

    
    invoice = [];
    displayInvoice();
    loadSaleProducts();
}


function printReceipt() {
    let printContents = document.getElementById("receiptContent").innerHTML;
    let originalContents = document.body.innerHTML;

    document.body.innerHTML = `
        <div style="width: 300px; margin: 0 auto; font-family: sans-serif;">
            ${printContents}
        </div>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    location.reload();
}


let sales = JSON.parse(localStorage.getItem("sales")) || [];

if (document.getElementById("salesTable")) {
    displaySalesHistory();
}

function formatSaleDate(value) {
    if (!value) return "غير محدد";
    let d = new Date(value);
    if (isNaN(d)) return value;

    return d.toLocaleString("ar-EG", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function displaySalesHistory() {
    let table = document.getElementById("salesTable");
    if (!table) return;

    table.innerHTML = "";
    sales.forEach(function (sale, index) {
        table.innerHTML += `
            <tr>
                <td>${sale.invoiceNumber}</td>
                <td>${formatSaleDate(sale.date)}</td>
                <td>
                    ${sale.items.map(function (item) {
                        return item.name + " × " + item.quantity;
                    }).join("<br>")}
                </td>
                <td>${sale.total} ج.م</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="showSaleDetails(${index})">👁️ التفاصيل</button>
                </td>
            </tr>
        `;
    });
}

function showSaleDetails(index) {
    let sale = sales[index];
    let details = "";

    sale.items.forEach(function (item) {
        details +=
            "المنتج: " + item.name + "\n" +
            "السعر: " + item.price + " ج.م\n" +
            "الكمية: " + item.quantity + "\n" +
            "الإجمالي: " + item.total + " ج.م\n" +
            "----------------------\n";
    });

    alert(
        "فاتورة رقم: " + sale.invoiceNumber + "\n" +
        "التاريخ: " + formatSaleDate(sale.date) + "\n\n" +
        details +
        "\nإجمالي الفاتورة: " + sale.total + " ج.م"
    );
}

let reportSales = JSON.parse(localStorage.getItem("sales")) || [];

if (document.getElementById("totalInvoices")) {
    displayReports();
}

function displayReports() {
    let totalInvoices = reportSales.length;

    let totalSales = reportSales.reduce((sum, sale) => sum + sale.total, 0);

    let totalProductsSold = reportSales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0);
    }, 0);

    let totalProfit = reportSales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
            let sellPrice = Number(item.sellPrice) || 0;
            let buyPrice = Number(item.buyPrice) || 0;
            let quantity = Number(item.quantity) || 0;
            return itemSum + (sellPrice - buyPrice) * quantity;
        }, 0);
    }, 0);

    let products = JSON.parse(localStorage.getItem("products")) || [];
    let stockValue = products.reduce((sum, product) => sum + (product.buyPrice * product.quantity), 0);

    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    let totalExpenses = expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);

    document.getElementById("totalInvoices").innerText = totalInvoices;
    document.getElementById("totalSales").innerText = totalSales + " ج.م";
    document.getElementById("totalProductsSold").innerText = totalProductsSold;
    document.getElementById("totalProfit").innerText = totalProfit + " ج.م";
    document.getElementById("totalExpenses").innerText = totalExpenses + " ج.م";

    let netProfit = totalProfit - totalExpenses;
    document.getElementById("netProfit").innerText = netProfit + " ج.م";
    document.getElementById("stockValue").innerText = stockValue + " ج.م";
}



let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function addExpense() {
    let name = document.getElementById("expenseName").value;
    let amount = Number(document.getElementById("expenseAmount").value);

    if (name === "" || amount <= 0) {
        alert("من فضلك أدخل اسم المصروف والمبلغ");
        return;
    }

    expenses.push({
        name: name,
        amount: amount,
        date: new Date().toISOString()
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));
    alert("تم إضافة المصروف بنجاح ✅");

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    displayExpenses();
}

function displayExpenses() {
    let table = document.getElementById("expensesTable");
    if (!table) return;

    table.innerHTML = "";
    expenses.forEach(function (expense, index) {
        table.innerHTML += `
            <tr>
                <td>${expense.name}</td>
                <td>${expense.amount} ج.م</td>
                <td>${new Date(expense.date).toLocaleDateString("ar-EG")}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteExpense(${index})">حذف</button>
                </td>
            </tr>
        `;
    });
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
    displayExpenses();
}

if (document.getElementById("expensesTable")) {
    displayExpenses();
}

let customers = JSON.parse(localStorage.getItem("customers")) || [];

if (document.getElementById("customersTable")) {
    displayCustomers();
}

function addCustomer() {
    let name = document.getElementById("customerName").value;
    let phone = document.getElementById("customerPhone").value;
    let address = document.getElementById("customerAddress").value;

    if (name === "" || phone === "") {
        alert("من فضلك أدخل اسم العميل ورقم الهاتف على الأقل");
        return;
    }

    customers.push({ name: name, phone: phone, address: address });
    localStorage.setItem("customers", JSON.stringify(customers));
    alert("تمت إضافة العميل بنجاح ✅");

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerAddress").value = "";

    displayCustomers();
}

function displayCustomers() {
    let table = document.getElementById("customersTable");
    if (!table) return;

    table.innerHTML = "";
    customers.forEach(function (customer, index) {
        table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${customer.name}</td>
                <td>${customer.phone}</td>
                <td>${customer.address || "غير محدد"}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCustomer(${index})">🗑️ حذف</button>
                </td>
            </tr>
        `;
    });
}

function deleteCustomer(index) {
    customers.splice(index, 1);
    localStorage.setItem("customers", JSON.stringify(customers));
    displayCustomers();
}

if (document.getElementById("stockTable")) {
    displayStock();
}

function displayStock() {
    let table = document.getElementById("stockTable");
    if (!table) return;

    let stockProducts = JSON.parse(localStorage.getItem("products")) || [];
    table.innerHTML = "";

    stockProducts.forEach(function (product) {
        let status = "";
        if (product.quantity === 0) {
            status = '<span class="badge bg-danger">❌ نفد المخزون</span>';
        } else if (product.quantity <= 5) {
            status = '<span class="badge bg-warning text-dark">⚠️ كمية منخفضة</span>';
        } else {
            status = '<span class="badge bg-success">✅ متوفر</span>';
        }

        table.innerHTML += `
            <tr>
                <td>${product.code}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.quantity}</td>
                <td>${status}</td>
            </tr>
        `;
    });
}


function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

if (localStorage.getItem("darkMode") === "enabled") {
    document.body.classList.add("dark-mode");
}

window.resetDashboardData = function () {
    let confirmAction = confirm("⚠️ هل أنت متأكد تماماً من مسح كافة البيانات؟ (منتجات، مبيعات، مصروفات، عملاء)");
    
    if (confirmAction) {
        try {
            localStorage.removeItem("products");
            localStorage.removeItem("sales");
            localStorage.removeItem("expenses");
            localStorage.removeItem("customers");

            alert("تم مسح كافة البيانات بنجاح! ✅");
            location.reload(); 
        } catch (error) {
            alert("حدث خطأ أثناء المسح: " + error.message);
        }
    }
};

window.resetData = window.resetDashboardData;

let smallChart = null;
let largeChart = null;


function getMonthlyChartData() {
    let sales = JSON.parse(localStorage.getItem("sales")) || [];
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let monthlySales = new Array(12).fill(0);
    let monthlyExpenses = new Array(12).fill(0);

    sales.forEach(sale => {
        let date = new Date(sale.date);
        if (!isNaN(date)) {
            monthlySales[date.getMonth()] += Number(sale.total) || 0;
        }
    });

    expenses.forEach(exp => {
        let date = new Date(exp.date);
        if (!isNaN(date)) {
            monthlyExpenses[date.getMonth()] += Number(exp.amount) || 0;
        }
    });

    return {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        datasets: [
            {
                label: 'المبيعات (ج.م)',
                data: monthlySales,
                backgroundColor: 'lightblue',
                borderRadius: 6
            },
            {
                label: 'المصروفات (ج.م)',
                data: monthlyExpenses, 
                backgroundColor: 'blue',
                borderRadius: 6
            }
        ]
    };
}

function updateSalesChart() {
    const ctx = document.getElementById('salesExpensesChart');
    if (!ctx) return;

    if (smallChart) {
        smallChart.destroy();  
    }

    smallChart = new Chart(ctx, {
        type: 'bar',
        data: getMonthlyChartData(),
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { font: { family: 'Arial', size: 12 } }
                }
            },
            scales: {
                x: { grid: { display: false } },
                y: { beginAtZero: true }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    updateSalesChart();
});
let chartZoomed = false;

document.getElementById("zoomBtn").addEventListener("click", function () {
    const canvas = document.querySelector("canvas");
    const chart = canvas ? Chart.getChart(canvas) : null;

    if (!chart) {
        alert("مش لاقيين الرسم البياني");
        return;
    }

    const container = canvas.parentElement;

    if (!chartZoomed) {
        container.style.height = "500px";
        container.style.width = "100%";
        chartZoomed = true;
        this.innerHTML = "🔍 تصغير";
    } else {
        container.style.height = "250px";
        chartZoomed = false;
        this.innerHTML = "🔍 تكبير";
    }

    chart.resize();
});