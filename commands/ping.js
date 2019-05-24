module.exports = {
	name: 'ping',
	description: 'Ping!',
	uses: '+ping',
	execute(msg, args) {
		msg.react('👍');
	}
};