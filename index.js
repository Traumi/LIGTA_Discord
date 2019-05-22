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

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	//client.user.setActivity('YouTube', { type: 'WATCHING' 'LISTENING' });
	client.user.setActivity('Compter les moutons');
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
	if(command === "debug"){
		msg.channel.send(":)");
		console.log(client.commands);
	}
	if (msg.content === 'join') {
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