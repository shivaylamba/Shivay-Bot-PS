
var request = require("request");

let data;

exports.commands = {
    generation: function (arg, user, room) {
        var url = "http://pokeapi.co/api/v2/generation/"+arg;
        let self=this;
        request(url, function(err, resp, body){
            if(!err && resp.statusCode == 200){
             data = JSON.parse(body);
             var htmltext = "!addhtmlbox <ul>"
             data["pokemon_species"].sort().forEach(function(pokemon){
                 htmltext+= '<li>' +  pokemon.name  + '</li>' }) 
           
                                  htmltext+="</ul>";
                               
                                  self.restrictReply(htmltext)   
            }
        });
       
      
                       
},
};      
 