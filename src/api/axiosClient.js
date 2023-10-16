import axios from "axios";
// import Cookies from 'universal-cookie';

// const cookies = new Cookies();

const axiosClient = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});

// axiosClient.interceptors.response.use(
//     function (response) {
//         return response;
//     },
//     function (error) {
//         console.log('error', error)
//         let res = error.response;
//         if (res.status === 401) {
//             window.location.href = "http://localhost:3000/";
//         }
//         console.error("Looks like there was a problem. Status Code:" + res.status);
//         return Promise.reject(error);
//     }
// );

// axiosClient.interceptors.request.use(function (config) {
//     const token = ''//cookies.get(`${process.env.REACT_APP_PREFIX}access_token`);
//     config.headers.Authorization = token || '';
//     return config;
// });

export default axiosClient;