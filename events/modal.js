const imgGen = require('../utility/HTML2IMG')
const cache = require('../utility/cache.js');
const db = require('../utility/database.js');
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  Modal,
  TextInputBuilder
} = require('discord.js');
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isModalSubmit()) return;

    var data = interaction.customId.split(' ');
    var type = data[0];
    var interactionID = data[1];
    var originalUser = data[2];


    var hasErrors = false;



    if (type === 'newsModal') {
      // newsTitle, imageURL, newsQuote, newsArticle
      const newsTitle = interaction.fields.getTextInputValue('newsTitle') || ""
      const imageURL = interaction.fields.getTextInputValue('imageURL') || "https://s3-alpha.figma.com/hub/file/948140848/1f4d8ea7-e9d9-48b7-b70c-819482fb10fb-cover.png"
      const newsQuote = interaction.fields.getTextInputValue('newsQuote') || ""
      const newsArticle = interaction.fields.getTextInputValue('newsArticle').trim() || ""
      // const reportTypeText = interaction.fields.getTextInputValue('reportTypeText').trim() || `Emergency Report`

      const HTML = `
              <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville&family=Montserrat:wght@300;400;600;700;800&display=swap" rel="stylesheet">
              <style>
*{box-sizing:border-box;font-family:"Montserrat",sans-serif}body{background:transparent}.cont{display:inline-block;padding:10px}.news-container{height:auto;position:relative;display:inline-block}.newspaper{height:auto;width:550px;padding:10px;display:flex;position:relative;z-index:2;box-shadow:0 1px 0 rgba(0,0,0,.15);background:#e2e2e0;border-bottom-left-radius:2px 4px;border-bottom-right-radius:3px 2px;border-top-left-radius:1px 15px;border-top-right-radius:15px 2px}.paper-look{background:transparent url(https://res.cloudinary.com/tristangregory/image/upload/v1657482630/noisy-texture-100x100-o5-d10-c-f34379-t1.png) repeat fixed center;position:absolute;inset:0;opacity:72%}.fake{position:absolute;z-index:1;transform:rotate(1deg);height:100%;box-shadow:0 0 0 rgba(0,0,0,0);filter:brightness(80%)}.newspaper-inner{width:100%;border:1.5px solid #afb0aa;padding:10px}.header{display:flex;margin-bottom:5px}.left-side{width:66%;display:flex;flex-wrap:wrap;text-align:center}.right-side{width:33%;margin-left:auto}.news-title{font-size:40px;width:100%;color:#333230;font-weight:600;letter-spacing:.25px;font-family:"Libre Baskerville",serif}.news-title:first-letter{color:#ffb94c}.tag-line{width:100%;font-size:13px;background:#ffb94c;color:#462b00;padding:2px;font-weight:500;letter-spacing:1.25px}.emergency{background:#dc3018;font-weight:600;color:#fff2e9;height:100%;display:flex;text-align:center;padding:5px;font-size:22px}.emergency-inner{width:100%;border:2px solid #fff2e9;display:flex;justify-content:center;align-items:center}.title{background:#094fb4;color:#f1f9fe;text-align:center;padding:10px;margin-bottom:5px;font-size:35px;font-weight:600}.border{width:100%;background:#094fb4;height:3px;margin-bottom:10px}.news-image{width:100%;height: 100%;max-height:325px;margin-bottom:5px}.title-details{background:#a5c2d4;width:100%;padding:10px;color:#333331;margin-bottom:10px;font-size:25px;text-align:center;font-weight:700;letter-spacing:.25px}.article{color:#333331;width:100%;font-size:23px;font-weight:600;letter-spacing:.15px;white-space:break-spaces;overflow-wrap:break-word}.credit-img{position:absolute;height:35px;display:block;bottom:10px;right:10px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1));display:none}.issue-number{position:absolute;display:block;bottom:0;right:0}.credit-bar{border-top:1.5px solid #afb0aa;padding-top:10px;margin-top:5px;position:relative;font-weight:600;font-size:11px}
              </style>
              <div class="cont">

              <div class="news-container">
          <div class="newspaper fake">
        <div class="newspaper-inner">
          </div>
            </div>
        <div class="newspaper">
        <div class="paper-look"></div>

        <div class="newspaper-inner">
          <div class="header">
            <div class="left-side">
              <span class="news-title">NEWS</span>
              <div class="tag-line">Pelops News</div>
              </div>
            
            <div class="right-side">
              <div class="emergency">
                <div class="emergency-inner">
                  Emergency
                  Report
                  </div>
                </div>
              </div>
            
          </div>
          
          <div class="title">${newsTitle}</div>
          <div class="border"></div>

          <img src="${imageURL}" class="news-image">

          <div class="title-details">
${newsQuote}
            </div>
          
          <div class="article">${newsArticle}</div>
           <div class="credit-bar">
      Created by ${interaction.user.username}
       <span class="issue-number">Issue #${await db.get('news.uses')}</span>
      </div>
          
          </img>
        
        <img class="credit-img" src="https://res.cloudinary.com/tristangregory/image/upload/v1653341451/gbl/pelops/Pelops_II.webp">
        </div>
        
        </div>
        </div>
              `

              const details = {
                originalUser: originalUser,

                title: newsTitle,
                image: imageURL,
                quote: newsQuote,
                article: newsArticle,
                HTML: HTML
              }
              db.set(`news.${interactionID}`, details, 9999)


              const embed = new EmbedBuilder()
              embed.setTitle("News Preview")


              if(await isImageURL(imageURL)) {
                imgAlertMsg = ''
                embed.setImage(imageURL)
              } else {
                hasErrors = true
                imgAlertMsg = '<:pelops_alert:983097178513895544>Please enter a valid image URL<:pelops_alert:983097178513895544>'
              }



      embed.setDescription(`\`\`\`This is a preview, please click the Generate Image button to create your news article\`\`\`
**Title:** 
${newsTitle}
**Image:** 
${imageURL} ${imgAlertMsg}
**Quote:** 
${newsQuote}
**Article:** 
${newsArticle}
      
      `)
      

      
    

      btns = new ActionRowBuilder();
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`editNewsModal ${interactionID}`)
          .setLabel(`Edit News Details`)
          .setStyle('Primary')
      )
      btns.addComponents(
        new ButtonBuilder()
          .setCustomId(`generateNews ${interactionID}`)
          .setLabel(`Generate Image`)
          .setStyle('Success')
          .setDisabled(hasErrors)
      )



      await interaction.update({
        embeds: [embed],
        components: [btns],

      })

    }




  }


}



function isImageURL(url) {
  return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}