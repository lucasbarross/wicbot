var app = require("express")(),
    routes = require("./routes.js"),
    bodyParser = require("body-parser");
    
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes);
app.listen(process.env.PORT || 3000, function(){
    console.log("Express connected");
});