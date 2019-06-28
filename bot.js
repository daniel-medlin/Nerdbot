const Discord = require('discord.js');
const client = new Discord.Client();
const RichEmbed = require('discord.js');
const auth = require('./auth.json');
const prefix = "!";

const roleNewUser = "587787978491953159"; //ID of new member role
const roleMember = "587787582583078923"; //ID of member role
const reactionMSG = "587817645416644621"; //ID of the post that requires reactions

client.on('error', console.error); //display client errors without crashing
client.on('ready', () => {
	console.log('Logged in as '+client.user.tag+'!');
});
client.on('ready', () => {
	client.user.setActivity('!nrHelp || NerdRevolt', { type: 'WATCHING' }) //Watching nr!Help || NerdRevolt
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  .catch(console.error);
})


client.on('guildMemberAdd', (member) => { //add newly joined members to the new user role ewww hardcoded
	member.addRole(roleNewUser)    //id for "New User' role on server
		.then(console.log(member.user.username+" has joined "+ member.guild.name + " with the New User role!"))
		.catch(console.error);
});

client.on('raw', event => {  //gets around the cached message issue of adding a role on reaction by fetching the message.
	//console.log(event);
	const eventName = event.t;
	if(eventName === 'MESSAGE_REACTION_ADD'){
		if(event.d.message_id === reactionMSG){ //message ID we want to monitor for reactions
			var reactionChannel = client.channels.get(event.d.channel_id);
			if(reactionChannel.messages.has(event.d.message_id)) //check if our message is already cached
				return; //already cached
			else {
				reactionChannel.fetchMessage(event.d.message_id)
				.then(msg => {
						//console.log(msg);
						var msgReaction = msg.reactions.get(event.d.emoji.name); //get the reaction
						var user = client.users.get(event.d.user_id);  //get user that reacted to the message
						client.emit('messageReactionAdd', msgReaction, user);
				})
				.catch(err => console.log(err));
			}
		}
	}
	else if(eventName === 'MESSAGE_REACTION_REMOVE'){ //if reaction removed...
		if(event.d.message_id === reactionMSG){  //message ID we want to monitor for reactions
			var reactionChannel = client.channels.get(event.d.channel_id);
			if(reactionChannel.messages.has(event.d.message_id)) //check if our message is already cached
				return; //already cached
			else {
				reactionChannel.fetchMessage(event.d.message_id)
				.then(msg => {
						//console.log(msg);
						var msgReaction = msg.reactions.get(event.d.emoji.name); //get the reaction
						var user = client.users.get(event.d.user_id);  //get user that reacted to the message
						client.emit('messageReactionRemove', msgReaction, user);
				})
				.catch(err => console.log(err));
			}
		}
	}
});

client.on("messageReactionAdd", (messageReaction, user) => { //Add new users to the Member role after reacting to the the rules.
	if (messageReaction.message.id === reactionMSG){ //ensure we're reacting to the correct message
		if(messageReaction.emoji.name === '👍'){
			var member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if(member){
				member.addRole(roleMember); //Add Members role
				member.removeRole(roleNewUser);//remove new User role
				console.log(member.user.username + " has been added to the Members role. - "+ timestamp());
			}
		} else console.log("Wrong Reaction!");
	}
});

client.on("messageReactionRemove", (messageReaction, user) => { //Remove Members role if user removes reaction
	if (messageReaction.message.id === reactionMSG){ //ensure we're reacting to the correct message
		if(messageReaction.emoji.name === '👍'){
			var member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if(member){
				member.addRole(roleNewUser);//add New User role
				member.removeRole(roleMember); //remove Members role
				console.log(member.user.username + " has been removed from the Members role. - "+ timestamp());
			}
		}
	}	
});


