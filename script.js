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


    if (
        name === "" ||
        category === "" ||
        code === "" ||
        buyPrice === "" ||
        sellPrice === "" ||
        quantity === ""
    ) {

        alert("من فضلك املئي جميع البيانات");

        return;
    }


    let product = {

        name: name,
        category: category,
        code: code,

        buyPrice: Number(buyPrice),
        sellPrice: Number(sellPrice),
        quantity: Number(quantity)

    };



    products.push(product);



    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );




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


    table.innerHTML = "";


    products.forEach(function (product, index) {

        table.innerHTML += `

            <tr>

                <td>
                    ${product.code}
                </td>

                <td>
                    ${product.name}
                </td>

                <td>
                    ${product.category}
                </td>

                <td>
                    ${product.buyPrice} ج.م
                </td>

                <td>
                    ${product.sellPrice} ج.م
                </td>

                <td>

    ${product.quantity === 0
                ? '<span class="text-danger fw-bold">❌ نفد المخزون</span>'
                : product.quantity <= 5
                    ? `<span class="text-warning fw-bold">⚠️ ${product.quantity} قليل</span>`
                    : product.quantity
            }

</td>

               <td>

    <button
        class="btn btn-warning btn-sm"
        onclick="editProduct(${index})">

        ✏️ تعديل

    </button>

    <button
        class="btn btn-danger btn-sm"
        onclick="deleteProduct(${index})">

        🗑️ حذف

    </button>

</td>

            </tr>

        `;

    });

}

function searchProducts() {

    let searchValue =
        document.getElementById("searchInput").value.toLowerCase();


    let table =
        document.getElementById("productsTable");


    table.innerHTML = "";


    products.forEach(function (product, index) {

        if (
            product.name.toLowerCase().includes(searchValue) ||
            product.code.toLowerCase().includes(searchValue)
        ) {

            table.innerHTML += `

                <tr>

                    <td>${product.code}</td>

                    <td>${product.name}</td>

                    <td>${product.category}</td>

                    <td>${product.buyPrice} ج.م</td>

                    <td>${product.sellPrice} ج.م</td>

                    <td>${product.quantity}</td>

                    <td>

                        <button
                            class="btn btn-warning btn-sm"
                            onclick="editProduct(${index})">

                            ✏️ تعديل

                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            onclick="deleteProduct(${index})">

                            🗑️ حذف

                        </button>

                    </td>

                </tr>

            `;

        }

    });

}
function editProduct(index) {

    let product = products[index];


    let newName = prompt(
        "اسم المنتج:",
        product.name
    );

    if (newName === null) {
        return;
    }


    let newCategory = prompt(
        "التصنيف:",
        product.category
    );

    if (newCategory === null) {
        return;
    }


    let newCode = prompt(
        "الكود:",
        product.code
    );

    if (newCode === null) {
        return;
    }


    let newBuyPrice = prompt(
        "سعر الشراء:",
        product.buyPrice
    );

    if (newBuyPrice === null) {
        return;
    }


    let newSellPrice = prompt(
        "سعر البيع:",
        product.sellPrice
    );

    if (newSellPrice === null) {
        return;
    }


    let newQuantity = prompt(
        "الكمية:",
        product.quantity
    );

    if (newQuantity === null) {
        return;
    }

    product.name = newName;
    product.category = newCategory;
    product.code = newCode;

    product.buyPrice = Number(newBuyPrice);
    product.sellPrice = Number(newSellPrice);
    product.quantity = Number(newQuantity);


    localStorage.setItem(
        "products",
        JSON.stringify(products)
    );

    displayProducts();

}
let saleProducts =
    JSON.parse(localStorage.getItem("products")) || [];



let invoice = [];



if (document.getElementById("saleProduct")) {

    loadSaleProducts();

}



