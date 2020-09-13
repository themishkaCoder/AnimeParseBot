// import axios from 'axios'
const axios = require("axios")
const cheerio = require('cheerio');

class Parse {
    constructor(animeTitle){
        this.animeTitle = animeTitle
        this.animResponse = ''
        this.animeList = []
    }
    get animResult(){
        this.parseAnime().then(data=>{console.log(data)})
    }
    get animeListGet(){
        return this.animeList
    }
    parseAnime(){
        let responseData
        var emptyArray = []
        console.log(`animeTitle - ${this.animeTitle}`)
        return axios.get(`https://www11.9anime.to/search?keyword=${this.animeTitle}`)
        .then((response) => {
            responseData = response.data
            const $ = cheerio.load(responseData);
            // return this.filterAnime(responseData)
            $(".film-list .item").each((i, elem)=>{
                emptyArray.push({
                    name: $(elem).find("a.name").text(),
                    poster: $(elem).find("a.poster img").attr("src")
                }) 
            })
            this.animeList = emptyArray
            return emptyArray
        })
            
        
        // console.log(emptyArray)
        // return emptyArray
    }
    filterAnime(unFilterData){
        const $ = cheerio.load(unFilterData);
        let emptyArray = []
        console.log($('.title a').text())
        // this.animeList = [{name: "123"}]
        $(".film-list .item").each((i, elem)=>{
            // console.log($(elem).find("a.name").text())
            // console.log($(elem).find("a.poster img").attr("src"))
            emptyArray.push({
                name: $(elem).find("a.name").text(),
                poster: $(elem).find("a.poster img").attr("src")
            }) 
        })
        
        this.animeList = emptyArray
        console.log("emptyArray")
        // console.log(emptyArray)
        return emptyArray
    }
}

module.exports = { Parse }