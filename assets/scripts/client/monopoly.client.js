/* login handling */

$(document).ready(function() {
	$("#login-button").on("click", function() {
		let loginName = $("#login-name").val();
		performLogin(loginName);
	});
});

/* navigation handling */
$(document).ready(function() {
	$("ul.navbar").on("click", "li", function() {
		let dest = $(this).data("page");
		if (dest === undefined) {
			return;
		}

		$("div.main-content > div").hide();
		$("div.header").text($("div.main-content #" + dest).data("title"));
		$("div.main-content #" + dest).fadeIn();
		$("ul.navbar li").removeClass("active");
		$(this).addClass("active");
	});

	$("#balanceBox").on("click", function() {
		$("#user-money").toggleClass("text-blur");
	});
	
	$("ul.navbar li:nth-child(1)").click();
});

/* payments handling */
$(document).ready(function() {
	$("div.player-list").on("click", ".player", function() {
		$("div.player-list > div.player").removeClass("selected");
		$(this).addClass("selected");
		updatePaymentsPreview();
	});

	$("#payAmount").on("keyup", function() {
		if ($(this).val().length > 10) {
			$(this).val($(this).val().slice(0, 10));
		}
		updatePaymentsPreview();
	});

	$("#pay-preview-submit").on("click", function() {
		let selectedPlayer = $("div.player-list > div.player.selected").data("name");

		let amount = $("#payAmount").val();
		if(isNaN(amount) || parseFloat(amount) <= 0 || amount.length == 0) {
			$("#pay-preview").hide();
			return;
		}
	
		if (amount.includes(",") || amount.includes(".")) {
			amount = parseFloat(amount) * 1000000;
		} else {
			amount = parseInt(amount);
		}

		$("div.player-list > div.player").removeClass("selected");
		$("#payAmount").val("");
		
		performSendMoney(selectedPlayer, amount);

		updatePaymentsPreview();
	});
});

const updatePaymentsPreview = () => {
	let selectedPlayer = $("div.player-list > div.player.selected").data("name");

	if (!selectedPlayer) {
		$("#pay-preview").hide();
		return;
	}

	let amount = $("#payAmount").val();
	if(isNaN(amount) || parseFloat(amount) <= 0 || amount.length == 0) {
		$("#pay-preview").hide();
		return;
	}

	if (amount.includes(",") || amount.includes(".")) {
		amount = parseFloat(amount) * 1000000;
	}

	$("#pay-preview-receiver").text(selectedPlayer);
	$("#pay-preview-amount").text("- " + formatNumber(amount) + "€");

	$("#pay-preview").css("display", "flex");
}

const clearPlayerlist = () => {
	$("div#payments > div.player-list").empty();
}

const addPlayer = (name) => {
	$("div#payments > div.player-list").append(
		$('<div class="player" data-name="' + name + '">')
			.append($('<div class="icon">')
				.text(name.substring(0, 2).toUpperCase())
			)
			.append($("<p>")
				.text(name)
			)
	);
}

const removePlayer = (name) => {
	$("div#payments > div.player-list > div.player[data-name='" + name + "']").remove();
}

/* set user money */
const updateMoney = (amount) => {
	$("#user-money").text(formatNumber(amount) + "€");
}

/* set user name */
const updateName = (name) => {
	myUsername = name;
	$("#balance-box-name").text("Hallo " + name + "!");
}