const Discord = require('discord.js');
const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.
var client;
var gid;


exports.massKick = function (message, postID, c, g){
    client = c;
    gid = g;
	var kickList = new Array();
	var notFound = new Array();
	if (message.member.roles.find(r => r.name === "Admin") || message.member.roles.find(r => r.name === "Moderator")) {
		message.channel.fetchMessage(postID).then(msg => {
			let members = msg.content.split('\n');
			let clean = msg.cleanContent.split('\n');
			for (let i = 0; i<members.length; i++){
				var userID = members[i].substr(3,18)
				if (userID.length == 18 && !isNaN(userID)) {
					if (findAndKick(userID)){ //if successfully kicked, add to list.
						kickList.push(clean[i].substr(1,clean[i].length))
					} else notFound.push(clean[i].substr(1,clean[i].length))
				} else {
					notFound.push(members[i].substr(1, members[i].length))
				}
			}
			buildDisplay(kickList, notFound, message.channel)
		}).catch(console.error);		
	} //else do nothing I don't want test to respond to anyone.
}


function findAndKick(userID){
	var success = true;
	let guild = client.guilds.get(gid);
	guild.fetchMember(userID).then( m => {
		try{
			guild.members.get(userID).kick("Inactive")
		} catch(err){console.error; success = false};
	}).catch(console.error, success = false);
	return success;
}


function buildDisplay(kickList, notFound, channel){
	let notif = new Discord.RichEmbed()
	.setTitle("__**Mass Kick**__")
	.setColor(embedColor)
	.setThumbnail(NRicon)
	.setDescription("This is a one time use function to clear out old/inactive members")
	.addBlankField()
	.addField("\u200b", "The following users have been kicked")
	for (let i = 0;i<kickList.length;i++){
		notif.addField("\u200b", kickList[i], true)
	}
	notif.addBlankField()
	.addField("\u200b", "The following users were not located or failed to kick")
	for (let i = 0; i<notFound.length;i++){
		notif.addField("\u200b", notFound[i], true)
	}
	notif.setFooter("This message will be removed in 30 seconds.")
	channel.send(notif)
	//.then(sent => { //deletes message after 30000ms or 30 sec
	//	sent.delete(30000).catch(e => console.log(e));
	//  });
}