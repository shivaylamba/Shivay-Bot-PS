'use strict'
var Crawler = require('Crawler')
exports.commands = {
     test: function (arg, user, room) {
          const that = this;
         // this.restrictReply('!addhtmlbox <div><div style="background: url(&quot;https://cdn02.nintendo-europe.com/media/images/10_share_images/others_3/nintendo_direct_3/H2x1_PokmonDirect_27-02-2019_EU.png&quot;) no-repeat 0 -40px ; background-size: cover ; border: 1px solid #000 ; border-radius: 5px"><div style="background: rgba(0 , 0 , 0 , 0) ; padding: 10px ; box-shadow: inset 0 0 1px rgba(255 , 255 , 255 , 0.5)"><center><br><br><br><br><br><br><br><br><div style="background: rgba(0 , 0 , 0 , 0.7) ; padding: 5px ; border-radius: 5px"><span style="color: #fff ; font-family: monospace ; font-size: 1.2em ; text-shadow: 0 0 1px #000">You can follow the direct at <a href="https://www.twitch.tv/Nintendo" style="color : #fff">https://www.twitch.tv/Nintendo</a><strong><br><br>Times: 6:00 a.m. PT | 9:00 a.m. ET<br> <br> 3:00 p.m. CET | 2:00 p.m. GMT</strong> </span></div></center></div></div></div>');
          var c = new Crawler({
               maxConnections : 10,
               // This will be called for each crawled page
               callback : function (error, res, done) {
                   if(error){
                       console.log(error);
                   }else{
                       var $ = res.$;
                       // $ is Cheerio by default
                       //a lean implementation of core jQuery designed specifically for the server
                       $(".dextable").each((i) => {
                        if(i!==7) {
                            return;
                        }
                        console.log($(this))
                        var textarray =$(this).find(".fooinfo").map(function(){

                            return $(this).text();
                         }).get();
                         var htmltext = "!addhtmlbox <table><tbody>"
                         console.log(textarray)
                            textarray.forEach(title => {
                                htmltext +='<tr>'
                                htmltext += `<td>${title}</td>`
                                htmltext +='</tr>'
                            });
                            htmltext+="</tbody></table>";
                            console.log(htmltext)
                            that.restrictReply(htmltext)
                       });
                    //    var i=1;
                    //    table.each((i, r) => {
                    //     const t = $(r).find('.fooinfo');
                    //     console.log("Herre ", t);
                    //   })
                    //  var textarray= table.find(".fooinfo").map(function(){

                    //     return $(this).text();
                    //  }).get();
                    //  var htmltext = "!addhtmlbox <table><tbody>"
                    //  textarray.forEach(title => {
                    //      htmltext +='<tr>'
                    //       htmltext += `<td>${title}</td>`
                    //       htmltext +='</tr>'
                    //  });
                    //  htmltext+="</tbody></table>";
                    //  that.restrictReply(htmltext)
                   }
                   done();
               }
           });
           c.queue('https://serebii.net/pokedex-sm/'+arg+'.shtml');
    },
};
