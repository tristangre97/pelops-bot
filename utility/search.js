const Fuse = require("fuse.js");
const cache = require("./cache.js");
const { Worker } = require("worker_threads");
const defaultSearchKeys = ["name", "value"];

const defaultOptions = {
  searchList: [],
  query: "",
  searchKeys: defaultSearchKeys,
  workerAmount: 1,
  cacheName: "none",
  threshold: 0.4,
}

exports.search = async function (options) {
  var { searchList, query, searchKeys, workerAmount, cacheName, threshold } = options;

  // Loop through options and set default values if not set
  for (const [key, value] of Object.entries(defaultOptions)) {
    if (!options[key]) {
      options[key] = value;
    }
  }

  if (cache.get(`${cacheName}_${query}`)) {
    return cache.get(`${cacheName}_${query}`);
  }

  if (workerAmount > 1) {
    const searchLists = splitArray(searchList, workerAmount);
    focusedValueLength = query.length;
    const searchPromises = searchLists.map((list) => {
      return new Promise((resolve, reject) => {
        const worker = new Worker(
          "./searchWorker.js",
          {
            workerData: { searchList: list, query, searchKeys, threshold },
          }
        );

        worker.on("message", (results) => {
          resolve(results);
          worker.unref();
        });

        worker.on("error", reject);

        worker.on("exit", (code) => {
          if (code !== 0) {
            reject(new Error(`Worker stopped with exit code ${code}`));
          }
        });
      });
    });

    const promiseResults = await Promise.allSettled(searchPromises);
    // Filter out rejected promises
    filteredResults = promiseResults.filter(
      (result) => result.status === "fulfilled"
    );
    // Get the results
    finalResults = promiseResults.map((result) => result.value);

    // Remove undefined results
    finalResults = finalResults.filter((result) => result !== undefined);
    if (finalResults.length == 0) {
      return [];
    }
    searchList = finalResults.flat().map((element) => element.item)
  }



  const fuse = new Fuse(
    searchList,
    {
      keys: searchKeys,
      shouldSort: true,
      threshold: 0.3,
    }
  );
  results = await fuse.search(query);
  cache.set(
    `${cacheName}_${query}`,
    results.flat().map((element) => element.item),
    60
  );

  return results.flat().map((element) => element.item);
};

function splitArray(array, numGroups) {
  const perGroup = Math.ceil(array.length / numGroups);
  return new Array(numGroups)
    .fill("")
    .map((_, i) => array.slice(i * perGroup, (i + 1) * perGroup));
}
