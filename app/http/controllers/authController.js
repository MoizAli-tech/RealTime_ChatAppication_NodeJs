const User = require("../../models/User");
const bcrypt = require("bcrypt")
const passport = require("passport");
function authController(){
    return {
        logout(req,res,next){
            req.logout((error)=>{
                next(error)
            })
            res.redirect("/")
        },
        register(req,res){
            return res.render("./auth/register")
        },
        async postRegister(req,res){
        
            let {email,password,cpassword} = req.body;
            if(!email || !password || !cpassword){
                req.flash("error","Please fill all fields !! ")
                return res.redirect("/register")
            }

            let user = await User.exists({email});

            if(user){
                req.flash("error","User already exists!! ")
                return res.redirect("/register")
            }else if(password !== cpassword){
                
                    req.flash("error","password does not match ")
                    return res.redirect("/register")
                
            }else{
                password = await bcrypt.hash(password,10);
                let user = new User({
                    email,
                    password
                })
                 await user.save();
                return res.redirect("/login")
            }
        },
        login(req,res){
            res.render("auth/login")
        },
        postLogin(req,res,next){
            let {email,password}=req.body;
            console.log(email,password)
            passport.authenticate("local",(error,user,info)=>{
                    console.log("i ran")
                    if(error){
                        req.flash("error","please retry login");
                        return res.redirect("/login");
                    }

                    if(!user){
                        req.flash("error",info.message);
                        return res.redirect("/login");                        
                    }
                    console.log(user)
                    req.login(user,(error)=>{
                        if(error){
                            req.flash("error",error.message);
                            res.redirect("/login");
                        }else{
                            res.redirect("/")
                        }

                    })
            })(req,res,next)
            
        }
    }
}

module.exports = authController;
