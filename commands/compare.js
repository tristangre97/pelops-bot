const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
const search = require('../utility/search.js');
const unitEmbedGen = require('../utility/getUnitData.js');
const compareImg = require('../utility/generateCompareImg.js');


module.exports = {
    name: 'compare',
    category: 'Tools',
    description: "Compare two units",
    slash: "both",
    testOnly: false,
    expectedArgs: '<item> <amount>',
    options: [{
            name: 'unit_one_name', // Must be lower case
            description: 'The name of the unit.',
            required: true,
            type: 3,
            autocomplete: true,
        },
        {
            name: 'unit_one_level', // Must be lower case
            description: 'The level of the unit.',
            required: true,
            type: 10,
        },
        {
            name: 'unit_two_name', // Must be lower case
            description: 'The name of the unit.',
            required: true,
            type: 3,
            autocomplete: true,
        },
        {
            name: 'unit_two_level', // Must be lower case
            description: 'The level of the unit.',
            required: true,
            type: 10,
        },
    ],


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {

        var {
            unit_name,
            unit_level
        } = args;


        var [unit_one_name, unit_one_level, unit_two_name, unit_two_level] = args;
        startTime = performance.now();
        db.add(`stats.uses`)
        const embed = new MessageEmbed()
        .setColor('#ffb33c')
        .setTitle('Generating Comparison...')
        .setDescription(`I am generating a comparison between **__${unit_one_name}__** and **__${unit_two_name}__**.`)
        .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

    reply = await interaction.editReply({
        embeds: [embed],
    });


        unitOneSearchResults = await search.unitSearch(unit_one_name);
        unitTwoSearchResults = await search.unitSearch(unit_two_name);

        if (unitOneSearchResults.length == 0) {
            const embed = new MessageEmbed()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_one_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1651506970/gbl/pelops/pelops_error.png')
                return interaction.editReply({
                embeds: [embed],

            });
            
        }

        if (unitTwoSearchResults.length == 0) {
            const embed = new MessageEmbed()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_two_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1651506970/gbl/pelops/pelops_error.png')
                return interaction.editReply({
                embeds: [embed],

            });
            
        }




        unit1 = unitOneSearchResults[0].item;
        unit2 = unitTwoSearchResults[0].item;

        
        
        // db.add(`unit.${unit['Unit Name']}.uses`)

        unitOneRarity = Number(unit1.RARITY);
        unitTwoRaity = Number(unit2.RARITY);



        if (unitOneRarity == "4") {
            maxLevel = 30;
        } else {
            maxLevel = 40;
        }

        if (unitTwoRaity == "4") {
            maxLevel = 30;
        } else {
            maxLevel = 40;
        }



        if (unit_one_level < 1) unit_one_level = 1
        if (unit_one_level - 1 > maxLevel) {
            unit_one_level = maxLevel
        }

        if (unit_two_level < 1) unit_two_level = 1
        if (unit_two_level - 1 > maxLevel) {
            unit_two_level = maxLevel
        }



    


        unit1Data = await unitEmbedGen.getUnitEmbed(unit1, unit_one_level)
        unit2Data = await unitEmbedGen.getUnitEmbed(unit2, unit_two_level)

        unit1Data = unit1Data.unitData[unit1Data.unitData.length - 1];
        unit2Data = unit2Data.unitData[unit2Data.unitData.length - 1];

        // console.log(unit1Data)

        allData = [unit1Data, unit2Data]
        var img = await compareImg.make(allData)


        // return interaction.editReply('This command is still a work in progress.')
        // channel.send({ embeds: [embed], files: ['./image.png'] });
        return interaction.editReply({
            embeds: [],
            files: [img],
        })

    }
}