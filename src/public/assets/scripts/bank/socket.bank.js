let connection;

let myUsername = "";

function connectToServer() {
	// if user is running mozilla then use it's built-in WebSocket
	window.WebSocket = window.WebSocket || window.MozWebSocket;

	connection = new WebSocket('ws://localhost:1338'); 

	connection.onopen = function () {

	};

	connection.onerror = function (error) {
		// an error occurred when sending/receiving data
	};

	connection.onclose = function () {
		addNotification("Keine Verbindung zum Server möglich..."); 
		$(".login-wrapper").fadeIn("normal", () => {
			$(".page-wrapper").hide();
		});
		setTimeout(() => {
			connectToServer();
		}, 3000);
	}

	connection.onmessage = function (message) {
		try {
			var json = JSON.parse(message.data);
		} catch (e) {
			console.log('This doesn\'t look like a valid JSON: ', message.data);
			return;
		}
		// handle incoming message
		//console.log(json);
		console.log(json);
		
		if(json.type == "notification") {
			addNotification(json.data.message);
		} else if(json.type == "ownData") {
			updateName(json.data.name);
		} else if(json.type == "loginSuccess") {
			$(".page-wrapper").css("display", "grid");
			$(".login-wrapper").fadeOut();
		} else if(json.type == "transaction") {
			let isPositive = json.data.receiver === myUsername;
			let name = json.data.receiver === myUsername ? json.data.sender : json.data.receiver;

			addTransaction(name, json.data.reason, json.data.amount, json.data.timestamp, isPositive, true);
		} else if(json.type == "transactionList") {
			clearTransactionlist();
			json.data.forEach((t) => {
				let isPositive = t.receiver === myUsername;
			let name = t.receiver === myUsername ? t.sender : t.receiver;

			addTransaction(name, t.reason, t.amount, t.timestamp, isPositive, false);
			});
		} else if(json.type == "onlineStatus") {
			setPlayerOnlineStatus(json.data.playerName, json.data.isOnline);
		} else if(json.type == "playerList") {
			clearPlayerlist();
			json.data.forEach((p) => {
				addPlayer(p.name);
			});
		} else if(json.type == "playerListExtended") {
			clearPlayerlist();
			json.data.forEach((pData) => {
				addPlayer(pData.player.name);
				setPlayerOnlineStatus(pData.player.name, pData.isOnline);
			});
		} else if(json.type == "addPlayer") {
			addPlayer(json.data.name);
		} else if(json.type == "deletePlayer") {
      const delName = json.data.name;

      $("div.player[data-name='"+delName+"']").remove();
    }
	}
}

$(document).ready(function() {
	connectToServer();
});

const performLogin = (name) => {
	let data = {
		name: name
	}
	sendObject(connection, "specialLogin", data);
};

const performGiveMoney = (receiver, amount, reason) => {
	let data = {
		name: receiver,
		amount: amount,
		reason: reason
	}
	sendObject(connection, "giveMoney", data);
}

const performAddPlayer = (name) => {
  let data = {
    name: name
  }
  sendObject(connection, "createPlayer", data)
}

const performCloseConnection = (name) => {
  let data = {
    name: name
  }
  sendObject(connection, "closeConnection", data)
}

const performDeletePlayer = (name) => {
  let data = {
    name: name
  }
  sendObject(connection, "deletePlayer", data)
}

const performBroadcastRichest = () => {
  sendObject(connection, "broadcastRichest")
}

const performBroadcastPoorest = () => {
  sendObject(connection, "broadcastPoorest")
}

const performBroadcastFreeParkingAmount = () => {
  sendObject(connection, "broadcastFreeParkingAmount")
}

const performTellRanking = () => {
  sendObject(connection, "tellRanking")
}

const performGiveFreeParking = (name) => {
  let data = {
    name: name
  }
  sendObject(connection, "giveFreeParking", data)
}

const sendObject = (con, type, data) => {
	let obj = {};
	if (data != null) {
		obj = {
			type: type,
			data: data
		};
	}
	else {
		obj = {
			type: type
		};
	}
	con.send(JSON.stringify(obj));
}