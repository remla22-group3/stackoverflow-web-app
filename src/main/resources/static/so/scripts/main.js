var RemovedTags =[]
var ExtraTags = []
var ReceivedTags = []
var Tags = []
var LastQuery = ""

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    ///var instances = M.Modal.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.modal').modal();

    $.ajax({
        			type: "GET",
        			async: false,
        			url: "./api/tags",
        			//data: JSON.stringify({"title": title}),
        			contentType: "application/json",
        			dataType: "json",
        			success: handleResultTags,
        			error: handleErrorTags
        	});

        let InputsearchElement1 = document.getElementById("search");
        InputsearchElement1.addEventListener("keypress", function(event) {
          if (event.key === "Enter") {
            event.preventDefault();
            getPrediction();
          }
        });

        let InputsearchElement2 = document.getElementById("searchTags");
                InputsearchElement2.addEventListener("keypress", function(event) {
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
    ReceivedTags = []
    ExtraTags = []
    RemovedTags =[]

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
    			error: handleError
    	})


    let arrPreds = ["More +"];
    arrPreds.push(...ReceivedTags);
    //.push();

    //let ul = document.getElementById("id_ul");
    let i =0;


    arrPreds.map(arr=>{

    if(arr == "More +")
    {
        var a = document.createElement("a");
        a.setAttribute("href","#modal1");
        a.setAttribute("class","modal-trigger");


        var span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = arrPreds[i];
        predictionElement.appendChild(a);

    }
    else{
        var a = document.createElement("a");
        tagTemp = String(arrPreds[i])
        a.setAttribute("id",tagTemp);

        var span = document.createElement("span");
        a.appendChild(span);
        span.innerHTML = Tags[arrPreds[i]] + " ";

        var spanX = document.createElement("a");
        span.appendChild(spanX);
        spanX.innerHTML = "x";
        //spanX.onclick(removeTag(tagTemp));
        removetagf = "removeTag("+tagTemp+")";
        spanX.setAttribute("onclick",removetagf);
        spanX.setAttribute("href","#modal1");

        predictionElement.appendChild(a);
    }

    i++;

    })
  }

function handleResult(res) {
		ReceivedTags = res.result
		console.log(ReceivedTags)
	};

function handleError(_) {
    		console.log("errrrror in predict")
    };

function handleResultTags(res) {
		Tags = res.result
		console.log(Tags)
	};

function handleErrorTags(_) {
    		console.log("errrrror in fetching tag pairs")
    };

  function removeTag(tagid) {
    var elem = document.getElementById(tagid);
    elem.remove();
    if(!ExtraTags.includes(tagid))
    {
        RemovedTags.push(tagid);
    }
    else{
        for(var r=0; r < ExtraTags.length; r++){
               if(ExtraTags[r]==ToInsertId){
                  ExtraTags.splice(r, 1);
               }
        }
    }
    return;
  };

  function addTagManual1(TagManual1){
    TagManual = TagManual1.id;
    let ManualTagElement = document.getElementById(TagManual);
    ToInsertId = TagManual.split("_")[1];
    ManualTagElement.remove();

    for(var r=0; r < RemovedTags.length; r++){
       if(RemovedTags[r]==ToInsertId){
          RemovedTags.splice(r, 1);
       }
    }

    ExtraTags.push(parseInt(ToInsertId,10));

    let predictionElement = document.getElementById("predictionElement");
    var a = document.createElement("a");
    tagTemp = String(ToInsertId)
    a.setAttribute("id",tagTemp);

    var span = document.createElement("span");
    a.appendChild(span);
    span.innerHTML = Tags[ToInsertId] + " ";

    var spanX = document.createElement("a");
    span.appendChild(spanX);
    spanX.innerHTML = "x";

    removetagf = "removeTag("+tagTemp+")";
    spanX.setAttribute("onclick",removetagf);
    spanX.setAttribute("href","#modal1");

    predictionElement.appendChild(a);
  };


  function SearchTagsManual(){
    let searchedTag = document.getElementById("searchTags").value;
    matchedId = []
    matchedName = []
    for(var i=0; i< Tags.length; i++){
        if(Tags[i].includes(searchedTag) && (!ReceivedTags.includes(i) || RemovedTags.includes(i)) && !ExtraTags.includes(i) ){
            matchedId.push(i);
            matchedName.push(Tags[i]);
        }
    }

    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';

    var j = 0;

    for(var j=0; j<matchedId.length; j++)
    {
            var a = document.createElement("a");
            tagTemp = "TagManual_"+String(matchedId[j])
            a.setAttribute("id",tagTemp);

            var span = document.createElement("span");
            a.appendChild(span);
            span.innerHTML = matchedName[j] + " ";

            var aX = document.createElement("a");
            span.appendChild(aX);
            aX.innerHTML = "+";
            addTagManual = "addTagManual1("+tagTemp+")";
            aX.setAttribute("onclick",addTagManual);

            ManualTagElement.appendChild(a);
    }
  };

  function ModalSearchClose(){
      let searchedTag = document.getElementById("searchTags").value;
      searchTags.value = '';
      let ManualTagElement = document.getElementById("ManualTagElement");
      ManualTagElement.innerHTML = '';
  }


