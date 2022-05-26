$(document).ready(function() {

	let resultSel = $("#result")
	let textareaSel = $("textarea")

	function getTitle() {
		return textareaSel.val().trim()
	}
	
	function cleanResult() {
		resultSel.removeClass("correct")
		resultSel.removeClass("incorrect")
		resultSel.removeClass("error")
		resultSel.html()
	}

	$("button").click(function (e) {
		e.stopPropagation()
		e.preventDefault()

		const title = getTitle()

		$.ajax({
			type: "POST",
			url: "./",
			data: JSON.stringify({"title": title}),
			contentType: "application/json",
			dataType: "json",
			success: handleResult,
			error: handleError	
		})
	})

	function handleResult(res) {
		cleanResult()		
		resultSel.addClass("correct")
		resultSel.html("The classifier predicted the tags: " + res.result)
		resultSel.show()
	}
	
	function handleError(_) {
		cleanResult()		
		resultSel.addClass("error")
		resultSel.html("An error occurred (see log).")
		resultSel.show()
	}
	
	textareaSel.on('keypress',function() {
		resultSel.hide()
	})
})