//COMMANDS
client.on('message', function(message){
		//our bot needs to know if it will execute a command
		//It will listen for messages that start with '!nr'
		var msg = message.content;
		
		if (msg.substr(0,3)=="!nr"){
				var args = msg.substr(3).split(' '); //split the remainder of the message by spaces for each arguments
				var cmd = args[0].toLowerCase(); //pull out the first argument and converts to lowercase.
				var cmd2 = args[1]; //second argument
				switch(cmd){
					//!nrPing
					case 'ping':
						ping(message.channel);
					break;
					//!nrRules
					case 'rules':
						message.delete();
						rules(message.channel);
					break;
					//!nrHello
					case 'hello':
						var uname = message.author.username;
						message.delete();
						message.channel.send("Hi there, " + uname + "!");
					break;
					//!nrTime
					case 'time':
						message.delete();
						var uname = message.author.username;
						message.channel.send("Current Time for " + uname + ": " + timestamp() + " GMT");
					break;
					case 'poll':
						message.delete();
						var uname = message.author.username;
						if (cmd2 == null) { //no poll question
							message.channel.send("Poll formulated incorrectly, please read the help (!nrHelp)");
						} else if (cmd2.substr(0,1) !== "\"") {//poll question should be in quotations, this for open quote
								message.channel.send("Poll formulated incorrectly, please read the help (!nrHelp)");
							}	else if (msg[msg.length -1] !== "\"") {//poll question should be in quotations, this checks for close quote
									message.channel.send("Poll formulated incorrectly, please read the help (!nrHelp");
							}	else {
									var len = msg.length -10  //subtract the command and the quotes from the message length
									var question = msg.substr(9,len) //pull just the question with no quotes.
								poll(message.channel, uname, question)
							}
					break;

					//ADMIN COMMANDS BELOW HERE
					//!nrDelete [1] allow admin to delete multiple messages
					case 'delete':
						if(!isNaN(cmd2)){ //only run command if cmd2 is a number
							del(message, cmd2)
						}				
					break;
					//!nrHelp
					case 'help':
						message.delete();
						help(message.channel);
					break;
				}
				
				
		}
});


//Shhh the functions are sleeping down here.


function timestamp(){
	var date = new Date(); //month
	if ((date.getMonth()+1)<10){
		var month = "0" + (date.getMonth()+1);
	} else var month = (date.getMonth()+1);	
	if (date.getDate() < 10){ //day
		var day = "0" + date.getDate();
	} else var day = date.getDate();
	var year = date.getFullYear(); //year
	if (date.getHours()<10){ //hours
		var hours = "0" + date.getHours();
	} else hours = date.getHours();
	if (date.getMinutes() < 10){ //min
		var min = "0" + date.getMinutes();
	} else var min = date.getMinutes();
	if (date.getSeconds() < 10){ //sec
		var sec = "0" + date.getSeconds();
	} else var sec = date.getSeconds();

	var datetime = month + "/" + day + "/" + year + " @ " + hours + ":" + min + ":" + sec;
		return datetime;
}

//Functions available to all users
//Server Rules called with !rules
function rules(channel){
	const embed = {
		"description": "We're a new community with a wide range of categories!  Programming, Batch, Hardware, Software, Music, Gaming, Hacking and General text and voice channels.",
		"url": "https://discordapp.com",
		"color": 123456,
		"thumbnail": {
		  "url": "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png"
		},
		"author": {
		  "name": "Welcome to Nerd Revolt!",
		  "icon_url": "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png"
		},
		"fields": [
		  {
			"name": "Server Rules",
			"value": "Violation of any of these rules can lead to a ban of the user!\n\n \
			1:  Members are not allowed to engage in threatening behavior toward other members. This includes flaming. \n\
			2:  Don't try to cause harm to member and public, this includes attempt to infect members with any kind of malware infection. \n\
			3:  Don't be a diiiiiiiiiiiiiick \n\
			4:  Please try to be a mature person even if your age is under 16 years old. \n\
			5:  There will be no racial, ethnic, gender based insults or any other personal discrimination.  This will not be tolerated and can lead to immediate suspension. \n\
			6:  Posting of malicious software results in immediate ban \n\
			7:  This is not a place for politico-religious arguments, don't outside of #calm-people-discuss-things-politely-in-here. \n\
			8:  Keep to English language in the code rooms and #general-but-icky-is-the-best \n\
			9:  Be polite and thoughtful debate on potentially controversial topics.\n"
		  },
		  { //character limit of a field is 1024...
			"name": "10: Be kind to others.  How hard is it to not be an asshole?", //might as well highlight this rule
			"value": "11: No advertising of ddos, stress testing, or booter services. \n\
			12: Do not post personal information that isn't yours. \n\
			13: Nicknames can only be altered by @Admin s, make your requests to them for sensible name changes. \n\
			14: You may have your username changed to something more human-typable if it's made of lots of non-keyboard symbols that stop people from properly @-ing you."
		  }
		]
	  };
	  channel.send({ embed });
}

