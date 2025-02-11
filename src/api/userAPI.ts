import { isAxiosError } from "axios";
import { api } from "../lib/axios";
import { User } from "../types";

export const loadDataUser = async () => {
    try{
        const url = "/user/load-data-user";
        const { data } = await api.get(url, {
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            console.log(error);
        }
        else{
            return { success: false, errors: [{ msg: "Error" }] }
        }
    }
}

export const searchContact = async (email: string) => {
    try{
        const url = "/user/search-contact";
        const { data } = await api.post(url, { email },{
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response ){
            return error.response.data
        }
    }
}

export const searchContactById = async (userId: string) => {
    try{
        const url = "/user/search-contact-by-id";
        const { data } = await api.post(url, {userId},{
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response){
            console.log(error.response.data);
        };
    };
};


export const editUserName = async ( userId: User['id'], name: User['name'] ) => {
    try{
        const url = "/user/edit-username";
        const { data } = await api.post(url, { userId, name },{
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            console.log(error.response.data);
            return error.response.data;
        };
    };
};

export const uploadImage = async ( formData: FormData ) => {
    try{
        const url = "/user/upload-image";
        const { data } = await api.post(url, formData,{
            withCredentials: true
        });
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            console.log(error.response.data);
            return error.response.data;
        };
    };
};