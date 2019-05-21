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
const config = require('./config.json');
const {convertFile}  = require('convert-svg-to-png');

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


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`)
	//client.user.setActivity('YouTube', { type: 'WATCHING' 'LISTENING' });
	client.user.setActivity('Compter les moutons');
})
client.on('message', msg => {
  const args = msg.content.split(' '); //.slice(prefix.length).split
  const command = args.shift().toLowerCase(); 
  if (command === '+ping') {
    msg.reply('Pong!')
  }
  if (command === '+help') {
	var text = '\n';
	text += '+profil <pseudo> : Affiche le profil du joueur\n\n';
	text += '+update <pseudo> : Permet de mettre à jour le profil du joueur avant de l\'afficher\n\n';
	text += '+build <skinNumber> <pseudo> : Met à jour le profil du joueur avec le skin souhaité\n\n';
	text += '+build2d <skinNumber> <region> <pseudo> : Met à jour le profil du joueur avec le skin et la région souhaités\n\n';
	text += '+skinList <englishChampionName> : Affiche la correspondance skin/numero\n\n';
	text += '+regionList : Affiche les régions disponibles\n\n';
	  
    const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Aide : \n\nCommandes disponibles :')
	.setDescription(text)
	msg.channel.send(exampleEmbed);
  }
  if (command === '+update') {
    var filename = args.join(' ');
    const inputFilePath = 'C:/xampp/htdocs/ligta/images/svgrecap/euw1/'+filename+'.svg';
    var pseudo = args.join('');
    axios.get('http://localhost/ligta/updateSVG.php?id='+pseudo+'&skin=0')
    .then(function (response) {
		if(response.data == "error"){
			msg.channel.send("Désolé, je ne trouve pas ce joueur...");
		}else{
			(async() => {
				if (fs.existsSync(inputFilePath)) {
					const outputFilePath = await convertFile(inputFilePath);
					const attachment = new Discord.Attachment(outputFilePath);
					msg.channel.send(attachment);
				}else{
					msg.channel.send("Désolé, je ne trouve pas ce joueur...");
				}
			})();
		}
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  if (command === '+build') {
	const skin = args.shift(); 
    var filename = args.join(' ');
    const inputFilePath = 'C:/xampp/htdocs/ligta/images/svgrecap/euw1/'+filename+'.svg';
    var pseudo = args.join('');
    axios.get('http://localhost/ligta/updateSVG.php?id='+pseudo+'&skin='+skin)
    .then(function (response) {
		if(response.data == "error"){
			msg.channel.send("Désolé, je ne trouve pas ce joueur...");
		}else{
			(async() => {
				if (fs.existsSync(inputFilePath)) {
					const outputFilePath = await convertFile(inputFilePath);
					const attachment = new Discord.Attachment(outputFilePath);
					msg.channel.send(attachment);
				}else{
					msg.channel.send("Désolé, je ne trouve pas ce joueur...");
				}
			})();
		}
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  if (command === '+build2d') {
	const skin = args.shift();
	var clan = args.shift();
	switch(clan.toLowerCase()){
		case "demacia" :
			clan = "Demacia";
			break;
		case "freljord":
			clan = "Freljord";
			break;
		case "piltover":
			clan = "Piltover";
			break;
		case "shadowisles":
			clan = "ShadowIsles";
			break;
		case "zaun":
			clan = "Zaun";
			break;
	}
    var filename = args.join(' ');
    const inputFilePath = 'C:/xampp/htdocs/ligta/images/svgrecap/euw1/'+filename+'.svg';
    var pseudo = args.join('');
    axios.get('http://localhost/ligta/updateSVG.php?id='+pseudo+'&skin='+skin+'&clan='+clan)
    .then(function (response) {
		if(response.data == "error"){
			msg.channel.send("Désolé, je ne trouve pas ce joueur...");
		}else{
			(async() => {
				if (fs.existsSync(inputFilePath)) {
					const outputFilePath = await convertFile(inputFilePath);
					const attachment = new Discord.Attachment(outputFilePath);
					msg.channel.send(attachment);
				}else{
					msg.channel.send("Désolé, je ne trouve pas ce joueur...");
				}
			})();
		}
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  if (command === '+skinlist') {
    var champion = args.join(' ');
	//console.log('http://localhost/ligta/skinList.php?champ='+champion);
    axios.get('http://localhost/ligta/skinList.php?champ='+champion)
    .then(function (response) {
		if(response.data == "error"){
			msg.channel.send("Désolé, je ne trouve pas ce champion...");
		}else{
			var skins = "";
			for(let i = 0 ; i < response.data.length ; ++i){
				skins += response.data[i].name+" : "+response.data[i].num+"\n";
			}
			const exampleEmbed = new Discord.RichEmbed()
			.setColor('#0099ff')
			.setTitle('Skins de '+champion+' : ')
			.setDescription(skins);
			msg.channel.send(exampleEmbed);
		}
		
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  if (command === '+regionlist') {
	var reg = "- Demacia\n- Freljord\n- Piltover\n- ShadowsIsles\n- Zaun"
    const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Régions disponibles : ')
	.setDescription(reg);
	msg.channel.send(exampleEmbed);
  }
  if (command === '+profil') {
    var filename = args.join(' ');
    const inputFilePath = 'C:/xampp/htdocs/ligta/images/svgrecap/euw1/'+filename+'.svg';
    if (fs.existsSync(inputFilePath)) {
      (async() => {
        const outputFilePath = await convertFile(inputFilePath);
        const attachment = new Discord.Attachment(outputFilePath);
        msg.channel.send(attachment);
      })();
    }else{
      var pseudo = args.join('');
      axios.get('http://localhost/ligta/updateSVG.php?id='+pseudo+'&skin=0')
      .then(function (response) {
		if(response.data == "error"){
			msg.channel.send("Désolé, je ne trouve pas ce joueur...");
		}else{
			(async() => {
				if (fs.existsSync(inputFilePath)) {
					const outputFilePath = await convertFile(inputFilePath);
					const attachment = new Discord.Attachment(outputFilePath);
					msg.channel.send(attachment);
				}else{
					msg.channel.send("Désolé, je ne trouve pas ce joueur...");
				}
			})();
		}
        
      })
      .catch(function (error) {
        console.log('http://localhost/ligta/updateSVG.php?id='+pseudo+'&skin=0');
      });
    }
    
    
    //msg.channel.send(`Command name: ${command}\nArguments: ${args}`);
    //msg.channel.send(`This server's name is: ${msg.guild.name}`);
    /*const exampleEmbed = new Discord.RichEmbed()
	.setColor('#0099ff')
	.setTitle('Some title')
	.setURL('https://discord.js.org/')
	.setAuthor('Some name', 'https://i.imgur.com/wSTFkRM.png', 'https://discord.js.org')
	.setDescription('Some description here')
	.setThumbnail('https://i.imgur.com/wSTFkRM.png')
	.addField('Regular field title', 'Some value here')
	.addBlankField()
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.addField('Inline field title', 'Some value here', true)
	.setImage(path)
	.setTimestamp()
	.setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');*/
    //e.set_image(url="https://discordapp.com/assets/e4923594e694a21542a489471ecffa50.svg")
    
	}
	if(command === "+debug"){
		msg.channel.send(msg);
		console.log(msg.member.guild.channels);
	}
	if (msg.content === '!join') {
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
	channel.send(`Welcome to the server, ${member}!`, attachment);
});
client.login(config.token)