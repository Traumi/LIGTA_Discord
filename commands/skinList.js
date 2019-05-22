module.exports = {
	name: 'skinList',
    description: 'Affiche les skins/id du champion',
    uses: '+skinList <Text:champion[EN]>',
	execute(msg, args, Discord, axios) {
        var champion = args.join(' ');
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
	},
};