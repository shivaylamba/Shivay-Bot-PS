"use strict";

const http = require("https");

function getUserInfo(userid) {
    let link = 'https://pokemonshowdown.com/users/' + userid + '.json';
    return new Promise((resolve, reject) => {
        http.get(link, res => {
            var data = '';
            res.on('data', function(part) {
                data += part;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
    });
}

exports.commands = {
    registerdate: function(target, room, user) {
        this.can("broadcast");
        
        target = toId(target) || user.userid;

        getUserInfo(target).then(data => {
            if (data.registertime === 0) return this.send("This alt is not registered.");
            
            let date = getEST(data.registertime * 1000);
            
            this.send("The userid '" + target + "' was registered on " + date + ".");
        });
    },
};