let metric = true;
const metricToImperial = 2.54;

let ogStCount = 0;
let ogRowCount = 0;
let ogWidth = 0;
let ogLength = 0;

let userStCount = 0;
let userRowCount = 0;
let userWidth = 0;
let userLength = 0;

let stRatio = 0;
let rowRatio = 0;

let ogWidStRatio = 0;
let ogLenRowRatio = 0;
let userWidStRatio = 0;
let userLenRowRatio = 0;

let pinned = new Set();

let note = document.createElement("p");
note.classList.add("note-text");

// Handle measurement system toggle
function handleSysToggle() {
    metric = !document.getElementsByClassName("sys-checkbox")[0].checked;

    // Highlight the correct system label
    let metricLabel = document.getElementsByClassName("sys-metric")[0];
    let imperialLabel = document.getElementsByClassName("sys-imperial")[0];

    if(metric) {
        imperialLabel.classList.remove("current-toggle-value");
        metricLabel.classList.add("current-toggle-value");
    } else {
        metricLabel.classList.remove("current-toggle-value");
        imperialLabel.classList.add("current-toggle-value");
    }

    // Change all units accordingly
    let unitText = document.getElementsByClassName("measure-unit");
    let unit = metric ? "cms" : "inches";

    if (unitText[0].textContent !== unit) {
        for(let i = 0; i < unitText.length; i++) {
            unitText[i].innerHTML = unit;
        }
    }

    // Change the calculations values
    let lenInput = document.getElementById("length-input");
    let widInput = document.getElementById("width-input");

    // if lenInput and widInput exist on screen
    if(lenInput && widInput) {
        if(metric) {
            lenInput.value = (lenInput.value / metricToImperial).toFixed(1);
            widInput.value = (widInput.value / metricToImperial).toFixed(1);
        } else {
            lenInput.value = (lenInput.value * metricToImperial).toFixed(1);
            widInput.value = (widInput.value * metricToImperial).toFixed(1);
        }
    }

}

// Handle conversion form submit button
function handleSubmit(e) {
    e.preventDefault();

    // Remove sections below form if exist
    let sections = document.getElementsByTagName("section");

    while(sections.length > 1) {
        sections[1].parentNode.removeChild(sections[1]);
    }

    // Remove prev pinned
    pinned = new Set();

    // Grab input values
    ogStCount = Number(document.getElementById("og-stitches").value);
    ogRowCount = Number(document.getElementById("og-rows").value);
    ogWidth = Number(document.getElementById("og-width").value);
    ogLength = Number(document.getElementById("og-length").value);

    userStCount = Number(document.getElementById("user-stitches").value);
    userRowCount = Number(document.getElementById("user-rows").value);
    userWidth = Number(document.getElementById("user-width").value);
    userLength = Number(document.getElementById("user-length").value);

    // Conversion ratios 
    ogWidStRatio = ogStCount / ogWidth;
    ogLenRowRatio = ogRowCount / ogLength;
    userWidStRatio = userStCount / userWidth;
    userLenRowRatio = userRowCount / userLength;

    stRatio = userWidStRatio / ogWidStRatio;
    rowRatio = userLenRowRatio / ogLenRowRatio;

    // Compare gauges
    let widAnalysis = "narrower than";
    let lenAnalysis = "shorter than";

    if(stRatio < 1) {
        widAnalysis = "wider than";
    } else if (stRatio === 1) {
        widAnalysis = "the same width as"
    }

    if(rowRatio < 1) {
        lenAnalysis = "taller than";
    } else if (rowRatio === 1) {
        lenAnalysis = "the same length as"
    }

    // Add analysis section
    let analysis = "Your gauge is " + widAnalysis + " and " + lenAnalysis + " the original gauge.";

    let sectionAnalysis = document.createElement("section");
    sectionAnalysis.classList.add("section-analysis");
    let analysisP = document.createElement("p");
    analysisP.textContent = analysis;
    sectionAnalysis.appendChild(analysisP);

    document.getElementsByTagName("body")[0].appendChild(sectionAnalysis);

    // Add calculation section
    let sectionCalculation = document.createElement("section");
    sectionCalculation.classList.add("section-calculations");

    let calculationsTagline = document.createElement("h3");
    calculationsTagline.classList.add("tagline");
    calculationsTagline.textContent = "Calculations";
    let calculationsTitle = document.createElement("h2");
    calculationsTitle.classList.add("heading-secondary", "margin-bottom-md");
    calculationsTitle.textContent = "Find your stitch and row counts!";

    sectionCalculation.appendChild(calculationsTagline);
    sectionCalculation.appendChild(calculationsTitle);

    document.getElementsByTagName("body")[0].appendChild(sectionCalculation);

    createCalcInput("width", userWidStRatio, (userWidStRatio * 10).toFixed(1));
    createCalcInput("length", userLenRowRatio, (userLenRowRatio * 10).toFixed(1));
    createCalcInput("stitches", stRatio, (stRatio * 10).toFixed(1));
    createCalcInput("rows", rowRatio, (rowRatio * 10).toFixed(1));

    // Add pinned section
    let sectionPinned = document.createElement("section");
    sectionPinned.classList.add("section-pinned");
    let pinnedTagline = document.createElement("h3");
    pinnedTagline.classList.add("tagline");
    pinnedTagline.textContent = "Pinned";
    let pinnedTitle = document.createElement("h2");
    pinnedTitle.classList.add("heading-secondary", "margin-bottom-md");
    pinnedTitle.textContent = "Keep your calculations handy!";
    let pinnedP = document.createElement("p");
    pinnedP.textContent = "Nothing pinned yet."
    pinnedP.setAttribute("id", "nothing-pinned");

    sectionPinned.appendChild(pinnedTagline);
    sectionPinned.appendChild(pinnedTitle);
    sectionPinned.appendChild(pinnedP);

    document.getElementsByTagName("body")[0].appendChild(sectionPinned);

    document.getElementById("convert-btn").disabled = true;
    note.textContent = "Your current inputs match the current conversions shown.";
    document.getElementsByTagName("form")[0].appendChild(note);

    document.getElementsByClassName('section-analysis')[0].scrollIntoView({
        behavior: "smooth"
      });
}

