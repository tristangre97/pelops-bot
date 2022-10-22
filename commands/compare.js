const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder
} = require('discord.js');
const search = require('../utility/search.js');
const unitEmbedGen = require('../utility/getUnitData.js');
const imgGen = require('../utility/HTML2IMG.js');


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
    {
        name: 'unit_one_star_rank', // Must be lower case
        description: 'The star rank of the unit.',
        required: false,
        type: 10,
    },
    {
        name: 'unit_one_apply_boost', // Must be lower case
        description: 'Prevent unavailable units from appearing in the deck',
        required: false,
        type: 3,
        choices: [{ name: 'In Water', value: 'In Water' },
        { name: 'Battra', value: 'Battra' },
        { name: 'Jet Jaguar 73', value: 'Jet Jaguar 73' },
        { name: 'Spacegodzilla Crystals', value: 'Spacegodzilla Crystals' },
        { name: 'Below 33% HP', value: 'Below 33% HP' }]
    },
    {
        name: 'unit_two_star_rank', // Must be lower case
        description: 'The star rank of the unit.',
        required: false,
        type: 10,
    },
    {
        name: 'unit_two_apply_boost', // Must be lower case
        description: 'Prevent unavailable units from appearing in the deck',
        required: false,
        type: 3,
        choices: [{ name: 'In Water', value: 'In Water' },
        { name: 'Battra', value: 'Battra' },
        { name: 'Jet Jaguar 73', value: 'Jet Jaguar 73' },
        { name: 'Spacegodzilla Crystals', value: 'Spacegodzilla Crystals' },
        { name: 'Below 33% HP', value: 'Below 33% HP' }]
    }
    ],


    run: async ({
        message,
        interaction,
        channel,
        client,
        args,
        guild
    }) => {



        // var {unit_one_name, unit_one_level, unit_two_name, unit_two_level} = args;
        var unit_one_name = args['unit_one_name'];
        var unit_one_level = args['unit_one_level'];
        var unit_two_name = args['unit_two_name'];
        var unit_two_level = args['unit_two_level'];
        var unit_one_star_rank = args['unit_one_star_rank'] || 1;
        var unit_one_apply_boost = args['unit_one_apply_boost'] || 0;
        var unit_two_star_rank = args['unit_two_star_rank'] || 1;
        var unit_two_apply_boost = args['unit_two_apply_boost'] || 0;

        const embed = new EmbedBuilder()
            .setColor('#ffb33c')
            .setTitle('Generating Comparison...')
            .setDescription(`I am generating a comparison between **__${unit_one_name}__** and **__${unit_two_name}__**.`)
            .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

        await interaction.reply({
            embeds: [embed],
        });


        unitOneSearchResults = await search.unitSearch(unit_one_name);
        unitTwoSearchResults = await search.unitSearch(unit_two_name);

        if (unitOneSearchResults.length == 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_one_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/pelops/pelops_error.png')
            return interaction.reply({
                embeds: [embed],

            });

        }

        if (unitTwoSearchResults.length == 0) {
            const embed = new EmbedBuilder()
                .setColor('#ff6a56')
                .setTitle('Unit not found')
                .setDescription(`Unit \`${unit_two_name}\` not found`)
                .setFooter(`Check your spelling and try again.`)
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/pelops/pelops_error.png')
            return interaction.reply({
                embeds: [embed],

            });

        }




        unit1 = unitOneSearchResults[0].item;
        unit2 = unitTwoSearchResults[0].item;



        





        // console.log(`${unit_one_name} ${unit_one_level} ${unit_two_name} ${unit_two_level}`)
        unitOneData = await unitEmbedGen.getUnitEmbed(unit1, unit_one_level, unit_one_star_rank, unit_one_apply_boost);
        // console.log(unitOneData)
        unitTwoData = await unitEmbedGen.getUnitEmbed(unit2, unit_two_level, unit_two_star_rank, unit_two_apply_boost);

        unitOneData = unitOneData.unitData;
        unitTwoData = unitTwoData.unitData;
        // console.log(unitOneData)
        var cardSections = [`<div class="separation-title half">Unit Stats</div>`]

        // cardSections.push(`<div class="stat-card-section">
        // <p class="stat-title">Cost</p>
        // <p class="stat-total half" >${unitOneData.Cost}</p>
        // <p class="stat-total half" >${unitTwoData.Cost}</p>
        //   </div>`)


        // if (unitOneData.Boosts.length > 0 || unitTwoData.Boosts.length > 0) {
        //     cardSections.push(`<div class="stat-card-section">
        //     <p class="stat-title">Applied Buffs</p>
        //     <p class="stat-total half" >${unitOneData.Boosts.join(`<br>`)}</p>
        //     <p class="stat-total half" >${unitTwoData.Boosts.join(`<br>`)}</p>
        //       </div>`)
        // }

        if (unitOneData.unitStats.HP > 0 || unitTwoData.unitStats.HP > 0) {
            cardSections.push(`<div class="stat-card-section">
            <p class="stat-title">Health</p>
            <p class="stat-total half" >${unitOneData.unitStats.HP.toLocaleString()}</p>
            <p class="stat-total half" >${unitTwoData.unitStats.HP.toLocaleString()}</p>
              </div>`)
        }

        if (unitOneData.unitStats.ATK > 0 || unitTwoData.unitStats.ATK > 0) {
            cardSections.push(`<div class="stat-card-section">
            <p class="stat-title">Attack</p>
            <p class="stat-total half" >${unitOneData.unitStats.ATK.toLocaleString()}</p>
            <p class="stat-total half" >${unitTwoData.unitStats.ATK.toLocaleString()}</p>

            <div class="mini-stat-card-section">
                <p class="stat-title">DPS</p>
                <p class="stat-total half" >${unitOneData.unitStats.DPS.toLocaleString()}</p>
                <p class="stat-total half" >${unitTwoData.unitStats.DPS.toLocaleString()}</p>
                    </div>
                </div>`)

        }


        if (unitOneData.leaderStats.HP > 0 || unitTwoData.leaderStats.HP > 0) {
            cardSections.push(`<div class="separation-title half">Leader Stats</div>`)
            cardSections.push(`<div class="stat-card-section">
            <p class="stat-title">Health</p>
            <p class="stat-total half" >${unitOneData.leaderStats.HP.toLocaleString()}</p>
            <p class="stat-total half" >${unitTwoData.leaderStats.HP.toLocaleString()}</p>
              </div>`)
        }

        if (unitOneData.leaderStats.ATK > 0 || unitTwoData.leaderStats.ATK > 0) {
            cardSections.push(`<div class="stat-card-section">
            <p class="stat-title">Attack</p>
            <p class="stat-total half" >${unitOneData.leaderStats.ATK.toLocaleString()}</p>
            <p class="stat-total half" >${unitTwoData.leaderStats.ATK.toLocaleString()}</p>

            <div class="mini-stat-card-section">
                <p class="stat-title">DPS</p>
                <p class="stat-total half" >${unitOneData.leaderStats.DPS.toLocaleString()}</p>
                <p class="stat-total half" >${unitTwoData.leaderStats.DPS.toLocaleString()}</p>
                    </div>

              </div>`)
        }





        var finalHTML = `
        <style>
*{font-family:"Poppins",sans-serif;box-sizing:border-box;z-index:100;text-shadow:0 1px 1px rgb(0 0 0 / 20%)}.unit-compare-card{background:linear-gradient(to bottom,rgba(255,162,76,113),rgba(255,185,76));color:#462b00;width:900px;height:auto;border-radius:25px;display:flex;position:relative;padding-top:25px;padding-bottom:15px;overflow:hidden;position:relative;z-index:10}.unit-card{width:100%;text-align:center}.unit-card-header{width:95%;margin:auto;height:auto;display:flex}.unit-data{width:50%}.unit-img-cont{max-width:300px;min-height:200px;margin:auto;display:flex;justify-content:center;align-items:center;position:relative}.unit-img-cont img{max-width:300px;max-height:150px;filter:drop-shadow(0 2px 3px rgba(76,146,255,.4))}.unitName{font-size:34px;letter-spacing:.25px;margin-top:0;margin-bottom:8px;color:#462b00}.unitRarity{display:none}.unitLevel{font-size:20px;font-weight:500;letter-spacing:.15px;margin-top:5px;margin-bottom:5px}.unit-stat-card{display:flex;flex-wrap:wrap;position:relative;padding:25px;row-gap:15px;column-gap:25px;justify-content:space-between}.stat-card-section{display:flex;flex-wrap:wrap;width:95%;margin:auto;background:rgba(255,185,76);border:2px solid rgb(255,162,113);border-radius:15px;position:relative;padding-top:15px;padding-bottom:15px;margin-bottom:0;box-shadow:0 2px 4px rgb(255,162,113)}.mini-stat-card-section{display:flex;flex-wrap:wrap;width:100%;margin:auto;position:relative;padding-top:15px;padding-bottom:0;margin-bottom:0}.full{width:100%}.half{width:50%}.stat-title{width:140px;font-size:18px;font-weight:700;letter-spacing:.15px;color:#fff;text-transform:uppercase;margin-top:8px;position:absolute;top:21px;left:50%;transform:translatex(-50%);background:rgb(255,162,113);border:0 solid rgb(76,146,255);border-radius:9px;padding:5px;padding-left:15px;padding-right:15px}.stat-total{font-size:34px;font-weight:600;letter-spacing:.15px;color:#003735;margin-top:8px;margin-bottom:8px}.credit-text{position:absolute;bottom:-10px;right:50%;transform:translatex(50%);display:none}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1));z-index:10000}.small-text{font-size:20px;font-weight:400;letter-spacing:.15px}.flex-wrap{display:flex;flex-wrap:wrap}.higher{color:rgb(0,226,167)}.lower{color:rgb(255,76,148)}.separation-title{font-size:34px;font-weight:600;letter-spacing:.15px;background:rgb(76,146,255);color:#fff;border:0 solid rgb(76,146,255);margin:auto;border-radius:15px;box-shadow:0 2px 4px rgb(255,162,113)}
        </style>
        <div class="unit-compare-card">
        <div class="thing"></div>
        <img class="credit-img" src="http://localhost:8008/gbl/pelops/Pelops_II.webp">

      <div class="unit-card">
    
        <div class="unit-card-header">
    
        <div class="unit-data flex-wrap full">
        <div class="unit-img-cont half">
          <img id="unitOneName" src="http://localhost:8008/gbl/${unitOneData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png">
        </div>
         <div class="unit-img-cont half">
          <img id="unitOneName" src="http://localhost:8008/gbl/${unitTwoData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.png">
        </div>
        
         <div class="unit-data flex-wrap full">
        <p class="unitName half">${unitOneData.Name}</p>
        <p class="unitName half">${unitTwoData.Name}</p>
        <p class="unitLevel half">Level ${unitOneData.Level}</p>
        <p class="unitLevel half">Level ${unitTwoData.Level}</p>
           </div>
      </div>
    
        </div>
    
        <div class="unit-stat-card">
          
          
          
${cardSections.join('')}

   
          
        </div>
    
    
    
      </div>
    
    </div>`







        allData = [unitOneData, unitTwoData]
        imgGenStart = performance.now()

        var img = await imgGen.cluster(finalHTML, '.unit-compare-card')

        imgGenEnd = performance.now()
        totalImgGenTime = imgGenEnd - imgGenStart
        // var img = await compareImg.make(allData)





        return interaction.editReply({
            content: `\`${totalImgGenTime.toFixed(2)}ms\``,
            embeds: [],
            files: [img],
        })

    }
}