function loadSaleProducts() {

    let select =
        document.getElementById("saleProduct");


    select.innerHTML = `
        <option value="">
            اختاري المنتج
        </option>
    `;


    saleProducts.forEach(function (product, index) {

        if (product.quantity > 0) {

            select.innerHTML += `

                <option value="${index}">

                    ${product.name}
                    -
                    ${product.sellPrice} ج.م
                    -
                    المتاح: ${product.quantity}

                </option>

            `;

        }

    });

}
function addToInvoice() {

    let productIndex =
        document.getElementById("saleProduct").value;


    let quantity =
        Number(
            document.getElementById("saleQuantity").value
        );



    if (productIndex === "") {

        alert("اختاري المنتج أولًا");

        return;

    }



    if (quantity <= 0) {

        alert("أدخلي كمية صحيحة");

        return;

    }


    let product =
        saleProducts[productIndex];



    if (quantity > product.quantity) {

        alert(
            `الكمية المتاحة فقط: ${product.quantity}`
        );

        return;

    }


    invoice.push({
        productIndex: productIndex,
        name: product.name,
        buyPrice: product.buyPrice,
        sellPrice: product.sellPrice,
        price: product.sellPrice,
        quantity: quantity,
        total: product.sellPrice * quantity
    });

    displayInvoice();

}
function displayInvoice() {

    let table =
        document.getElementById("invoiceTable");


    table.innerHTML = "";


    let total = 0;


    invoice.forEach(function (item, index) {

        total += item.total;


        table.innerHTML += `

            <tr>

                <td>
                    ${item.name}
                </td>

                <td>
                    ${item.price} ج.م
                </td>

                <td>
                    ${item.quantity}
                </td>

                <td>
                    ${item.total} ج.م
                </td>

                <td>

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="removeFromInvoice(${index})">

                        🗑️ حذف

                    </button>

                </td>

            </tr>

        `;

    });


    document.getElementById("invoiceTotal").textContent =
        total;

}
function removeFromInvoice(index) {

    invoice.splice(index, 1);

    displayInvoice();

}
function completeSale() {

    if (invoice.length === 0) {
        alert("الفاتورة فارغة");
        return;
    }

    invoice.forEach(function (item) {
        saleProducts[item.productIndex].quantity -= item.quantity;
    });

    let total = invoice.reduce(function (sum, item) {
        return sum + item.total;
    }, 0);

    let sales = JSON.parse(localStorage.getItem("sales")) || [];

    let invoiceNumber = sales.length + 1;

    let sale = {
        invoiceNumber: invoiceNumber,
        date: new Date().toISOString(),
        items: invoice,
        total: total
    };

    sales.push(sale);

    localStorage.setItem("sales", JSON.stringify(sales));

    localStorage.setItem("products", JSON.stringify(saleProducts));

    alert(
        `تم البيع بنجاح ✅\n\n` +
        `رقم الفاتورة: ${invoiceNumber}\n` +
        `إجمالي الفاتورة: ${total} ج.م`
    );

    invoice = [];

    displayInvoice();

    loadSaleProducts();
}

let sales = JSON.parse(localStorage.getItem("sales")) || [];

if (document.getElementById("salesTable")) {
    displaySalesHistory();
}


function formatSaleDate(value) {

    if (!value) {
        return "غير محدد";
    }

    let d = new Date(value);

    if (isNaN(d)) {
        return value;
    }

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
                    <button
                        class="btn btn-primary btn-sm"
                        onclick="showSaleDetails(${index})">
                        👁️ التفاصيل
                    </button>
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


    let totalSales = reportSales.reduce(function (sum, sale) {
        return sum + sale.total;
    }, 0);


    let totalProductsSold = reportSales.reduce(function (sum, sale) {

        return sum + sale.items.reduce(function (itemSum, item) {
            return itemSum + item.quantity;
        }, 0);

    }, 0);

    let totalProfit = reportSales.reduce(function (sum, sale) {

        return sum + sale.items.reduce(function (itemSum, item) {

            let sellPrice = Number(item.sellPrice) || 0;
            let buyPrice = Number(item.buyPrice) || 0;
            let quantity = Number(item.quantity) || 0;

            let profit =
                (sellPrice - buyPrice) * quantity;

            return itemSum + profit;

        }, 0);

    }, 0);

    let products =
        JSON.parse(localStorage.getItem("products")) || [];

    let stockValue = products.reduce(function (sum, product) {
        return sum + (product.buyPrice * product.quantity);
    }, 0);
    let expenses =
    JSON.parse(localStorage.getItem("expenses")) || [];

let totalExpenses = expenses.reduce(function (sum, expense) {
    return sum + (Number(expense.amount) || 0);
}, 0);

    document.getElementById("totalInvoices").innerText =
        totalInvoices;

    document.getElementById("totalSales").innerText =
        totalSales + " ج.م";

    document.getElementById("totalProductsSold").innerText =
        totalProductsSold;

    document.getElementById("totalProfit").innerText =
        totalProfit + " ج.م";
        document.getElementById("totalExpenses").innerText =
    totalExpenses + " ج.م";
    let netProfit = totalProfit - totalExpenses;

document.getElementById("netProfit").innerText =
    netProfit + " ج.م";
    document.getElementById("stockValue").innerText =
        stockValue + " ج.م";
}
function filterReports() {

    let fromDate = document.getElementById("fromDate").value;
    let toDate = document.getElementById("toDate").value;

    let filteredSales = reportSales.filter(function (sale) {

        let saleDate = new Date(sale.date);

        if (fromDate) {
            let startDate = new Date(fromDate);
            startDate.setHours(0, 0, 0, 0);

            if (saleDate < startDate) {
                return false;
            }
        }

        if (toDate) {
            let endDate = new Date(toDate);
            endDate.setHours(23, 59, 59, 999);

            if (saleDate > endDate) {
                return false;
            }
        }

        return true;
    });

    displayFilteredReports(filteredSales);
    displayBestProducts(filteredSales);


}
function displayBestProducts(filteredSales) {

    let productSales = {};

    filteredSales.forEach(function (sale) {

        sale.items.forEach(function (item) {

            if (!productSales[item.name]) {
                productSales[item.name] = 0;
            }

            productSales[item.name] += item.quantity;

        });

    });



    let bestProductsTable =
        document.getElementById("bestProductsTable");

    bestProductsTable.innerHTML = "";


    let sortedProducts = Object.entries(productSales);

    sortedProducts.sort(function (a, b) {
        return b[1] - a[1];
    });


    sortedProducts.forEach(function (product) {

        bestProductsTable.innerHTML += `
            <tr>
                <td>${product[0]}</td>
                <td>${product[1]}</td>
            </tr>
        `;

    });
}
function resetReports() {
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";

    reportSales =
        JSON.parse(localStorage.getItem("sales")) || [];

    displayReports();

    displayBestProducts(reportSales);
}
function displayFilteredReports(filteredSales) {

    let totalInvoices = filteredSales.length;

    let totalSales = filteredSales.reduce(function (sum, sale) {
        return sum + sale.total;
    }, 0);

    let totalProductsSold = filteredSales.reduce(function (sum, sale) {

        return sum + sale.items.reduce(function (itemSum, item) {
            return itemSum + item.quantity;
        }, 0);

    }, 0);

    let totalProfit = filteredSales.reduce(function (sum, sale) {

        return sum + sale.items.reduce(function (itemSum, item) {

            return itemSum +
                (item.sellPrice - item.buyPrice) * item.quantity;

        }, 0);

    }, 0);


    document.getElementById("totalInvoices").innerText =
        totalInvoices;

    document.getElementById("totalSales").innerText =
        totalSales + " ج.م";

    document.getElementById("totalProductsSold").innerText =
        totalProductsSold;

    document.getElementById("totalProfit").innerText =
        totalProfit + " ج.م";
}
let productSales = {};

