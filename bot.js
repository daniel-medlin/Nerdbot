const Discord = require('discord.js');
const client = new Discord.Client();

const auth = require('./auth.json');
const fs = require('fs');
const mg = require('./mathgifs');
const rMod = require('./roleMod.js');
const rPromote = require('./promote.js');
const userStat = require('./userStat.js');
const mod = require('./Automod.js');

const gid = "444186550197288970"; //ID of the guild
const roleNewUser = "587787978491953159"; //ID of new member role
const roleMember = "587787582583078923"; //ID of member role
const ruleMSG = "587817645416644621"; //ID of the rules post
const langMSG = "619323243077173278"; //ID of the language post
const osMSG = "663852075343675421"; //ID of the OS post
const genRoles = "962133843035439184"; //ID of the general roles post
const welcomeChan = "646926674159468557"; //ID of Welcome Channel Channel
const sBox = "718261894359679017"; //ID for Suggestion Box Channel
const logChan = "657746941295329300"; //ID of Logs channel
const langChan = "619317154080227348"; //ID of the language channel

//language role IDs
const batch = "619314081068875792";
const cLang = "619314304759365633";
const java = "619314332244770836";
const go = "780594031305555979";
const python = "619314356039188480";
const vb = "619314378637967371";
const webdev = "619314416466264075";
const rust = "962149413583732737";
const challenge = "711990793329705031";

//Gen Role IDs
const gaming = "962093267174965268";
const tech = "962093145422712852";
const music = "962018183634620467";

//OS Roles ID
const windowsOS = "663845613426835456";
const linuxOS = "663845696457146391";
const appleOS = "663845749293056021";
const androidOS = "663845790527127555";

//OS react ID
const windowsReact = "663817236993146885";
const linuxReact = "663817216214695947";
const appleReact = "663817567827263508";
const androidReact = "663817195519868968";


const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});

client.on('error', console.error); //display client errors without crashing
client.on('ready', () => {
	console.log('Logged in as '+client.user.tag+'!');
	checkUsers();
});
client.on('ready', () => {
	client.user.setActivity('!nrHelp || NerdRevolt', { type: 'WATCHING' }) //Watching !nrHelp || NerdRevolt
  .then(presence => console.log(`Activity set to ${presence.game ? presence.game.name : 'none'}`))
  .catch(console.error);
});

client.on('guildMemberAdd', (member) => { //add newly joined members to the new user role
	member.addRole(roleNewUser)    //id for "New User' role on server
	
		.then(console.log(member.user.username+" has joined "+ member.guild.name + " with the New User role! - " + timestamp()))
		.then(storeNewUser(member.user.id, member.user.username))
		.catch(console.error);
		console.log(member)
});

client.on("guildMemberAdd", (member) => {
	console.log(member)
})

