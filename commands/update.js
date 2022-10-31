const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const fs = require("fs");
const fetch = require("node-fetch");
const humanizeDuration = require("humanize-duration");
const cache = require('../utility/cache.js');
var msg = []
var downloadInfo = []


module.exports = {
    name: 'update',
    category: 'Tools',
    description: 'Updates the data I use',
    slash: "both",
    testOnly: false,


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {
        var allowed = ['222781123875307521', '216368047110225920', '521823544724684851']
        if (!allowed.includes(interaction.user.id)) return interaction.reply("You are not allowed to use this command.")
        msg = []
        downloadInfo = []
        var updateStatus = await cache.get("pelops_update_status");
        if (updateStatus != "finished") {
            const embed = new EmbedBuilder()
                .setColor('#ffb33c')
                .setTitle('Already Updating...')
                .setDescription('Please wait until the current update is finished.')
                .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646260264/gbl/pelops/pelops_wait.png')

            reply = await interaction.reply({
                embeds: [embed],
            });
            return
        }



        cache.flush()
        cache.set("pelops_update_status", "running", 25);
        cache.set("pelops_update_start", Date.now(), 60);
        const embed = new EmbedBuilder()
            .setColor('#ffb33c')
            .setTitle(`Updating ${dataList.length} files...`)
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

        reply = await interaction.reply({
            embeds: [embed],
        });
        var ready = true;
        finished = false;
        i = 0;


        const finishedEmbed = new EmbedBuilder();
        finishedEmbed.setColor('#ffb33c')

        updateStart = performance.now();

        while (dataList.length > i && ready == true && finished == false) {
            var saveStart = performance.now();
            ready = false;
            var name = dataList[0].name;
            var url = dataList[0].url;
            saveStatus = await serverDownloader(name, url)
            var saveEnd = performance.now();


            if (saveStatus == 'Success') {
            downloadInfo.push(`Updated \`${name}\` (${humanizeDuration(saveEnd - saveStart, { maxDecimalPoints: 2 })})`)
            } else {
                downloadInfo.push(`Failed to update \`${name}\` (${humanizeDuration(saveEnd - saveStart, { maxDecimalPoints: 2 })})`)
            }

            finishedEmbed.setTitle(`Updating ${dataList.length} files...`)
            finishedEmbed.setDescription(`${msg.join("\n")}\n\n${downloadInfo.join("\n")}`)
            finishedEmbed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

            await interaction.editReply({
                embeds: [finishedEmbed],

            });



            if (i + 1 == dataList.length) {
                ready = false;
                finished = true;
                console.log("Finished");
                await cache.set("pelops_update_status", "finished", 0);


            } else {
                dataList.push(dataList.shift());
                i++
                ready = true;

            }

        } 
        var updateEnd = performance.now();

        msg.unshift(`**__${downloadInfo.length}__** files updated.`)

        finishedEmbed.setTitle('Finished Update!')
        finishedEmbed.setDescription(`${msg.join("\n")}\n\n${downloadInfo.join("\n")}`)
        finishedEmbed.setImage('https://res.cloudinary.com/tristangregory/image/upload/v1648922161/gbl/pelops/pelops_idk.jpg')

        await interaction.editReply({
            embeds: [finishedEmbed],

        });
    }
}


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
        fs.writeFile(`./data/${name}.json`, JSON.stringify(data), function (err) {
            if (err) {
                console.log('Error writing file');
                cache.set(`${name}`, fs.readFileSync(`./data/${name}.json`, 'utf8'), 0);
                return msg.push(`\`${name}\` failed to download, keeping current version.\n\`${error}\``)
            }
            downloadFinish = performance.now();
            cache.set(name, JSON.stringify(data), 0);

            console.log(`Downloaded ${name} in ${downloadFinish - downloadStart}ms`);
            // downloadInfo.push(`\`${name}\` downloaded in ${downloadFinish - downloadStart}ms`)
            controller.abort();
        });
        return 'Success';
    } catch (error) {
        cache.set(`${name}`, fs.readFileSync(`./data/${name}.json`, 'utf8'), 0);
         msg.push(`\`${name}\` failed to download, keeping current version.\n\`\`\`${error}\`\`\``)
        return 'Failed';
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
},
{
    name: "seasonData",
    fullName: "Season List Data",
    url: "https://sheetsu.com/apis/v1.0bu/b5f4fd1de48b",
},
{
    name: "leaderData",
    fullName: "Unit Leader Data",
    url: "https://sheetsu.com/apis/v1.0su/9c52e24e16f7",
},
{
    name: "starRankRewards",
    fullName: "Star Rank Rewards",
    url: "https://sheetsu.com/apis/v1.0bu/6069e15a0d0e",
}
];


// starRankRewards













