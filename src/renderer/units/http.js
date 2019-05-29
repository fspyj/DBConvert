import axios from 'axios'
const service =axios.create({
    withCredentials:true ,
    baseURL:'http://20.0.0.69:8081',
     timeout:15000
})
export default  service
