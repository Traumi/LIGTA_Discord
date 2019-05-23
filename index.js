//npm i xmlhttprequest
//npm i convert-svg-to-png
//npm i axios
//npm i -S canvas@next
const Discord = require('discord.js')
const https = require('https');
const axios = require('axios')
const fs = require('fs')
const Canvas = require('canvas');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const client = new Discord.Client()
client.commands = new Discord.Collection();
const config = require('./config.json');
const {convertFile}  = require('convert-svg-to-png');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const applyText = (canvas, text) => {
	const ctx = canvas.getContext('2d');

	// Declare a base size of the font
	let fontSize = 100;

	do {
		// Assign the font to the context and decrement it so it can be measured again
		ctx.font = `small-caps bold ${fontSize -= 10}px Arial`;
		// Compare pixel width of the text to the canvas minus the approximate avatar size
	} while (ctx.measureText(text).width > canvas.width - 600);

	// Return the result to use in the actual canvas
	return ctx.font;
};

socialBorder = function(level){
	if(level >= 500){
		return 21;
	}else if(level >= 475){
		return 20;
	}else if(level >= 450){
		return 19;
	}else if(level >= 425){
		return 18;
	}else if(level >= 400){
		return 17;
	}else if(level >= 375){
		return 16;
	}else if(level >= 350){
		return 15;
	}else if(level >= 325){
		return 14;
	}else if(level >= 300){
		return 13;
	}else if(level >= 275){
		return 12;
	}else if(level >= 250){
		return 11;
	}else if(level >= 225){
		return 10;
	}else if(level >= 200){
		return 9;
	}else if(level >= 175){
		return 8;
	}else if(level >= 150){
		return 7;
	}else if(level >= 125){
		return 6;
	}else if(level >= 100){
		return 5;
	}else if(level >= 75){
		return 4;
	}else if(level >= 50){
		return 3;
	}else if(level >= 30){
		return 2;
	}else{
		return 1;
	}
}


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	//client.user.setActivity('YouTube', { type: 'WATCHING' 'LISTENING' });
	client.user.setActivity('Compter les moutons');
	//client.user.setActivity('un chat avec un arc-en-ciel aux fesses', { url: 'https://www.twitch.tv/solaryfortnite' });
	//client.user.setActivity('un chat avec un arc-en-ciel aux fesses', {  type: 'LISTENING', url: 'https://youtu.be/QH2-TGUIwu4' });
})
client.on('message', msg => {

	if (!msg.content.startsWith(config.prefix) || msg.author.bot) return;

  const args = msg.content.slice(config.prefix.length).split(' ');
	const command = args.shift().toLowerCase(); 
	
  if (command === 'ping') {
		client.commands.get('ping').execute(msg, args);
  }
  if (command === 'help') {
		client.commands.get('help').execute(msg, args, Discord, client);
  }
  if (command === 'update') {
    client.commands.get('update').execute(msg, args, Discord, axios, fs, convertFile);
  }
  if (command === 'build') {
		client.commands.get('build').execute(msg, args, Discord, axios, fs, convertFile);
  }
  if (command === 'build2d') {
		client.commands.get('build2d').execute(msg, args, Discord, axios, fs, convertFile);
  }
  if (command === 'skinlist') {
    client.commands.get('skinList').execute(msg, args, Discord, axios);
  }
  if (command === 'regionlist') {
		client.commands.get('regionList').execute(msg, args, Discord);
  }
  if (command === 'profil') {
    client.commands.get('profil').execute(msg, args, Discord, axios, fs, convertFile);
	}
	if (command === 'pileface') {
    client.commands.get('pileface').execute(msg, args, Discord);
	}
	if (command === 'spec') {
    client.commands.get('spec').execute(msg, args, Discord, axios, Canvas, socialBorder);
	}
	if(command === "debug"){
		msg.channel.send(":)");
		console.log(client.commands);
	}
	if (command === 'join') {
		client.emit('guildMemberAdd', msg.member);
	}
});
client.on('guildMemberAdd', async member => {
	const channel = member.guild.channels.find(ch => ch.name === 'tests');
	if (!channel) return;

	// Set a new canvas to the dimensions of 700x250 pixels
	const canvas = Canvas.createCanvas(1500, 500);
	// ctx (context) will be used to modify a lot of the canvas
	const ctx = canvas.getContext('2d');
	// Since the image takes time to load, you should await it
	const background = await Canvas.loadImage('./images/wallpaper2.png');
	// This uses the canvas dimensions to stretch the image onto the entire canvas
	let bg_height = background.height*canvas.width/background.height;
	let bg_offset = (bg_height-500)/2
	ctx.drawImage(background, 0, -bg_offset, canvas.width, bg_height);

	ctx.strokeStyle = '#74037b';
	ctx.strokeRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = "#0000008A";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Slightly smaller text placed above the member's display name
	ctx.font = 'small-caps 45px Arial';
	ctx.fillStyle = '#FFFFFF';
	ctx.fillText('Bienvenue sur le serveur,', canvas.width / 2.6, canvas.height / 2.7);

	ctx.font = applyText(canvas, member.displayName);
	ctx.fillStyle = '#FFFFFF';
	//ctx.textAlign = "center";
	ctx.fillText(member.displayName, canvas.width / 2.6, canvas.height / 1.6);

	ctx.beginPath();
	ctx.arc(250, 250, 200, 0, Math.PI * 2, true);
	ctx.closePath();
	ctx.clip();
	const avatar = await Canvas.loadImage(member.user.displayAvatarURL);
	ctx.drawImage(avatar, 50, 50, 400, 400);

	const attachment = new Discord.Attachment(canvas.toBuffer(), 'welcome-image.png');
	channel.send(`On accueille ${member} parmis nous!`, attachment);
});
client.login(config.token)