module.exports = {
	name: 'spec',
    description: 'Affiche la partie en cours!',
    uses: '+spec <Text:pseudo>',
	execute(msg, args, Discord, axios, Canvas, socialBorder) {
        var pseudo = args.join('');
        msg.channel.send('Traitement de la demande en cours...')
        .then(loading => {
            axios.get('http://localhost/ligta/currentGame.php?pseudo='+pseudo)
            .then(function (response) {
                if(response.data == "error"){
                    msg.channel.send("Désolé, je ne trouve pas ce joueur...");
                    console.log('http://localhost/ligta/currentGame.php?pseudo='+encodeURI(pseudo));
                    loading.delete()
                }else if(response.data == "nomatch"){
                    msg.channel.send("Ce joueur n'est pas dans une partie...");
                    loading.delete()
                }else{
                    (async() => {
                        const canvas = Canvas.createCanvas(2000, 1200);
                        const ctx = canvas.getContext('2d');
                        const background = await Canvas.loadImage('./images/'+response.data.map+'.png');

                        let bg_height = background.height*canvas.width/background.height;
                        let bg_offset = (bg_height-500)/2
                        ctx.drawImage(background, 0, -bg_offset, canvas.width, bg_height);

                        ctx.strokeStyle = '#74037b';
                        ctx.strokeRect(0, 0, canvas.width, canvas.height);

                        ctx.fillStyle = "#0000008A";
                        ctx.fillRect(0, 0, canvas.width, canvas.height);

                        ctx.font = '70px Arial';
                        ctx.fillStyle = '#FFFFFF';
                        ctx.textAlign = "center";
                        ctx.fillText(response.data.gametype, canvas.width / 2, 80);

                        ctx.beginPath();
                        ctx.moveTo(1000, 150);
                        ctx.lineTo(1000, 600);
                        ctx.strokeStyle = "#FFFFFF";
                        ctx.lineWidth = 3;
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(1000, 719);
                        ctx.lineTo(1000, 1175);
                        ctx.lineWidth = 3;
                        ctx.stroke();

                        var vs = await Canvas.loadImage('./images/vs.png');
                        ctx.drawImage(vs, 943.5, 625, 113, 69);

                        ctx.beginPath();
                        ctx.moveTo(200, 175);
                        ctx.lineTo(940, 175);
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        ctx.beginPath();
                        ctx.moveTo(1060, 175);
                        ctx.lineTo(1800, 175);
                        ctx.lineWidth = 1.5;
                        ctx.stroke();

                        for(let i = 0 ; i < response.data.blue.length ; ++i){
                            ctx.beginPath();
                            ctx.moveTo(200, 375+(i*200));
                            ctx.lineTo(940, 375+(i*200));
                            ctx.lineWidth = 1.5;
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.arc(260, 250+(i*200), 35, 0, 2 * Math.PI);
                            ctx.fillStyle = "#000000";
                            ctx.fill();
                            ctx.font = 'bold 25px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.blue[i].level, 260, 250+(i*200));
                            var level = socialBorder(response.data.blue[i].level);
                            var border = await Canvas.loadImage('http://localhost/ligta/images/border/social/theme-'+level+'-social-border.png');
                            ctx.drawImage(border, 195, 185+(i*200), 130, 130);
                            ctx.font = 'small-caps 35px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "left";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.blue[i].pseudo, 335, 250+(i*200));
                            ctx.font = '25px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.blue[i].champ_name, 95, 332.5+(i*200));
                            ctx.font = '20px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.blue[i].champ_points+" pts", 95, 360+(i*200));
                            var div_name = "";
                            switch(response.data.blue[i]["division"]){
                                case "UNRANKED":
                                    div_name = "Non classé";
                                    break;
                                case "IRON":
                                    div_name = "Fer";
                                    break;
                                case "BRONZE":
                                    div_name = "Bronze";
                                    break;
                                case "SILVER":
                                    div_name = "Argent";
                                    break;
                                case "GOLD":
                                    div_name = "Or";
                                    break;
                                case "PLATINUM":
                                    div_name = "Platine";
                                    break;
                                case "DIAMOND":
                                    div_name = "Diamant";
                                    break;
                                case "MASTER":
                                    div_name = "Maître";
                                    break;
                                case "GRANDMASTER":
                                    div_name = "Grand Maître";
                                    break;
                                case "CHALLENGER":
                                    div_name = "Challenger";
                                    break;
                            }
                            ctx.font = '30px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(div_name+" "+response.data.blue[i]["palier"], 871.25, 340+(i*200));
                            var champ = await Canvas.loadImage('http://localhost/ligta/ddragon/img/champion/tiles/'+response.data.blue[i]["champion"]+'_0.jpg');
                            ctx.drawImage(champ, 35, 190+(i*200), 120, 120);
                            var mastery = await Canvas.loadImage('http://localhost/ligta/images/mastery/cm'+response.data.blue[i]["champ_mastery"]+'.png');
                            ctx.drawImage(mastery, 105, 260+(i*200), 70, 70);
                            var tier = "";
                            switch(response.data.blue[i]["palier"]){
                                case "IV":
                                    tier = 4;
                                    break;
                                case "III":
                                    tier = 3;
                                    break;
                                case "II":
                                    tier = 2;
                                    break;
                                case "I":
                                    tier = 1;
                                    break;
                            }
                            var mastery = await Canvas.loadImage('http://localhost/ligta/images/rank/Icons_All_Splits/normal_'+response.data.blue[i]["division"]+'_'+tier+'.png');
                            ctx.drawImage(mastery, 810, 190+(i*200), 112.5, 127.5);
                            
                        }
                        for(let i = 0 ; i < response.data.red.length ; ++i){
                            ctx.beginPath();
                            ctx.moveTo(1060, 375+(i*200));
                            ctx.lineTo(1800, 375+(i*200));
                            ctx.lineWidth = 1.5;
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.arc(1740, 250+(i*200), 35, 0, 2 * Math.PI);
                            ctx.fillStyle = "#000000";
                            ctx.fill();
                            ctx.font = 'bold 25px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.red[i].level, 1740, 250+(i*200));
                            var level = socialBorder(response.data.red[i].level);
                            var border = await Canvas.loadImage('http://localhost/ligta/images/border/social/theme-'+level+'-social-border.png');
                            ctx.drawImage(border, 1675, 185+(i*200), 130, 130);
                            ctx.font = 'small-caps 35px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "right";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.red[i].pseudo, 1665, 250+(i*200));
                            ctx.font = '25px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.red[i].champ_name, 1905, 332.5+(i*200));
                            ctx.font = '20px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(response.data.red[i].champ_points+" pts", 1905, 360+(i*200));
                            var div_name = "";
                            switch(response.data.red[i]["division"]){
                                case "UNRANKED":
                                    div_name = "Non classé";
                                    break;
                                case "IRON":
                                    div_name = "Fer";
                                    break;
                                case "BRONZE":
                                    div_name = "Bronze";
                                    break;
                                case "SILVER":
                                    div_name = "Argent";
                                    break;
                                case "GOLD":
                                    div_name = "Or";
                                    break;
                                case "PLATINUM":
                                    div_name = "Platine";
                                    break;
                                case "DIAMOND":
                                    div_name = "Diamant";
                                    break;
                                case "MASTER":
                                    div_name = "Maître";
                                    break;
                                case "GRANDMASTER":
                                    div_name = "Grand Maître";
                                    break;
                                case "CHALLENGER":
                                    div_name = "Challenger";
                                    break;
                            }
                            ctx.font = '30px Arial';
                            ctx.fillStyle = '#FFFFFF';
                            ctx.textAlign = "center";
                            ctx.textBaseline = "middle"; 
                            ctx.fillText(div_name+" "+response.data.red[i]["palier"], 1128.75, 340+(i*200));
                            var champ = await Canvas.loadImage('http://localhost/ligta/ddragon/img/champion/tiles/'+response.data.red[i]["champion"]+'_0.jpg');
                            ctx.drawImage(champ, 1845, 190+(i*200), 120, 120);
                            var mastery = await Canvas.loadImage('http://localhost/ligta/images/mastery/cm'+response.data.red[i]["champ_mastery"]+'.png');
                            ctx.drawImage(mastery, 1825, 260+(i*200), 70, 70);
                            var tier = "";
                            switch(response.data.red[i]["palier"]){
                                case "IV":
                                    tier = 4;
                                    break;
                                case "III":
                                    tier = 3;
                                    break;
                                case "II":
                                    tier = 2;
                                    break;
                                case "I":
                                    tier = 1;
                                    break;
                            }
                            var mastery = await Canvas.loadImage('http://localhost/ligta/images/rank/Icons_All_Splits/normal_'+response.data.red[i]["division"]+'_'+tier+'.png');
                            ctx.drawImage(mastery, 1077.5, 190+(i*200), 112.5, 127.5);
                        }

                        const attachment = new Discord.Attachment(canvas.toBuffer(), 'ingame.png');
                        msg.channel.send(attachment);
                        loading.delete(500);
                    })();
                }
            })
            .catch(function (error) {
                console.log(error);
                loading.delete()
            });
        });
	}
};