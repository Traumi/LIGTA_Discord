module.exports = {
	name: 'ping',
	description: 'Ping!',
	uses: '+ping',
	execute(msg, args) {
        //message.channel.send('Pong.');
        msg.reply('Pong!');
	},
};