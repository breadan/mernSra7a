import multer from "multer";
import { dirname } from 'path';
import * as path from 'path';
import { randomUUID } from "crypto"

const imagesDirname = "./upload"
const photoStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, imagesDirname);
    },
    filename: function (req, file, cb) {
        if (file) {

            cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
        } else {
            cb(null, false)
        }
    }
});

const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {    //u can put formatted image here
            cb(null, true);
        } else {
            cb({ message: "Unsupported File format" }, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024   //1mg of file size
    }
})

export { photoUpload }