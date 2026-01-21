import axios from 'axios';
const UseAxiosPublic = () => {
    const axiosPublic=axios.create({
        baseURL:"http://localhost:8080/api/",
    })
    return axiosPublic;
};

export default UseAxiosPublic;