import multer from "multer";
import { dirname } from 'path';
import * as path from 'path';

const __dirname = dirname("../images");
const photoStorage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../images"));
    },
    filename: (req, file, cb) => {
        if (file) {

            cb(null, new Date().toISOString().replace(/:/g, "_") + file.originalname);
        }else {
            cb(null, false)
        }
    }
});

const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function(req, file, cb) {
        if (file.mimetype.startsWith('image')) {    //u can put formatted image here
            cb(null, true);
        } else {
            cb({message: "Unsupported File format"}, false);
        }
    },
    limits: {
        fileSize: 1024 * 1024 *5  //1mg of file size
    }
})

export { photoUpload }