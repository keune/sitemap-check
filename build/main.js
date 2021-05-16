#!/usr/bin/env node
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var chalk = require('chalk');
var axios = require('axios').default;
var parseString = require('xml2js').parseString;
var yargs = require("yargs");
var options = yargs
    .usage("Usage: [options] <URL>")
    .option('t', { alias: 'timeout', describe: "Timeout in seconds for a single URL", type: "number", default: 10 })
    .option('maxPerSitemap', { describe: "Maximum number of URLs to fetch from a single sitemap (default -1: visit all URLs)", type: "number", default: -1 })
    .demandCommand(1)
    .argv;
var log = console.log;
var d = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    log.apply(void 0, args);
};
var dd = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    log.apply(void 0, args);
    process.exit();
};
if (isNaN(options.timeout)) {
    log("Invalid value for timeout: " + options.timeout);
    process.exit(1);
}
if (isNaN(options.maxPerSitemap)) {
    log("Invalid value for maxPerSitemap: " + options.maxPerSitemap);
    process.exit(1);
}
axios.defaults.timeout = options.timeout * 1000;
var parseXml = function (xml) {
    return new Promise(function (resolve, reject) {
        parseString(xml, { explicitArray: false }, function (err, ok) {
            if (err)
                return resolve(err);
            return resolve(ok);
        });
    });
};
var isTimeoutError = function (err) {
    return err.code === 'ECONNABORTED' && err.message.indexOf('timeout') !== -1;
};
var headUrl = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var result, err_1, statusOk, statusMsg;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                result = null;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.head(url)];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                result = null;
                return [3 /*break*/, 4];
            case 4:
                statusOk = result && result.status === 200;
                statusMsg = statusOk ? chalk.green('200 OK') : chalk.red('HTTP NOT OK');
                log("URL: " + url + " " + statusMsg);
                return [2 /*return*/];
        }
    });
}); };
var parseSitemap = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var result, hasTimedOut, err_2, statusOk, response, data, err_3, isSitemap, isSitemapList, dataOk, statusMsg, msg, xmlValidMsg, type, urls, _i, urls_1, url_1, urls, _a, urls_2, url_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                hasTimedOut = false;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get(url)];
            case 2:
                result = _b.sent();
                return [3 /*break*/, 4];
            case 3:
                err_2 = _b.sent();
                hasTimedOut = isTimeoutError(err_2);
                result = null;
                return [3 /*break*/, 4];
            case 4:
                statusOk = result && result.status === 200;
                response = result && result.data;
                _b.label = 5;
            case 5:
                _b.trys.push([5, 7, , 8]);
                return [4 /*yield*/, parseXml(response)];
            case 6:
                data = _b.sent();
                return [3 /*break*/, 8];
            case 7:
                err_3 = _b.sent();
                data = null;
                return [3 /*break*/, 8];
            case 8:
                isSitemap = data && data['urlset'] && data['urlset']['url'];
                isSitemapList = data && data['sitemapindex'] && data['sitemapindex']['sitemap'];
                dataOk = isSitemap || isSitemapList;
                if (statusOk) {
                    statusMsg = chalk.green('Fetched');
                }
                else {
                    msg = 'Not Fetched';
                    if (hasTimedOut) {
                        msg += ' (Timeout)';
                    }
                    statusMsg = chalk.red(msg);
                }
                xmlValidMsg = '';
                if (statusOk) {
                    if (dataOk) {
                        xmlValidMsg = chalk.green('Valid XML');
                    }
                    else {
                        xmlValidMsg = chalk.red('Invalid XML');
                    }
                }
                type = 'URL';
                if (isSitemapList) {
                    type = 'SITEMAP LIST';
                }
                else if (isSitemap) {
                    type = 'SITEMAP';
                }
                type = chalk.blue(type);
                log(type + ": " + url + " " + statusMsg + " " + xmlValidMsg);
                if (!statusOk) return [3 /*break*/, 17];
                if (!isSitemapList) return [3 /*break*/, 13];
                urls = data['sitemapindex']['sitemap'].map(function (el) { return el['loc']; });
                _i = 0, urls_1 = urls;
                _b.label = 9;
            case 9:
                if (!(_i < urls_1.length)) return [3 /*break*/, 12];
                url_1 = urls_1[_i];
                return [4 /*yield*/, parseSitemap(url_1)];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11:
                _i++;
                return [3 /*break*/, 9];
            case 12: return [3 /*break*/, 17];
            case 13:
                if (!isSitemap) return [3 /*break*/, 17];
                urls = data['urlset']['url'].map(function (el) { return el['loc']; });
                if (options.maxPerSitemap > -1) {
                    urls = urls.slice(0, options.maxPerSitemap);
                }
                _a = 0, urls_2 = urls;
                _b.label = 14;
            case 14:
                if (!(_a < urls_2.length)) return [3 /*break*/, 17];
                url_2 = urls_2[_a];
                return [4 /*yield*/, headUrl(url_2)];
            case 15:
                _b.sent();
                _b.label = 16;
            case 16:
                _a++;
                return [3 /*break*/, 14];
            case 17: return [2 /*return*/];
        }
    });
}); };
(function () { return __awaiter(_this, void 0, void 0, function () {
    var url;
    return __generator(this, function (_a) {
        url = options._[0];
        parseSitemap(url);
        return [2 /*return*/];
    });
}); })();
