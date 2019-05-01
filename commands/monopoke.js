'use strict'
var dex = require('./../data/dex1.js').BattlePokedex;
exports.commands = {
     monopoke: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a pokemon');
         if (!dex[toId(arg)]) return this.restrictReply(arg + " is not a pokemon.");
          this.restrictReply('/etour monopoke');
          this.restrictReply('/tour scouting off');
          this.restrictReply('/tour autodq 1.5');
          this.restrictReply('/tour modjoin off');
          this.restrictReply('/mn the monopoke tour was created, the tour scouting off, tourautodq 1.5 and tour modjoin off was done by' + user);
          this.restrictReply('/tour name Monopoke ' + arg);
         this.restrictReply('/tour rules !Team Preview, -Aegislash, -BL, -BL2, -BL3, -BL4, -Blaziken, -Genesect, -Gengarite, -LC, -LC Uber, -Landorus, -Lucarionite, -Metagrossite, -NFE, -NU, -Naganadel, -OU, -PU, -Pheromosa, -RU, -UU, +' + arg);
    },
};