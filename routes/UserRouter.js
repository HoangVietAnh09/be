const express = require("express");
const User = require("../db/userModel");
const router = express.Router();

router.post("/logout", async (request, response) => {
    if(!request.session){
        return response.status(200).json({status: 200, message: 'No session to destroy'})
    }
    
    request.session.destroy((err) => {
        if(err){
            return response.status(500).json({ status: 500, message: "Error logging out" });
        }
        response.clearCookie('connect.sid');
        return response.status(200).json({ message: "Logged out successfully" });
    })
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


// router.get("/:name", async (request, response) => {
//     try {
//         const user = await User.findBy
//     }catch (error){
//         console.error(error)
//     }
// })

router.delete("/:id", async (request, response) => {
    try {
        const result = await User.findByIdAndDelete(request.params.id);
        response.status(200).json({status: 200, message: "User deleted successfully."});
    }catch (error) {

    }
})

router.put("/:id", async (request, response) => {
    try {
        const updates = Object.fromEntries(
            Object.entries(request.body).filter(([k, v]) => (v != null && v !== ""))
        );        
        console.log(updates);
        const updateUser = await User.findByIdAndUpdate(request.params.id, updates, { new: true });
        response.status(200).json({status: 200, updateUser: updateUser});
    }catch (error) {
        console.error("Error updating user:", error);
    }

    // try {
    //     const updatedUser = await User.findByIdAndUpdate(request.params.id, request.body, { new: true });
    //     response.status(200).json(updatedUser);
    // }catch (error) {
    //     console.error("Error updating user:", error);
    // }
})

module.exports = router;
