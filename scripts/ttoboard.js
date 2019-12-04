function TTOBoard() {
	// Create a 2D array of boards
	this.boards = new Array(3);
	for (var i = 0; i < this.boards.length; i++) {
		this.boards[i] = new Array(3);
		for(var k = 0; k < this.boards[i].length; k++) {
			this.boards[i][k] = new C4Board();
			console.log(i + " " + k + " - " + this.boards[i][k]);
		}
	}

	this.winner = null;
	this.player = players.X;
	this.playerid = null;

	var self = this;

	// Called to retrieve the JSON state and update the board view
	this.getState = function() {
		webReq('http://localhost:3000/' + gameid + '/get', function(data, state, req) {
			self.updateState(data);
			setTimeout(self.getState(), 750);
		});
	}

	this.updateState = function(data) {
		var jsonstate = JSON.parse(data);

		var winner = jsonstate.winner;
		var player = jsonstate.player;
		var playerid= jsonstate.playerid;

		this.winner = winner;
		this.player = player;
		this.playerid = playerid;

		var boardStates = jsonstate.boards;

		for (xpos in boardStates) {
			for (ypos in boardStates[xpos]) {
				// Positions
				var x = parseInt(xpos);
				var y = parseInt(ypos);

				// JSON board object
				var board = boardStates[xpos][ypos];

				// Values
				var winner = board.winner;
				var state = board.state;

				var boardActual = this.boards[x][y];
				boardActual.winner = winner;

				for (rowpos in board.rows) {
					for (spacepos in board.rows[rowpos]) {
						var row = parseInt(rowpos);
						var space = parseInt(spacepos);

						// update the player
						boardActual.rows[row].spaces[space].player = board.rows[rowpos][spacepos];
					}
				}
			}
		}
	}

	this.render = function() {
		
	}
}