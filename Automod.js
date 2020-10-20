const Discord = require('discord.js');
const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.
const fs = require('fs');
const logChan = "657746941295329300"; //ID of Logs channel

process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error.message);
});


exports.read = function(message,uid,username){//Read and return log for requested user.
    displayData(message,uid,username)
}
function displayData(message,uid,username){
    let log = readLog(uid)
    var output = new Discord.RichEmbed()
    .setTitle("**__Admin actions against user: " + username + "__**")
    .setColor(embedColor)
    .setThumbnail(NRicon)
    for (let i=0;i<log.length;i++){
        output.addField("ID: "+log[i].id +"      Action: "+log[i].action, log[i].reason + " :: " + log[i].date)
    }
    message.channel.send(output)
}

exports.warn = function(message,user,text){ //WARN USER
    writeLog(user.id, user.displayName, "Warning", text)
    displayData(message,user.id,user.displayName)
    user.send("You have been officially warned by " + message.author + " of NerdRevolt.  Please be sure to check out the <#587298778512490512> and see the warning reason below: \n" + text)
    message.client.channels.get(logChan).send(user.displayName + " has been warned by " + message.author + " for \"" + text+"\"")
    message.delete()
}

exports.kick = function(message,user,text){ //KICK USER
    var member = message.guild.member(user);
    if(member){
        user.send("You have been kicked from NerdRevolt for the following reason: \n" + text)
        member
            .kick(text)
            .then(writeLog(user.id, user.displayName, "Kick", text))
            .then(displayData(message,user.id,user.displayName))
            .then(message.client.channels.get(logChan).send(user.displayName + " has been kicked by " + message.author + " for \"" + text+"\""))
            .catch(err => {
                let errOut = new Discord.RichEmbed()
                .setTitle("**__ERROR__**")
                .setColor(embedColor)
                .setThumbnail(NRicon)
                .addField("Unable to kick user!", "Username: " + user.displayName)
                message.channel.send(errOut)
                console.log(err)
            })
    }
}
exports.ban = function(message,user,text){ //BAN USER
    let channel = message.channel;
    var filter = m => m.author.id === message.author.id
    var collector = channel.createMessageCollector(filter, { time: 30000 }); //listen for a response
    let banCheck = new Discord.RichEmbed()
    .setTitle("**__Ban User__**")
    .setColor(embedColor)
    .setThumbnail(NRicon)
    .addField("\u200b", "Are you sure you would like to ban the user, " + user + "?  This will remove the user along with any messages sent.")
    .addField("\u200b", "You have 30 seconds to respond with either **Yes or No** before this action is canceled.")
    channel.send(banCheck).then(sent => {
        sent.delete(30000); //Send the embed then delete it after 30 seconds.
        message.delete(35000);
    
    collector.on('collect', response => {
        switch(response.content.toLowerCase()){
            case "yes":
                sent.delete()
                collector.stop();
                response.delete(1000);
                message.delete(500);
                var member = message.guild.member(user)
                if(member){
                    user.send("You have been banned from NerdRevolt for the following reason: \n" + text)
                    member
                        .ban({
                            reason: text
                        })
                        .then(writeLog(user.id, user.displayName, "Ban", text))
                        .then(displayData(message,user.id,user.displayName))
                        .then(message.client.channels.get(logChan).send(user.displayName + " has been banned by " + message.author + " for \"" + text+"\""))
                        .catch(err => {
                            let errOut = new Discord.RichEmbed()
                            .setTitle("**__ERROR__**")
                            .setColor(embedColor)
                            .setThumbnail(NRicon)
                            .addField("Unable to ban user!", "Username: " + user.displayName)
                            message.channel.send(errOut)
                            console.log(err)
                        })
                }
            break;
            case "no":
                sent.delete()
                collector.stop();
                response.delete(1000);
                message.delete(500);
                //cancel all actions
            break;
            default:
                response.channel.send("**YES or NO**").then(errSent => {
                    errSent.delete(2000);
                    response.delete(1500);
                })
            break;
        }
    })
  });
}

exports.delete = function(message, ID){ //removes warning from user's record based on id.
    if (ID == "No Reason Provided"){
        ID = "No ID Provided"
    }
    let jsonStr = fs.readFileSync("automod.json")
    let mod = JSON.parse(jsonStr).moderation;
    let found = false;

    for (let i=0;i<mod.length;i++){
        if (ID == mod[i].id){
            let user = message.client.users.get(mod[i].uid)
            message.client.channels.get(logChan).send(mod[i].action + " log has been removed from user: " + user + "'s stats by " + message.author + ".  This log showed a reason of \"" + mod[i].reason + "\"")
            found = true;
            mod.splice(i,1);
            let jsonData = JSON.stringify({"moderation":mod});
            fs.writeFileSync('automod.json', jsonData, function(err){
                if(err){console.log(err)}
            });
        }
    }
    if(found){
        message.channel.send("Admin action with ID: "+ID+" has been deleted.").then(sent => {
            sent.delete(5000); //Send the embed then delete it after 30 seconds.
            message.delete(5000);
        });
    } else message.channel.send("Unable to locate admin action with ID: "+ID+".").then(sent => {
        sent.delete(5000); //Send the embed then delete it after 30 seconds.
        message.delete(5000);
    });
}

exports.displayID = function(message, ID){
    if (ID != undefined){
        let jsonStr = fs.readFileSync("automod.json")
        let mod = JSON.parse(jsonStr).moderation;
        let found = false;
        
        for (let i=0;i<mod.length;i++){
            if (ID == mod[i].id) {
                found = true;
                var output = new Discord.RichEmbed()
                .setTitle("**__Log details__**")
                .setColor(embedColor)
                .setThumbnail(NRicon)
                .setDescription(message.guild.members.get(message.author.id) + " attempted to clear log: " + ID)
                .addField("ID: " + mod[i].id + "\nUSER: " + mod[i].uname, "ACTION: " + mod[i].action + "\nREASON: \"" + mod[i].reason + "\" \nDATE: " + mod[i].date)
                message.client.channels.get(logChan).send(output);
            }
            if (!found){
                message.client.channels.get(logChan).send(message.guild.members.get(message.author.id) + " attempted to clear log: " + ID)
            }
        }
    } else console.error("ID Undefined");
}

function writeLog(uid, uname, action, reason){ //Write data to JSON for future recall.
	let jsonStr = fs.readFileSync("automod.json"); //read in the json data
    let obj = JSON.parse(jsonStr); //parsed the json string for reading.
    let thisUserData = {id: createID(), uid: uid, uname: uname, action: action, reason: reason, date: new Date()}; //log ID, User ID, username, action(ban,kick,warn), reason, date
	
	obj['moderation'].push(thisUserData); //adds new item to the moderation object in obj
	jsonStr = JSON.stringify(obj); //converts my json string back to the correct format for writing.
	fs.writeFileSync('automod.json',jsonStr, function(err) {
		if (err) {
			console.log(err);
		}
	}); //write the new json file
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

function createID(){
    return Math.floor(10000 + (99999 - 10000) * Math.random());
}