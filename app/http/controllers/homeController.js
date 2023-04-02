const User = require("../../models/User");
const Message = require("../../models/Message");

function homeController() {

    return {
        async index(req, res, next) {
            let user = {};
            if (req.session.receiver && req.session.sender) {
                try {
                    user = await Message.findOne({
                        messages: {
                            $elemMatch: {
                                $or: [{ sender: req.session.sender, receiver: req.session.receiver }, { sender: req.session.receiver, receiver: req.session.sender }]
                            }
                        }
                    }, { messages: 1 });
                } catch (error) {
                    next(error)
                }


            }
            res.render("home", { conversation: user?.messages ? user.messages : [] })

        },

        async homePost(req, res, next) {
            let { email, message } = req.body;
            if (!email || !message) {
                req.flash("error", "Please fill all fields");
                res.json({ redirect: "/" })
                return;
            }
            if (req.session.receiver && req.session.receiver == email) {
                try {



                    const eventEmitter = req.app.get("eventEmitter");

                    let sender = await Message.findOneAndUpdate(
                        {
                            messages: {
                                $elemMatch: {
                                    $or: [{ sender: req.user?.email, receiver: email }, { sender: email, receiver: req.user?.email }]
                                }
                            }
                        },
                        { $push: { messages: { sender: req.user.email, receiver: email, message: message } } },
                        { new: true }
                    );

                    if (!sender) {

                        let msg = new Message({
                            sender: req.user.email,
                            receiver: email,
                            messages: [{
                                sender: req.user.email,
                                receiver: email,
                                message: message
                            }]
                        })

                        await msg.save();
                        sender = msg;
                    }

                    eventEmitter.emit("msg", req.user.email, email, message);
                    return res.json(sender.messages[sender.messages.length - 1])



                } catch (error) {
                    next(error)
                }
            } else {
                console.log("i ran from home", req.session.receiver)
                req.flash("error", "You are required to set the receiver first");
                return res.json({ redirect: "/" })
            }





        },

        async receiverPost(req, res, next) {
            req.session.sender = req.user.email;
            let { email } = req.body;

            try {
                let user = await User.findOne({ email });
                if (!user) {
                    return res.json({ message: "No such user exists" });
                }
            } catch (error) {
                next(error)
            }



            if (!email) {
                return res.json({ message: "Please enter the email" });
            }
            if (!req.session.receiver || req.session.receiver != email) {
                req.session.receiver = email;
                return res.json({ receiver:true})
            } else if (req.session.receiver == email) {
                return  res.json({ message: "User already has been set" });
            }
        }

    }
}

module.exports = homeController;