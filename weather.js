const request = require('request');
require('dotenv').config();

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

function kelvinToFahrenheit (kelvin) {
    return Math.round(kelvin * (9/5) - 459.67);
} 

module.exports = {
    showWeather: function (msg, embed) {
        city = msg.content.split("!weather ")[1]
        
        request(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}`, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', body); // Print the HTML 

            obj = JSON.parse(body);

            embed.setTitle(`Weather for ${obj['name']}`);
            embed.setColor('#0099ff');
            
            console.log(obj)
            embed.setDescription(`${obj['weather'][0]['description']}`);
            Object.keys(obj["main"]).forEach(function(key) {
                if (key == 'temp') {
                    embed.addField(`${key}`, `${kelvinToFahrenheit(obj["main"][key])}`, false);
                } else if (key == 'feels_like') {
                    embed.addField(`${key}`, `${kelvinToFahrenheit(obj["main"][key])}`, false);
                } else if (key == 'temp_min') {
                    embed.addField(`${key}`, `${kelvinToFahrenheit(obj["main"][key])}`, false);
                } else if (key == 'temp_max') {
                    embed.addField(`${key}`, `${kelvinToFahrenheit(obj["main"][key])}`, false);
                } else {
                    embed.addField(`${key}`, `${obj["main"][key]}`, false);
                }
                
            });

            msg.channel.send({embed});
        });

        

    }
}