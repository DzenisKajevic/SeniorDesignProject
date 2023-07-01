import axios from 'axios';
import { resolve } from '../resolver';

export async function addToRecentlyPlayedSongs(fileId) {
    return await resolve(
        axios({
            method: 'post',
            url: 'http://localhost:3001/api/v1/recentlyPlayedSongs/addToRecentlyPlayedSongs',
            data: { fileId },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

export async function getRecentlyPlayedSongs() {
    return await resolve(
        axios({
            method: 'get',
            url: 'http://localhost:3001/api/v1/recentlyPlayedSongs/getRecentlyPlayedSongs',
            /* params: options, */
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}

// clear history
/* export async function deleteFavouriteFile(fileId) {
    return await resolve(
        axios({
            method: 'delete',
            url: 'http://localhost:3001/api/v1/favouriteFiles/deleteFavouriteFile',
            data: { fileId },
            headers: { 'Authorization': 'Bearer ' + window.localStorage.token }
        }));
}
 */

