const nodeHtmlToImage = require('node-html-to-image')
const { Cluster } = require('puppeteer-cluster');






(async () => {
  const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_CONTEXT,
      maxConcurrency: 10,
      puppeteerOptions: {
        headless: true,
        concurrency: Cluster.CONCURRENCY_PAGE,
        args: ['--no-sandbox', '--autoplay-policy=user-gesture-required', '--disable-background-networking', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-update', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-domain-reliability', '--disable-extensions', '--disable-features=AudioServiceOutOfProcess', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-notifications', '--disable-offer-store-unmasked-wallet-cards', '--disable-popup-blocking', '--disable-print-preview', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-setuid-sandbox', '--disable-speech-api', '--disable-sync', '--hide-scrollbars', '--ignore-gpu-blacklist', '--metrics-recording-only', '--mute-audio', '--no-default-browser-check', '--no-first-run', '--no-pings', '--no-sandbox', '--no-zygote', '--password-store=basic', '--use-gl=swiftshader', '--use-mock-keychain', '--disable-gpu', '--disable-accelerated-2d-canvas']
      },
  });



  await cluster.task(async ({ page, data: data }) => {
     
      await page.setContent(data.html);
      const content = await page.$(`${data.selector}`);
      const imageBuffer = await content.screenshot({ omitBackground: true });
      return imageBuffer;
  });

  // setup server
  exports.cluster = async function (html, selector) {
    data = {
      html: html,
      selector: selector
    }
    const image = await cluster.execute(data);
    return image;
  }


})();









exports.makeTest = async function (HTML, selector) {
  if(!selector) selector = 'body'
  const image = await nodeHtmlToImage({
    html: HTML,
    puppeteerArgs: {
      args: ['--no-sandbox', '--autoplay-policy=user-gesture-required', '--disable-background-networking', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-update', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-domain-reliability', '--disable-extensions', '--disable-features=AudioServiceOutOfProcess', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-notifications', '--disable-offer-store-unmasked-wallet-cards', '--disable-popup-blocking', '--disable-print-preview', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-setuid-sandbox', '--disable-speech-api', '--disable-sync', '--hide-scrollbars', '--ignore-gpu-blacklist', '--metrics-recording-only', '--mute-audio', '--no-default-browser-check', '--no-first-run', '--no-pings', '--no-sandbox', '--no-zygote', '--password-store=basic', '--use-gl=swiftshader', '--use-mock-keychain', '--disable-gpu', '--disable-accelerated-2d-canvas']
    },
    selector: selector,
    transparent: true,
  });


 return image;

}