reportSales.forEach(function (sale) {

    sale.items.forEach(function (item) {

        if (!productSales[item.name]) {
            productSales[item.name] = 0;
        }

        productSales[item.name] += item.quantity;

    });

});


if (document.getElementById("bestProductsTable")) {

    let bestProductsTable =
        document.getElementById("bestProductsTable");

    bestProductsTable.innerHTML = "";

    let sortedProducts = Object.entries(productSales);

    sortedProducts.sort(function (a, b) {
        return b[1] - a[1];
    });

    sortedProducts.forEach(function (product) {

        bestProductsTable.innerHTML += `
            <tr>
                <td>${product[0]}</td>
                <td>${product[1]}</td>
            </tr>
        `;

    });

}
if (document.getElementById("dashboardProducts")) {
    let products =
        JSON.parse(localStorage.getItem("products")) || [];

    document.getElementById("dashboardProducts").innerText =
        products.length;
}
if (document.getElementById("todaySales")) {

    let sales =
        JSON.parse(localStorage.getItem("sales")) || [];

    let today = new Date().toISOString().split("T")[0];

    let todaySales = sales.reduce(function (sum, sale) {

        let saleDate = sale.date.split("T")[0];

        if (saleDate === today) {
            return sum + sale.total;
        }

        return sum;

    }, 0);

    document.getElementById("todaySales").innerText =
        todaySales + " ج.م";
}
if (document.getElementById("dashboardProfit")) {

    let sales =
        JSON.parse(localStorage.getItem("sales")) || [];

    let profit = sales.reduce(function (sum, sale) {

        let saleProfit = sale.items.reduce(function (itemSum, item) {

            let sellPrice = Number(item.sellPrice) || 0;
            let buyPrice = Number(item.buyPrice) || 0;
            let quantity = Number(item.quantity) || 0;

            return itemSum + (sellPrice - buyPrice) * quantity;

        }, 0);

        return sum + saleProfit;

    }, 0);

    let expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    let totalExpenses = expenses.reduce(function (sum, expense) {

        return sum + (Number(expense.amount) || 0);

    }, 0);

    profit = profit - totalExpenses;

    document.getElementById("dashboardProfit").innerText =
        profit + " ج.م";
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

    if (!table) {
        return;
    }

    table.innerHTML = "";

    expenses.forEach(function (expense, index) {

        table.innerHTML += `
            <tr>
                <td>${expense.name}</td>
                <td>${expense.amount} ج.م</td>
                <td>${new Date(expense.date).toLocaleDateString("ar-EG")}</td>
                <td>
                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteExpense(${index})">
                        حذف
                    </button>
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
if (document.getElementById("dashboardExpenses")) {

    let expenses =
        JSON.parse(localStorage.getItem("expenses")) || [];

    let totalExpenses = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    document.getElementById("dashboardExpenses").innerText =
        totalExpenses + " ج.م";
}
function printReports() {
    window.print();
}
function exportReports() {

    let table = document.querySelector("table");

    let workbook = XLSX.utils.table_to_book(table);

    XLSX.writeFile(workbook, "تقرير_المبيعات.xlsx");
}
 products =
    JSON.parse(localStorage.getItem("products")) || [];

if (document.getElementById("stockCount")) {
    document.getElementById("stockCount").innerText =
        products.length;
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
        alert("من فضلك أدخلي اسم العميل ورقم الهاتف على الأقل");
        return;
    }

    customers.push({
        name: name,
        phone: phone,
        address: address
    });

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