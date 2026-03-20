import {create} from 'zustand';
import { axiosInstance } from '../lib/axios';
import toast from "react-hot-toast"
import { LogOut } from 'lucide-react';

// const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create ((set,get) => ({
    authUser: null,
    isCheckingAuth:true,
    isSigningUp: false,
    isLoggingIn: false,
    isLoadingIn: false,


    checkAuth: async () =>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data})
        } catch (error) {
            console.log("Error in check")
            set({authUser:null})
        } finally {
            set({isCheckingAuth: false});
        }
    },

    signup : async(data) => {
        set({isSigningUp:true})
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            set({authUser: res.data});

            //toast
            toast.success("Account created successfully!")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isSigningUp:false})
        }
    },

    // login store
    login : async(data) => {
        set({isLoggingIn:true})
        try {
            const res = await axiosInstance.post("/auth/login", data);
            set({authUser: res.data});

            //toast
            toast.success("Logged in successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({isLoggingIn:false})
        }
    },

    //logout
    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
            console.log(firstError);
        }
    },

    updateProfile: async(data) => {
        set({isLoadingIn:true})
        try {
            const res = await axiosInstance.put("/auth/updateProfile", data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(error.response.data.message);
        } finally {
            set({isLoadingIn:false})
        }
    },
}));