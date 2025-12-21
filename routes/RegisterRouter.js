const express = require("express");
const User = require("../db/userModel");
const router = express.Router();


router.post("/register", async (request, response) => {
    const {first_name, last_name, username, password, retype_password, location, description, occupation} = request.body;
    if(first_name == undefined || last_name == undefined || username == undefined || password == undefined || retype_password == undefined) {
        return response.status(400).json({message: "All fields are required."});
    }
    if(password !== retype_password) {
        return response.status(400).json({message: "Passwords do not match."});
    }

    const existedUser = await User.findOne({username: username})
    if(existedUser) {
        return response.status(400).json({message: "Username already exists."});
    }else{
        const newUser = new User({username, password, first_name, last_name, location, description, occupation});
        try {
            await newUser.save();
            return response.status(201).json({status: 201, message: "User registered successfully."});
        }catch (error) {
            console.error("Error registering user:", error);
            return response.status(500).json({message: "Internal server error."});
        }
    }
});



module.exports = router;