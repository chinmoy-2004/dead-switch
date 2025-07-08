import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";


const useAuthstore = create((set, get) => ({
   
    authuser:null,
    isCheckingauth:false,
    issignup:false,
    islogin:false,
    
    checkauth: async()=>{
        try {
            const res=await axiosInstance.get("/auth/checkauth");
            set({authuser:res.data});
            // console.log("authuser",res.data);
        } catch (error) {
            console.log("error in authstore checkauth",error)
            toast.error(error.response?.data?.message || "Internal server error");
        }
    },

    signup: async(formdata)=>{
        try {
            set({issignup:true});
            const res=await axiosInstance.post("/auth/signup",formdata);
            set({authuser:res.data})
            toast.success("Signed up sucessfully")
            
        } catch (error) {
            // console.log("error in authstore signup",error)
             toast.error(error.response?.data?.message || "Internal server error");
        }
        finally {
            set({issignup:false});
        }
    },

    login: async(formdata)=>{
        try {
            set({islogin:true});
            const res=await axiosInstance.post("/auth/login",formdata);
            set({authuser:res.data});
            toast.success("session generated sucessfully");
        } catch (error) {
            // console.log("error in authstore login",error)
           toast.error(error.response?.data?.message || "Internal server error");
        }
        finally {
            set({islogin:false});
        }
    },

    logout:async()=>{
        try {
            await axiosInstance.get("/auth/logout");
            set({authuser:null});
            toast.success("session ended sucessfully")
        } catch (error) {
            // console.log("error in authstore logout",error)
            toast.error(error.response?.data?.message || "Internal server error");
        }
    }
    
}));

export default useAuthstore;
