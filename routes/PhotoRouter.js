const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const requireAuth = require("./UpoadFileRouter").requireAuth;
router.post("/:photoId/like", async (request, response) => {
    const photoId = request.params.photoId;
    const userId = request.body.userId;
    console.log(userId)
    console.log(photoId)

    try {
        const photo = await Photo.findById(photoId)
        console.log(photo)
        const liked = photo.likes.includes(userId)
        if(liked){
            photo.likes.pull(userId)
        }else{
            photo.likes.push(userId)
        }
        await photo.save();
        return response.status(200).json({status: 200, liked: !liked, likeCount: photo.likes.length});
    }catch(err){
        return response.status(500).json({status: 500, message: 'Internal Error'})
    }
});

router.get("/:id", async (request, response) => {
    const userId = request.params.id;

    try {
        const photos = await Photo.find({ user_id: userId })
        response.status(200).json(photos);
    }catch (error) {
        console.error("Error retrieving photos by user ID:", error);
    }
});


router.delete("/:id", async (request, response) => {
    try {
        const result = await Photo.findByIdAndDelete(request.params.id);
        response.status(200).json({status: 200, message: "Photo deleted successfully."});
    }catch (error) {
        console.error("Error deleting photo by ID:", error);
    }
})

// router.delete("/:idphoto/:idcomment" , async (request, response) => {
//     try {
//         const photo = Photo.findById(request.params.idphoto);
//         const comment = photo.comments.id(request.params.idcomment);
//         if (!comment) {
//             return response.status(404).json({
//                 message: "Comment not found."
//             });
//         }
//         comment.remove();
//         await photo.save();
//         response.status(200).json({message: "Comment deleted successfully."});
//     }catch (error) {
//         console.error("Error deleting photo by ID:", error);
//     }
// })

module.exports = router;
