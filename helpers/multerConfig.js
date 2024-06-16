const fs = require('fs');
const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);

    // Function to check for existing files and adjust the name if necessary
    const checkAndCreateFileName = (name, extension, counter = 0) => {
      const fileName = counter === 0 ? `${name}${extension}` : `${name}-${counter}${extension}`;
      const filePath = path.join('uploads/images', fileName);

      if (fs.existsSync(filePath)) {
        // If the file already exists, increment the counter and check again
        return checkAndCreateFileName(name, extension, counter + 1);
      } else {
        // If the file doesn't exist, return the new file name
        return fileName;
      }
    };

    // Get the final file name by checking for existing files
    const finalFileName = checkAndCreateFileName(baseName, ext);
    cb(null, finalFileName);
  },
});

const upload = multer({ storage: storage }).single('image');

module.exports = upload;
