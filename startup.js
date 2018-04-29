const Discord = require("discord.js");
const client = new Discord.Client();
client.on('ready', () => {
	console.log("Logged in successfully.");
	client.user.setPresence({
		game: {
			name: '$help for help',
			type: 0
		}
	});
	console.log("Set status.");
});

client.on('message', message => {
	if (message.content === "$ping") {
		message.channel.send({
			embed: {
				"title": "Status",
				"url": "",
				"color": 1234567,
				"footer": {
					"text": "© Jack Wemble"
				},
				"fields": [{
					"name": "Online",
					"value": ":alarm_clock: " + Math.ceil(client.ping) + " ms"
				}]
			}
		})
	}
});

var randomValue;

client.on('message', msg => {
	if (msg.content == '$roulette') {
		if (!(randomValue >= 1 && randomValue <= 6)) {
			randomValue = 6;
		}
		var random = (Math.random() * randomValue);
		var calc = (Math.ceil(random));
		if (calc == 1) {
			msg.channel.send(':gun: ***BANG***');
			randomValue = 6;
			const member = msg.guild.member(msg.author);
			member.kick();
			msg.author.sendMessage("You shot yourself, good job.");
		} else {
			msg.channel.send(':gun: *Click*');
			randomValue = randomValue - 1;
			msg.channel.send();
		}
	}
});


client.login("NDM5OTI0NjEyOTAyNTUxNTUy.DcdJUA.Cfj4qlHlynCbEziaWmV29S9QIz4");
