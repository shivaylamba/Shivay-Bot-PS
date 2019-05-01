'use strict'
exports.commands = {
     iq: function (arg, user, room) {
          if (!arg) return this.restrictReply('You didn\'t specify a person');
         if (arg=='vortex') return this.restrictReply('cant calculate for vortex cuz it is a thot');
                  if (arg=='shivay') return this.restrictReply('/mute shivay');

          this.restrictReply('Analysisng the IQ of the person. ' + 'Give me a few moments.......');
         
          var x = Math.floor((Math.random() * 200) + 1);
          this.restrictReply('The iq of ' + arg + 'is :  ' +   x );
         
    },
};