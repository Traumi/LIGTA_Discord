module.exports = {
	name: 'build2d',
    description: 'Crée et affiche le profil LoL avec les infos indiquées (Plus riche)!',
    uses: '+build2d <Number:skinId> <Text:region> <Text:pseudo>',
	execute(msg, args, Discord, axios, fs, convertFile) {
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
                        msg.react('👍');
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
};