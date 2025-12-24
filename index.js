const express = require("express");
const session = require("express-session");
const app = express();
const cors = require("cors");
const dbConnect = require("./db/dbConnect");
const UserRouter = require("./routes/UserRouter");
const PhotoRouter = require("./routes/PhotoRouter");
const RegisterRouter = require("./routes/RegisterRouter");
const LoginRouter = require("./routes/LoginRouter");
const Photo = require("./db/photoModel");
const UploadFileRouter = require("./routes/UpoadFileRouter");
// const CommentRouter = require("./routes/CommentRouter");

dbConnect();


app.use(session({
  secret: "Vietanh204@",
  resave: false,
  saveUninitialized: true,
  credentials: true,
  cookie: { secure: false }
}))

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(express.json());
app.use("/api/user", UserRouter);
app.use("/api/photo", PhotoRouter);
app.use("/admin", RegisterRouter);
app.use("/admin", LoginRouter);
app.use("/api/upload", UploadFileRouter);

app.get("/", (request, response) => {
  response.send({ message: "Hello from photo-sharing app API!" });
});

app.delete("/commentsOfPhoto/:idphoto/:idcomment", async (request, response) => {
    const photoId = request.params.idphoto;
    console.log("Photo ID:", photoId);
    console.log("Comment ID:", request.params.idcomment);
    const commentId = request.params.idcomment;
    try {
        const photo = await Photo.findById(photoId);
        if(photo){
            const comment = photo.comments.id(commentId);
            console.log("Comment to delete:", comment);
            if(comment){
                photo.comments.pull(commentId);
                await photo.save();
                response.status(200).json({status: 200, message: "Comment deleted successfully."});
            }else{
              response.status(404).json({status: 404, message: "Comment not found."});
            }
        }else{
          response.status(404).json({status: 404, message: "Photo not found."});
        }
    }catch (error) {
        console.error("Error deleting comment by ID:", error);
        response.status(500).json({status: 500, message: "Internal server error."});
    }
})

app.put("/updateComment/:idphoto/:idcomment", async (request, response) => {
  const photoId = request.params.idphoto;
  const commentId = request.params.idcomment;
  try {
    const photo = await Photo.findById(photoId);
    const comment = photo.comments.id(commentId);
    console.log(comment)
    comment.comment = request.body.comment
    console.log(comment.comment)
    comment.date_time = new Date();
    await photo.save()

    return response.status(200).json({status: 200,comment: comment});
  }catch(error){
    return response.status(500).json({status: 500, message: 'Internal Error'})
  }

})

app.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  const photo_id = request.params.photo_id;
  const comment = request.body.comment;
  const user = request.session.user;
  if(!user){
    return response.status(401).json({message: "Unauthorized. Please log in."});
  }
  try {
    const photo = await Photo.findById(photo_id);
    if(!photo){
      return response.status(404).json({message: "Photo not found."});
    }else{
      const newComment = {
        comment: comment,
        date: new Date(),
        user_id: request.session.user.id,
      }
      if(newComment.comment === undefined || newComment.comment.trim() === ""){
        return response.status(400).json({message: "Comment text is required."});
      }
      photo.comments.push(newComment);
      try {
        await photo.save();
        return response.status(200).json({message: "Comment added successfully.", comment: newComment});
      }catch (error) {
        console.error("Error saving comment:", error);
        return response.status(500).json({message: "Internal server error."});
      }
    }
  }catch (error) {
    console.error("Error fetching photo:", error);
    return response.status(500).json({message: "Internal server error."});
  }
})

app.listen(8081, () => {
  console.log("server listening on port 8081");
});
