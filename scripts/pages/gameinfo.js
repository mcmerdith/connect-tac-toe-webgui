var gameid,$display,$selectors,$inputs,$buttons;

var fields = {
  select: 'input[name="player-select"]',
  reg: 'option[name="reg-player-select"]',
  unreg: 'option[name="unreg-player-select"]'
};

function getSelected(field) {
  return $(field + ':checked');
}

function getField(field) {
  return $(field);
}

function getFieldWithClass(field, klass) {
  return $(field + '.' + klass);
}

// On load
$(function() {
  // Get the GameID from the url bar
  gameid = getUrlParameter('id');
  if (!gameid) {
    // Cancel loading if there isn't a GameID
    alert('No Game ID specified! Return to the homepage and try again.');
    return;
  }

  // Declare the IO
  // Display
  $display = {
    playerX: $('#playerx-display'),
    playerO: $('#playero-display'),
    ready: $('#game-ready-display'),
    gameid: $('#gameid-display'),
    response: {
      register: $('#register-response'),
      unregister: $('#unregister-reponse'),
      delete: $('#delete-response')
    }
  }

  $inputs = {
    registerId: $('input[name="reg-player-id"]')
  }

  $buttons = {
    play: $('#play-button-online'),
    playLocal: $('#play-button-local'),
    delete: $('#delete-button'),
    cancelDelete: $('#cancel-delete-button')
  }

  // Update fields with the gameid
  document.title = 'ConnectTacToe - Game Info (' + gameid + ')';
  $display.gameid.html(gameid);

  // Set the local button
  $buttons.playLocal.prop('href', 'play.html?id=' + gameid); // Set the URL
  $buttons.playLocal.prop('onclick', null); // Remove the alert

  // Attach a listener to the player selector radios
  getField(fields.select).click(function() {
    // Get the value of the selector
    let radioValue = getSelected(fields.select).val();
    // If one is selected, set the play buttons parameters
    if (radioValue) {
      $buttons.play.prop('href', 'play.html?id=' + gameid + '&player=' + radioValue); // Set the URL
      $buttons.play.prop('onclick', null); // Remove the alert
    }
  });

  showLoading(); // Show the user the page is loading

  // Request the game info
  let gameInfoWeb = new WebRequestor(true, 1000);
  gameInfoWeb.webRequest(gameid + '/info', processData, error);
});

function processData(data) {
  let jsonObject = JSON.parse(data);

  let ready = jsonObject.ready;
  let players = JSON.parse(jsonObject.players);
  let x = players.X;
  let o = players.O;

  $playerXSelect = getFieldWithClass(fields.select, 'x');
  $playerOSelect = getFieldWithClass(fields.select, 'o');
  let hasXVal = (x) ? true : false;
  let hasOVal = (o) ? true : false;

  $playerXSelect.val(x);
  $display.playerX.html((x) ? x : '');

  $playerOSelect.val(o);
  $display.playerO.html((o) ? o : '');

  getFieldWithClass(fields.reg, 'x').prop('disabled', hasXVal);
  getFieldWithClass(fields.reg, 'o').prop('disabled', hasOVal);

  $playerXSelect.prop('disabled', !hasXVal);
  $playerOSelect.prop('disabled', !hasOVal);

  $display.ready.html((ready) ? 'Ready' : 'Not Ready');

  hideLoading();
}

function registerPlayer() {
  let uid = $inputs.registerId.val();
  let player = getSelected(fields.reg).val();

  if (player === "select") {
    alert('Please select a player');
    return;
  }

  let webNoRepeat = new WebRequestor(false);
  webNoRepeat.webRequest(gameid + '/register?player=' + player + '&id=' + uid, (data) => {
    $display.response.register.removeClass('d-none');
    $display.response.register.html(data);
  }, error);
}

function unregisterPlayer() {
  let player = getSelected(fields.unreg).val();

  if (player === "select") {
    alert('Please select a player');
    return;
  }

  let webNoRepeat = new WebRequestor(false);
  webNoRepeat.webRequest(gameid + '/unregister?player=' + player, (data) => {
    $display.response.unregister.removeClass('d-none');
    $display.response.unregister.html(data);
  }, error);
}

function confirmDelete() {
  let webNoRepeat = new WebRequestor(false);
  webNoRepeat.webRequest(gameid + '/delete', (data) => {
    web = null;
    $display.response.delete.html(data);
    $display.response.delete.removeClass('d-none');
    $buttons.delete.remove();
    $buttons.cancelDelete.html('Close');
    // $('.btn').toArray().forEach(function(e) {
    //   $(e).prop('disabled', true);
    // });
  }, error);
}
