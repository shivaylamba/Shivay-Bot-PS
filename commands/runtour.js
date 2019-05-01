'use strict'
exports.commands = {
     runtour: function (arg, user, room) {
          if (!arg) return this.restrictReply('you didnt specify a time, the command is .runtour [time]');
          this.restrictReply('/tour scouting off');
          this.restrictReply(arg);
          this.restrictReply(`/tour autostart ${arg}`);
          this.restrictReply('/tour autodq 1.5');
          this.restrictReply('/tour modjoin off');
          this.restrictReply('/mn the tour was created, the tour scouting off, tourautodq 1.5 and tour modjoin off was done by' + user);
    },
};