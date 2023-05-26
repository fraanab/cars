import axios from 'axios';

// AXIOS
export const uploadImg = async (files) => {
    // Defining our variables
    const UPLOAD_PRESET = 'arthur-cloud' // Insert yours
    const CLOUD_NAME = 'arthur-cloud' // Insert yours
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const resData =[]
    for (let i = 0; i < files.length; i++) {

        const FORM_DATA = new FormData();
        // Building the request body
        FORM_DATA.append('file', files[i])
        FORM_DATA.append('upload_preset', UPLOAD_PRESET)
        console.log('uploadImg -> FORM_DATA', FORM_DATA)
        // Sending a post method request to Cloudniarys' API
        try {
            const res = await axios.post(UPLOAD_URL, FORM_DATA)
            resData.push(res.data) ;
        } catch (err) {
            console.error('ERROR!', err)
        }
    }
    return resData
}
