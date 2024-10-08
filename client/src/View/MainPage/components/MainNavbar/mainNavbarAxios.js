import * as profilePics from "../../../../api/profilePics/profilePics"
import * as users from "../../../../api/auth/userAuth"

//onClick={() => deleteFile("631aed4060c43bb3bf484804")}
export async function deleteFile(fileId) {
    const response = await profilePics.deleteFile(fileId);
    if (response.error) {
        console.log(response.error);
    }
    else {
        console.log(response.data);
    }
    return response;
}

export async function uploadProfilePicture(image) {
    const response = await profilePics.uploadProfilePicture(image);
    if (response.error) {
        console.log(response.error);
    }
    else {
        console.log(response.data);
    }
    return response;
}


export async function getFile(input) {
    const response = await profilePics.getFile(input);
    if (response.error) {
        console.log(response.error);
    }
    else {
        console.log(response);
    }
    return response;
}

export async function renameUser(newUsername) {
    const response = await users.renameUser(newUsername);
    if (response.error) {
        console.log(response.error);
    }
    else {
        console.log(response.data);
    }
    return response;
} 