import cloudinary from "cloudinary";

cloudinary.config({
    cloud_name: process.CLOUDINARY_CLOUD_NAME,
    api_key: process.CLOUDINARY_API_KEY,
    api_secret: process.CLOUDINARY_API_SECRET
})

//upload function
const cloudinaryUpload = async (fileToUpload) => {
    try{
        const data = await cloudinary.Uploader.upload(fileToUpload, {
            resource_type: "auto",
        });
        return data
        
    }catch(e){
        return e;
    }
}


//remove function
const cloudinaryRemove = async (imagePublicId) => {
    try{
        const result = await cloudinary.uploader.destroy(imagePublicId)
        return result
        
    }catch(e){
        return e;
    }
}

export { cloudinaryUpload, cloudinaryRemove }