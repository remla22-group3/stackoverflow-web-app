var RemovedTags =[]
var ExtraTags = []
var ReceivedTags = []
var Tags = []

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


    let arrPreds = ReceivedTags;
    arrPreds.push("More +");

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
	}

	function handleError(_) {
    		console.log("errrrror in predict")
    	}

function handleResultTags(res) {
		Tags = res.result
		console.log(Tags)
	}

	function handleErrorTags(_) {
    		console.log("errrrror in fetching tag pairs")
    	}

  function removeTag(tagid) {
    //tagid1 = String(tagid);
    var elem = document.getElementById(tagid.id);
    elem.remove();
    RemovedTags.push(tagid.id);
    return;
  }

  function SearchTagsManual(){
    let searchedTag = document.getElementById("searchTags").value;
    matchedId = []
    matchedName = []
    for(var i=0; i< Tags.length; i++){
        if(Tags[i].includes(searchedTag)){
            matchedId.push(i);
            matchedName.push(Tags[i]);
        }
    }

    let ManualTagElement = document.getElementById("ManualTagElement");
    ManualTagElement.innerHTML = '';

    var j = 0;
    //matchedId.map(arr=>{
    for(var j=0; j<matchedId.length; j++)
    {
            var a = document.createElement("a");
            tagTemp = "TagManual"+String(matchedId[j])
            a.setAttribute("id",tagTemp);

            var span = document.createElement("span");
            a.appendChild(span);
            span.innerHTML = matchedName[j] + " ";

            var spanX = document.createElement("a");
            span.appendChild(spanX);
            spanX.innerHTML = "+";
            //spanX.onclick(removeTag(tagTemp));
            addTagManual = "addTagManual("+tagTemp+")";
            spanX.setAttribute("onclick",addTagManual);

            ManualTagElement.appendChild(a);
    }
       // j++;

      //})


  }

