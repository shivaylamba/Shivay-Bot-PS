'use strict'
exports.commands = {
     log: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a person');
          
          this.restrictReply('Calculating log of ' + arg);
         
          var x = Math.log(arg);
          this.restrictReply('The log of ' + arg + ' is :  ' +   x );
         
    },
};