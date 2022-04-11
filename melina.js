/* 
melina.js as the name suggests contains all the functionality for the melina character such as saying
quotes from the elden ring. 

*/

const melinaQuotes = [
    "Greetings. Traveller from beyond the fog. I Am Melina. I offer you an accord.",
    "Have you heard of the finger maidens? They serve the Two Fingers, offering guidance, and aid, to the Tarnished. But you, I am afraid, are maidenless.",
    "I can play the role of maiden. Turning rune fragments into strength. To aid you in your search for the Elden Ring. You need only take me with you. To the foot of the Erdtree.",
    "I understand. I'm asking you to put faith in but a stranger. Yet I'm certain that we can reach an understanding.",
    "This tiny golden aura is the grace of the Erdtree. This light once shone in the eyes of your Tarnished brethren.",
    "Shall I turn your runes to strength? Let my hand rest upon you, for but a moment.",
    "Share them with me, your thoughts, your ambitions, the principles you would follow.",
    "The Erdtree...is close.",
    "Forgive me. I've been...testing you. To see whether or not grace truly does guide you.",
    "I know... I'm asking you to commit a cardinal sin.",
    "There is something I'd like to say. My purpose was given to me by my mother. But now, I act of my own volition."
]


module.exports = {

    melinaQuote: function() {
        /* 
            Returns a random quote selected from melinaQuotes
        */

        const randomInt = Math.floor(Math.random() * (melinaQuotes.length - 1));
        //console.log(randomInt);
        return melinaQuotes[randomInt];
    }

} 