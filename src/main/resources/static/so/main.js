var RemovedTags =[]
var ExtraTags = []
var ReceivedTags = []

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems, options);
  });

  // Or with jQuery

  $(document).ready(function(){
    $('.modal').modal();
  });
          
function getPrediction() {
    /// clear tags in UI
    let predictionElement = document.getElementById("predictionElement");
    predictionElement.innerHTML = '';
    
    ///reset tag lists
    ReceivedTags = []
    ExtraTags = []
    RemovedTags =[]

    // Add new predicted tags
    let arrPreds = ["Tag1", "Tag2","More +"]; 
    ReceivedTags = arrPreds;

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
        span.innerHTML = arrPreds[i] + " ";

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


  function removeTag(tagid) {
    //tagid1 = String(tagid);
    var elem = document.getElementById(tagid.id);
    elem.remove();
    RemovedTags.push(tagid.id);
    return;
  }
