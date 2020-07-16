const puppeteer = require('puppeteer');
const Apify = require('apify');

const { exec } = require('child_process');
require('dotenv').config();

const SERVER_URL = 'http://localhost:8080';
const KF2_USERNAME = process.env.KF2_USERNAME;
const KF2_PASSWORD = process.env.KF2_PASSWORD;



module.exports = {
    startServer: async function (msg, embed) {

        const result = await exec("C:\\Users\\Cloud\\Desktop\\KF2\\KF2Server.bat");
        console.log(result);
        
        async function screenshot() {
            const browser = await puppeteer.launch({defaultViewport: {width: 1000, height: 650}});
            const page = await browser.newPage();
            await page.goto(`${SERVER_URL}`, {waitUntil: 'networkidle0'});
            // login
            await page.type(`#username`, KF2_USERNAME);
            await page.type(`#password`, KF2_PASSWORD);
            await page.click('[type="submit"]');
            await page.waitForNavigation();

            await page.screenshot({path: 'example.png'});
        }
        
        setTimeout(screenshot, 6000);

        msg.channel.send({files: ["./example.png"]})
    },
    
    killServer: async function(msg, embed) {
        const result = await exec("TASKKILL //IM KFServer.exe");
        SERVER_STATUS = false;
        console.log(result);
        msg.channel.send("Server has been closed.");
    }
}