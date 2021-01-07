require('dotenv').config();
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { NOTFOUND } = require("dns");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    res.render("home");
});

app.get("/oops", function(req, res){
    res.render("oops");
});


app.post("/" , function(req, res){

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    
    https.get(url, function(response){
        console.log(response.statusCode);

        //get a respons from the API with data on weather
        response.on("data", function(data){
            
            if (response.statusCode === 200) {
            //Create constants to hold weather data 
            const weatherData = JSON.parse(data)
    
            const temp = weatherData.main.temp
       
            const description = weatherData.weather[0].description
           
            const icon = weatherData.weather[0].icon
            const imgURL = " http://openweathermap.org/img/wn/" + icon + "@2x.png"
           
                res.render("result", {
                    query: query,
                    description: description,
                    temp: temp,
                    imgURL:imgURL 
                });

        } else {
            res.render("oops");
        }
    });

    });
});





app.listen(3000, function(){
    console.log("Server is running on port 3000");
})

