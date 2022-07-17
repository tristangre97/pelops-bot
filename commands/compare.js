const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
    MessageEmbed,
    MessageActionRow,
    MessageButton
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

        db.add(`stats.uses`)
        const embed = new MessageEmbed()
        .setColor('#ffb33c')
        .setTitle('Generating Comparison...')
        .setDescription(`I am generating a comparison between **__${unit_one_name}__** and **__${unit_two_name}__**.`)
        .setImage('https://res.cloudinary.com/tristangregory/image/upload/v1646259339/gbl/pelops/pelops_load.jpg')

    reply = await interaction.reply({
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
                .setThumbnail('https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/pelops/pelops_error.png')
                return interaction.reply({
                embeds: [embed],

            });
            
        }

        if (unitTwoSearchResults.length == 0) {
            const embed = new MessageEmbed()
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

        
        
        // db.add(`unit.${unit['Unit Name']}.uses`)

       

    

        // console.log(`${unit_one_name} ${unit_one_level} ${unit_two_name} ${unit_two_level}`)
        unitOneData = await unitEmbedGen.getUnitEmbed(unit1, unit_one_level, unit_one_star_rank, unit_one_apply_boost);
        // console.log(unitOneData)
        unitTwoData = await unitEmbedGen.getUnitEmbed(unit2, unit_two_level, unit_two_star_rank, unit_two_apply_boost);
       
        unitOneData = unitOneData.unitData;
        unitTwoData = unitTwoData.unitData;
        // console.log(unitOneData)
        var cardSections = []

        cardSections.push(`<div class="stat-card-section">
        <p class="stat-title full">Cost</p>
        <p class="stat-total half" >${unitOneData.Cost}</p>
        <p class="stat-total half" >${unitTwoData.Cost}</p>
          </div>`)


          if(unitOneData.Boosts.length > 0 || unitTwoData.Boosts.length > 0) {
            cardSections.push(`<div class="stat-card-section">
            <p class="stat-title full">Applied Buffs</p>
            <p class="stat-total half" >${unitOneData.Boosts.join(`<br>`)}</p>
            <p class="stat-total half" >${unitTwoData.Boosts.join(`<br>`)}</p>
              </div>`)
          }

          if(unitOneData.HP > 0 || unitTwoData.HP > 0) {
            cardSections.push(`<div class="stat-card-section">
            <p class="stat-title full">Health</p>
            <p class="stat-total half" >${unitOneData.HP}</p>
            <p class="stat-total half" >${unitTwoData.HP}</p>
              </div>`)
          }

          if(unitOneData.ATK > 0 || unitTwoData.ATK > 0) {

            cardSections.push(`
            <div class="stat-card-section">
            <p class="stat-title full">Attack</p>
            <p class="stat-total half" >${unitOneData.ATK}</p>
            <p class="stat-total half" >${unitTwoData.ATK}</p>
              </div>
              `)

            cardSections.push(`<div class="stat-card-section">
                <p class="stat-title full">DPS</p>
                <p class="stat-total half" >${unitOneData.DPS}</p>
                <p class="stat-total half" >${unitTwoData.DPS}</p>
                  </div>
`)

           
          }

        



        var finalHTML = `
        <link rel="preconnect" href="https://fonts.googleapis.com">
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;500;700;800&display=swap" rel="stylesheet">
        <style>
        *{font-family:"Poppins",sans-serif;box-sizing:border-box}.unit-compare-card{background:#ffb94c;color:#462b00;width:700px;height:auto;border-radius:25px;display:flex;position:relative;padding-top:15px;padding-bottom:15px}.unit-card{width:100%;text-align:center}.unit-card-header{width:100%;height:auto;display:flex}.unit-data{width:50%}.unit-img-cont{max-width:300px;max-height:180px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{padding-top:15px;max-width:300px;max-height:180px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2))}.unitName{font-size:34px;letter-spacing:.25px;margin-top:0px;margin-bottom:8px;color:#462b00}.unitRarity{display:none}.unitLevel{font-size:20px;font-weight:500;letter-spacing:.15px;margin-top:25px;margin-bottom:5px}.unit-stat-card{display:flex;flex-wrap:wrap}.stat-card-section{display:flex;flex-wrap:wrap;width:100%}.stat-card-section:nth-child(odd){background:rgba(70,43,0,.12)}.full{width:100%}.half{width:50%}.stat-title{font-size:20px;font-weight:700;letter-spacing:.15px;color:#643f00;text-transform:uppercase;margin-top:8px}.stat-total{font-size:34px;font-weight:400;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:25px}.credit-text{position:absolute;bottom:-10px;right:50%;transform:translatex(50%);display:none}.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1))}.small-text{font-size:20px;font-weight:400;letter-spacing:.15px}.flex-wrap{display:flex;flex-wrap:wrap}
        </style>
        <div class="unit-compare-card">
        <img class="credit-img" src="https://res.cloudinary.com/tristangregory/image/upload/v1644991351/gbl/pelops/Pelops_II.webp">
    
      <div class="unit-card">
    
        <div class="unit-card-header">
    
        <div class="unit-data flex-wrap full">
        <div class="unit-img-cont half">
          <img id="unitOneName" src="https://res.cloudinary.com/tristangregory/image/upload/e_trim/v1644991354/gbl/${unitOneData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}">
        </div>
         <div class="unit-img-cont half">
          <img id="unitOneName" src="https://res.cloudinary.com/tristangregory/image/upload/e_trim/v1644991354/gbl/${unitTwoData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}">
        </div>
        
         <div class="unit-data flex-wrap full">
         <p class="unitLevel half">Level ${unitOneData.Level}</p>
        <p class="unitLevel half">Level ${unitTwoData.Level}</p>
        <p class="unitName half">${unitOneData.Name}</p>
        <p class="unitName half">${unitTwoData.Name}</p>
        
           </div>
      </div>
    
        </div>
    
        <div class="unit-stat-card">
          
          
          
${cardSections.join('')}

   
          
        </div>
    
    
    
      </div>
    
    </div>`







        allData = [unitOneData, unitTwoData]

        if(cache.get(`compare_${unitOneData.Name}_${unitOneData.Level}_${unitTwoData.Name}_${unitTwoData.Level}_${unit_one_star_rank}_${unit_one_apply_boost}_${unit_two_star_rank}_${unit_two_apply_boost}`)) {
            var img = cache.get(`compare_${unitOneData.Name}_${unitOneData.Level}_${unitTwoData.Name}_${unitTwoData.Level}`)
        } else {
            
            var img = await imgGen.makeTest(finalHTML, '.unit-compare-card')
            cache.set(`compare_${unitOneData.Name}_${unitOneData.Level}_${unitTwoData.Name}_${unitTwoData.Level}_${unit_one_star_rank}_${unit_one_apply_boost}_${unit_two_star_rank}_${unit_two_apply_boost}`, img)
        }

        // var img = await compareImg.make(allData)





        return interaction.editReply({
            embeds: [],
            files: [img],
        })

    }
}