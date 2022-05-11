const Discord = require('discord.js');
const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.
const fs = require('fs')

exports.mention = function(message){
    console.log(message)
    console.log(message.mentions.users.first())
    var user = message.guild.member(message.mentions.users.first());
    console.log(user)
    stats(message, user);
}
exports.noMention = function(message, cmd2, gid, Client){
    var user;
    if(cmd2.length == 18 && !isNaN(cmd2)){ //cmd2 is a userID
        user = Client.guilds.get(gid).members.get(cmd2);
    } else { //cmd2 is presumably a username, we'll try to find it.
    if((cmd2.startsWith('"') || cmd2.endsWith("'")) && (cmd2.endsWith('"') || cmd2.endsWith("'"))){
		cmd2 = cmd2.substr(1, cmd2.length-2) //if username is in quotes remove them
	}
	user = Client.guilds.get(gid).members.find(user => user.displayName == cmd2)
    }
    if (!user){errorMessage(message, cmd2)}else{stats(message, user)}; 
}

    function stats(message, user){
    let uIcon = user.user.displayAvatarURL; //user avatar
    //Time on Server
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

    let log = readLog(user.id)
    let memberEmbed = new Discord.RichEmbed()
    .setColor(embedColor)
    .setThumbnail(uIcon)
    .addField("__**Member Information**__", "\u200b")
    .addField("Name", user.displayName)
    .addField("ID", user.id)
    .addField("Joined date", user.joinedAt)
    .addField("Time since Join", timeOutput)
    .addBlankField()
    .addField("__**Admin Data/Warnings**__", "\u200b")
    for (let i=0;i<log.length;i++){
        memberEmbed.addField("ID: "+log[i].id +"      Action: "+log[i].action, log[i].reason + " :: " + log[i].date)
    }

    message.channel.send(memberEmbed);
}

function errorMessage(message, cmd2){
    let errorMessage = new Discord.RichEmbed()
    .setColor(embedColor)
    .setThumbnail(NRicon)
    .addField("__**ERROR!! USER NOT FOUND**__", "\u200b")
    .addBlankField()
    .addField("Requested User: ", cmd2, true)
    message.channel.send(errorMessage);
}

function readLog(uid){
    let jsonStr = fs.readFileSync("automod.json");//read in the json data
    let obj = JSON.parse(jsonStr);
    let mod = obj.moderation;
    var log = [];
    
    for (let i=0;i<mod.length;i++){
        if (uid == mod[i].uid){
            log.push({id: mod[i].id, action: mod[i].action, reason: mod[i].reason, date: mod[i].date}) //data to the array to return.
        }
    }
    return log;
}