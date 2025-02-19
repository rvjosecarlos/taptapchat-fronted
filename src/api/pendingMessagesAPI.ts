import { api } from "../lib/axios";
import { isAxiosError } from "axios";

export const getPendingMessages = async (userId: string) => {
    try{
        
        const url = "/mensaje/find-remove-message";
        const { data } = await api.post(url, { userId },{
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            return error.response.data;
        };
    };
};