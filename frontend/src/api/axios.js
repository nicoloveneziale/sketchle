import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/api" || 'https://sketchle.onrender.com/api', 
    headers: {
        'Content-Type': 'application/json'
    }
});

export default api;