client.on('guildMemberRemove', (member) => { //actions on member leaving guild
	deleteUser(member.id);
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
		} else if(event.d.message_id === osMSG){ //message ID for os post
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
		} else if(event.d.message_id === genRoles){ //message ID for General Roles post
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
		} else if(event.d.message_id === osMSG){  //message ID for language post
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
		} else if(event.d.message_id === genRoles){  //message ID for general roles post
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

function output(outText, channelID){ //display text in language channel 
	client.channels.get(channelID).send(outText).then(sent => {
		sent.delete(2000)
	});
}

client.on("messageReactionAdd", (messageReaction, user) => { //Add new users to the Member role after reacting to the the rules.
	if (messageReaction.message.id === ruleMSG){ //ensure we're reacting to the correct message
		if(messageReaction.emoji.name === '👍'){
			var member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if(member){
				member.addRole(roleMember); //Add Members role
				member.removeRole(roleNewUser);//remove new User role
				console.log(member.user.username + " has been added to the Members role. - "+ timestamp());
				deleteUser(user.id, user.username);

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
				output(user.username + " has been added to the Batch role.", langChan);
			break;
			case '🇨':
				member.addRole(cLang);
				output(user.username + " has been added to the C role.", langChan);
			break;
			case '🇯':
				member.addRole(java);
				output(user.username + " has been added to the Java role.", langChan);
			break;
			case '🇵':
				member.addRole(python);
				output(user.username + " has been added to the Python role.", langChan);
			break;
			case '🇻':
				member.addRole(vb);
				output(user.username + " has been added to the VB role.", langChan)
			break;
			case '🇼':
				member.addRole(webdev);
				output(user.username + " has been added to the WebDev role.", langChan)
			break;
			case '🇬':
				member.addRole(go);
				output(user.username + " has been added to the Go role.", langChan);
			break;
			case '🇷':
				member.addRole(rust);
				output(user.username + " has been added to the Rust role.", langChan);
			break;
			case '⁉️':
				member.addRole(challenge);
				output(user.username + " has been added to the Challenge role.", langChan);
			break;
			default:
				messageReaction.remove(user); //catch invalid reactions and remove it.  Shouldn't happen but better safe than sorry.
		}
	} else if (messageReaction.message.id === osMSG){ //reactions on OS message
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.id){
			case windowsReact:
				member.addRole(windowsOS);
				output(user.username + " has been added to the Windows role.", langChan)
			break;
			case linuxReact:
				member.addRole(linuxOS);
				output(user.username + " has been added to the Linux role.", langChan)
			break;
			case appleReact:
				member.addRole(appleOS);
				output(user.username + " has been added to the Apple role.", langChan);
			break;
			case androidReact:
				member.addRole(androidOS);
				output(user.username + " has been added to the Android role.", langChan);
			break;
			default: messageReaction.remove(user); //catch invalid reactions and remove it.  Shouldn't happen but better safe than sorry.
		}
	} else if (messageReaction.message.id === genRoles){ //reactions on General Roles message
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.name){
			case '🎮':
				member.addRole(gaming);
				output(user.username + " has been added to the Gaming role.", langChan)
			break;
			case '🎸':
				member.addRole(music);
				output(user.username + " has been added to the Music role.", langChan)
			break;
			case '💻':
				member.addRole(tech);
				output(user.username + " has been added to the Tech role.", langChan);
			break;
			default: messageReaction.remove(user); //catch invalid reactions and remove it.  Shouldn't happen but better safe than sorry.
		}
	}
});

client.on("messageReactionRemove", (messageReaction, user) => { //Remove Members role if user removes reaction
	/* //This functionality was the most abused feature with many users quickly switching back and forth.  This bogs down the bot.
	if (messageReaction.message.id === ruleMSG){ //ensure we're reacting to the correct message
		if(messageReaction.emoji.name === '👍'){
			var member = messageReaction.message.guild.members.find(member => member.id === user.id);
			if(member){
				member.addRole(roleNewUser);//add New User role
				member.removeRole(roleMember); //remove Members role
				console.log(member.user.username + " has been removed from the Members role. - "+ timestamp());
			}
		}
	} else */
	if (messageReaction.message.id === langMSG){
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.name){
			case '🇧':
				member.removeRole(batch);
				output(user.username + " has been removed from the Batch role.", langChan);
			break;
			case '🇨':
				member.removeRole(cLang);
				output(user.username + " has been removed from the C role.", langChan);
			break;
			case '🇯':
				member.removeRole(java);
				output(user.username + " has been removed from the Java role.", langChan);
			break;
			case '🇵':
				member.removeRole(python);
				output(user.username + " has been removed from the Python role.", langChan);
			break;
			case '🇻':
				member.removeRole(vb);
				output(user.username + " has been removed from the VB role.", langChan);
			break;
			case '🇼':
				member.removeRole(webdev);
				output(user.username + " has been removed from the WebDev role.", langChan);
			break;
			case '🇬':
				member.removeRole(go);
				output(user.username + " has been removed from the Go role.", langChan);
			break;
			case '🇷':
				member.removeRole(rust);
				output(user.username + " has been removed from the Rust role.", langChan);
			break;
			case '⁉️':
				member.removeRole(challenge);
				output(user.username + " has been removed from the Challenge role.", langChan);
			break;
		}
	} else if (messageReaction.message.id === osMSG){
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.id){
			case windowsReact:
				member.removeRole(windowsOS);
				output(user.username + " has been removed from the Windows role.", langChan);
			break;
			case linuxReact:
				member.removeRole(linuxOS);
				output(user.username + " has been removed from the Linux role.", langChan);
			break;
			case appleReact:
				member.removeRole(appleOS);
				output(user.username + " has been removed from the Apple role.", langChan);
			break;
			case androidReact:
				member.removeRole(androidOS);
				output(user.username + " has been removed from the Android role.", langChan);
			break;
		}
	} else if (messageReaction.message.id === genRoles){ //reactions on General Roles message
		var member = messageReaction.message.guild.members.find(member => member.id === user.id);
		switch(messageReaction.emoji.name){
			case '🎮':
				member.removeRole(gaming);
				output(user.username + " has been removed from the Gaming role.", langChan)
			break;
			case '🎸':
				member.removeRole(music);
				output(user.username + " has been removed from the Music role.", langChan)
			break;
			case '💻':
				member.removeRole(tech);
				output(user.username + " has been removed from the Tech role.", langChan);
			break;
		}
	}
});

