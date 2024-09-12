import axios from "axios"
// const url = "http://34.234.71.49:3001";
const url = import.meta.env.VITE_API;

export const callApi = async (method, endpoint, data) => {
    const Token = await axios({
        url: url + "/api/token",
        method: "POST",
    })

    return await axios({
        url: url + endpoint,
        method: method,
        headers: {
            authorization: "Bearer " + Token.data,
        },
        data: data,
    })

}