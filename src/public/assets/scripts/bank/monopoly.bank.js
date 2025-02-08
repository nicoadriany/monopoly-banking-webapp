/* login handling */

const DEBUG = false;

let selectedPlayer = "";

const presets = [50000, 100000, 250000, 500000, 1000000, 1500000, 2000000];

$(document).ready(function () {
  $("#login-button").on("click", function () {
    let loginName = $("#login-name").val();
    performLogin(loginName);
  });

  //create presets
  presets.forEach((v) => {
    addPreset(v);
  });

  $("div.presets").on("click", "div.preset", function () {
    let amount = parseInt($(this).data("amount"));
    let reason = $(this).data("reason");

    if (selectedPlayer == "") {
      return;
    }

    performGiveMoney(selectedPlayer, amount, reason);
  });

  if (DEBUG) {
    setTimeout(() => {
      performLogin("Bank");
      $("li[data-page='settings']").click();
    }, 1000);
  }
});

/* navigation handling */
$(document).ready(function () {
  $("ul.navbar").on("click", "li", function () {
    let dest = $(this).data("page");
    if (dest === undefined) {
      return;
    }

    $("div.content-wrapper > div").hide();
    $("div.header").text($("div.content-wrapper #" + dest).data("title"));
    $("div.content-wrapper #" + dest).fadeIn();
    $("ul.navbar li").removeClass("active");
    $(this).addClass("active");
  });

  $("div.player-wrapper").on("click", "div.player", function () {
    const playerName = $(this).data("name");

    if (playerName == selectedPlayer) {
      return;
    }

    selectedPlayer = playerName;

    $("div.player-wrapper div.player div.icon").html(
      "<i class='fa-solid fa-user'></i>"
    );
    $(this)
      .find("div.icon")
      .html("<i class='fa-solid fa-check-double blinking'></i>");
  });

  $("#add-player-submit").on("click", function () {
    const addPlayerName = $("#add-player-name").val();
    if (addPlayerName.trim()) {
      performAddPlayer(addPlayerName);
      $("#add-player-name").val("");
    }
  });

  $("#send-money-submit").on("click", function () {
    if (selectedPlayer) {
      const sendMoneyAmount = parseInt($("#send-money-input").val());
      performGiveMoney(selectedPlayer, sendMoneyAmount, "Gutschrift");
      $("#send-money-input").val("");
    }
  });

  $("#force-disconnect-action").on("click", function () {
    if (
      selectedPlayer &&
      confirm(
        `Willst du die Verbindung von ${selectedPlayer} wirklich trennen?`
      )
    ) {
      performCloseConnection(selectedPlayer);
    }
  });

  $("#give-free-parking-action").on("click", function () {
    if (
      selectedPlayer &&
      confirm(
        `Willst du das Geld aus der Mitte wirklich an ${selectedPlayer} auszahlen?`
      )
    ) {
      performGiveFreeParking(selectedPlayer);
    }
  });

  $("#broadcast-richest-action").on("click", function () {
    if (
      confirm(
        `Willst du wirklich den (aktuell) reichsten Spieler ankündigen?`
      )
    ) {
      performBroadcastRichest();
    }
  });

  $("#broadcast-poorest-action").on("click", function () {
    if (
      confirm(
        `Willst du wirklich den (aktuell) ärmsten Spieler ankündigen?`
      )
    ) {
      performBroadcastPoorest();
    }
  });

  $("#broadcast-free-parking-amount-action").on("click", function () {
    performBroadcastFreeParkingAmount();
  });

  $("#tell-ranking-action").on("click", function () {
    if (
      confirm(
        `Willst du wirklich jedem Spieler seine aktuelle Position mitteilen?`
      )
    ) {
      performTellRanking();
    }
  });

  $("#delete-player-action").on("click", function () {
    if (
      selectedPlayer &&
      confirm(`Willst du den Spieler ${selectedPlayer} wirklich löschen?`)
    ) {
      performDeletePlayer(selectedPlayer);
    }
  });

  $("div.menu-wrapper ul.navbar li:nth-child(1)").click();
});

/* set user name */
const updateName = (name) => {
  myUsername = name;
};

/* add preset */

const addPreset = (amount) => {
  $("div.presets").append(
    $(
      '<div class="preset" data-amount="' +
        amount +
        '" data-reason="Gutschrift">'
    ).text(formatNumber(amount) + "€")
  );
};

/* add player */
const addPlayer = (name) => {
  $("div.player-wrapper").append(
    $('<div class="player noselect" data-name="' + name + '">')
      .append($('<div class="icon">').html('<i class="fa-solid fa-user"></i>'))
      .append(
        $('<div class="content">').append(
          $("<p>")
            .append($("<b>").text(name))
            .append($("<br />"))
            .append(
              $('<span id="online-status-' + name + '">').text(
                "Fetch status..."
              )
            )
        )
      )
  );
};

const clearPlayerlist = () => {
  $("div.player-wrapper").empty();
};

const setPlayerOnlineStatus = (name, status) => {
  let spanClass = status ? "status-online" : "status-offline";
  let spanContent = status ? "Online" : "Offline";

  $("span#online-status-" + name).text(spanContent);
  $("span#online-status-" + name).removeClass();
  $("span#online-status-" + name).addClass(spanClass);
};
