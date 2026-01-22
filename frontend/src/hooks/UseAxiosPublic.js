import axios from 'axios';
const UseAxiosPublic = () => {
    const axiosPublic=axios.create({
        baseURL:"https://jilapi-dx6c.vercel.app/api/",
    })
    return axiosPublic;
};

export default UseAxiosPublic;