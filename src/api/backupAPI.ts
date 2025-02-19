import { isAxiosError } from "axios";
import { api } from "../lib/axios";
import { User } from "../types";

export const downloadBackup = async (userId: User['id']) => {
    try{
        const url = "/backup/download-backup";
        const { data } = await api.post(url, { userId },{
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            return error.response.data;
        }
    }
};

export const uploadBackup = async ( userId: User['id'], encryptedBD: string ) => {
    try{
        const url = "/backup/upload-backup";
        const { data } = await api.post(url, { userId, encryptedBD }, {
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response){
            return error.response.data;
        }
    }
}