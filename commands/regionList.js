module.exports = {
	name: 'regionList',
        description: 'Affiche la liste des régions disponibles (+build2d)',
        uses: '+regionList',
	execute(msg, args, Discord) {
        var reg = "- Demacia\n- Freljord\n- Piltover\n- ShadowsIsles\n- Zaun"
        const exampleEmbed = new Discord.RichEmbed()
        .setColor('#0099ff')
        .setTitle('Régions disponibles : ')
        .setDescription(reg);
        msg.channel.send(exampleEmbed);
	},
};