function createCalcInput(toConvert, convertRatio, convertedValue) {
    const convertedUnit = {
        'length': 'rows',
        'width': 'stitches',
        'stitches': 'stitches',
        'rows': 'rows'
    }

    let calculation = document.createElement("div");
    calculation.classList.add("flex-row", "flex-gap-sm", "margin-bottom-md");

    let calcCard = document.createElement("div");
    let gridName = "measure";
    if(toConvert === "stitches" || toConvert === "rows") {
        gridName = "convert";
    }
    calcCard.classList.add("grid", "calc-"+ gridName +"-grid", "card", "calc-card");

    let calcInputRow = document.createElement("div");
    calcInputRow.classList.add("calc-input-row");

    let calcColumn = document.createElement("div");
    calcColumn.classList.add("column");

    let calcLabel = document.createElement("label");
    calcLabel.classList.add("input-label", "calc-input-label");
    calcLabel.setAttribute("for", toConvert + "-input");
    calcLabel.textContent = toConvert.toUpperCase();
    
    let calcInput = document.createElement("input");
    calcInput.classList.add("input-text", "calc-input-text");
    calcInput.setAttribute("type", "number");
    calcInput.setAttribute("min", "1");
    calcInput.setAttribute("value", "10");
    calcInput.setAttribute("id", toConvert + "-input");
    calcInput.setAttribute("onchange", "handleCalcInputChange(event, " +convertRatio+", "+convertedValue+")");

    calcColumn.appendChild(calcLabel);
    calcColumn.appendChild(calcInput);

    let calcUnit = document.createElement("span");
    calcUnit.classList.add("calc-text-frag");
    if(toConvert === "length" || toConvert === "width") {
        calcUnit.classList.add("measure-unit");
        calcUnit.textContent = metric ? "cms" : "inches"
    } else {
        calcUnit.textContent = 'og ' + toConvert;
    }

    calcInputRow.appendChild(calcColumn);
    calcInputRow.appendChild(calcUnit);

    let calcP = document.createElement("p");
    calcP.classList.add("calc-text-frag");
    let calcPSpan = document.createElement("span");
    calcPSpan.textContent = convertedValue + ' ' + convertedUnit[toConvert];

    calcP.innerHTML = "is " + '<span>' + convertedValue + ' ' + convertedUnit[toConvert] + '</span>' + " in your gauge.";

    calcCard.appendChild(calcInputRow);
    calcCard.appendChild(calcP);

    let pinButton = document.createElement("button");
    pinButton.classList.add("flex-row-text-item", "fav-btn");
    pinButton.setAttribute("aria-label", "pin this calculation");
    pinButton.setAttribute("onclick", "handlePinButtonClick(event)");
    pinButton.innerHTML = "<ion-icon name=\"heart-empty\" class=\"fav-icon\"></ion-icon>";
    pinButton.firstChild.setAttribute("onmouseenter", "handlePinButtonMouseEnter(event)");
    pinButton.firstChild.setAttribute("onmouseleave", "handlePinButtonMouseLeave(event)");
    
    calculation.appendChild(calcCard);
    calculation.appendChild(pinButton);

    document.getElementsByClassName("section-calculations")[0].appendChild(calculation);
}