function storeNewUser(uid, uname){ //Write users to .json
	let thisUserData = {uid: uid, uname: uname, joined: new Date()};
	let jsonStr = fs.readFileSync("userdata.json"); //read in the json data
	let obj = JSON.parse(jsonStr); //parsed the json string for reading.
	let users = obj.users;
	let found = false;

	for (let i=0;i<users.length;i++){
		if (uid == users[i].uid){
			found = true;
		}
	}
	if (!found){
		obj['users'].push(thisUserData); //adds new users to the users object in obj
		jsonStr = JSON.stringify(obj); //converts my json string back to the correct format for writing.
		fs.writeFileSync('userdata.json',jsonStr, function(err) {
			if (err) {
				console.log(err);
			}
		}); //write the new json file
	}
}

function deleteUser(uid, username){ //remove users from .json
	let jsonData = fs.readFileSync("userdata.json")
	let users = JSON.parse(jsonData).users;
	
	for (let i=0;i<users.length;i++){
		if (uid == users[i].uid){
			users.splice(i,1);
			jsonData = JSON.stringify({"users":users});
			fs.writeFileSync("userdata.json", jsonData, function(err) {
				if (err) {
					console.log(err);
				}
			});
			let member = client.guilds.get(gid).members.get(uid);
			let uIcon = member.user.displayAvatarURL;
			if (uIcon == undefined){uIcon=NRicon};
			if(uid==undefined){return}//can't delete undefined also, don't want an ugly message.
			setTimeout(function(){
				client.fetchUser(uid)
				.then(user => {
					uIcon = user.displayAvatarURL;
					let currentUser = user.username;
					let welcomeEmbed = new Discord.RichEmbed()
						.setTitle("__**Welcome to Nerd Revolt!**__")
						.setColor(embedColor)
						.setThumbnail(uIcon)
						.setDescription("Hey "+currentUser+" (<@" + user.id + ">), welcome to **Nerd Revolt**:tada::hugging:!  Have fun coding with us!\n\n\
						Be sure to check out the <#"+langChan+"> channel to select your prefered programming lanugages.  \nYou can also select your roles manually using the !nrRole command.")
						setTimeout(function(){ client.channels.get(welcomeChan).send(welcomeEmbed); }, 2000);
				}, rejection => {
					console.log(rejection);
				});
			}, 2000);
			
		}
	}

}

