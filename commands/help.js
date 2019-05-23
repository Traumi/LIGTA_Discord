module.exports = {
	name: 'help',
        description: 'Affiche l\'aide',
        uses: '+help',
	execute(msg, args, Discord, client) {
                var text = '';
                for (var [key, value] of client.commands) {
                        text += key+' : ['+value.uses+'] '+value.description+'\n\n';
                }
                
                const exampleEmbed = new Discord.RichEmbed()
                .setColor('#0099ff')
                .setTitle('Aide :')
                .addField('Commandes disponibles :', text)
                .addBlankField()
                .addField('Attention !', "Ce bot ne vous enverra jamais de MP, si jamais vous en recevez un merci de contacter au plus vite un admin")
                msg.channel.send(exampleEmbed);
	}
};