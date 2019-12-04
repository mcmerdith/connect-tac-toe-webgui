function C4Board() {
	this.rows = new Array(6);
	for (var i = 0; i < this.rows.length; i++) {
		this.rows[i] = new C4Row();
	}
	this.winner = null;
}

function C4Row() {
	this.spaces = new Array(7);

	for (var i = 0; i < this.spaces.length; i++) {
		this.spaces[i] = new Space();
	}
}

function Space() {
	this.player = players.X;
}