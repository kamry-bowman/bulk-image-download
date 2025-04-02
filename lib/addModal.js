import JSZip from "jszip";

const CHECK_BOX_CLASS_NAME = "colleague-selection";
var urlCreator = window.URL || window.webkitURL;

function renderRowIntoTable(row, table) {
    const rowEl = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = row.name;
    rowEl.appendChild(nameCell);
    const titleCell = document.createElement("td");
    titleCell.textContent = row.title;
    rowEl.appendChild(titleCell);
    const imageCell = document.createElement("td");
    const img = document.createElement("img");
    let imageUrl = urlCreator.createObjectURL(row.imageBlob);
    img.src = imageUrl;
    imageCell.appendChild(img);
    rowEl.appendChild(imageCell);
    const checkBoxCell = document.createElement("td");
    rowEl.appendChild(checkBoxCell);
    const checkBox = createCheckbox();
    checkBoxCell.appendChild(checkBox);
    checkBox.id = row.name;
    checkBox.name = row.name;
    checkBox.checked = true;
    checkBox.className = CHECK_BOX_CLASS_NAME;
    table.appendChild(rowEl);
}

// Save the data based on which rows were selected in the DOM
async function saveSelection(data) {
    const zip = new JSZip();
    const resultData = [];
    const rows = Array.from(
        document.querySelectorAll(`input.${CHECK_BOX_CLASS_NAME}`)
    );
    for (let i = 0; i < data.length; i++) {
        const checkBoxEl = rows[i];
        const item = data[i];
        if (checkBoxEl.name !== item.name) {
            throw new Error(
                `Unexpected name mismatch: ${checkBoxEl.name} != ${item.name}`
            );
        }
        if (checkBoxEl.checked === true) {
            const { imageBlob, name, fileName, title, imageUrl, ...rest } =
                item;
            const calculatedName = name || fileName || title || imageUrl;
            const zipFileName = `bulk-image-download-${calculatedName.replace(
                " ",
                ""
            )}-${rest.position}.jpg`;
            zip.file(`img/${zipFileName}`, imageBlob);
            resultData.push({ ...item, zipFileName });
        }
    }
    const stringifiedResultData = JSON.stringify(resultData);
    zip.file("data.json", stringifiedResultData);
    const zipData = await zip.generateAsync({
        type: "blob",
        streamFiles: true,
    });
    let link = document.createElement("a");
    link.href = window.URL.createObjectURL(zipData);
    link.download = `bulk-image-downloader-data.zip`;
    document.getElementsByTagName("body")[0].appendChild(link);
    link.click();
}
function createCheckbox() {
    const checkBox = document.createElement("input");
    checkBox.style.pointerEvents = "auto";
    checkBox.style.opacity = 1;
    checkBox.style.position = "static";
    checkBox.type = "checkbox";
    return checkBox;
}

function renderGrid(data, onClose) {
    // TODO: allow toggling all selected / none selected
    const div = document.createElement("div");
    div.style.overflowY = "auto";
    div.style.height = "100vh";
    const table = document.createElement("table");
    const headerRow = document.createElement("tr");
    const empty1 = document.createElement("th");
    const empty2 = document.createElement("th");
    const empty3 = document.createElement("th");
    const checkBoxHeaderCell = document.createElement("th");
    const headerCheckBox = createCheckbox();
    headerCheckBox.checked = true;
    checkBoxHeaderCell.append(headerCheckBox);
    headerRow.appendChild(empty1);
    headerRow.appendChild(empty2);
    headerRow.appendChild(empty3);
    headerRow.appendChild(checkBoxHeaderCell);
    headerCheckBox.onclick = function toggleCheckBoxesClicked() {
        const checkBoxes = document.querySelectorAll(
            `.${CHECK_BOX_CLASS_NAME}`
        );
        for (const checkBox of checkBoxes) {
            const newCheckedState = headerCheckBox.checked;
            if (checkBox.checked != newCheckedState) {
                checkBox.click();
            }
        }
    };
    table.appendChild(headerRow);
    div.appendChild(table);
    const caption = document.createElement("caption");
    caption.innerText = "Select Items to Include";
    table.appendChild(caption);
    for (const row of data) {
        renderRowIntoTable(row, table);
    }
    const button = document.createElement("button");
    button.textContent = "Save Selection";
    button.onclick = function saveSelectionAndCloseModal() {
        saveSelection(data);
        onClose();
    };
    div.appendChild(button);
    return div;
}

export function addModal(data) {
    const modal = document.createElement("div");
    modal.id = "bulk-image-download-modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.borderRadius = "5px";
    modal.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
    modal.style.zIndex = "1000";

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";

    document.body.prepend(overlay);
    document.body.prepend(modal);
    const closeButton = document.createElement("button");
    closeButton.textContent = "×";
    closeButton.style.position = "absolute";
    closeButton.style.right = "10px";
    closeButton.style.top = "10px";
    closeButton.style.border = "none";
    closeButton.style.background = "none";
    closeButton.style.fontSize = "20px";
    closeButton.style.cursor = "pointer";
    closeButton.style.padding = "5px";

    function closeAndCleanup() {
        modal.style.display = "none";
        overlay.style.display = "none";
        document.body.removeChild(modal);
        document.body.removeChild(overlay);
    }
    closeButton.onclick = closeAndCleanup;
    const content = renderGrid(data, closeAndCleanup);
    modal.appendChild(content);
    modal.appendChild(closeButton);
}
