const homeController = require("../app/http/controllers/homeController")
const authController = require("../app/http/controllers/authController")
const chatboxController = require("../app/http/controllers/chatboxController")

//middlewares
const isAuthenticated = require("../app/http/middlewares/isAuthenticated");



function routes(app) {


    app.get("/", isAuthenticated,homeController().index)
    
    app.post("/",homeController().homePost)

    app.post("/setReceiver",homeController().receiverPost)

    app.get("/register", authController().register)

    app.post("/register", authController().postRegister)

    app.get("/login", authController().login)

    app.post("/login", authController().postLogin)

    app.get("/logout", authController().logout)



}

module.exports = routes;