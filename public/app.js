$.getJSON('/articles', function(data) {
  for (let i = 0; i < data.length; i++) {
    $('#articles').append(
      `<div class="tile is-parent">
        <article class="tile is-child notification is-info">
          <div class="content">
            <p data-id=${ data[i]._id } class="title">${ data[i].title }</p>
            <span class="subtitle">
              <a target="_blank" href=${ data[i].link }>
              ${ data[i].link }
              </a>
            </span>
            <div class="content">
              <p data-id=${ data[i]._id }>${ data[i].summary }</p>
            </div>
          </div>
        </article>
      </div>`
    );
  }
});

$(document).on('click', 'p', function() {
  $('#notes').empty();
  let thisId = $(this).attr('data-id');

  $.ajax({
    method: 'GET',
    url: '/articles/' + thisId
  }).then(function(data) {
    let bodyText = '';
    if (data.body) {
      bodyText = data.body;
    }
    console.log(data);
    $('#notes').append(
      `<div class="tile is-parent">
        <article class="tile is-child notification is-success">
          <div class="content">
            <p class="title note-title">${ data.title }</p>
            <div class="content">
              <div class="field">
                <div class="control">
                  <input id="title-input" class="input is-info" type="text" placeholder="Note Title">
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <textarea id="body-input" class="textarea is-info" placeholder=${ bodyText }></textarea>
                </div>
              </div>
              <div class="field">
                <div class="control">
                  <button id="save-note" class="button is-link" data-id=${ data._id }>Submit</button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>`
    );

    if (data.note) {
      $('#title-input').val(data.note.title);
      $('#body-input').val(data.note.body);
    }
  })
});

$(document).on('click', '#save-note', function() {
  let thisId = $(this).attr('data-id');

  $.ajax({
    method: 'POST',
    url: '/articles/' + thisId,
    data: {
      title: $('#title-input').val(),
      body: $('#body-input').val()
    }
  }).then(function(data) {
      console.log(data);

      $('#notes').empty();
    });

  $('#title-input').val('');
  $('#body-input').val('');
});