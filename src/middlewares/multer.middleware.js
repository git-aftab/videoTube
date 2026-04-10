import multer from "multer";
import fs from 'fs'

const uploadPath = "public/temp";

// Auto create folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "_" + uniqueSuffix);
  },
});

export const upload = multer({storage})