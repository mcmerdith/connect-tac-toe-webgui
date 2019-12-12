function TTOBoard() {
  var self = this;

  // Create a 2D array of boards
  this.boards = new Array(3);
  for (var i = 0; i < this.boards.length; i++) {
    this.boards[i] = new Array(3);
    for (var k = 0; k < this.boards[i].length; k++) {
      this.boards[i][k] = new C4Board();
    }
  }

  this.winner = null;
  this.player = players.X;
  this.playerid = null;

  this.states = {
    current: "",
    old: "",
    differs: function() {
      return self.states.current !== self.states.old;
    },
    resolve: function() {
      self.states.old = self.states.current;
    },
    hasRender: false
  }

  // Called to retrieve the JSON state and update the board view
  this.maintainState = function() {
    let web = new WebRequestor(true, 1000);
    web.webRequest(gameid + '/get', (data) => {
      self.updateState(data);
    }, error);
  }

  this.updateState = function(data) {
    var jsonstate = JSON.parse(data);

    self.states.current = data;

    if (self.states.differs()) {
      self.states.hasRender = true;
      self.states.resolve();
    }

    var winner = jsonstate.winner;
    var player = jsonstate.player;
    var playerid = jsonstate.playerid;

    self.winner = winner;
    self.player = player;
    self.playerid = playerid;

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

        var boardActual = self.boards[x][y];
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
    if (self.states.hasRender) {
      self.states.hasRender = false;
    } else {
      return;
    }

    $('#player-display').html(self.playerid + ' (' + self.player + ')');
		if (local) player = self.playerid;

    for (let tx = 0; tx < self.boards.length; tx++) {
      for (let ty = 0; ty < self.boards[tx].length; ty++) {
        let b = self.boards[tx][ty];
        let bo = $('#rows > #' + tx + ' > #' + ty);
        bo.css('background-repeat', 'no-repeat');
        bo.css('background-size', 'auto 100%');
        bo.css('background-position', 'center');

        if (b.winner) {
          bo.css('background-color', 'rgba(100,100,100,0.5)');
          let bx = $('#rows > #' + tx + ' > #' + ty + ' div');
          bx.removeClass('border');
          if (b.winner === players.X) {
            bo.css('background-image', 'url(images/redx1024.png)');
          } else if (b.winner === players.O) {
            bo.css('background-image', 'url(images/yellowo1024.png)');
          }
        }

        for (let cx = 0; cx < b.rows.length; cx++) {
          let row = b.rows[b.rows.length - 1 - cx];
          for (let cy = 0; cy < row.spaces.length; cy++) {
            let block = $('#rows > #' + tx + ' > #' + ty + ' > #' + cx + ' > #' + cy + ' > img');

            let s = row.spaces[cy];

            let player = s.player;

            if (player === players.X) {
              block.prop('src', 'images/redx1024.png');
            } else if (player === players.O) {
              block.prop('src', 'images/yellowo1024.png');
            } else {
              block.prop('src', 'images/blank1024.png');
            }
          }
        }
      }
    }

    if (self.winner) {
      alert(self.winner + ' wins!');
    }
  }
}
