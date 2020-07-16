const puppeteer = require('puppeteer');
const { exec, spawn } = require('child_process');
require('dotenv').config();

const SERVER_URL = 'http://localhost:8080';

module.exports = {
    startServer: async function (msg, embed) {

        const result = await exec("C:\\Users\\Cloud\\Desktop\\KF2\\KF2Server.bat");
        console.log(result);
        
        async function screenshot() {
            const browser = await puppeteer.launch({defaultViewport: {width: 1000, height: 650}});
            const page = await browser.newPage();
            await page.goto(`${SERVER_URL}`);
            await page.screenshot({path: 'example.png'});
        }
        
        setTimeout(screenshot, 6000);
    }
}