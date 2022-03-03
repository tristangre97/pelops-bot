const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const fs = require("fs");
const fetch = require("node-fetch");

const cache = require('../utility/cache.js');
const db = require('../utility/database.js');

module.exports = {
    category: 'Tools',
    description: 'Updates ', // Required for slash commands

    slash: true, // Create both a slash and legacy command
    testOnly: false, // Only register a slash command for the testing guilds
    ownerOnly: true,
    callback: async ({
        message,
        interaction,
        channel,
        client
    }) => {
        await interaction.deferReply();
        var updateStatus = await cache.get("pelops_update_status");
        console.log(updateStatus);
        if (updateStatus != "finished") {
            const embed = new MessageEmbed()
            .setColor('#ffb33c')
            .setTitle('Already Updating...')
            .setDescription('Please wait until the current update is finished.')
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646260264/gbl/pelops/pelops_wait.png')

        reply = await interaction.editReply({
            embeds: [embed],
        });
        return
        }


        cache.set("pelops_update_status", "running", 0);
        cache.flush()
        const embed = new MessageEmbed()
            .setColor('#ffb33c')
            .setTitle('Updating...')
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

        reply = await interaction.editReply({
            embeds: [embed],
        });
        var ready = true;
        finished = false;
        i = 1;


        while (dataList.length > 0 && ready == true && finished == false) {

            ready = false;
            var name = dataList[0].name;
            var url = dataList[0].url;
            await serverDownloader(name, url)

            if (i == dataList.length) {
                ready = false;
                finished = true;
                console.log("Finished");
                cache.set("pelops_update_status", "finished", 0);


            } else {
                i++
                ready = true;
                dataList.push(dataList.shift());
            }

        } //While loop end


        const finishedEmbed = new MessageEmbed()
            .setColor('#ffb33c')
            .setTitle('Finished!')
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259627/gbl/pelops/pelops_idk.jpg')

        await interaction.editReply({
            embeds: [finishedEmbed],

        });

    },
}






var dataList = [{
        name: "unitData",
        url: "https://sheetsu.com/apis/v1.0su/bfb7ac95068b",
    },
    {
        name: "mapLogsjson",
        url: "https://sheetsu.com/apis/v1.0su/9acebc3f7c89",
    }
];
//var t = require('./json/XboxOfficial.json')

async function serverDownloader(name, url) {
    try {
        var controller = new AbortController();
        var signal = controller.signal;
        downloadStart = performance.now();
        const response = await fetch(url, {
            signal
        });
        const data = await response.json();
        if (!response.status == 200) return;
        fs.writeFile(`/home/tristan/Downloads/pelops/data/${name}.json`, JSON.stringify(data), function (err) {
            if (err) return console.log(err);
            downloadFinish = performance.now();
            cache.set(name, JSON.stringify(data), 0);

            console.log(`Downloaded ${name} in ${downloadFinish - downloadStart}ms`);
            controller.abort();
        });
    } catch (error) {
        console.log(error);
    }
}