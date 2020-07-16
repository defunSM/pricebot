const puppeteer = require('puppeteer');

const SERVER_URL = 'http://localhost:8080';

module.exports = {
    startServer: async function (msg, embed) {

        var wshShell = new ActiveXObject("WScript.Shell");
        wshShell.Run("C:\\Users\\Cloud\\Desktop\\KF2\\KF2Server.bat");

        const browser = await puppeteer.launch({defaultViewport: {width: 1000, height: 650}});
        const page = await browser.newPage();
        await page.goto(`${SERVER_URL}`);
        await page.screenshot({path: 'example.png'});
    }
}