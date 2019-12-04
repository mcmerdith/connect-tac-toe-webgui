var ttoboard;
var interval;
var gameid;

var templates = {
	c4: null,
	tto: null
}

var players = {
	X: "X",
	O: "O",
	E: "E"
}

$(function() {
	// Define the templates
	gameid = getUrlParameter("id");
	templates.c4 = document.getElementById("c4rowtemp");
	templates.tto = document.getElementById("ttorowtemp");

	// Create a blank grid
	attachCloneToParent(templates.tto, $('#rows'), 3, ""); // TTO Row Gen
	$('div', '.row, .tto').toArray().forEach(function(e) {
		attachCloneToParent(templates.c4, e, 6, ""); // For each TTO Row, add 6 C4 Rows
	});

	// Define the TTO board
	ttoboard = new TTOBoard();
	
	ttoboard.getState(); // updateState will call itself recursively so no need to set a timeout

	interval = setInterval(ttoboard.render, 500);

}); // Render a blank board on window load

function attachCloneToParent(clone, parent, count, idbase) {
	for(var p = 0; p < count; p++) {
		var clon = clone.content.cloneNode(true);
		$(':first-child', clon).prop("id", idbase + p);
		$(parent).append(clon);
	}
}

function handleClick(ttox, ttoy, c4x) {

}