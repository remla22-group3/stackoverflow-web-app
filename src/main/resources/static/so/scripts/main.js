let RemovedTags = [];
let ExtraTags = [];
let ReceivedTags = [];
let Tags = [];
let LastQuery = "";

let UserChoiceModel = [];
let UserChoiceSelection = [];
let UserChoiceManual = [];


$(document).ready(function() {
    $('.modal').modal();

    $.ajax({
        type: "GET",
        async: false,
        url: "./api/tags",
        contentType: "application/json",
        dataType: "json",
        success: handleResultTags,
        error: handleErrorTags
    });

    let InputSearchElement1 = document.getElementById("search");
    InputSearchElement1.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            getPrediction();
        }
    });

    let InputSearchElement2 = document.getElementById("searchTags");
        InputSearchElement2.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            SearchTagsManual();
        }
    });
});

function getPrediction() {
    /// clear tags in UI
    let predictionElement = document.getElementById("predictionElement");
    predictionElement.innerHTML = '';

    ///reset tag lists
    ReceivedTags = [];
    ExtraTags = [];
    RemovedTags =[];

    let title = document.getElementById("search").value;
    LastQuery = title;
    // Add new predicted tags
    $.ajax({
        type: "POST",
        async: false,
        url: "./api/predict",
        data: JSON.stringify({"title": title}),
        contentType: "application/json",
        dataType: "json",
        success: handleResult,
        error: handleErrorPredict
    })


    let predArr = ["More +"];
    for (let t = 0; t < ReceivedTags.length; t++) {
        predArr.push(ReceivedTags[t]);
    }

    for (const elem of predArr) {
        let a;
        let span;
        if (elem === "More +") {
            a = document.createElement("a");
            a.setAttribute("href","#modal1");
            a.setAttribute("class","modal-trigger");


            span = document.createElement("span");
            a.appendChild(span);
            span.innerHTML = elem;
            predictionElement.appendChild(a);

        }
        else {
            a = document.createElement("a");
            const tagTemp = String(elem);
            a.setAttribute("id",tagTemp);

            span = document.createElement("span");
            a.appendChild(span);
            span.innerHTML = elem + " ";

            const spanX = document.createElement("a");
            span.appendChild(spanX);
            spanX.innerHTML = "+";
            const AddTagFromModelF = "AddTagFromModel(\""+tagTemp+"\")";
            spanX.setAttribute("onclick",AddTagFromModelF);

            predictionElement.appendChild(a);
        }
    }
}

function handleResult(res) {
    const tempA = res.result;
    for (let r = 0; r < tempA.length; r++) {
        ReceivedTags.push(tempA[r]);
    }

}

function handleErrorPredict(_) {
    console.log("Error in predict.");
}

function handleResultTags(res) {
    Tags = res.result;
}

function handleErrorTags(_) {
    console.log("Error in tags.");
}

function removeTag(tagId) {
    const elem = document.getElementById(tagId);
    elem.remove();
    if (!ExtraTags.includes(tagId)) {
        RemovedTags.push(tagId);
    }
    else {
        for (let r = 0; r < ExtraTags.length; r++) {
            if (ExtraTags[r] === tagId) {
                ExtraTags.splice(r, 1);
            }
        }
    }
}

function AddTagFromModel(tagName) {
    if (!UserChoiceModel.includes(tagName) && !UserChoiceSelection.includes(tagName) && !UserChoiceManual.includes(tagName))
    {
        let UserChoiceElement = document.getElementById("UserChoiceElement");
        const a = document.createElement("a");
        const tagTemp = "TagModel_" + tagName;
        a.setAttribute("id",tagTemp);
        a.setAttribute("class","TagChoice");
        const span = document.createElement("span");
        span.setAttribute("class","addedtagmodel");
        a.setAttribute("ValSel",tagName);
        //span.style.backgroundColor = "#3db049";
        tagPropertiesUtil(a, span, tagName, tagTemp, UserChoiceElement);
        UserChoiceModel.push(tagName);
    }
}

function AddTagFromSelection(tagName) {
    const SelectionSearchToRemoveId = "SelectionSearch_"+tagName;
    let SelectionSearchToRemove = document.getElementById(SelectionSearchToRemoveId);
    SelectionSearchToRemove.remove();
    if (!UserChoiceModel.includes(tagName) && !UserChoiceSelection.includes(tagName) && !UserChoiceManual.includes(tagName))
    {
        let UserChoiceElement = document.getElementById("UserChoiceElement");
        const a = document.createElement("a");
        const tagTemp = "TagSelection_" + tagName;
        a.setAttribute("id",tagTemp);
        a.setAttribute("class","TagSelection");
        a.setAttribute("ValSel",tagName);
        const span = document.createElement("span");
        span.setAttribute("class","addedtagselection");
        //span.style.backgroundColor = "#3db049";
        tagPropertiesUtil(a, span, tagName, tagTemp, UserChoiceElement);
        UserChoiceSelection.push(tagName);
    }
}

