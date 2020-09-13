const axios = require("axios")
const cheerio = require('cheerio');
const TelegBot = require("node-telegram-bot-api")
const token = '1139190379:AAG81mbmAXQSH_ejTocGh0TG9R3JwT8nmSA'
let bot = new TelegBot(token, {polling: true})

async function parsingProccesUniversal(animeTitle, typeAnime){
    let animeListArray = []
    await console.log(`animeTitle - ${animeTitle}`)
    await axios.get(`https://www12.9anime.to/search?keyword=${animeTitle}`)
    .then((response) => {
        const $ = cheerio.load(response.data);
        $(".film-list .item").each((i, elem)=>{
            let dubResult = /Dub/.test($(elem).find("a.name").text());
            if(typeAnime == "all"){
                animeListArray.push({
                    name: $(elem).find("a.name").text(),
                    poster: $(elem).find("a.poster img").attr("src"),
                    url: $(elem).find("a.name").attr("href"),
                    episodes: $(elem).find("a.poster .status .ep").text()
                }) 
            } 
            else if(typeAnime == "dub"){
                if(dubResult){
                    animeListArray.push({
                        name: $(elem).find("a.name").text(),
                        poster: $(elem).find("a.poster img").attr("src"),
                        url: $(elem).find("a.name").attr("href"),
                        episodes: $(elem).find("a.poster .status .ep").text()
                    }) 
                } 
            }
            else if(typeAnime == "sub"){
                if(dubResult == false){
                    animeListArray.push({
                        name: $(elem).find("a.name").text(),
                        poster: $(elem).find("a.poster img").attr("src"),
                        url: $(elem).find("a.name").attr("href"),
                        episodes: $(elem).find("a.poster .status .ep").text()
                    }) 
                } 
            }
        })
    })
    return await animeListArray
}
parsingProccesUniversal("hellsing", "all").then(data=>{console.log(data)})

bot.onText(/\/find (.+)/, function (msg, match) {
    let fromId = msg.from.id; // Получаем ID отправителя
    let resp = match[1]; // Получаем текст после /find
    let chatId = msg.chat.id;
    bot.sendMessage(fromId, "=====Loading=====");
    parsingProccesUniversal(resp, "all")
    .then(async(animeList) => {
        await animeList.forEach(item => {
            bot.sendPhoto(chatId, `https:${item.poster}`, {caption: `${item.name}${item.episodes}\nLink - https://www12.9anime.to${item.url}\nCreated for 9anime`});
            console.log("Complete!")
        })
    })
});

bot.onText(/\/find_dub (.+)/, function (msg, match) {
    let fromId = msg.from.id; // Получаем ID отправителя
    let resp = match[1]; // Получаем текст после /find
    let chatId = msg.chat.id;
    bot.sendMessage(fromId, "=====Loading=====");
    parsingProccesUniversal(resp, "dub")
    .then(async(animeList) => {
        await animeList.forEach(item => {
            bot.sendPhoto(chatId, `https:${item.poster}`, {caption: `${item.name}${item.episodes}\nLink - https://www12.9anime.to${item.url}\nCreated for 9anime`});
            console.log("Complete!")
        })
    })
});

bot.onText(/\/find_sub (.+)/, function (msg, match) {
    let fromId = msg.from.id; // Получаем ID отправителя
    let resp = match[1]; // Получаем текст после /find
    let chatId = msg.chat.id;
    bot.sendMessage(fromId, "=====Loading=====");
    parsingProccesUniversal(resp, "sub")
    .then(async(animeList) => {
        await animeList.forEach(item => {
            bot.sendPhoto(chatId, `https:${item.poster}`, {caption: `${item.name}${item.episodes}\nLink - https://www12.9anime.to${item.url}\nCreated for 9anime`});
            console.log("Complete!")
        })
    })
});
bot.on("polling_error", (err) => console.log(err));