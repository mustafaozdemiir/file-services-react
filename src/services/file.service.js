import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:8080/api/files/';

class FileService {
    getAll() {
        return axios.get(API_URL + 'getAll', { headers: authHeader() });
    }

    upload(file) {
        const formData = new FormData();
        console.log(" - ", file)
        console.log(" header ->", authHeader())
        formData.append('file', file);
        return axios.post(API_URL + 'upload', formData, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } });
    }
    replace(fileId, file) {
        console.log(fileId + " - ", file)
        console.log(" header ->", authHeader())
        const formData = new FormData();
        formData.append('file', file);
        return axios.put(API_URL + 'replace?id=' + fileId, formData, { headers: { ...authHeader(), 'Content-Type': 'multipart/form-data' } });
    }

    delete(id) {
        return axios.delete(API_URL + id, { headers: authHeader() });
    }

}

export default new FileService();
