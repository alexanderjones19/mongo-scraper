$.getJSON('/articles', function(data) {
  for (let i = 0; i < data.length; i++) {
    $('#articles').append(
      `<div class="tile is-parent">
        <article class="tile is-child notification is-info">
          <div class="content">
            <p class="title">${ data[i].title }</p>
            <p class="subtitle">
              <a target="_blank" href=${ data[i].link }>
              ${ data[i].link }
              </a>
            </p>
            <div class="content">
              <p>${ data[i].summary }</p>
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
    url: '/articles' + this.Id
  }).then(function(data) {
    for (let i = 0; i < data.length; i++) {
      $('#notes').append(
        `<div class="tile is-parent">
          <article class="tile is-child notification is-success">
            <div class="content">
              <p class="title note-title">${ data[i].title }</p>
              <div class="content">
                
              </div>
            </div>
          </article>
        </div>`
      );
    }
  })
});