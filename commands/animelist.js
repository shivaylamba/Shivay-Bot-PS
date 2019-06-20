const myanimelist = require('myanimelists');
const { getInfoFromName } = require('myanimelists');
'use strict'
exports.commands = {
     anime: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a anime name');
         
          getInfoFromName(arg)
          //.then(result => this.restrictReply('!addhtmlbox <h2>Anime Synopsis</h2><br>'+ JSON.stringify(result.synopsis) +''))
          .then(result => this.restrictReply('!addhtmlbox <img src ='+JSON.stringify(result.picture)+'height="150" width="150">'))
         // .then(result => this.restrictReply('!addhtmlbox <h1>Anime title</h1> <br>' +result.title + '<br> <h2>Anime Synopsis</h2><br>'+ result.synopsis +'<br> <h3>Anime episodes number : <br>' + result.episodes +''))

          .catch(error => console.log(error));
         
    },

    test11: function (target,room,user) {
        
        // .then(result => this.restrictReply('!addhtmlbox <img src ='+JSON.stringify(result.picture)+'height="150" width="150">'))
        this.restrictReply('!addhtmlbox <img src="https://images.sftcdn.net/images/t_app-cover-l,f_auto/p/ce2ece60-9b32-11e6-95ab-00163ed833e7/260663710/the-test-fun-for-friends-screenshot.jpg" height="32" width="32">');
      },
};