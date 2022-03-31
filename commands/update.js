const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const fs = require("fs");
const fetch = require("node-fetch");
const humanizeDuration = require("humanize-duration");
const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
var msg = []
var downloadInfo = []
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
        msg = []
        downloadInfo = []
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
            .setDescription(`I am updating **__${dataList.length}__** files.`)
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

        reply = await interaction.editReply({
            embeds: [embed],
        });
        var ready = true;
        finished = false;
        i = 0;

        console.log(`Datalist - ${dataList.length}`)

        while (dataList.length > i && ready == true && finished == false) {
            var saveStart = performance.now();
            ready = false;
            var name = dataList[0].name;
            var url = dataList[0].url;
            await serverDownloader(name, url)
            var saveEnd = performance.now();;

            downloadInfo.push(`\`${name}\` took ${humanizeDuration(saveEnd - saveStart,  { maxDecimalPoints: 2 })}`)
            console.log(i)
            if (i + 1 == dataList.length) {
                ready = false;
                finished = true;
                console.log("Finished");
                cache.set("pelops_update_status", "finished", 0);


            } else {
                dataList.push(dataList.shift());
                i++
                ready = true;

            }

        } //While loop end

       
            msg.unshift(`**__${downloadInfo.length}__** files updated.`)
        

        const finishedEmbed = new MessageEmbed();
        finishedEmbed.setColor('#ffb33c')
        finishedEmbed.setTitle('Finished Update!')
        finishedEmbed.setDescription(`${msg.join("\n")}\n\n${downloadInfo.join("\n")}`)
        finishedEmbed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259627/gbl/pelops/pelops_idk.jpg')

        await interaction.editReply({
            embeds: [finishedEmbed],

        });

    }


}



async function serverDownloader(name, url) {
    try {
        var controller = new AbortController();
        var signal = controller.signal;
        // downloadStart = performance.now();
        const response = await fetch(url, {
            signal
        });
        const data = await response.json();
        if (!response.status == 200) return;
        fs.writeFile(`/home/tristan/Downloads/pelops/data/${name}.json`, JSON.stringify(data), function (err) {
            if (err) {
                console.log('Error writing file');
                cache.set(`${name}`, fs.readFileSync(`/home/tristan/Downloads/pelops/data/${name}.json`, 'utf8'), 0);
                return msg.push(`\`${name}\` failed to download, keeping current version.\n\`${error}\``)
            }
            // downloadFinish = performance.now();
            cache.set(name, JSON.stringify(data), 0);

            // console.log(`Downloaded ${name} in ${downloadFinish - downloadStart}ms`);
            // downloadInfo.push(`\`${name}\` downloaded in ${downloadFinish - downloadStart}ms`)
            controller.abort();
        });
    } catch (error) {
        cache.set(`${name}`, fs.readFileSync(`/home/tristan/Downloads/pelops/data/${name}.json`, 'utf8'), 0);
        return msg.push(`\`${name}\` failed to download, keeping current version.\n\`\`\`${error}\`\`\``)
        // console.log(error);
    }
}


var dataList = [{
        name: "unitData",
        fullName: "Unit Data",
        url: "https://sheetsu.com/apis/v1.0su/bfb7ac95068b",
    },
    {
        name: "mapLogs",
        fullName: "Map Logs",
        url: "https://sheetsu.com/apis/v1.0bu/9acebc3f7c89",
    }
];
