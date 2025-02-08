function formatNumber(number) {
	//return Math.max(0, number).toFixed(0).replace(/(?=(?:\d{3})+$)(?!^)/g, '.');
	return parseInt(number).toLocaleString("de-DE");
}

/* notification handling */
const addNotification = (msg) => {
	let elem = $('<div class="notification">').text(msg);
	$("#notifications").append(elem);
	elem.slideDown();

	setTimeout(() => {
		elem.slideUp("normal", () => {
			elem.remove();
		});
	}, 3000);
};

$(document).ready(function() {
	$("div.notification-wrapper").on("click", "div.notification", function() {
		$(this).slideUp("fast", () => {
			$(this).remove();
		});
	});
});


/* transaction handling */
const addTransaction = (name, reason, amount, date, isPositive, sendNotification = false) => {
	let moneyClass = "money-positive";
	let moneyPrefix = "+ "
	let moneyNotification = "Du hast " + formatNumber(amount) + "€ von '" + name + "' erhalten";
	if (!isPositive) {
		moneyClass = "money-negative";
		moneyPrefix = "- "
		moneyNotification = "Du hast " + formatNumber(amount) + "€ an " + name + " überwiesen";
	}

	const formattedDate = (new Date(date)).toLocaleString('de-DE', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false
	});

	$("div#transactions > div.transaction-list").prepend(
		$('<div class="transaction" data-name="' + name + '">')
			.append($('<div class="icon">')
				.html('<i class="fa-solid fa-dollar-sign"></i>')
			)
			.append($('<div class="content">')
				.append($('<p>')
					.append($('<b>')
						.text(name)
					)
					.append($('<br />'))
					.append($('<p>')
						.text(reason)
					)
				)
				.append($('<p class="money ' + moneyClass + '">')
					.text(moneyPrefix + formatNumber(amount) + '€')
				)
				.append($('<p class="time">')
					.text(formattedDate + " Uhr")
				)
			)
	);

	if (sendNotification) {
		addNotification(moneyNotification);
	}
}

const clearTransactionlist = () => {
	$("div#transactions > div.transaction-list").empty();
}