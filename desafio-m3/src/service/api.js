import axios from 'axios';

const iAxios = axios.create({
    baseURL: 'https://desafio-backend-03-dindin.herokuapp.com/',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})
export default iAxios;