
const puppeteer = require('puppeteer');
// const sharp = require('sharp');

const NUMBER_OF_ITEMS = 5;

module.exports = {
    findPrice: async function (item, msg, embed) {
        const browser = await puppeteer.launch({defaultViewport: {width: 1000, height: 650}});
        const page = await browser.newPage();
        await page.goto(`https://www.amazon.com/s?k=${item}`);
        await page.screenshot({path: 'example.png'});
        
        var price = await page.evaluate(() => [...document.querySelectorAll('.a-price-whole')].map(elem => elem.innerText));
        var fractionPrice = await page.evaluate(() => [...document.querySelectorAll('.a-price-fraction')].map(elem => elem.innerText));
        var itemName = await page.evaluate(() => [...document.querySelectorAll('.a-size-medium')].map(elem => elem.innerText));
        
        if (itemName.length == 0) {
            var itemName = await page.evaluate(() => [...document.querySelectorAll('.a-size-base-plus')].map(elem => elem.innerText));
        }

        console.log(price);
        console.log(itemName);
        msg.channel.send({files: ["./example.png"]});

        const link = `https://www.amazon.com/s?k=${item}`.replace(/ /g, "+"); // adds + in the link to avoid breaking hyperlink in embed
        
        embed.setTitle(`Prices for ${item}`);
        embed.setColor('#0099ff');
        embed.setDescription(link);

        // iterates the itemName and price found
        for (i=0; i < NUMBER_OF_ITEMS; i++) {
            embed.addField(`${itemName[i]}`, `$${price[i].split("\n")[0]}` + `.${fractionPrice[i]}`, false);
        }
        
        embed.setTimestamp();
        msg.channel.send({embed});

        await browser.close();
    }
}
