const express = require("express");
const router = express.Router();
const session = require("express-session");
const User = require("../db/userModel");

router.post("/login", async (request, response) => {
    const {username, password} = request.body;
    if (username == undefined || password == undefined) {
        return response.status(400).json({message: "Username and password are required."});
    }else{
        try {
            const user = await User.findOne({username: username, password: password});
            if(!user){
                return response.status(401).json({message: "Invalid username or password."});
            }else{
                request.session.user = {username: user.username, id: user._id};
                return response.status(200).json({status: 200 , message: "Login successful.", user: {username:user.username, id: user._id}});
            }
        }catch (error) {
            console.error("Error logging in user:", error);
            return response.status(500).json({message: "Internal server error."});  
        }
    }
});

router.post("/logout", (request, response) => {
    request.session.destroy();
    if(!request.session) {
        response.redirect("/");
    }else{
        return response.status(500).json({message: "Logout failed."});
    }
});

module.exports = router;