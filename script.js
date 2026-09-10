const MAX_ITEMS = 50;

const itemsContainer = document.getElementById("itemsContainer");
const previewItems = document.getElementById("previewItems");

const addItemBtn = document.getElementById("addItemBtn");

const currencyInput = document.getElementById("currency");

let logoData = "";


/* =========================
   ITEMS
========================= */

function addItem(
    description = "",
    quantity = 1,
    price = 0
) {

    const currentItems =
        itemsContainer.querySelectorAll(".item-row").length;

    if (currentItems >= MAX_ITEMS) {

        alert("You can only add up to 50 items.");

        return;
    }


    const row = document.createElement("div");

    row.className = "item-row";


    row.innerHTML = `

        <input
            type="text"
            class="item-description"
            placeholder="Item description"
            value="${escapeHTML(description)}"
        >

        <input
            type="number"
            class="item-quantity"
            min="0"
            step="1"
            value="${quantity}"
        >

        <input
            type="number"
            class="item-price"
            min="0"
            step="0.01"
            value="${price}"
        >

        <span class="item-total">
            0.00
        </span>

        <button
            type="button"
            class="remove-item"
            title="Remove item"
        >
            ×
        </button>

    `;


    itemsContainer.appendChild(row);


    row.querySelectorAll("input").forEach(input => {

        input.addEventListener(
            "input",
            updateInvoice
        );

    });


    row
        .querySelector(".remove-item")
        .addEventListener("click", () => {

            row.remove();

            updateInvoice();

        });


    updateInvoice();
}


addItemBtn.addEventListener(
    "click",
    () => addItem()
);


/* =========================
   CALCULATIONS
========================= */

function getItems() {

    const rows =
        itemsContainer.querySelectorAll(".item-row");

    const items = [];


    rows.forEach(row => {

        const description =
            row.querySelector(".item-description").value;

        const quantity =
            parseFloat(
                row.querySelector(".item-quantity").value
            ) || 0;

        const price =
            parseFloat(
                row.querySelector(".item-price").value
            ) || 0;

        const total = quantity * price;


        row.querySelector(".item-total")
            .textContent =
            formatNumber(total);


        items.push({
            description,
            quantity,
            price,
            total
        });

    });


    return items;
}


function calculateTotals() {

    const items = getItems();

    const subtotal =
        items.reduce(
            (sum, item) => sum + item.total,
            0
        );


    const discount =
        parseFloat(
            document.getElementById("discount").value
        ) || 0;


    const taxRate =
        parseFloat(
            document.getElementById("tax").value
        ) || 0;


    const shipping =
        parseFloat(
            document.getElementById("shipping").value
        ) || 0;


    const taxableAmount =
        Math.max(
            0,
            subtotal - discount
        );


    const tax =
        taxableAmount * (taxRate / 100);


    const grandTotal =
        taxableAmount +
        tax +
        shipping;


    return {
        subtotal,
        discount,
        tax,
        shipping,
        grandTotal
    };
}


/* =========================
   UPDATE PREVIEW
========================= */

