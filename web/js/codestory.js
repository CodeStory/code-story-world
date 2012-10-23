var current_login = 'dgageot';

function refreshRegistrationLinks() {
  $.getJSON('registrations/' + current_login, function (json) {
    $('.register').html('Register');

    _.each(json, function (talkId) {
      $('#session-' + talkId + ' a.register').html('Unregister');
    });
  });
}

var dayLabels = {
  '2012-11-12':'Monday, Nov. 12 2012',
  '2012-11-13':'Tuesday, Nov. 13 2012',
  '2012-11-14':'Wednesday, Nov. 14 2012',
  '2012-11-15':'Thursday, Nov. 15 2012',
  '2012-11-16':'Friday, Nov. 16 2012'
}

function refreshPlanning() {
  $.getJSON('planning.json', function (json) {
    _.each(json.days, function (day) {
      day.dayLabel = dayLabels[day.day];

      _.each(day.slots, function (slot) {
        _.each(slot.talks, function (talk) {
          talk.speakers_string = talk.speakers.join(', ');
        })
      })
    })

    $("#content").html(Hogan.compile($('#talks-template').html()).render(json));
    refreshRegistrationLinks();
  });
}

function register(login, talkId, callback) {
  $.post('register', {login:login, talkId:talkId}, callback);
}

function unregister(login, talkId, callback) {
  $.post('unregister', {login:login, talkId:talkId}, callback);
}

function listenRegistrationClicks() {
  $('.register').live('click', function () {
    var talkId = $(this).attr('data-talk');

    if ($(this).html() == "Register") {
      register(current_login, talkId, refreshRegistrationLinks);
    } else {
      unregister(current_login, talkId, refreshRegistrationLinks);
    }
  });
}

function initAuthenticationState() {
  $('header').html(Hogan.compile($('#header-template').html()).render({authenticated:false}));
}

$(document).ready(function () {
  initAuthenticationState();
  refreshPlanning();
  listenRegistrationClicks();
});