function help(channel){
		const embed = {
			"description": "This bot is currently hard coded to accept new members and give them the 'New Users' role, upon accepting the rules (:thumbsup:), new users are granted the member role.",
			"color": 123456,
			"thumbnail": {
			  "url": "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png"
			},
			"author": {    
			  "name": "Nerdbot Help",
			  "icon_url": "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png"
			},
			"fields": [
			  {
				"name": "\u200b",
				"value": "\u200b"
			  },
			  {
				"name": "Nerdbot commands", 
				"value": "__**!nrRules**__: Display the rules.\n\
				__**!nrHello**__: Say hello!\n\
				__**!nrPoll \"question\"**__: To create a poll, enter the !nrpoll command followed by your question in quotes\n\
				(ex. !nrPoll \"This is the correct format\")\n\
				__**!nrTime**__: Display your current date and time.\n\n"
			  },
			  {
				"name": "\u200b",
				"value": "\u200b"
			  },
			  {
				"name": "Staff commands",
				"value":"__**!nrDelete**__ [number to delete]: Deletes requested number of posts from current channel (Staff Only)\n\n\n\
				**To request more commands, just DM b00st3d**"
			  }
			]
		  };
		  channel.send({ embed });
}

function ping(channel){
	var response = Math.floor(Math.random() * 10) + 1
	switch(response){
		case 1:
			channel.send("I'm still here...");
		break;
		case 2:
			channel.send("What?!");
		break
		case 3:
			channel.send("I didn't do anything!");
		break
		case 4:
			channel.send("...");
		break
		case 5:
			channel.send(":nerd:");
		break
		case 6:
			channel.send("What do you want?");
		break
		case 7:
			channel.send("@Nerdbot isn't here right now, please leave a message after the beep...");
		break
		case 8:
			channel.send("Go get your own beer!");
		break
		case 9:
			channel.send("Why did you waste so much time programming these responses?");
		break
		case 10:
			channel.send("Here I am!");
		break
		}	
}

function poll(channel, user, question){
	const embed = {
		"color": 123456,
		"thumbnail": {
		  "url": "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png"
		},
		"author": {    
		  "name": user + " has posed the following question:",
		  "icon_url": "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png"
		},
		"fields": [
		  {
			"name": question, 
			"value": ":thumbsup: for Yes, :thumbsdown: for no, or :no_mouth: for no opinion"
		  }
		]
	  };
	  channel.send({ embed });

	channel.fetchMessages({ limit: 1}).then(message => { //fetches the cached messages
		var lastMessage = message.first(); //should be our message
		if (!lastMessage.author.bot) {
			//The author of the last message wasn't a bot
			console.log("Failed to get the bot's poll message.  User had to manually add reactions")
		} else {
			addReactions(lastMessage);
		}
	}).then(console.log("New Poll posted by " + user))
	.catch(console.error);
	
}
function addReactions(pollQuestion){
	pollQuestion.react("👍")
		.then(() => pollQuestion.react("👎"))
		.then(() => pollQuestion.react("😶"))
		.catch(() => console.error('One of the emojis failed to react.'));
}


//ADMIN FUNCTIONS BELOW THIS LINE
//delete user specified number of messages
function del(message, number){
	var uname = message.author.username;
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Mod")) { //if message comes from admin or mod...
		message.channel.bulkDelete(number)
			.then(message.channel.send(number + " messages deleted by " + uname + " at " + timestamp()))
			.catch(console.error);
	} else {
		message.channel.send(message.author.username + " has attempted to delete " + number + " messages.\nOnly Administrators or Moderators can delete messages!  This has been flagged for review by <@&444250817680375809>");
		console.log("WARNING!!!! - " + message.author.username + " has attempted to delete " + number + " messages from the " + message.channel.name + " channel.");
	}
}






client.login(auth.token);