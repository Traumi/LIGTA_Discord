module.exports = {
	name: 'pileface',
    description: 'Pile ou face?',
    uses: '+pileface',
	execute(msg, args, Discord) {
        let res = Math.floor(Math.random() * Math.floor(2));
        switch(res){
            case 0 : 
                msg.reply("Pile");
                break;
            case 1 :
                msg.reply("Face");
                break;
            default:
                msg.reply("JE SUIS TOUT CASSÉ :(");
                break;
        }
        
	}
};