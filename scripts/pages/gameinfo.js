var gameid,$display,$selectors;

// On load
$(function() {
  // Get the GameID from the url bar
  gameid = getUrlParameter('id');
  if (!gameid) {
    // Cancel loading if there isn't a GameID
    alert('No Game ID specified! Return to the homepage and try again.');
    return;
  }

  // Update fields with the gameid
  document.title = 'ConnectTacToe - Game Info (' + gameid + ')';
  $('#gameid-display').html('Game ID: ' + gameid);

  // Attach a listener to the player selector radios
  $('input[type="radio"]').click(function() {
    // Get the value of the selector
    var radioValue = $('input[name="player-select"]:checked').val();
    // If one is selected, set the play buttons parameters
    if (radioValue) {
      let $playButton = $('#play-button');
      $playButton.prop('href', 'play.html?id=' + gameid + '&player=' + radioValue); // Set the URL
      $playButton.attr('onclick', null); // Remove the alert
    }
  });

  // Declare the IO
  // Display
  $display = {
    playerX: $('#playerx-display'),
    playerO: $('#playero-display')
  }

  // Input
  $selectors = {
    playerSelect: $('input[name="player-select"]'),
    register: $('option[name="reg-player-select"]'),
    unregister: $('option[name="unreg-player-select"]'),
    xEnabled: false,
    oEnabled: false
  }
  $inputs = {
    registerId: $('input[name="reg-player-id"]')
  }

  showLoading(); // Show the user the page is loading

  // Request the game info
  var gameInfoWeb = new WebRequestor(true, 1000);
  gameInfoWeb.webRequest(gameid + '/info', processData, error);
});

function processData(data) {
  let jsonObject = JSON.parse(data);

  let ready = jsonObject.ready;
  let players = JSON.parse(jsonObject.players);
  let x = players.X;
  let o = players.O;

  if (x) {
    $display.playerX.html(x);
    $('.x', $selectors.playerSelect).val(x);
    $selectors.xEnabled = true;
  } else {
    $display.playerX.html('');
    $('.x', $selectors.playerSelect).val('X');
    $selectors.xEnabled = false;
  }
  if (x) {
    $display.playerO.html(o);
    $('.o', $selectors.playerSelect).val(o);
    $selectors.oEnabled = true;
  } else {
    $display.playerO.html('');
    $('.o', $selectors.playerSelect).val('O');
    $selectors.oEnabled = false;
  }

  $('.x', $selectors.register).prop('disabled', $selectors.xEnabled);
  $('.o', $selectors.register).prop('disabled', $selectors.oEnabled);

  $('.x', $selectors.playerSelect).prop('disabled', !$selectors.xEnabled);
  $('.o', $selectors.playerSelect).prop('disabled', !$selectors.oEnabled);

  let status = (ready) ? 'Ready' : 'Not Ready';
  $('#gamereadydisplay').html('Game Status: ' + status);

  hideLoading();
}

function showLoading() {
  var loadingTemplate = document.getElementById('loading-template');

  $('.load').toArray().forEach(function(e) {
    let elem = $(e);
    let clon = loadingTemplate.content.cloneNode(true);

    if (elem.hasClass('load-large'))
      $(clon).children().toArray().forEach(function(e1) {
        $(e1).removeClass('spinner-border-sm');
      });
    if (elem.hasClass('load-prepend')) {
      elem.prepend(clon);
    } else {
      elem.append(clon);
    }
  });
}

function hideLoading() {
  $('.loading-icon').toArray().forEach(function(e) {
    $(e).remove();
  });
}

function registerPlayer() {
  var uid = $inputs.registerId.val();
  var player = $selectors.register.val();

  let webNoRepeat = new WebRequestor(false);
  webNoRepeat.webRequest(gameid + '/register?player=' + player + '&id=' + uid, (data) => {
    var response = $('#registerResponse');
    response.removeClass('d-none');
    response.html(data);
  }, (err) => {
    error(err);
  });
}

function unregisterPlayer() {
  var player = $selectors.unregister.val();

  let webNoRepeat = new WebRequestor(false);
  webNoRepeat.webRequest(gameid + '/unregister?player=' + player, (data) => {
    var $response = $('#unregisterResponse');
    $response.removeClass('d-none');
    $response.html(data);
  }, (err) => {
    error(err);
  });
}

function confirmDelete() {
  let webNoRepeat = new WebRequestor(false);
  webNoRepeat.webRequest(gameid + '/delete', (data) => {
    web = null;
    $('#deleteResponse').html(data);
    $('#deleteResponse').removeClass('d-none');
    $('#deleteButton').remove();
    $('#cancelDeleteButton').html('Close');
    $('.btn').toArray().forEach(function(e) {
      $(e).prop('disabled', true);
    });
  });
}
