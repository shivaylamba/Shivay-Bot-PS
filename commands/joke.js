// 'use strict'

// exports.commands = {
//      joke: function (arg, user, room) {
//           $(document).ready(function() {

//             var jokesAPI = "https://api.icndb.com/jokes?escape=javascript";
//             $.getJSON(jokesAPI, {
          
//               })
//               .done(function(json) {
//                 var obj = JSON.stringify(json);
//                 var data = JSON.parse(obj);
//                 var jokes = [];
//                 var jokeDisplay = document.getElementById("getOtherJoke");
//                 for (var i = 0; i < data.value.length; i++) {
//                   jokes.push(data.value[i].joke);
//                 }
          
//                 function pickJoke() {
//                   var random = Math.floor(Math.random() * jokes.length);
//                   return jokes[random];
//                 }     
              
//                 pickedJoke = pickJoke();
//                 jokeDisplay.textContent = pickedJoke;
//                 this.restrictReply(jokeDisplay.textContent);
//               })
              
//           })
//     },
// };       
        var request = require("request");

        let data;
        
        exports.commands = {
            joke: function (arg, user, room)
             {

                var jokesAPI = "https://api.icndb.com/jokes?escape=javascript";
                let self=this;
                request(jokesAPI, function(err, resp, body){
                    if(!err && resp.statusCode == 200){
                     data = JSON.parse(body);
                     var jokes = [];
                     for (var i = 0; i < data.value.length; i++) {
                        jokes.push(data.value[i].joke);
                      }
                      var random = Math.floor(Math.random() * jokes.length);
                      self.restrictReply(jokes[random]);
                    }
                });
               
              
                               
          },
        };      
         