function AddTagFromManual(tagName) {
    const ManualSearchToRemoveId = "ManualSearch_"+tagName;
    let ManualSearchToRemove = document.getElementById(ManualSearchToRemoveId);
    ManualSearchToRemove.remove();
    if (!UserChoiceModel.includes(tagName) && !UserChoiceSelection.includes(tagName) && !UserChoiceManual.includes(tagName))
    {
        let UserChoiceElement = document.getElementById("UserChoiceElement");
        const a = document.createElement("a");
        const tagTemp = "TagManual_" + tagName;
        a.setAttribute("id",tagTemp);
        a.setAttribute("class","TagManual");
        a.setAttribute("ValSel",tagName);
        const span = document.createElement("span");
        span.setAttribute("class","addedtagmanual");
        //span.style.backgroundColor = "#3db049";
        tagPropertiesUtil(a, span, tagName, tagTemp, UserChoiceElement);
        UserChoiceManual.push(tagName);
    }
}

function tagPropertiesUtil(a, span, tagName, tagTemp, UserChoiceElement) {
    a.appendChild(span);
    span.innerHTML = tagName + " ";
    const spanX = document.createElement("a");
    span.appendChild(spanX);
    spanX.innerHTML = "x";
    const removeTagF = "removeTag("+tagTemp+")";
    spanX.setAttribute("onclick",removeTagF);
    UserChoiceElement.appendChild(a);
}

function SearchTagsManual() {
    let searchedTag = document.getElementById("searchTags").value.toLowerCase();
    let matchedName = [];
    //(!ReceivedTags.includes(i) || RemovedTags.includes(i)) && !ExtraTags.includes(i)
    let exactMatchFlag = false;

    for (let i = 0; i< Tags.length; i++) {
        //if (Tags[i].includes(searchedTag) && ((!UserChoiceModel.includes(searchedTag) && !UserChoiceSelection.includes(searchedTag) && !UserChoiceManual.includes(searchedTag)) || ((searchedTag != Tags[i]) && (Tags[i].includes(searchedTag)))) ) {
        if (Tags[i].includes(searchedTag) && !UserChoiceModel.includes(Tags[i]) && !UserChoiceSelection.includes(Tags[i]) && !UserChoiceManual.includes(Tags[i])) {
            matchedName.push(Tags[i]);
        }
    }

    if (!UserChoiceModel.includes(searchedTag) && !UserChoiceSelection.includes(searchedTag) && !UserChoiceManual.includes(searchedTag) && !matchedName.includes(searchedTag)) {
         exactMatchFlag = true;
    }

    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';

    for (let j = 0; j < matchedName.length; j++) {
        const a = document.createElement("a");
        const tagTemp = "SelectionSearch_"+matchedName[j];
        a.setAttribute("id",tagTemp);

        const span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = matchedName[j] + " ";

        const aX = document.createElement("a");
        span.appendChild(aX);
        aX.innerHTML = "+";
        const addTagSelection = "AddTagFromSelection(\""+matchedName[j]+"\")";
        aX.setAttribute("onclick",addTagSelection);

        ManualTagElement.appendChild(a);
    }

    if (exactMatchFlag) {
        const a = document.createElement("a");
        const tagTemp = "ManualSearch_"+searchedTag;
        a.setAttribute("id",tagTemp);
        const span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = searchedTag + " ";
        const aX = document.createElement("a");
        span.appendChild(aX);
        aX.innerHTML = "+";
        const addTagSelection = "AddTagFromManual(\""+searchedTag+"\")";
        aX.setAttribute("onclick",addTagSelection);
        ManualTagElement.appendChild(a);
    }

}

function ModalSearchClose() {
    let searchedTag = document.getElementById("searchTags").value;
    searchedTag.value = '';
    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';
}

function SubmitSearch() {
    const allTags = UserChoiceModel.concat(UserChoiceSelection, UserChoiceManual);
    $.ajax({
        type: "PUT",
        async: false,
        url: "./api/submit",
        data: JSON.stringify({"title": LastQuery, "result": allTags}),
        contentType: "application/json",
        success: handleResultSubmit,
        error: handleErrorSubmit
    });
}

function handleResultSubmit(_) {
    ReceivedTags = [];
    ExtraTags = [];
    RemovedTags =[];
    UserChoiceModel = [];
    UserChoiceSelection = [];
    UserChoiceManual = [];
    LastQuery = "";
    const searchElement = document.getElementById("search");
    searchElement.value = "";
    const searchTagsElement = document.getElementById("searchTags");
    searchTagsElement.value = "";
    const userChoiceElement = document.getElementById("UserChoiceElement");
    userChoiceElement.replaceChildren();
    const predictionElement = document.getElementById("predictionElement");
    predictionElement.replaceChildren();
    const manualTagElement = document.getElementById("ManualTagElement");
    manualTagElement.replaceChildren();
}

function handleErrorSubmit(_) {
    console.log("Error in submit.");
}
