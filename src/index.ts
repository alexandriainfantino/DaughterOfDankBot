import * as dotenv from "dotenv"
import * as Discord from "discord.js"
const imgur = require('imgur');
imgur.setClientId(process.env.CLIENT_ID);
imgur.setAPIUrl(process.env.API_URL);

dotenv.config();
const client = new Discord.Client();

client.on('message', async (message: any) => {
    const commandString = message.content;
    const commandArray = commandString.split(" ");
    const command = commandArray[0];

    switch(command.toLowerCase()) {
        case "-dank":
            const channelId = message.channel.id;
            const channel = client.channels.cache.get(channelId as string) as Discord.TextChannel;
            const query = commandArray.slice(1).join(" ");
            const optionalParams = {sort: 'top'};
            imgur.search(query, optionalParams)
                .then(function(json) {
                    if (json.data.length === 0) {
                        channel.send("no image found :(");
                    } else {
                        try {
                            const arrayLength = json.data.length;
                            let index = 0;
                            if (arrayLength > 1) {
                                index = Math.floor(Math.random() * Math.floor(arrayLength));
                            }
                            let image = json.data[index];
                            if (image.is_album) {
                                const albumLength = image.images.length;
                                const albumIndex = Math.floor(Math.random() * Math.floor(albumLength));
                                console.log('album index is ' + albumIndex);
                                image = image.images[albumIndex].link;
                            } else {
                                image = image.link;
                            }
                            const embed = new Discord.MessageEmbed().setImage(image).setURL(image);
                            console.log('index is ' + index);
                            console.log('image URL' + image);
                            channel.send({embed});
                        } catch (e) {
                            channel.send("I crashed, blame dad.");
                        }
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
});

client.login(process.env.DISCORD_TOKEN);
