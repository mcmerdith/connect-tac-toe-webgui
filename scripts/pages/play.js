var ttoboard, interval, gameid, player, x, y, local = false;

var templates = {
  c4: null,
  tto: null
}

var players = {
  X: 'X',
  O: 'O',
  E: 'E'
}

$(() => {
  // Define the templates
  gameid = getUrlParameter('id');
  player = getUrlParameter('player');

  if (!gameid) {
    alert('Missing Game ID or Player ID');
    return;
  }
  if (!player) {
    local = true;
  }

  $('#gameid-display').html(gameid);
  $('#playerid-display').html(player);

  templates.c4 = document.getElementById('C4-row-template');
  templates.tto = document.getElementById('TTO-row-template');

  // Create a blank grid
  attachCloneToParent(templates.tto, $('#rows'), 3, ''); // TTO Row Gen

  let tRows = $('.row.tto').toArray();

  tRows.forEach((e) => {
    let tCols = $(e).find('.col-4.tto').toArray();
    tCols.forEach((e1) => {
      attachCloneToParent(templates.c4, e1, 6, ''); // For each TTO Row, add 6 C4 Rows
    });
  });

  for (let x = 0; x < tRows.length; x++) {
    let cols = $(tRows[x]).find('.col-4.tto').toArray();
    for (let y = 0; y < cols.length; y++) {
      let cRows = $(cols[y]).find('.row.c4').toArray();
      for (let z = 0; z < cRows.length; z++) {
        let spaces = $(cRows[z]).find('.col.c4').toArray();
        for (let w = 0; w < spaces.length; w++) {
          let $space = $(spaces[w]);
          $space.attr('onclick', ('handleClick(' + y + ',' + x + ',' + w + ');'));

          $space.append(
            $('<img>', {
              src: 'images/blank1024.png',
              class: 'w-100'
            })
          );
        }
      }
    }
  }

  // Define the TTO board
  ttoboard = new TTOBoard();

  ttoboard.render();
  interval = setInterval(ttoboard.render, 500);

  ttoboard.maintainState(); // updateState will call itself recursively so no need to set a timeout
}); // Render a blank board on window load

function attachCloneToParent(clone, parent, count, idbase) {
  for (var p = 0; p < count; p++) {
    let clon = clone.content.cloneNode(true);
    // $(clon).prop('id', idbase + p);
    let par = $(parent);
    par.append(clon);
    par.find('> :last-child').prop('id', idbase + p);
  }
}

function handleClick(ttox, ttoy, c4x) {
  let web = new WebRequestor(false);

  showLoading();

  web.webRequest(gameid + '/play?col=' + ttox + '&row=' + ttoy + '&c4col=' + c4x + '&id=' + player, () => {
    hideLoading();
  }, (err) => {
    error(err);
    setTimeout(clearError, 2500);
  });
}
