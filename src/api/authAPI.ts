import { RegistroUser, User } from "../types";
import { api } from "../lib/axios";
import { isAxiosError } from "axios";

export const createAccount = async (userData: RegistroUser) => {
    try{
        const url = "/auth/create-account";
        const { data } = await api.post(url, userData);
        return data;
    }
    catch(error){
        if( isAxiosError(error) && error.response ){
            return error.response.data;
        };
    }
};

export const confirmAccount =  async (token: string) => {
    try{
        const url = "/auth/confirm-account";
        const { data } = await api.post(url, { token });
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response){
            return error.response.data;
        }
    }
};

export const login = async ( dataLogin: {email: string, password: string}) => {
    try{
        const url = "/auth/login";
        const { data } = await api.post(url, dataLogin, {
            withCredentials: true
        });
        return data
    }
    catch(error){
        if(isAxiosError(error) && error.response){
            return error.response.data;
        }
    };
};

export const requestNewToken = async ( email: string ) => {
    try{
        const url = "/auth/request-new-token";
        const { data } = await api.post(url, { email });
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response){
            return error.response.data;
        };
    };
};

export const changePassword = async (dataChangePassword: { password: string, passwordConfirm: string, token: string }) => {
    try{
        const url = "/auth/change-password";
        const { data } = await api.post(url, dataChangePassword);
        return data;
    }
    catch(error){
        if(isAxiosError(error) && error.response){
            return error.response.data;
        }
    }
};

export const logout = async (userId: User['id']) => {
    try{
        const url = "/auth/logout";
        const { data } = await api.post(url, {userId}, {
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