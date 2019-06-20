const myanimelist = require('myanimelists');
const { getInfoFromName } = require('myanimelists');
'use strict'
exports.commands = {
     anime: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a anime name');
         
          getInfoFromName(arg)
          //.then(result => this.restrictReply('!addhtmlbox <h2>Anime Synopsis</h2><br>'+ JSON.stringify(result.synopsis) +''))
         // .then(result => this.restrictReply('!addhtmlbox <img src ='+JSON.stringify(result.picture)+'height="150" width="150">'))
         // .then(result => this.restrictReply('!addhtmlbox <h1>Anime title</h1> <br>' +result.title + '<br> <h2>Anime Synopsis</h2><br>'+ result.synopsis +'<br> <h3>Anime episodes number : <br>' + result.episodes +''))
          //.then(result => console.log(result))
          .then(result => this.restrictReply('!addhtmlbox <table width="100%"><tbody><tr><td style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px ; background: rgba(170 , 165 , 215 , 0.5) ; box-shadow: 2px 2px 5px rgba(170 , 165 , 215 , 0.8) ; border: 1px solid rgba(170 , 165 , 215 , 1) ; border-radius: 5px ; color: #2d2b40 ; text-align: center ; font-size: 15pt"><b>'+JSON.stringify(result.title)+'</b></td><td rowspan="6"><img src='+JSON.stringify(result.picture)+'height="320" width="225" alt="undefined" title="undefined" style="float: right ; border-radius: 10px ; box-shadow: 4px 4px 3px rgba(0 , 0 , 0 , 0.5) , 1px 1px 2px rgba(255 , 255 , 255 , 0.5) inset"></td></tr><tr><td style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px"><b>Genres: </b>'+JSON.stringify(result.genres[0])+'</td></tr><tr><td style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px"><b>Premiered </b>' +JSON.stringify(result.premiered) +'</td></tr><tr></tr><tr><td style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px"><b>Status: </b>'+JSON.stringify(result.status) +'</td></tr><tr><td style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px"><b>Episode Count: </b>' + JSON.stringify(result.episodes)+'</td></tr><tr><td style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px"><b>Rating: </b>'+JSON.stringify(result.rating)+'</td></tr><tr><td colspan="2" style="text-shadow: 1px 1px 1px #ccc ; padding: 3px 8px"><b>Description: </b><p>'+JSON.stringify(result.synopsis)+'<br></p></td></tr></tbody></table>'))
          .catch(error => console.log(error));
         
    },

    test11: function (target,room,user) {
        
        // .then(result => this.restrictReply('!addhtmlbox <img src ='+JSON.stringify(result.picture)+'height="150" width="150">'))
        this.restrictReply('!addhtmlbox <img src="https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/ce2ece60-9b32-11e6-95ab-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg" height="32" width="32">');
      },
};