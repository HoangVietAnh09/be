const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const Photo = require('../db/photoModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = './../photo-sharing-v1/public/images';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (JPEG, JPG, PNG, GIF)'), false);
  }
};


const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


function requireAuth(req, res, next) {
  console.log('Session:', req.session);
  
  if (!req.session || !req.session.user) {
    return res.status(401).json({
      message: 'Unauthorized. Please log in.'
    });
  }
  next();
}
router.get('/tesst', async (req, res) => {
    return "tesst"
})


router.post('/photos/new', requireAuth, upload.single('photo'), async (req, res) => {
  try {
    console.log('File:', req.file);
    
    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded'
      });
    }
    
    const user = req.session.user;
    const fileName = req.file.filename;
    
    const newPhoto = new Photo({
      file_name: fileName,
      date_time: new Date(),
      user_id: user.id,
      comments: []
    });
    
    await newPhoto.save();
    
    console.log('Photo saved:', newPhoto);
    
    return res.status(200).json({
      message: 'Photo uploaded successfully',
      data: {
        _id: newPhoto._id,
        file_name: newPhoto.file_name,
        date_time: newPhoto.date_time,
        user_id: newPhoto.user_id
      }
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});


router.delete('/photos/:photo_id', requireAuth, async (req, res) => {
  try {
    const photo_id = req.params.photo_id;
    const user = req.session.user;
    
    const photo = await Photo.findById(photo_id);
    
    if (!photo) {
      return res.status(404).json({
        message: 'Photo not found'
      });
    }
    
    if (photo.user_id.toString() !== user.id.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own photos'
      });
    }
    const uploadDir = './../photo-sharing-v1/public/images';

    const filePath = path.join(uploadDir, photo.file_name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    await Photo.findByIdAndDelete(photo_id);
    
    
    return res.status(200).json({
      message: 'Photo deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error.message
    });
  }
});

router.use('/images', express.static('images'));

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        message: 'File is too large. Maximum size is 5MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        message: 'Too many files. Maximum is 5 files.'
      });
    }
  }
  
  return res.status(500).json({
    message: error.message || 'Internal server error'
  });
});


module.exports = router;