function handleCalcInputChange(e, convertRatio, convertValue) {
    convertValue = convertRatio * Number(e.target.value);

    let convertedValueTextNode = e.target.parentNode.parentNode.parentNode.getElementsByTagName("p")[0].getElementsByTagName("span")[0];
    const convertedValueUnit = convertedValueTextNode.textContent.split(" ")[1];
    convertedValueTextNode.textContent = convertValue.toFixed(1) + " " + convertedValueUnit;
}

function handlePinButtonMouseEnter(e) {
    e.target.setAttribute("name", "heart");
}

function handlePinButtonMouseLeave(e) {
    e.target.setAttribute("name", "heart-empty");
}

function handlePinButtonClick(e) {
    e.preventDefault();
    const pinnedP = document.getElementById("nothing-pinned");
    if(pinnedP){
        pinnedP.parentNode.removeChild(pinnedP);
    }

    const calcInputRow = e.target.parentNode.parentNode;
    const inputValue = calcInputRow.getElementsByTagName("input")[0].value;
    const inputUnit = calcInputRow.getElementsByTagName("span")[0].textContent;
    const textfrag = calcInputRow.getElementsByTagName("p")[0].textContent;
    const pinnedText = inputValue + " " + inputUnit + " " + textfrag;

    if(!pinned.has(pinnedText)) {
        pinned.add(pinnedText);
        // create pinned text
        let pinnedRow = document.createElement("div");
        pinnedRow.classList.add("flex-row");
        let pinnedRowP = document.createElement("p");
        pinnedRowP.textContent = pinnedText;
        

        let unpinButton = document.createElement("button");
        unpinButton.setAttribute("aria-label", "unpin this calculation");
        unpinButton.classList.add("flex-row-center-item", "fav-btn");
        unpinButton.setAttribute("onclick", "handleUnpinButtonClick(event)");
        unpinButton.innerHTML = "<ion-icon name=\"heart\" class=\"favd-icon\"></ion-icon>";
        
        pinnedRow.appendChild(pinnedRowP);
        pinnedRow.appendChild(unpinButton);

        document.getElementsByClassName("section-pinned")[0].appendChild(pinnedRow);

        // TODO: add a pinned notification
    }
}

// Handle unpin button
function handleUnpinButtonClick(e) {
    e.preventDefault();
    let pinnedRow = e.target.parentNode.parentNode;
    pinned.delete(pinnedRow.getElementsByTagName("p")[0].textContent);
    pinnedRow.parentNode.removeChild(pinnedRow);
    if(pinned.size === 0) {
        let pinnedP = document.createElement("p");
        pinnedP.textContent = "Nothing pinned yet."
        pinnedP.setAttribute("id", "nothing-pinned");

        document.getElementsByClassName("section-pinned")[0].appendChild(pinnedP);
    }
}

// Enable conversion submit button if user input value is diff from current conversion's values
function handleConvertInput(e) {
    if(!checkInputValues()) {
        if (document.getElementById("convert-btn").disabled) {
            document.getElementById("convert-btn").disabled = false;
            let note = document.getElementsByClassName("note-text")[0];
            note.parentNode.removeChild(note);
        }
    } else {
        document.getElementById("convert-btn").disabled = true;
        note.textContent = "Your current inputs match the current conversions shown.";
        document.getElementsByTagName("form")[0].appendChild(note);
    }
}

// Check if user's input value is same as the current conversion's values
function checkInputValues() {
    if(Number(document.getElementById("og-stitches").value) === ogStCount &&
        Number(document.getElementById("og-rows").value) === ogRowCount &&
        Number(document.getElementById("og-width").value) === ogWidth &&
        Number(document.getElementById("og-length").value) === ogLength &&
        Number(document.getElementById("user-stitches").value) === userStCount &&
        Number(document.getElementById("user-rows").value) === userRowCount &&
        Number(document.getElementById("user-width").value) === userWidth &&
        Number(document.getElementById("user-length").value) === userLength
    ) {
        return true;
    }
    return false;
}

// Add handler to inputs
document.getElementById("og-stitches").setAttribute("onchange", "handleConvertInput(event)");
document.getElementById("og-width").setAttribute("onchange", "handleConvertInput(event)");
document.getElementById("og-rows").setAttribute("onchange", "handleConvertInput(event)");
document.getElementById("og-length").setAttribute("onchange", "handleConvertInput(event)");

document.getElementById("user-stitches").setAttribute("onchange", "handleConvertInput(event)");
document.getElementById("user-width").setAttribute("onchange", "handleConvertInput(event)");
document.getElementById("user-rows").setAttribute("onchange", "handleConvertInput(event)");
document.getElementById("user-length").setAttribute("onchange", "handleConvertInput(event)");