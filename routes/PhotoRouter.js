const express = require("express");
const Photo = require("../db/photoModel");
const router = express.Router();
const requireAuth = require("./UpoadFileRouter").requireAuth;
router.post("/", async (request, response) => {
  
});

router.get("/:id", async (request, response) => {
    const userId = request.params.id;

    try {
        const photos = await Photo.find({ user_id: userId })
                                //   .populate('user_id', 'last_name')
                                //   .select('_id file_name date_time user_id')
                                //   .lean();

        // const result = photos.map(p => ({
        //     _id: p._id,
        //     file_name: p.file_name,
        //     date_time: p.date_time,
        //     user: {
        //         _id: p.user_id._id,
        //         first_name: p.user_id.first_name,
        //         last_name: p.user_id.last_name
        //     }
        // }));

        response.status(200).json(photos);
    }catch (error) {
        console.error("Error retrieving photos by user ID:", error);
    }
});

router.delete("/:id", async (request, response) => {
    try {
        const result = await Photo.findByIdAndDelete(request.params.id);
        response.status(200).json({message: "Photo deleted successfully."});
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
