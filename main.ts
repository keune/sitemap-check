#!/usr/bin/env node

const chalk = require('chalk');
const axios = require('axios').default;
const parseString = require('xml2js').parseString;
const yargs = require("yargs");

const options = yargs
 .usage("Usage: [options] <URL>")
 .option('t', { alias: 'timeout', describe: "Timeout in seconds for a single URL", type: "number", default: 10 })
 .option('maxPerSitemap', { describe: "Maximum number of URLs to fetch from a single sitemap (default -1: visit all URLs)", type: "number", default: -1 })
 .demandCommand(1)
 .argv;

const log = console.log;
const d = (...args) => {
  log(...args);
};

const dd = (...args) => {
  log(...args);
  process.exit();
};

if (isNaN(options.timeout)) {
  log(`Invalid value for timeout: ${options.timeout}`);
  process.exit(1);
}
if (isNaN(options.maxPerSitemap)) {
  log(`Invalid value for maxPerSitemap: ${options.maxPerSitemap}`);
  process.exit(1);
}
axios.defaults.timeout = options.timeout * 1000;

const parseXml = (xml: string) => {
    return new Promise((resolve, reject) => {
        parseString(xml, {explicitArray: false}, function (err, ok) {
            if (err) return resolve(err);
            return resolve(ok);
        });
    });
};

const isTimeoutError = err => {
  return err.code === 'ECONNABORTED' && err.message.indexOf('timeout')!== -1;
};

const headUrl = async (url: string) => {
  let result = null;
  try {
    result = await axios.head(url);
  } catch (err) {
    result = null;
  }
  const statusOk = result && result.status === 200;
  const statusMsg = statusOk ? chalk.green('200 OK') : chalk.red('HTTP NOT OK');
  log(`URL: ${url} ${statusMsg}`);
};

const parseSitemap = async (url: string) => {
  let result,
    hasTimedOut = false;
  try {
    result = await axios.get(url);
  } catch (err) {
    hasTimedOut = isTimeoutError(err);
    result = null;
  }
  const statusOk = result && result.status === 200;
  const response = result && result.data;
  let data;
  try {
    data = await parseXml(response);
  } catch (err) {
    data = null;
  }
  const isSitemap = data && data['urlset'] && data['urlset']['url'];
  const isSitemapList = data && data['sitemapindex'] && data['sitemapindex']['sitemap'];
  const dataOk = isSitemap || isSitemapList;
  let statusMsg : string;
  if (statusOk) {
    statusMsg = chalk.green('Fetched');
  } else {
    let msg = 'Not Fetched';
    if (hasTimedOut) {
      msg += ' (Timeout)';
    }
    statusMsg = chalk.red(msg);
  }
  let xmlValidMsg = '';
  if (statusOk) {
    if (dataOk) {
      xmlValidMsg = chalk.green('Valid XML');
    } else {
      xmlValidMsg = chalk.red('Invalid XML');
    }
  }
  let type = 'URL';
  if (isSitemapList) {
    type = 'SITEMAP LIST';
  } else if (isSitemap) {
    type = 'SITEMAP';
  }
  type = chalk.blue(type);
  log(`${type}: ${url} ${statusMsg} ${xmlValidMsg}`);
  if (statusOk) {
    if (isSitemapList) {
      const urls = data['sitemapindex']['sitemap'].map(el => el['loc']);
      for (const url of urls) {
        await parseSitemap(url);
      }
    } else if (isSitemap) {
      let urls = data['urlset']['url'].map(el => el['loc']);
      if (options.maxPerSitemap > -1) {
        urls = urls.slice(0, options.maxPerSitemap);
      }
      for (const url of urls) {
        await headUrl(url);
      }
    }
  }
};

(async () => {
  const url = options._[0];
  parseSitemap(url);
})();
