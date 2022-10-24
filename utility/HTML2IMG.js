const nodeHtmlToImage = require('node-html-to-image')
// const NodeImageFromHtml = require("node-image-from-html");
const { Cluster } = require('puppeteer-cluster');
// const fetch = require('node-fetch');
const https = require('https');

// const engine = new NodeImageFromHtml.BrowserHandler({
//   concurrency: 5,
// });

// (async () => {

//   await engine.start();

//   exports.idk = async function (html, selector) {

//     start = performance.now()
//     const rendered = await engine.render(html, { selector: selector });
//     end = performance.now()
//     console.log(end - start)
//     return rendered;

//   }

// })();



(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 50,
    puppeteerOptions: {
      headless: true,
      userDataDir: './data/puppeteer/cache',
      args: ['--no-sandbox', '--autoplay-policy=user-gesture-required', '--disable-background-networking', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-update', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-domain-reliability', '--disable-extensions', '--disable-features=AudioServiceOutOfProcess', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-notifications', '--disable-offer-store-unmasked-wallet-cards', '--disable-popup-blocking', '--disable-print-preview', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-setuid-sandbox', '--disable-speech-api', '--disable-sync', '--hide-scrollbars', '--ignore-gpu-blacklist', '--metrics-recording-only', '--mute-audio', '--no-default-browser-check', '--no-first-run', '--no-pings', '--no-sandbox', '--no-zygote', '--password-store=basic', '--use-gl=swiftshader', '--use-mock-keychain', '--disable-gpu', '--disable-accelerated-2d-canvas']
    },
  });



  await cluster.task(async ({ page, data: data }) => {

    await page.setContent(data.html);
    const content = await page.$(`${data.selector}`);
    const imageBuffer = await content.screenshot({ 
      omitBackground: true,
      type: 'jpeg',
      quality: 100,
    });
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





exports.request = async function (html, selector) {
  if (!selector) selector = 'body'
  
  body = {
    html: html,
    selector: selector
  }

  image = await fetch('http://localhost:8008/htmltoimg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)

  }).then((response) => response.json()).then((serverResponse) => {
    return Buffer.from(JSON.stringify(serverResponse.image));
  })



  return image;

}






