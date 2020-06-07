import * as dotenv from "dotenv"
import * as Discord from "discord.js"
import BotUtilities from "./BotUtilities";
const imgur = require('imgur');
imgur.setClientId(process.env.CLIENT_ID);
imgur.setAPIUrl(process.env.API_URL);

const botUtilities = new BotUtilities();

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
                    if (query.toLowerCase().includes('correll')) {
                        const image = botUtilities.getCorrell();
                        const embed = new Discord.MessageEmbed().setImage(image).setURL(image);
                        console.log('image URL correll');
                        channel.send({embed});
                    }
                    else if (json.data.length === 0) {
                        channel.send("no image found :(");
                    } else {
                        try {
                            const image = botUtilities.findImage(json);
                            const file = new Discord.MessageAttachment(image);
                            console.log('image URL ' + image);
                            channel.send({ files: [file] });
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