function checkUsers(){ //hourly, check members of the new users group.  Compare that list of users to the users we have in the .json file.  Anyone older than 24 hours kick
	setInterval(function(){
		console.log("Checking for expired users - " + timestamp());
		let now = new Date();
		var jsonData = fs.readFileSync("userdata.json")
		var users = JSON.parse(jsonData).users;
		let roleMember = client.guilds.get(gid).roles.get(roleNewUser).members.map(m=>m.user.id); //lists members in the role

		for (let a=0;a<roleMember.length;a++){ //loop through members of the new user role
			for (let i=0;i<users.length;i++){ //loop through members of the .json file
				var uid = users[i].uid;
				var name = users[i].uname;
				var join = new Date(users[i].joined);
				if (uid == roleMember[a]){
					let diffDay = (Math.abs(now.getTime()-join.getTime()))/(1000 * 60 * 60 * 24); //Calculate the difference in days. if >= 1 then kick.
					//let diffMin = (Math.abs(now.getTime()-join.getTime()))/(1000 * 60); //Calculate the difference in min.  useful for testing.
					if (diffDay >= 1){
						
						client.guilds.get(gid).members.get(uid).kick("Failed to accept rules within 24 hours of joining");
						console.log(name + " has been kicked for inactivity - " + timestamp());
						deleteUser(uid);
					}
				} //No user match
			}
		}
	}, 1000*60*60);//run every hour
}


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
						message.delete();
						message.channel.send("Hi there, " + uname + "!");
					break;
					//!nrTime
					case 'time':
						message.delete();
						var myDate = new Date();
						message.channel.send("The current time is: " + myDate);
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
							mathGif(message, cmd2);
						} else message.channel.send("Invalid argument");
					break;
					case 'role':
						if (cmd2 == null){
							rMod.editRoles(message, 'noSelect');
						} else rMod.editRoles(message, cmd2);
						message.delete();
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
						} else userStats(message, msg.substring(8, msg.length));
						message.delete();
					break;
					case 'suggest':
						message.delete();
						if (cmd2 == null){
							message.channel.send("No suggestion detected.  Please try again.  Usage: !nrSuggest Your suggestion here").then(sent => {
								sent.delete(10000);
							  });
						} else suggestion(message.channel, uname, msg.substring(11, msg.length))
					break;
					/*
					case 'test':
						message.delete();
						message.channel.send("Successful Test").then(sent => {sent.delete(2000);});
						console.log(message);
					break;
					*/

					//ADMIN COMMANDS BELOW HERE
					//!nrDelete [1] allow admin to delete multiple messages
					case 'delete':
						if(!isNaN(cmd2)){ //only run command if cmd2 is a number
							del(message, parseInt(cmd2)+1);
						}				
					break;
					//!nrParrot repeat the phrase as if coming from bot
					case 'parrot':
						parrot(message.channel, message);
					break;
					case 'promote':
						if (cmd2 == null){
							rPromote.display(message.channel);
						} else if (cmd2.substring(0,2) != "<@"){
							rPromote.display(message.channel);
							message.channel.send("**Invalid Argument.  Correct usage: !nrPromote <@username> [role]**").then(sent => {
								sent.delete(20000).catch(e => console.log(e));
							  });
						} else {
							role = args[2]
							promote(message, uname, cmd2, role)
						}
						message.delete();
					break;
					case 'warn':
						autoMod("warn", message, cmd2, msg.substring(31, msg.length))
					break;
					case 'kick':
						autoMod("kick", message, cmd2, msg.substring(31, msg.length))
					break;
					case 'ban':
						autoMod("ban", message, cmd2, msg.substring(30, msg.length))
					break;
					case 'clear':
						autoMod("delete",message, cmd2, msg.substring(9, msg.length))
					break;
					case 'test':
						test(message);
						message.delete();
					break;
				}
		}
});


//Shhh the functions are sleeping down here.

