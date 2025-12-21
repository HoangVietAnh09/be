import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../photo-sharing-v1/public/images/')
    },
    filename: function (req, file, cb) {
    const uniqueName = file.originalname;
    cb(null, uniqueName);
  }
})

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;