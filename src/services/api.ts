import axios from 'axios';
import { environment } from '../environments/environments';

const api = axios.create({
    baseURL: environment.apiURL,
});

export default api;
