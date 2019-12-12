var web = new WebRequestor(true, 1000);
var $status;

$(function() {
  web.webRequest("querygames", processData, processError);
  $status = $('#connectionStatus');
});

function processData(data) {
  $('#server').html(web.connection.url);
  $status.html("Connected");
  $status.removeClass();
  $status.addClass("text-success");

  clearError();
  clearElem($('#games'));

  if (data.length > 2) {
    var x = data.substring(1, data.length - 1);
    var ids = x.split(',');

    ids.forEach(function(id) {
      var link = $('<a>', {
        href: 'gameinfo.html?id=' + id,
        html: id
      });
      var br = $('<br>', {});
      $('#games').append(link);
      $('#games').append(br);
    });

    $('#games').removeClass('d-none');
    $('#loading').hide();
  } else {
    // No data
    $('#loading').show();
    $('#loading').html("No games available");
  }
}

function processError(err) {
  error(err);
  clearElem($('#games'));
  $('#server').html("None");

  $status.html("Disconnected");
  $status.removeClass();
  $status.addClass("text-danger");
}

function newGame() {
  var id = Math.random().toString(36).substring(2, 10);

  var newGameWeb = new WebRequestor(false); // Create a new nonrepeating webrequestor
  newGameWeb.webRequest("create/" + id, () => {}, error);
}
