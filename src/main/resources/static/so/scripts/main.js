let RemovedTags = [];
let ExtraTags = [];
let ReceivedTags = [];
let Tags = [];
let LastQuery = "";

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
    predArr.push(...ReceivedTags);

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
            span.innerHTML = Tags[elem] + " ";

            const spanX = document.createElement("a");
            span.appendChild(spanX);
            spanX.innerHTML = "x";
            const removeTagF = "removeTag("+tagTemp+")";
            spanX.setAttribute("onclick",removeTagF);
            spanX.setAttribute("href","#modal1");

            predictionElement.appendChild(a);
        }
    }
}

function handleResult(res) {
    ReceivedTags = res.result;
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

function addTagManual1(TagManual1) {
    let TagManual = TagManual1.id;
    let ManualTagElement = document.getElementById(TagManual);
    let ToInsertId = TagManual.split("_")[1];
    ManualTagElement.remove();

    for (let r = 0; r < RemovedTags.length; r++) {
        if (RemovedTags[r] === ToInsertId){
            RemovedTags.splice(r, 1);
        }
    }

    ExtraTags.push(parseInt(ToInsertId,10));

    let predictionElement = document.getElementById("predictionElement");
    const a = document.createElement("a");
    let tagTemp = String(ToInsertId)
    a.setAttribute("id",tagTemp);

    const span = document.createElement("span");
    a.appendChild(span);
    span.innerHTML = Tags[ToInsertId] + " ";

    const spanX = document.createElement("a");
    span.appendChild(spanX);
    spanX.innerHTML = "x";

    const removeTagF = "removeTag("+tagTemp+")";
    spanX.setAttribute("onclick",removeTagF);
    spanX.setAttribute("href","#modal1");

    predictionElement.appendChild(a);
}

function SearchTagsManual() {
    let searchedTag = document.getElementById("searchTags").value;
    let matchedId = [];
    let matchedName = [];
    for (let i = 0; i< Tags.length; i++) {
        if (Tags[i].includes(searchedTag) &&
            (!ReceivedTags.includes(i) || RemovedTags.includes(i)) &&
            !ExtraTags.includes(i)) {

            matchedId.push(i);
            matchedName.push(Tags[i]);
        }
    }

    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';

    for (let j = 0; j < matchedId.length; j++) {
        const a = document.createElement("a");
        const tagTemp = "TagManual_"+String(matchedId[j]);
        a.setAttribute("id",tagTemp);

        const span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = matchedName[j] + " ";

        const aX = document.createElement("a");
        span.appendChild(aX);
        aX.innerHTML = "+";
        const addTagManual = "addTagManual1("+tagTemp+")";
        aX.setAttribute("onclick",addTagManual);

        ManualTagElement.appendChild(a);
    }
}

function ModalSearchClose() {
    let searchedTag = document.getElementById("searchTags").value;
    searchedTag.value = '';
    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';
}
