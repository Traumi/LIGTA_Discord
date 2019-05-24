module.exports = {
	name: 'about',
    description: 'Affiche les informations générales du bot',
    uses: '+about',
	execute(msg, args, Discord, pjson) {
        const exampleEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Bot informations')
        .addField('Nom : ', pjson.name, true)
        .addField('Auteur : ', pjson.author, true)
        .addField('Version : ', pjson.version, true)
        .addField('Description : ', pjson.description, true)
        msg.channel.send(exampleEmbed);
	}
};