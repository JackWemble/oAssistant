const Discord = require("discord.js");
const client = new Discord.Client();
client.on('ready', () => {
  console.log("Logged in successfully.");
  client.user.setPresence({
    game: {
      name: '-help for help',
      type: 0
    }
  });
  console.log("Set status.");
});

client.on('message', message => {
  if (message.content === "-status") {
    message.channel.send({
      embed: {
        "title": "Online",
        "url": "",
        "color": 1234567,
        "footer": {
          "text": "© Jack Wemble"
        },
        "fields": [{
          "value": ":alarm_clock: " + Math.ceil(client.ping) + " ms"
        }]
      }
    })
  }
});

client.on('message', message => {
  if (message.content == '-kick') {
    if (!message.member.roles.some(r => ["Administrator", "Moderator"])) {
      let kickMember = message.mentions.members.first();
      let adminMember = msg.guild.member(msg.author);
      kickMember.kick();
      message.channel.send(adminMember + " has kicked " + kickMember + ".");
    } else {
      message.channel.send("An error has occured:\n`You do not have the right permission to kick, or that player is not kickable.`");
    }
  }
});

client.on('message', message => {
  if (message.content == '-help') {
    message.channel.send({
      embed: {
        "title": "Help Menu",
        "url": "",
        "color": 1234567,
        "footer": {
          "text": "© Jack Wemble"
        },
        "fields": [{
            "name": "-help",
            "value": "Show the help menu."
          },
          {
            "name": "-status",
            "value": "Check the stauts of the bot."
          },
          {
            "name": "-roulette",
            "value": "Play roulette."
          }
        ]
      }
    })
  }
});

client.on('message', message => {
  if (message.content === "-status") {
    message.channel.send({
      embed: {
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
  if (msg.content == '-roulette') {
    if (!(randomValue >= 1 && randomValue <= 6)) {
      randomValue = 6;
    }
    var random = (Math.random() * randomValue);
    var calc = (Math.ceil(random));
    if (calc == 1) {
      msg.channel.send(':gun: ***BANG***');
      randomValue = 6;
      let member = msg.guild.member(msg.author);
      member.kick();
      msg.author.sendMessage("Good job, you shot yourself. Join back with this invite.\nhttps://discord.gg/Sh4nPKJ");
    } else {
      msg.channel.send(':gun: *Click*');
      randomValue = randomValue - 1;
      msg.channel.send();
    }
  }
});


client.login(process.env.BOT_TOKEN);