exports.make = async function (compareData) {

    // console.log(compareData);

    unitOneData = compareData[0];
    unitTwoData = compareData[1];

    // console.log(unitOneData);
    // unitEmbed.setThumbnail(`https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/${unitOneData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.webp`)

    var HTML = `
    <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@100;300;500;700;800&display=swap" rel="stylesheet">
    <style>.credit-img{position:absolute;height:75px;display:block;bottom:5px;right:5px;filter:drop-shadow(0 2px 2px rgba(102,248,243,1))}body{background:transparent;}*{font-family:"Poppins",sans-serif}.unit-compare-card{padding-top: 10px;padding-bottom: 10px;position:relative;background:#ffb94c;color:#462b00;width:700px;height:auto;border-radius:25px;display:flex}.unit-card{width:100%;text-align:center}.unit-card-header{padding:10px;width:100%;height:auto;display:flex}.unit-data{width:50%}.unit-img-cont{max-width:300px;max-height:200px;margin:auto;display:flex;justify-content:center;align-items:center}.unit-img-cont img{max-width:300px;max-height:200px;filter:drop-shadow(0 2px 3px rgba(0,0,0,.2))}.unitName{font-size:34px;letter-spacing:.25px;margin:4px;color:#462b00}.unitRarity{display:none}.unitLevel{font-size:20px;font-weight:500;letter-spacing:.15px}.unit-stat-card{display:flex;flex-wrap:wrap}.stat-card-section{display:flex;flex-wrap:wrap;width:100%}.stat-card-section:nth-child(odd){background:rgba(70,43,0,.12)}.full{width:100%}.half{width:50%}.stat-title{font-size:20px;font-weight:700;letter-spacing:.15px;color:#643f00;text-transform:uppercase;margin-top:8px}.stat-total{font-size:34px;font-weight:400;letter-spacing:.25px;color:#003735;margin-top:8px;margin-bottom:8px}</style>
    <div class="unit-compare-card">
    <img class="credit-img" src="https://res.cloudinary.com/tristangregory/image/upload/v1644991351/gbl/pelops/Pelops_II.webp">

  <div class="unit-card">

    <div class="unit-card-header">

      <div class="unit-data">
        <div class="unit-img-cont">
          <img id="unitOneName" src="https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/${unitOneData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.webp">
        </div>
        <p class="unitName" id="unitOneName">${unitOneData.Name}</p>
        <p class="unitRarity" id="unitOneRarity"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></p>
        <p class="unitLevel" id="unitOneLevel">Level ${unitOneData.Level}</p>
      </div>

      <div class="unit-data">
        <div class="unit-img-cont">
          <img id="unitOneName" src="https://res.cloudinary.com/tristangregory/image/upload/v1654043653/gbl/${unitTwoData.Name.replaceAll(" ", "_").replaceAll("-", "_").replaceAll("(", "").replaceAll(")", "")}.webp">
        </div>
        <p class="unitName" id="unitOneName">${unitTwoData.Name}</p>
        <p class="unitRarity" id="unitOneRarity"><i class="fa-solid fa-star"></i></p>
        <p class="unitLevel" id="unitOneLevel">Level ${unitTwoData.Level}</p>
      </div>

    </div>

    <div class="unit-stat-card">
      
      <div class="stat-card-section">
      <p class="stat-title full">Cost </p>
      <p class="stat-total half" >${unitOneData.Cost}</p>
      <p class="stat-total half" >${unitTwoData.Cost}</p>
        </div>
      
      <div class="stat-card-section">
      <p class="stat-title full">HP</p>
      <p class="stat-total half">${unitOneData.HP.toLocaleString()}</p>
       <p class="stat-total half">${unitTwoData.HP.toLocaleString()}</p>
      </div>
      
        <div class="stat-card-section">
      <p class="stat-title full">Attack</p>
      <p class="stat-total half">${parseInt(unitOneData.ATK * unitOneData.HitsPerAttack).toLocaleString()}</p>
       <p class="stat-total half">${parseInt(unitTwoData.ATK * unitTwoData.HitsPerAttack).toLocaleString()}</p>
      </div>
      
          <div class="stat-card-section">
      <p class="stat-title full">DPS</p>
      <p class="stat-total half">${unitOneData.DPS.toLocaleString()}</p>
      <p class="stat-total half">${unitTwoData.DPS.toLocaleString()}</p>
      </div>
      
    </div>



  </div>

</div>
    `

    // return console.log(unitOneData)

    const image = await nodeHtmlToImage({
        html: HTML,
        puppeteerArgs: {
          args: ['--no-sandbox', '--autoplay-policy=user-gesture-required', '--disable-background-networking', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-update', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-domain-reliability', '--disable-extensions', '--disable-features=AudioServiceOutOfProcess', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-notifications', '--disable-offer-store-unmasked-wallet-cards', '--disable-popup-blocking', '--disable-print-preview', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-setuid-sandbox', '--disable-speech-api', '--disable-sync', '--hide-scrollbars', '--ignore-gpu-blacklist', '--metrics-recording-only', '--mute-audio', '--no-default-browser-check', '--no-first-run', '--no-pings', '--no-sandbox', '--no-zygote', '--password-store=basic', '--use-gl=swiftshader', '--use-mock-keychain', '--disable-gpu', '--disable-accelerated-2d-canvas']
        },
        transparent: true,
      });









     return image;
   }


