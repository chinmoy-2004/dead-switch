import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";


const usePayloadStore = create((set, get) => ({


    ispayloadcreating: false,
    payloaddata:null,
    ispayloadfetching: false,

    addpayload: async (payloadData) => {
        try {
            set({ ispayloadcreating: true });
            const res = await axiosInstance.post("/payload/createpayload", payloadData);
            console.log("Payload added:", res.data);
            toast.success("Payload added successfully");
        } catch (error) {
            console.error("Error adding payload:", error);
             toast.error(error.response?.data?.message || "Internal server error");
        }
        finally {
            set({ ispayloadcreating: false });
        }
    },

    getpayloadbyid:async(switchId)=>{
        try {
            set({ ispayloadfetching: true,payloaddata:null });
            const res = await axiosInstance.get(`/payload/getpayloadbyswitchid/${switchId}`);
            console.log("Payload fetched:", res.data);
            set({ payloaddata: res.data });
        } catch (error) {
            console.log("error in getpayload by id",error);
             toast.error(error.response?.data?.message || "Internal server error");
        }
        finally {
            set({ ispayloadfetching: false });
        }
    }
}));

export default usePayloadStore;