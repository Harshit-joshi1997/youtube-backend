import {v2 as cloudinary} from "cloudinary";
import fs from "fs";


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
            //uplaodOnCloudinary function expects a local file path
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type: "auto" // Automatically detect the resource type (image, video, etc.)
            })
            //file has been uploaded to cloudinary
            console.log("file uploaded to cloudinary",response.url);
            return response; // Return the URL of the uploaded file
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the local save temporary file if upload fails
        return null; // Return null if upload fails
    }
}
   
    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    export {uploadOnCloudinary};