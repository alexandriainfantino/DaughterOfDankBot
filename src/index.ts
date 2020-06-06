import * as dotenv from "dotenv"
import * as Discord from "discord.js"
const imgur = require('imgur');
imgur.setClientId(process.env.CLIENT_ID);
imgur.setAPIUrl(process.env.API_URL);

dotenv.config();
const client = new Discord.Client();

client.on('message', async (message: any) => {
    const channel = client.channels.cache.get(process.env.DISCORD_ID as string) as Discord.TextChannel;
    const commandString = message.content;
    const commandArray = commandString.split(" ");
    const command = commandArray[0];

    switch(command) {
        case 'Image':
            let query = commandArray.slice(1).join(" ");
            let optionalParams = {sort: 'top'};
            imgur.search(query, optionalParams)
                .then(function(json) {
                    if (json.data.length === 0) {
                        channel.send("no image found :(");
                    } else {
                        const image = json.data[0].link;
                        const embed = new Discord.MessageEmbed().setImage(image);
                        channel.send({embed});
                    }
                })
                .catch(function (err) {
                    console.error(err);
                });
        }
});

client.login(process.env.DISCORD_TOKEN);
