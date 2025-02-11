import { api } from "../lib/axios";
import { isAxiosError } from "axios";

export const getPendingMessages = async (userId: string) => {
    try{
        console.log("Entra en getPendingmessage");
        const url = "/mensaje/find-remove-message";
        const { data } = await api.post(url, { userId },{
            withCredentials: true
        });
        console.log("Datos desde el primer obtencion",data);
        console.log("ID enviado", userId);
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            console.log(error.response.data);
            return error.response.data;
        };
    };
};