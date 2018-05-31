//---------------------------------------------------------------------------\\

const Discord = require("discord.js");
const client = new Discord.Client();
const mysql = require("mysql");
const sql = require("sqlite");
const adminRole = "oAdmin";
const prefix = "+";
sql.open("./score.sqlite");	

client.on('ready', () => {
  console.log("Logged in successfully.");
  con.connect(function(err) {
    console.log("Connected to MySQl server");
  });
  con.query('SELECT 1 + 1 AS solution', function(error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
  client.user.setPresence({
    game: {
      name: '-help for help',
      type: 0
    }
  });
  console.log("Set status.");
});

client.on("message", async message => {
  if (message.author.bot) return;
  var args = message.content.slice(prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();
});

//---------------------------------------------------------------------------\\

var con = mysql.createConnection({
  host: "176.9.143.154",
  user: "u317_uAJtCCdPei",
  password: process.env.DB_PASS,
  database: "s317_discord"
});

//---------------------------------------------------------------------------\\

// ADDUSER

client.on('message', message => {
  if (message.content == '-adduser') {
    message.delete().catch(O_o => {});
    console.log("adduser");
    var user;
    var username;
    var memberG;
    user = message.member;
    username = user.user.username;
    memberG = user;
    console.log("adding: " + username);
    var sql = "select userID from balances where name = ?";
    var inserts = [username];
    console.log("statement: " + sql);
    sql = mysql.format(sql, inserts);
    con.query(sql, function(error, results) {
      if (error) throw error;
      console.log(results[0]);
      if (results[0] != null) {
        console.log("not null");
        message.channel.send(user.toString() + " you already have an account!");
      } else {
        var sql = "insert into balances values(?,?,?)";
        var inserts = [username, message.author.id, 50];
        console.log("Statement: " + sql);
        sql = mysql.format(sql, inserts);
        con.query(sql, function(error, results) {
          if (error) throw error;
          console.log(results.affectedRows + " updated");
          message.channel.send("Succesfully added: " + user.toString() + " to the database!");
        });
      }
    })
  }
});
// REMOVE USER

client.on('message', message => {
  if (message.content.startsWith('-removeuser')) {
	var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] == null || args[1] == null) {
      message.channel.send(user + " please tag a user.");
      var user = message.mentions.users.first();
      var sql = "DELETE FROM balances where name = ?";
      var inserts = [user.id];
      var guildMember = message.mentions.members.first();
      sql = mysql.format(sql, inserts);
      con.query(sql, function(error, results) {
        console.log(results.affectedRows + " updated.");
        if (results.affectedRows == 0) {} else {
          if (message.member.roles.some(r => [adminRole, "oAdmin"].includes(r.name))) {
            message.channel.send(user + " has been successfully removed from the database.");
          } else {
            message.channel.send("You do not have the `oAdmin` role.")
          }
        }
      })
    }
  }
});

// BALANCE

client.on('message', message => {
  if (message.content == '-balance') {
    var sql = "SELECT balance FROM balances WHERE userID = ?";
    var inserts = [message.author.id];
    sql = mysql.format(sql, inserts);
    con.query(sql, function(error, results) {
      if (error) throw error;
      if (results[0] == null) {
        message.channel.send(message.author.toString() + " you do not have an account.\nYou can make one with '-adduser'.");
      } else {
        message.channel.send(message.author.toString() + " has " + results[0].balance + " coins.");
        console.log("balance: " + results[0].amount);
      }
    });
  } else {
	  
// TRANSFER

  if (message.content.startsWith('-transfer')) {
	var mentioned = message.mentions.members.first();
	var args = message.content.slice(prefix.length).trim().split(/ +/g);
    if (args[0] == null || args[1] == null) {
      message.channel.send("Please mention someone and type the amount you want to transfer to them.");
    } else if (mentioned.id == message.author.id) {
      message.channel.send(message.author.toString() + " you can't transfer coins to yourself.");
    } else {
      var mentioned = message.mentions.members.first();
      var amount = args[2];
      var sql = "select userID, balance from balances where userID = ?";
      var inserts = [message.author.id];
      sql = mysql.format(sql, inserts);
      con.query(sql, function(error, results) {
        if (error) throw error;
        if (results[0] == null) {
          message.channel.send(message.author.toString() + " you need to have an account in order to transfer coins to someone else.\nUse -adduser to make one.");
        } else if (results[0].balance < amount) {
          message.channel.send(message.author.toString() + " you do not have enough coins for the transfer.\nYou have " + results[0].balance + " coins.");
        } else {
          var sqlS = "select userID, balance from balances where userID = ?";
          var insertsS = [mentioned.id];
          sqlS = mysql.format(sqlS, insertsS);
          con.query(sqlS, function(errorS, resultsS) {
            if (errorS) throw errorS;
            if (resultsS[0] == null) {
              message.channel.send(message.author.toString() + " the user you are trying to give coins to does not have an account. He can make one with -adduser.");
            } else {
              var oldBalanceMen = resultsS[0].balance;
              var oldBalanceAut = results[0].balance;
              var newBalanceMen = oldBalanceMen + (Math.floor(amount));
              var newBalanceAut = oldBalanceAut - (Math.floor(amount));
              var sqlU = "update balances set balance = ? where userID = ?";
              var insertsU = [newBalanceAut, message.author.id];
              sqlU = mysql.format(sqlU, insertsU);
              con.query(sqlU, function(errorU, resultsU) {
                if (errorU) throw errorU;
                message.channel.send("Transfer successful.\n" + mentioned.toString() + " has " + newBalanceMen + " coins\n" + message.author.toString() + " has " + newBalanceAut + " coins");
              });
              var sqlM = "update balances set balance = ? where userID = ?";
              var insertsM = [newBalanceMen, mentioned.id];
              sqlM = mysql.format(sqlM, insertsM);
              con.query(sqlM, function(errorM, resultsM) {
                if (errorM) throw errorM;
                console.log(resultsM.affectedRows + " affected rows");
              });

            }
          });
        }
      });
    }
  }}
});


//---------------------------------------------------------------------------\\

// PING/STATUS

client.on('message', message => {
  if (message.content === "-ping") {
    message.channel.send({
      embed: {
        "title": "Ping",
        "url": "",
        "color": 1234567,
        "footer": {
		  "icon_url": "https://cdn.discordapp.com/attachments/450365125115904000/451010143283314709/spin.gif",
          "text": "© Jack Wemble & kalec.gos"
        },
        "fields": [{
		  "name": "Online",
          "value": ":alarm_clock: " + Math.ceil(client.ping) + " ms"
        }]
      }
    })
  }
});

// GETUSERS

client.on('message', message => {
  if (message.content.startsWith('-users')) {
    var list = 'select userID, name, balance from balances';
    console.log("getuser");
    con.query(list, function(error, results) {
      if (error) throw error;
      message.channel.send("Users in the database: ");
	  var i = 0;
      while (results[i] != null) {
        message.channel.send("Username: " + results[i].name + "\n Balance: " + results[i].balance + "\n");
        i++;
      }
    })
  }
});

// SPAM

client.on('message', message => {
  if (message.content.startsWith('-spam')) {
	var args = message.content.slice(prefix.length).trim().split(/ +/g);
    var length = args.length;
    if (args[0] == null || args[1] == null || args[2] == null || args[3] == null) {
      message.channel.send("Please mention a user, type a message, and the amount of times you want me to spam him. Example:\n'`-spam @Owl#2375 idiot 10`");
    } else {
      if (message.member.roles.has(message.guild.roles.find("name", adminRole).id)) {
        if (isNaN(parseInt(args[length - 1]))) {
          message.channel.send("Please type an amount.");
        } else {
          var text = "";
          var spammed = message.mentions.users.first();
		  message.delete().catch(O_o => {});
          for (var i = 0; i < length - 1; i++) {
            text = args[2];
            text += " ";	
          }
		  console.log(text)
          for (var i = 0; i < parseInt(args[length - 1]); i++) {
            spammed.send(text);
          }
        }
       } else {
		message.channel.send("You do not have the `oAdmin` role.")
       }
    }
  }
});

// PURGE

client.on('message', message => {
  if (message.content.startsWith('-purge')) {
	var numberDelete = message.content.slice(prefix.length).trim().split(/ +/g);
    var length = numberDelete.length;
	var numbertoDelete = numberDelete[1]
    if (numbertoDelete[0] == 0 || numbertoDelete[1] == 0) {
      message.channel.send("Please type the amount of messages to delete.")
    } else {
      if (message.member.roles.some(r => [adminRole, "oAdmin"].includes(r.name))) {
		  message.delete().catch(O_o => {});
          var numberDelete = message.content.slice(prefix.length).trim().split(/ +/g);
          message.channel.bulkDelete(numbertoDelete)
      } else {
        message.channel.send("You do not have the `oAdmin` role.")
      }
    }		
  } else {
	  
// KICK	  
	  
  if (message.content.startsWith('-kick')) {
    if (!message.member.roles.some(r => [adminRole, "oAdmin"].includes(r.name))) {
      let kickMember = message.mentions.members.first();
      let adminMember = message.guild.member(message.author);
      message.channel.send(adminMember + " has kicked " + kickMember + ".");
      kickMember.kick();
    } else {
      message.channel.send("An error has occured:\n`You do not have the right permission to kick, that player is not kickable, or you didn't tag anyone.`");
    }
  } else {
	  
// ROULETTE

var randomValue;
  if (message.content == '-roulette') {
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
  }}}
});

// SET STATUS

client.on('message', message => {
  if (message.content.startsWith('-status')) {
    var status = message.content.slice(prefix.length).trim().split(/ +/g);
    var length = status.length;
    var statusMsg = "";
    if (status[0] == null || status[1] == null) {
      message.channel.send("Please type a status.");
    } else {
      for (var i = 1; i < length; i++) {
        statusMsg += status[i];
        statusMsg += " ";
      }
	  console.log("Status set to: " + statusMsg);
      if (message.member.roles.some(r => [adminRole, "oAdmin"].includes(r.name))) {
		message.channel.send("Successfully set status to `" + statusMsg + "`");
        client.user.setPresence({
          game: {
            name: statusMsg,
            type: 0
          }
        });
      } else {
        message.channel.send("You do not have the `oAdmin` role.");
      }
    }
  } else {
    if (message.content.startsWith('-resetstatus')) {
      if (message.member.roles.some(r => [adminRole, "oAdmin"].includes(r.name))) {
		message.channel.send("Successfully reset status");
        client.user.setPresence({
          game: {
            name: "-help for help",
            type: 0
          }
        });
      } else {
        message.channel.send("You do not have the `oAdmin` role.")
      }
    }
  }
});

// HELP

client.on('message', message => {
  if (message.content == '-help') {
    message.channel.send({
      embed: {
        "title": "Help Menu",
        "url": "",
        "color": 1234567,
        "footer": {
		  "icon_url": "https://cdn.discordapp.com/attachments/450365125115904000/451010143283314709/spin.gif",
          "text": "© Jack Wemble & kalec.gos"
        },
		"thumbnail": {
			"url": "https://cdn.discordapp.com/attachments/439904497603444748/451449020867411980/RRXRN19.jpg",
		},
        "fields": [{
			"name": "Info",
			"value": "**\*** = Requires oAdmin role.",
		  },
		  {
            "name": "-help",
            "value": "Show the help menu."
          },
          {
            "name": "-ping",
            "value": "Check the stauts of the bot."
          },
          {
            "name": "-roulette",
            "value": "Play roulette."
          },
          {
            "name": "-balance",
            "value": "Check your balance, requires you to have to have an account in the database."
          },
          {
            "name": "-transfer <user> <amount>",
            "value": "Transfer <user> <amount> of coins. Takes coins from your balance and sends it to his balance."
          },
          {
            "name": "-adduser",
            "value": "Add yourself to the database and make an account to gain coins."
          },
          {
            "name": "-removeuser <user> **\***",
            "value": "Remove <user> from the database."
          },
          {
            "name": "-kick <user> **\***",
            "value": "Kick <user> from the server."
          },
          {
            "name": "-purge <amount> **\***",
            "value": "Purge chat."
          },
          {
            "name": "-spam <message> <user> <amount> **\***",
            "value": "Spam <user> with <amount> of <message>."
          },
          {
            "name": "-status <status message> **\***",
            "value": "Set bot's status with <status message>."
          },
          {
            "name": "-resetstatus **\***",
            "value": "Reset bot's status."
          },
        ]
      }
    })
  }
});

//---------------------------------------------------------------------------\\

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', reason.stack || reason)
})

client.login(process.env.BOT_TOKEN);