function updateInvoice() {

    const totals = calculateTotals();

    const currency =
        currencyInput.value;


    /* BUSINESS */

    setText(
        "previewBusinessName",
        value("businessName") ||
        "Your Business Name"
    );

    setText(
        "previewBusinessEmail",
        value("businessEmail") ||
        "hello@example.com"
    );

    setText(
        "previewBusinessPhone",
        value("businessPhone") ||
        "+63 900 000 0000"
    );

    setText(
        "previewBusinessAddress",
        value("businessAddress") ||
        "Your business address"
    );


    /* INVOICE */

    setText(
        "previewInvoiceNumber",
        value("invoiceNumber") ||
        "INV-001"
    );

    setText(
        "previewInvoiceDate",
        formatDate(value("invoiceDate"))
    );

    setText(
        "previewDueDate",
        formatDate(value("dueDate"))
    );


    /* CUSTOMER */

    setText(
        "previewCustomerName",
        value("customerName") ||
        "Customer Name"
    );

    setText(
        "previewCustomerEmail",
        value("customerEmail") ||
        "customer@example.com"
    );

    setText(
        "previewCustomerAddress",
        value("customerAddress") ||
        "Customer address"
    );


    /* ITEMS */

    previewItems.innerHTML = "";

    const items = getItems();


    items.forEach(item => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    item.description ||
                    "Item"
                )}
            </td>

            <td>
                ${item.quantity}
            </td>

            <td>
                ${currency}${formatNumber(item.price)}
            </td>

            <td>
                ${currency}${formatNumber(item.total)}
            </td>

        `;


        previewItems.appendChild(row);

    });


    /* TOTALS */

    setText(
        "previewSubtotal",
        currency +
        formatNumber(totals.subtotal)
    );

    setText(
        "previewDiscount",
        currency +
        formatNumber(totals.discount)
    );

    setText(
        "previewTax",
        currency +
        formatNumber(totals.tax)
    );

    setText(
        "previewShipping",
        currency +
        formatNumber(totals.shipping)
    );

    setText(
        "previewGrandTotal",
        currency +
        formatNumber(totals.grandTotal)
    );


    /* NOTES */

    setText(
        "previewNotes",
        value("notes") ||
        "Thank you for your business!"
    );


    /* COLORS */

    const background =
        document.getElementById(
            "backgroundColor"
        ).value;

    const accent =
        document.getElementById(
            "accentColor"
        ).value;


    const invoice =
        document.getElementById("invoice");


    invoice.style.background =
        background;

    invoice.style.color =
        accent;

}


/* =========================
   LOGO
========================= */

document
    .getElementById("logoInput")
    .addEventListener(
        "change",
        function () {

            const file =
                this.files[0];

            if (!file) return;


            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    logoData =
                        event.target.result;


                    const logo =
                        document.getElementById(
                            "logoPreview"
                        );


                    logo.src =
                        logoData;

                    logo.style.display =
                        "block";

                };


            reader.readAsDataURL(file);

        }
    );


document
    .getElementById("removeLogoBtn")
    .addEventListener(
        "click",
        () => {

            logoData = "";

            const logo =
                document.getElementById(
                    "logoPreview"
                );

            logo.src = "";

            logo.style.display =
                "none";

            document
                .getElementById("logoInput")
                .value = "";

        }
    );


/* =========================
   PRINT
========================= */

document
    .getElementById("printBtn")
    .addEventListener(
        "click",
        () => {

            window.print();

        }
    );


/* =========================
   RESET
========================= */

document
    .getElementById("resetBtn")
    .addEventListener(
        "click",
        () => {

            const confirmed =
                confirm(
                    "Reset the entire invoice?"
                );

            if (!confirmed) return;


            document
                .querySelectorAll(
                    "input:not([type='color']), textarea"
                )
                .forEach(element => {

                    element.value = "";

                });


            document.getElementById(
                "discount"
            ).value = 0;

            document.getElementById(
                "tax"
            ).value = 0;

            document.getElementById(
                "shipping"
            ).value = 0;


            itemsContainer.innerHTML = "";

            addItem();


            document.getElementById(
                "backgroundColor"
            ).value = "#ffffff";


            document.getElementById(
                "accentColor"
            ).value = "#222222";


            updateInvoice();

        }
    );


/* =========================
   LISTENERS
========================= */

document
    .querySelectorAll(
        ".settings-panel input, .settings-panel textarea, .settings-panel select"
    )
    .forEach(element => {

        element.addEventListener(
            "input",
            updateInvoice
        );

        element.addEventListener(
            "change",
            updateInvoice
        );

    });


/* =========================
   HELPERS
========================= */

function value(id) {

    return document
        .getElementById(id)
        .value
        .trim();

}


function setText(id, text) {

    document
        .getElementById(id)
        .textContent = text;

}


function formatNumber(number) {

    return Number(number)
        .toLocaleString(
            undefined,
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


function formatDate(date) {

    if (!date) return "—";


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return `${parts[1]}/${parts[2]}/${parts[0]}`;

}


function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* =========================
   START
========================= */

addItem();

updateInvoice();
