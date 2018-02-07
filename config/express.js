var app = require("express")(),
    routes = require("./routes.js");

app.use(routes);
app.listen(process.env.PORT || 3000, function(){
    console.log("Express connected");
});