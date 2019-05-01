'use strict'
exports.commands = {
     pair: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a person');
               var x = Math.floor((Math.random() * 100) + 1);
          this.restrictReply('Pairing you with ' + arg + ' . ' + '  Your match with ' + arg + ' is : ' + x + ' %.');
          
    },
};