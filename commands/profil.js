module.exports = {
	name: 'profil',
    description: 'Affiche le profil LoL',
    uses: '+profil <Text:pseudo>',
	execute(msg, args, Discord, axios, fs, convertFile) {
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
	}
};