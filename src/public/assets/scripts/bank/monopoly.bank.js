/* login handling */

const DEBUG = true;

let selectedPlayer = "";

const presets = [
	50000,
	100000,
	250000,
	500000,
	1000000,
	1500000,
	2000000
];

$(document).ready(function() {
	$("#login-button").on("click", function() {
		let loginName = $("#login-name").val();
		performLogin(loginName);
	});

	//create presets
	presets.forEach((v) => {
		addPreset(v);
	});

	$("div.presets").on("click", "div.preset", function() {
		let amount = $(this).data("amount");
		let reason = $(this).data("reason");

		if (selectedPlayer == "") {
			return;
		}

		performGiveMoney(selectedPlayer, amount, reason);
	});

	if (DEBUG) {
		setTimeout(() => {
			performLogin("Bank");
			$("li[data-page='transferMoney']").click();
		}, 1000);
	}
});

/* navigation handling */
$(document).ready(function() {
	$("ul.navbar").on("click", "li", function() {
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

	$("div.player-wrapper").on("click", "div.player", function() {
		const playerName = $(this).data("name");

		if (playerName == selectedPlayer) {
			return;
		}

		selectedPlayer = playerName;
		
		$("div.player-wrapper div.player div.icon").html("<i class='fa-solid fa-user'></i>");
		$(this).find("div.icon").html("<i class='fa-solid fa-check-double blinking'></i>");
	});

	

	$("div.menu-wrapper ul.navbar li:nth-child(1)").click();
});

/* set user name */
const updateName = (name) => {
	myUsername = name;
}

/* add preset */

const addPreset = (amount) => {
	$("div.presets").append(
		$('<div class="preset" data-amount="' + amount + '" data-reason="Gutschrift">')
			.text(formatNumber(amount) + "€")
	);
}

/* add player */
const addPlayer = (name) => {
	$("div.player-wrapper").append(
		$('<div class="player noselect" data-name="' + name + '">')
			.append($('<div class="icon">')
				.html('<i class="fa-solid fa-user"></i>')
			)
			.append($('<div class="content">')
				.append($('<p>')
					.append($('<b>')
						.text(name)
					)
					.append($('<br />'))
					.append($('<span id="online-status-' + name + '">')
						.text("Fetch status...")
					)
				)
			)
	);
}

const clearPlayerlist = () => {
	$("div.player-wrapper").empty();
}

const setPlayerOnlineStatus = (name, status) => {

	let spanClass = status ? "status-online" : "status-offline";
	let spanContent = status ? "Online" : "Offline";

	$("span#online-status-" + name).text(spanContent);
	$("span#online-status-" + name).removeClass();
	$("span#online-status-" + name).addClass(spanClass);
}