const Discord = require('discord.js');
const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.

exports.editRoles = function test(message, target, role){
    var member = message.mentions.members.first();
    var role = role.toLowerCase();
    var chan = message.channel;
    if (role == 'noselect'){ //no role selected
        displayOptions(chan, member, message);
    } else {
        if (roleCheck(role)){ //check if valid role
        executeRoleChange(chan, message, role, member);
        } else {
            chan.send("**Invalid Argument. " + role + " is not a valid role.  Please check spelling and format.**").then(sent => {
                sent.delete(20000);
              });
                 displayOptions(chan, member, message);
            }
    }   
    }
exports.display = function(channel){
    let displayEmbed = new Discord.RichEmbed()
    .setTitle("__**Staff Assignable Roles**__")
    .setDescription("Add/Remove roles from the tagged user.  Roles must be typed as displayed in this menu.\n\n\
    Usage: !nrPromote <@username> [role]")
    .setColor(embedColor)
    .setThumbnail(NRicon)
    .addBlankField()
    .addField("\u200b", "__**Available Roles**__")
    .addField("Note: To add or remove a role, it must be entered as displayed below.", "\u200b")
    .addField("\u200b", "Batch , C , Java")
    .addField("\u200b", "Python , VB , WebDev")
    .addField("\u200b", "Challenge , Windows , Linux")
    .addField("\u200b", "Apple , Android , SuperNerd")
    .addField("\u200b", "Muted , UploadRestricted")
    channel.send(displayEmbed).then(sent => {
        sent.delete(20000); //Send the embed then delete it after 10 seconds.
    });
}

function displayOptions(channel, member, message){
    let roles = member.roles.map(r => `${r.name}`) //creates an array of roles the user is a member of
    let user = member.displayName;
  let OptionsEmbed = new Discord.RichEmbed()
  .setTitle("__**Staff Assignable Roles**__\n\n\n")
  .setDescription("Add/Remove __**"+ user + "**__ from the roles listed in the **Available Roles** section below.\n\n\
    Usage:\n\
    !nrPromote <@username> [role]")
	.setColor(embedColor)
    .setThumbnail(NRicon)
    .addField("\u200b", "__**Currently Assigned Roles for user: " + user + "**__");
    //list user roles
    var count = 1;
    var fieldVal = "";
    for(let i=1;i<roles.length;i++){
        if (roles.length>3){
        if (count == 3){
            fieldVal = fieldVal + roles[i]
            OptionsEmbed.addField("\u200b", fieldVal);
            count = 1
            fieldVal = ""
        } else {
            fieldVal = fieldVal + roles[i] + " , "
            count++
        }
        } else {
        OptionsEmbed.addField("\u200b", roles[i], true)
        }
        if(i==(roles.length-1)){//end of the loop
        if (fieldVal != ""){//check if we still have data to display
            OptionsEmbed.addField("\u200b", fieldVal.slice(0, -2)); //trim the ", " from the end.
        }
        
        }
    }
    OptionsEmbed
    .addBlankField()
    .addField("\u200b", "__**Available Roles**__")
    .addField("Note: To add or remove a role, it must be entered as displayed below.", "\u200b")
    .addField("\u200b", "Batch , C , Java")
    .addField("\u200b", "Python , VB , WebDev")
    .addField("\u200b", "Challenge , Windows , Linux")
    .addField("\u200b", "Apple , Android , SuperNerd")
    .addField("\u200b", "Muted , UploadRestricted")
    channel.send(OptionsEmbed).then(sent => {
        sent.delete(20000); //Send the embed then delete it after 10 seconds.
    });
    }

function roleCheck(role){
  const validRoles = ["batch", "c", "java", "python", "vb", "webdev", "challenge", "windows", "linux", "apple", "android", "namechange", "muted", "uploadrestricted","supernerd"]
  if (validRoles.includes(role)){
    return true;
  } else return false;
}

function executeRoleChange(channel, message, role, member){
  var userRole
  //let member = message.guild.members.get(message.author.id)
  let roles = member.roles.map(r => `${r.name}`) //creates an array of roles the user is a member of
  switch(role){ 
    case 'batch': userRole = 'Batch';break;
    case 'c': userRole = 'C Language';break;
    case 'java': userRole = 'Java';break;
    case 'vb': userRole = 'VB';break;
    case 'webdev': userRole = 'WebDev';break;
    case 'challenge': userRole = 'Challenge';break;
    case 'windows': userRole = 'Windows';break;
    case 'linux': userRole = 'Linux';break;
    case 'apple': userRole = 'Apple';break;
    case 'android': userRole = 'Android';break;
    case 'namechange': userRole = 'Name Change';break;
    case 'muted': userRole = 'Muted';break;
    case 'uploadrestricted': userRole = 'Upload Restricted';break;
    case 'supernerd': userRole = 'Super Nerd';break;
  }
  var newRole = message.guild.roles.find(role => role.name === userRole)
  if (roles.includes(userRole)){
    member.removeRole(newRole);
    //remove role from user
    channel.send("User removed from role: **" + userRole +"**").then(sent => {
      sent.delete(5000);
    });
  } else {
    member.addRole(newRole)
    //add role to user
    channel.send("User added to role: **" + userRole+"**").then(sent => {
      sent.delete(5000);
    });
  }
}