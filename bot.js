const Discord = require('discord.js');
const client = new Discord.Client();
const RichEmbed = require('discord.js');
const auth = require('./auth.json');
const fs = require('fs');
const mg = require('./mathgifs');

const gid = "444186550197288970"; //ID of the guild
const roleNewUser = "587787978491953159"; //ID of new member role
const roleMember = "587787582583078923"; //ID of member role
const ruleMSG = "587817645416644621"; //ID of the rules post
const langMSG = "619323243077173278"; //ID of the language post

//language role IDs
const batch = "619314081068875792";
const cLang = "619314304759365633";
const java = "619314332244770836";
const python = "619314356039188480";
const vb = "619314378637967371";
const webdev = "619314416466264075";



const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.

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
	
		.then(console.log(member.user.username+" has joined "+ member.guild.name + " with the New User role! - " + timestamp()))
		.catch(console.error);
});

client.on('raw', event => {  //gets around the cached message issue of adding a role on reaction by fetching the message.
	//console.log(event);
	const eventName = event.t;
	if(eventName === 'MESSAGE_REACTION_ADD'){
		if(event.d.message_id === ruleMSG){ //message ID we want to monitor for reactions
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
		} else if(event.d.message_id === langMSG){ //message ID for language post
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
		if(event.d.message_id === ruleMSG){  //message ID we want to monitor for reactions
			var reactionChannel = client.channels.get(event.d.channel_id);
			if(reactionChannel.messages.has(event.d.message_id)) //check if our message is already cached
				return; //already cached
			else {
				reactionChannel.fetchMessage(event.d.message_id)
				.then(msg => {
						var msgReaction = msg.reactions.get(event.d.emoji.name); //get the reaction
						var user = client.users.get(event.d.user_id);  //get user that reacted to the message
						client.emit('messageReactionRemove', msgReaction, user);
				})
				.catch(err => console.log(err));
			}
		} else if(event.d.message_id === langMSG){  //message ID for language post
			var reactionChannel = client.channels.get(event.d.channel_id);
			if(reactionChannel.messages.has(event.d.message_id)) //check if our message is already cached
				return; //already cached
			else {
				reactionChannel.fetchMessage(event.d.message_id)
				.then(msg => {
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
	if (messageReaction.message.id === ruleMSG){ //ensure we're reacting to the correct message
		if(messageReaction.emoji.name === '👍'){
			var member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if(member){
				member.addRole(roleMember); //Add Members role
				member.removeRole(roleNewUser);//remove new User role
				console.log(member.user.username + " has been added to the Members role. - "+ timestamp());
			}
		} else {
			console.log("Wrong Reaction!");
			messageReaction.remove(user);
		}	
	} else if (messageReaction.message.id === langMSG){ //reactions on language message
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.name){
			case '🇧':
				member.addRole(batch);
				user.send("You have been added to the Batch role.");
			break;
			case '🇨':
				member.addRole(cLang);
				user.send("You have been added to the C role.");
			break;
			case '🇯':
				member.addRole(java);
				user.send("You have been added to the Java role.");
			break;
			case '🇵':
				member.addRole(python);
				user.send("You have been added to the Python role.");
			break;
			case '🇻':
				member.addRole(vb);
				user.send("You have been added to the VB role.");
			break;
			case '🇼':
				member.addRole(webdev);
				user.send("You have been added to the WebDev role.");
			break;
			default:
				messageReaction.remove(user); //catch invalid reactions and remove it.  Shouldn't happen but better safe than sorry.
		}
	}
});

client.on("messageReactionRemove", (messageReaction, user) => { //Remove Members role if user removes reaction
	if (messageReaction.message.id === ruleMSG){ //ensure we're reacting to the correct message
		if(messageReaction.emoji.name === '👍'){
			var member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if(member){
				member.addRole(roleNewUser);//add New User role
				member.removeRole(roleMember); //remove Members role
				console.log(member.user.username + " has been removed from the Members role. - "+ timestamp());
			}
		}
	} else if (messageReaction.message.id === langMSG){
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.name){
			case '🇧':
				member.removeRole(batch);
				user.send("You have been removed from the Batch role.");
			break;
			case '🇨':
				member.removeRole(cLang);
				user.send("You have been removed from the C role.");
			break;
			case '🇯':
				member.removeRole(java);
				user.send("You have been removed from the Java role.");
			break;
			case '🇵':
				member.removeRole(python);
				user.send("You have been removed from the Python role.");
			break;
			case '🇻':
				member.removeRole(vb);
				user.send("You have been removed from the VB role.");
			break;
			case '🇼':
				member.removeRole(webdev);
				user.send("You have been removed from the WebDev role.");
			break;
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
				var uname = message.author.username; //get user that requested the command
				var uid = message.author.id;
				//var uid = msg.author.id; //get user ID that requested the
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
						//var uname = message.author.username;
						message.delete();
						message.channel.send("Hi there, " + uname + "!");
					break;
					//!nrTime
					case 'time':
						message.delete();
						//var uname = message.author.username;
						var myDate = new Date();
						message.channel.send("The current time is: " + myDate);
					break;
					//!nrPoll
					case 'poll':
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
									message.delete();
								poll(message.channel, uname, question)
							}
					break;
					//!nrJoke
					case 'joke': 
						joke(message.channel); //Dad jokes read from a file.  This is mostly for practice in reading files, so I can save data later on.
					break;
					//!nrsource
					case 'source': //displays an embed with link to the github.
							displaySrc(message.channel);
					break;
					//!nrHelp
					case 'help':
						message.delete();
						help(message.channel);
					break;
					//!nrMath
					case 'math':
						if (cmd2 == null){
							mathGif(message, 0);
						} else if (cmd2 === "options" || !isNaN(cmd2)){
							mathGif2(message, cmd2);
						} else message.channel.send("Invalid argument");
					break;
					//I'm the humblest
					case 'humble':
						message.channel.send("<@"+uid+"> be praised!");
						message.delete();
					break;
					//Server Statistics
					case 'stat':
						if (cmd2 == null){
						serverStats(message.channel);
						} else userStats(message, cmd2);
					break;

					//ADMIN COMMANDS BELOW HERE
					//!nrDelete [1] allow admin to delete multiple messages
					case 'delete':
						if(!isNaN(cmd2)){ //only run command if cmd2 is a number
							del(message, cmd2)
						}				
					break;
					//!nrParrot repeat the phrase as if coming from bot
					case 'parrot':
						parrot(message.channel, message);
					break;
					//discussion questions
					case 'discussion':
						message.delete();
						discussion(message.channel, message);
					break;
					
					
				}
				
				
		}
});


//Shhh the functions are sleeping down here.


function timestamp(){
		return Date(); //decided after the fact that I didn't want to format the date.  Not changing all references now...
}

//Functions available to all users
//Server Rules called with !nrRules
function rules(channel){
	let rulesEmbed = new Discord.RichEmbed()
		.setTitle("__**Welcome to Nerd Revolt!**__\n\We're a new community with a wide range of categories!  Programming, Batch, Hardware, Software, Music, Gaming, Hacking and General text and voice channels.\n\n\n\Violations of any of these rules can lead to a ban of the user!")
		.setColor(embedColor)
		.setThumbnail(NRicon)
		.setDescription("1:  Members are not allowed to engage in threatening behavior toward other members. This includes flaming. \n\
		2:  Don't try to cause harm to member and public, this includes attempt to infect members with any kind of malware infection. \n\
		3:  Don't be a diiiiiiiiiiiiiick \n\
		4:  Please try to be a mature person even if your age is under 16 years old. \n\
		5:  There will be no racial, ethnic, gender based insults or any other personal discrimination.  This will not be tolerated and can lead to immediate suspension. \n\
		6:  Posting of malicious software results in immediate ban \n\
		7:  This is not a place for politico-religious arguments, don't outside of #calm-people-discuss-things-politely-in-here. \n\
		8:  Keep to English language in the code rooms and #general-but-icky-is-the-best \n\
		9:  Be polite and thoughtful debate on potentially controversial topics.\n\
		10: Be kind to others.  How hard is it to not be an asshole?\n\
		11: No advertising of ddos, stress testing, or booter services. \n\
		12: Do not post personal information that isn't yours. \n\
		13: Nicknames can only be altered by @Admin s, make your requests to them for sensible name changes. \n\
		14: You may have your username changed to something more human-typable if it's made of lots of non-keyboard symbols that stop people from properly @-ing you.")

		channel.send(rulesEmbed);
}

function help(channel){
	let helpEmbed = new Discord.RichEmbed()
	.setTitle("__**Nerdbot Help**__\n\n\n**Nerdbot commands**")
	.setColor(embedColor)
	.setThumbnail(NRicon)
	//.addBlankField()
	.addField("!nrRules", "Display the rules.")
	.addField("!nrJoke", "Dad jokes!")
	.addField("!nrMath", "Math Gifs. Optional arguments: options 1-21")
	.addField("!nrPoll \"Question\"", "To create a poll, enter the !nrpoll command followed by your question in quotes\
	(ex. !nrPoll \"This is the correct format\")")
	.addField("!nrStat", "Display server statistics")
	.addField("!nrStat @mention", "Display the mentioned user statistics")
	.addField("!nrSource", "Displays a link to the source of this bot")
	.addBlankField()
	.addField("**Staff Commands**", "\u200b")
	.addField("!nrDelete [number to delete]", "Deletes requested number of posts from the current channel")
	.addField("!nrDiscussion", "Generates a discussion question from 163 possible choices")
	.addField("!nrParrot \"statement\"", "Make the bot say what you say in the quotes following the command")
	.addBlankField()
	.setFooter("To request more commands, just DM b00st3d")

	channel.send(helpEmbed);
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
		"color": embedColor,
		"thumbnail": {
		  "url": NRicon
		},
		"author": {    
		  "name": user + " has posed the following question:",
		  "icon_url": NRicon
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
function joke(channel){
	var jokes;
	fs.readFile("./jokes.txt", "utf-8", (err, buf) => {
		if (err){console.log(err)};
		jokes = buf.split(';'); //end of line for each joke
		var j = Math.floor(Math.random() * jokes.length) //random from 0-length of jokes[]
		channel.send(jokes[j]);
	});

}

function displaySrc(channel){
	let sourceEmbed = new Discord.RichEmbed()
		.setTitle("__**Nerdbot Source**__")
		.setDescription("The NerdBot is open source and will probably stay that way unless it becomes super popular...")
		.setColor(embedColor)
		.setThumbnail(NRicon)
		.addBlankField()
		.addField("**Click here for the NerdBot Source**", "[NerdBot GitHub Link](https://github.com/b00st3d/NerdBot)")
		.addBlankField()
		.setFooter("If you have any suggestions or feature requests, please DM b00st3d")

		channel.send(sourceEmbed);
}
function mathGif(message, choice){
	var channel = message.channel;
	const filter = m => m.author.id === message.author.id
	const collector = channel.createMessageCollector(filter, { time: 10000 }); //listen for a response
	if (choice < 1 || choice > 21 || choice === "options"){ //if choice is outside the range of possible
		mg.options(channel);//display options
		console.log(collector); //TESTING

		collector.on('collect', response => {
			if (parseInt(response) > 0 && parseInt(response) < 22){//if response is between 1 and 21, get gif
				channel.send(mg.selection(parseInt(response))); //show the gif
				collector.stop();
			} else if (response.content === "cancel"){
				channel.send("Canceling request");
				collector.stop();
			} else {
				channel.send("Invalid selection!  Canceling request.");
				collector.stop();
			}
		});
		collector.on('end', collected => console.log('Collected '+ collected.size+ ' items'));
	}
}

function serverStats(channel){
	let guild = client.guilds.get(gid);
	let d = guild.createdAt.toDateString();
	let numUsers = guild.memberCount;
	let online = guild.members.filter(m => m.presence.status === 'online').size;

	let createdString = "This server was started on " + d;
	let userStat = "Number of online users: " + online + "/" + numUsers;
	console.log(createdString);
	console.log(userStat);
	let ServerEmbed = new Discord.RichEmbed()
		.setDescription("__**NerdRevolt Stats**__")
		.setColor(embedColor)
		.setThumbnail(NRicon)
		.addField("\u200b", "\u200b")
		.addField("NerdRevolt Launch Date", createdString)
		.addField("Number of users", userStat)
	channel.send(ServerEmbed);
}

function userStats(message, u){
	let channel = message.channel;
	if (u.startsWith('<@') && u.endsWith('>')){ //if the second command is a mention we can get to work.
		let user = message.guild.member(message.mentions.users.first()); 
		let uIcon = user.user.displayAvatarURL; //user avatar
		var lastmsg
		if (user.lastMessage == null){
			lastmsg = "Never"
		} else lastmsg = user.lastMessage.createdAt.toDateString();
		//console.log(lastmsg);
		var start = user.joinedAt;
		var curTime = Date.now();
		var dif = ((curTime - start)/3600000); //this is all that matters for calculating 24 hours but I want to make it display nicely.
		var hour = Math.floor(dif);
		var min = Math.floor((dif - hour)*60);
		if (hour > 24){
			var day = Math.floor(hour/24)
			var hour = hour % 24 //remainder of hours
		} else day = 0
		var dayVal, hourVal, minVal;
		if (day == 1){
			dayVal = "day";
		} else dayVal = "days";
		if (hour == 1){
			hourVal = "hour";
		} else hourVal = "hours";
		if (min == 1){
			minVal = "min";
		} else minVal = "mins";
		var timeOutput = day + " " + dayVal + ", " + hour + " " + hourVal + ", " + min + " " + minVal

		let memberEmbed = new Discord.RichEmbed()
		.setColor(embedColor)
		.setThumbnail(uIcon)
		.addField("__**Member Information**__", "\u200b")
		.addField("Name", user)
		.addField("ID", user.id)
		.addField("Joined date", user.joinedAt)
		.addField("Time since Join", timeOutput)
		//.addField("Last message", lastmsg)

		message.channel.send(memberEmbed);
		
	} else {
		channel.send("Error: Either user doesn't exist or you failed to mention them.")
	};
}


//ADMIN FUNCTIONS BELOW THIS LINE
//delete user specified number of messages
function del(message, number){
	var uname = message.author.username;
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) { //if message comes from admin or mod...
		message.channel.bulkDelete(number)
			.then(message.channel.send(number + " messages deleted by " + uname))
			.catch(console.error);
	} else {
		message.channel.send(message.author.username + " has attempted to delete " + number + " messages.\nOnly Administrators or Moderators can delete messages!  This has been flagged for review by <@&444250817680375809>"); //Publicly shame the offender and tag moderators
		console.log("WARNING!!!! - " + message.author.username + " has attempted to delete " + number + " messages from the " + message.channel.name + " channel.");
	}
}

function discussion(channel, message){
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) { //if message comes from admin or mod...
	var discussion;
	fs.readFile("./discussion.txt", "utf-8", (err, buf) => {
		if (err){console.log(err)};
		discussion = buf.split(";"); //end of line for each question
		var j = Math.floor(Math.random() * discussion.length) //random select from discusssion questions
		channel.send(discussion[j]);
	});
}
else channel.send("Only staff can start this discussion");
}

function parrot(channel, message){
	myMsg = message.content.split('"');
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) { //if message comes from admin or mod...
		message.delete();
		console.log(message.author.username + " has sent the following parrot message: \"" + myMsg[1] + "\""); //log who sent what message to console just in case.


		
		//HOLY FUCKING GODDAMN SHIT YOU NEEED TO CHECK THIS OUT BECAUSE IT'S THROWING WIERD WARNINGS THAT I'M TOO DRUNK TO FIGURE OUT!!!!
		channel.send(myMsg[1]);

	}else ("Only staff can run this command.");
}






client.login(auth.token);