import { API_URL } from '@/consts';
import axios from 'axios';

export const axiosApi = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: 'Bearer c04414ba-4ca7-4d57-9e1a-4968377c5309',
  },
});
