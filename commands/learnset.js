'use strict'
var dex = require('./../data/learnsets-g6.js').BattleLearnsets;
exports.commands = {
     learnsetof: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a pokemon');
         if (!dex[toId(arg)]) return this.restrictReply(arg + " is not a pokemon.");
         console.log(dex[toId(arg)]);
         var htmltext = "!addhtmlbox "
        // let i;
        // for(i=0;i<5;i++)
        // htmltext+=arg.learnset[i] + '  '
        for (var key in dex[toId(arg)].learnset) {
            if (dex[toId(arg)].learnset.hasOwnProperty(key)) {
                console.log(key + " -> " + dex[toId(arg)].learnset[key]);
                htmltext+=key + '  '
            }
        }
       htmltext+="";
       this.restrictReply(htmltext)


    },
};
