const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/", async (request, response) => {
  
});

router.get("/list", async (request, response) => {
    try {
        const users = await User.find();
        response.status(200).json(users);
    }catch (error) {
        console.error("Error retrieving user list:", error);
    }
});

router.get("/:id", async (request, response) => {
    try {
        const user = await User.findById(request.params.id);
        response.status(200).json(user);
    }catch (error) {
        console.error("Error retrieving user by ID:", error);
    }
})

router.delete("/:id", async (request, response) => {
    try {
        const result = await User.findByIdAndDelete(request.params.id);
        response.status(200).json({message: "User deleted successfully."});
    }catch (error) {

    }
})

module.exports = router;