import path from 'path';
import multer from "multer";
import { dirname } from 'path';
const __dirname = dirname("__images");

//photo storage 
const photoStorage = multer.diskStorage({
    // const __dirname = new URL('.', import.meta.url).pathname;
    destination: function(req, file, cb){
        cb(null, path.join(__dirname, "../images"));
    },
    filename: function(req, file, cb){
        if(file) {
            cb(null, new Date().toISOString().replace(/:/g,"-") + file.originalname);
        }else{
            cb(null, false);
        }
    }
});

// photo upload
const photoUpload = multer({
    storage: photoStorage,
    fileFilter: function(req, file, cb){
        if(file.mimetype.startsWith("image")){
            cb(null, true);
        }else{
            cb({message: "Unsupported file type"}, false);
        }
    },
    limits: {fileSize: 1024 * 1024}
});

export default photoUpload ;