function test(message){
	//console.log(message)
	client.emit("guildMemberAdd", message.member)
}


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
		.setDescription("1. Be respectful and polite; this means tolerating other users, treating them with respect, not posting discriminatory or inflammatory content, and not spamming channels.  \n\
		2. Do not discuss anything illegal or blackhat, send malware, post anything NSFW, or break Discord [Terms of Service](https://discord.com/terms). \n\
		3. Keep chatting to the relevant channels and in English. \n\
		4. Members with the 'Super Nerd' role can change their nickname, otherwise, request a change from an Admin. \n\
		5. When posting code, use code tags (\\`\\`\\`lang <code>\\`\\`\\`) or upload it as a text document. ***Do not upload executables***. \n\
		6. The Moderation and Admin team have the final say in any moderation decision. If you do not approve, voice your feedback. \n\
		7. To help people answer your questions: Don't Ask to Ask, just Ask. When possible, search your question before sending it to the server. Whilst we appreciate good questions, we are not your search engine.");
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
	.addField("!nrStat", "Display server statistics")
	.addField("!nrStat [@mention, username, or user id]", "Display the users statistics using either mention, display name, or ID")
	.addField("!nrRole", "Add or remove yourself from various roles.  !nrRole without an argument lists roles.  !nrRole [Rolename] adds/removes you from the roll selected.")
	.addField("!nrSuggest <Your suggestion here>", "Drop a suggestion in the suggestion box.  Quotes not needed around suggestion text")
	//.addField("!nrSource", "Displays a link to the source of this bot")
	.addBlankField()
	.addField("**Staff Commands**", "\u200b")
	.addField("!nrDelete [number to delete]", "Deletes requested number of posts from the current channel")
	.addField("!nrParrot \"statement\"", "Make the bot say what you say in the quotes following the command")
	.addField("!nrPromote <@username> [role]", "Add/Remove tagged user from the role.  use !nrPromote to see valid roles")
	.addField("!nrWarn <@user> [reason]", "Warn a member, must mention the member with the reason optional.")
	.addField("!nrKick <@user> [reason]", "Kick a member, must mention the member with the reason optional.")
	.addField("!nrBan <@user> [reason]", "Ban a member, must mention the member with the reason optional.")
	.addField("!nrClear <log ID>", "Clear log with provided ID")
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
		.setFooter("If you have any suggestions or feature requests, Use !nrsuggest Your suggestion here")

		channel.send(sourceEmbed);
}
function mathGif(message, choice){
	var channel = message.channel;
	const filter = m => m.author.id === message.author.id
	const collector = channel.createMessageCollector(filter, { time: 10000 }); //listen for a response
	if (choice < 1 || choice > 21 || choice === "options"){ //if choice is outside the range of possible
		mg.options(channel);//display options

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
	} else {
		channel.send(mg.selection(parseInt(choice)))
	}
}

function serverStats(channel){
	let guild = client.guilds.get(gid);
	let d = guild.createdAt.toDateString();
	let numUsers = guild.memberCount;
	let online = guild.members.filter(m => m.presence.status === 'online').size;
	let chanCount = guild.channels.size;
	let catCount = guild.channels.filter(chan => chan.type === "category").size;
	let roleCount = guild.roles.size - 1; //don't count @everyone

	let createdString = "This server was started on " + d;
	let channelStat = "There are " + chanCount + " channels in " + catCount + " categories.";
	let userStat = "Number of online users: " + online + "/" + numUsers;
	let roles = "Total number of roles: " + roleCount;
	let ServerEmbed = new Discord.RichEmbed()
		.setDescription("__**NerdRevolt Stats**__")
		.setColor(embedColor)
		.setThumbnail(NRicon)
		.addField("\u200b", "\u200b")
		.addField("NerdRevolt Launch Date", createdString)
		.addBlankField()
		.addField("User count", userStat)
		.addField("Roles", roles)
		.addField("Channels", channelStat)
	channel.send(ServerEmbed);
}

function userStats(message, cmd2){
	if (cmd2.startsWith('<@') && cmd2.endsWith('>')){ 
		userStat.mention(message)
	} else {
		userStat.noMention(message, cmd2, gid, client);
	}
}

function suggestion(channel, user, suggestion){
	try{
		client.channels.get(sBox).send("Suggestion from: " + user + "\n>>> " + suggestion)
		channel.send("Your suggestion has been logged and will be reviewed by staff:\n\nSuggestion from: " + user + "\n>>> " + suggestion).then(sent => {
			sent.delete(10000);
		  });
	} catch(err) {
		channel.send("Suggestion not logged for the following reason: " + err.message + "\n\n\
		This message will be displayed for 30 seconds. Please provide this error message to staff.").then(sent => {
			sent.delete(30000);
		  });
	}
}

