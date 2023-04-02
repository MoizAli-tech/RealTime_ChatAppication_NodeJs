

function chatboxController(){


    return{
        message(req,res){
            res.send("i am message")
        }
    }
}

module.exports = chatboxController;