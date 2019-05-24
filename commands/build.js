module.exports = {
	name: 'build',
    description: 'Crée et affiche le profil LoL avec les infos indiquées!',
    uses: '+build <Number:skinId> <Text:pseudo>',
	execute(msg, args, Discord, axios, fs, convertFile) {
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
};