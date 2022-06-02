let RemovedTags = [];
let ExtraTags = [];
let ReceivedTags = [];
let Tags = [];

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
    });

    let predictionArr = ReceivedTags;
    predictionArr.push("More +");

    for (const predictionElem of predictionArr) {
        let a;
        let span;
        if (predictionElem === "More +") {
            a = document.createElement("a");
            a.setAttribute("href","#modal1");
            a.setAttribute("class","modal-trigger");


            span = document.createElement("span");
            a.appendChild(span);
            span.innerHTML = predictionElem;
            predictionElement.appendChild(a);
        }
        else {
            a = document.createElement("a");
            const tagTemp = String(predictionElem);
            a.setAttribute("id",tagTemp);

            span = document.createElement("span");
            a.appendChild(span);
            span.innerHTML = Tags[predictionElem] + " ";

            const spanX = document.createElement("a");
            span.appendChild(spanX);
            spanX.innerHTML = "x";
            const removeTagFunc = "removeTag("+tagTemp+")";
            spanX.setAttribute("onclick", removeTagFunc);
            spanX.setAttribute("href","#modal1");

            predictionElement.appendChild(a);
        }
    }
}

function handleResult(res) {
    ReceivedTags = res.result
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

function removeTag(tagid) {
    const elem = document.getElementById(tagid.id);
    elem.remove();
    RemovedTags.push(tagid.id);
}

function SearchTagsManual() {
    let searchedTag = document.getElementById("searchTags").value;
    let matchedId = [];
    let matchedName = [];
    for (let i = 0; i < Tags.length; i++) {
        if (Tags[i].includes(searchedTag)) {
            matchedId.push(i);
            matchedName.push(Tags[i]);
        }
    }

    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';

    for (let i = 0; i < matchedId.length; i++) {
        const a = document.createElement("a");
        let tagTemp = "TagManual" + String(matchedId[i]);
        a.setAttribute("id", tagTemp);

        const span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = matchedName[i] + " ";

        const spanX = document.createElement("a");
        span.appendChild(spanX);
        spanX.innerHTML = "+";
        //spanX.onclick(removeTag(tagTemp));
        const addTagManual = "addTagManual(" + tagTemp + ")";
        spanX.setAttribute("onclick", addTagManual);

        ManualTagElement.appendChild(a);
    }
}
