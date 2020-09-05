const login = require("facebook-chat-api");
var api_instance = {};

function getapi(){
    return new Promise((resolve, reject) => {
        return (async function middleman(){
            var temp = ""
            await login({email: "gjacbev_moidusen_1587767783@tfbnw.net", password: "8npe599gp5a"}, (err, api) => {
                if(err) return console.error(err);
                temp = api;
                console.log("A")
                
                console.log("B")
                
            });
            console.log("C")
            console.log(temp)
            return temp;
        })();

    })
}
exports.getapi = getapi;
// exports.api_instance = api_instance;