//ADMIN FUNCTIONS BELOW THIS LINE
//delete user specified number of messages
function del(message, number){
	var uname = message.author.username;
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) { //if message comes from admin or mod...
		if (number > 1 && number < 101){
		message.channel.bulkDelete(number)
			.then(console.log((number-1) + " messages deleted by " + uname))
			.catch(console.error);
		} else message.channel.send("number to delete must be greater than 0 and less than 100.");
	} else {
		message.channel.send(message.author.username + " has attempted to delete " + number + " messages.\nOnly Administrators or Moderators can delete messages!  This has been flagged for review by <@&444250817680375809>"); //Publicly shame the offender and tag moderators
		console.log("WARNING!!!! - " + message.author.username + " has attempted to delete " + number + " messages from the " + message.channel.name + " channel.");
	}
}

function parrot(channel, message){
	myMsg = message.content.split('"');
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) { //if message comes from admin or mod...
		message.delete();
		console.log(message.author.username + " has sent the following parrot message: \"" + myMsg[1] + "\""); //log who sent what message to console just in case.
		channel.send(myMsg[1]);

	}else ("Only staff can run this command.");
}

function promote(message, user, target, role){
	if (role == null) role = "noselect";
	channel = message.channel;
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name ==="Moderator")) { //if message comes from an admin or mod...
		rPromote.editRoles(message, target, role);
	}

}

function autoMod(type, message, userID, text){
	if (text == "" || text == undefined){ //check/set text
		text = "No Reason Provided"
	}
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) { //if message comes from staff
		if (type == 'delete'){mod.delete(message,text);return;}
		if (userID != undefined){ //check if a target was identified
			if (userID.substring(0,3) == "<@!"){ //userID is a mention as expected.
				userID = userID.substring(3,21)
				var user = message.guild.members.get(userID)
				var authorID = message.author.id
		
				if (user.roles.find(r => r.name === "Admin") || user.roles.find(r => r.name === "Moderator")){ //check if target is admin or mod.
					message.channel.send("Hey! <@!" + authorID + "> You can't warn staff!").then(sent => {
						sent.delete(5000);
					});
				} else { //Target isn't staff..valid target
					switch(type){
						case "warn": mod.warn(message, user, text);break;
						case "kick": mod.kick(message, user, text);break;
						case "ban" : mod.ban(message, user, text);break;
						case "read": mod.read(message,userID);break;
					}

				}
			} else {
				message.channel.send("Invalid Synatax.  Correct Syntax: **!nrwarn/kick/ban <@username> [reason text]**").then(sent => {
				sent.delete(10000).then(message.delete(12000));
			});}
		} else message.channel.send("Invalid Synatax.  Correct Syntax: **!nrwarn/kick/ban <@username> [reason text]**").then(sent => {
			sent.delete(10000).then(message.delete(12000));
		});
		
	} else {// Message not sent by staff
		message.channel.send("This command is for staff use only!  This action has been logged.").then(sent => {
			sent.delete(5000)
			message.delete(7000);
			if (userID != undefined){
				if (userID.substring(0,3) == "<@!"){ //userID is a mention as expected.
					userID = userID.substring(3,21)
					client.channels.get(logChan).send(message.guild.members.get(message.author.id) + " attempted to " + type + " " + message.guild.members.get(userID) + " with the message **" + text + "**") //if they tried to warn someone
				} else {
					if (type == 'delete'){
						if (text.length == 5 && !isNaN(text)){
							mod.displayID(message,text)
						} else client.channels.get(logChan).send(message.guild.members.get(message.author.id) + " attempted to clear log: " + text)
						
					} else client.channels.get(logChan).send(message.guild.members.get(message.author.id) + " attempted to use staff restricted command: " + type)
				}
			} else client.channels.get(logChan).send(message.author + " attempted to "+type+" a user with the message: **" + text + "**") //catch invalid syntax
			
		});
	}
}

client.login(auth.token);