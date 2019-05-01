'use strict';

exports.id = 'autoresp';
exports.desc = '';

exports.init = () => {};
exports.parse = (room, message, isIntro, spl) => {
	if (isIntro) return;
	
	let user = spl[2];
	if (spl[3].includes(“shivaybot” || “Shivay Bot” || “Shivay bot” || “Shivaybot”) || room == user) {
           if (spl[3].includes("hello" || “hi”)) Bot.say(room, ‘Hey there ${toId(user)}!’);
           if (spl[3].includes("when were you born")) Bot.say(room, ‘I was born on Friday, August 17, 2018. Thanks for asking ${toId(user)}!’);
           if (spl[3].includes("how are you")) Bot.say(room, ‘I am good! Thanks for asking,         ${toId(user)}!’);
           if (spl[3].includes("bye")) Bot.say(room, ‘bye ${toId(user)}!, have a nice day ahead!’);
 if (spl[3].includes("i want to battle you")) Bot.say(room, ‘Sure ${toId(user)}!, send me a challenge’);
 if (spl[3].includes("you are awesome")) Bot.say(room, ‘Thanks a lot!  ${toId(user)}!, you are good yourself as well!’);
 if (spl[3].includes("do you like me")) Bot.say(room, ‘yes ofcourse I like everyone,    ${toId(user)}!’);
 if (spl[3].includes("do you believe in god")) Bot.say(room, ‘I am a bot,,${toId(user)}. I believe in the user who created me : memogiuel.’);
