const Discord = require('discord.js');
const NRicon = "https://cdn.discordapp.com/icons/444186550197288970/8069d47b360eb4dc237eaffd8f538879.png";  //Nerd Revolt Icon for embeds.
const embedColor = 4194099; //color code for embeds.

exports.editRoles = function test(message,role){
  var role = role.toLowerCase();
  var user = message.author
  var chan = message.channel;
  var uid = user.id;
  if (role == 'noselect'){ //no role selected
    displayOptions(chan, message);
  } else {
    if (roleCheck(role)){ //check if valid role
      executeRoleChange(chan, message, role);
    } else displayOptions(chan, message);
  }
}

function displayOptions(channel, message){
  let member = message.guild.members.get(message.author.id)
  let roles = member.roles.map(r => `${r.name}`) //creates an array of roles the user is a member of

  let OptionsEmbed = new Discord.RichEmbed()
  .setTitle("__**USER ASSIGNED ROLES**__\n\n\n")
  .setDescription("Add your remove yourself from the roles listed in the **Available Roles** section below.\n\n\
    Usage:\n\
    !nrRole [role]")
	.setColor(embedColor)
  .setThumbnail(NRicon)
  .addField("\u200b", "__**Currently Assigned Roles for user: " + message.author.username + "**__");
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
        fieldVal = fieldVal + roles[i] + ", "
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
  .addField("\u200b", "Batch, C, Go")
  .addField("\u200b", "Java, Python, VB")
  .addField("\u200b", "WebDev, Challenge, Windows")
  .addField("\u200b", "Linux, Apple, Android")
  channel.send(OptionsEmbed).then(sent => {
    sent.delete(60000).catch(e => console.log(e)); //Send the embed then delete it after 60 seconds.
  });
}

function roleCheck(role){
  const validRoles = ["batch", "c", "go", "java", "python", "vb", "webdev", "challenge", "windows", "linux", "apple", "android"]
  if (validRoles.includes(role)){
    return true;
  } else return false;
}

function executeRoleChange(channel, message, role){
  var userRole
  let member = message.guild.members.get(message.author.id)
  let roles = member.roles.map(r => `${r.name}`) //creates an array of roles the user is a member of
  switch(role){ 
    case 'batch': userRole = 'Batch';break;
    case 'c': userRole = 'C Language';break;
    case 'go': userRole = 'Go';break;
    case 'java': userRole = 'Java';break;
    case 'python': userRole = 'Python';break;
    case 'vb': userRole = 'VB';break;
    case 'webdev': userRole = 'WebDev';break;
    case 'challenge': userRole = 'Challenge';break;
    case 'windows': userRole = 'Windows';break;
    case 'linux': userRole = 'Linux';break;
    case 'apple': userRole = 'Apple';break;
    case 'android': userRole = 'Android';break;
  }
  var newRole = message.guild.roles.find(role => role.name === userRole)
  if (roles.includes(userRole)){
    member.removeRole(newRole);
    //remove role from user
    channel.send("User removed from role: **" + userRole +"**").then(sent => {
      sent.delete(5000).catch(e => console.log(e));
    });
  } else {
    member.addRole(newRole)
    //add role to user
    channel.send("User added to role: **" + userRole+"**").then(sent => {
      sent.delete(5000).catch(e => console.log(e));
    });
  }
}