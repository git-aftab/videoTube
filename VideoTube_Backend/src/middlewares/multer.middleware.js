import multer from "multer";
import fs from "fs";
import path from "path";

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
    const ext = path.extname(file.originalname);
    // cb(null, file.originalname + "_" + uniqueSuffix);
    cb(null, uniqueSuffix + ext);
  },
});

export const upload = multer({ storage });
