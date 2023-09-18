// const { Cluster } = require('puppeteer-cluster');
const fetch = require('node-fetch');



// (async () => {
//   const cluster = await Cluster.launch({
//     concurrency: Cluster.CONCURRENCY_PAGE,
//     maxConcurrency: 50,
//     headless: 'new',
//     puppeteerOptions: {
//       userDataDir: './data/puppeteer/cache',
//       args: ['--single-process', '--no-sandbox', '--autoplay-policy=user-gesture-required', '--disable-background-networking', '--disable-background-timer-throttling', '--disable-backgrounding-occluded-windows', '--disable-breakpad', '--disable-client-side-phishing-detection', '--disable-component-update', '--disable-default-apps', '--disable-dev-shm-usage', '--disable-domain-reliability', '--disable-extensions', '--disable-features=AudioServiceOutOfProcess', '--disable-hang-monitor', '--disable-ipc-flooding-protection', '--disable-notifications', '--disable-offer-store-unmasked-wallet-cards', '--disable-popup-blocking', '--disable-print-preview', '--disable-prompt-on-repost', '--disable-renderer-backgrounding', '--disable-setuid-sandbox', '--disable-speech-api', '--disable-sync', '--hide-scrollbars', '--ignore-gpu-blacklist', '--metrics-recording-only', '--mute-audio', '--no-default-browser-check', '--no-first-run', '--no-pings', '--no-sandbox', '--no-zygote', '--password-store=basic', '--use-gl=swiftshader', '--use-mock-keychain', '--disable-gpu', '--disable-accelerated-2d-canvas']
//     },
//   });




//   await cluster.task(async ({ page, data: data }) => {
//     await page.setContent(data.html);


//     const content = await page.$(`${data.selector}`);

//     const options = {
//       omitBackground: false,
//       type: 'jpeg',
//       quality: 100
//     };

//     if (data?.image?.type == 'png') {
//       options.omitBackground = true;
//       options.type = 'png';
//       // remove quality
//       delete options.quality;
//     }

//     var imageBuffer = await content.screenshot(options);



//     return imageBuffer;
//   });

//   // setup server
//   exports.cluster = async function (html, selector, type, quality) {
//     data = {
//       html: html,
//       selector: selector,
//       image: {
//         type: type || 'jpeg',
//         quality: quality || 100,
//       }
//     }
//     const image = await cluster.execute(data);
//     return image;
//   }

//   exports.close = async function (data) {
//     return await cluster.close();
//   };


// })();



exports.post = async function (options) {
  const { html, selector, type, quality } = options;

  const data = {
    html: html,
    selector: selector,
    image: {
      type: type || 'jpeg',
      quality: quality || 100,
    }
  }

  const response = await fetch('http://localhost:8008/htmltoimg', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });


  image = await response.json();
  let buffer = Buffer.from(image.image, 'base64');


  return buffer;

}