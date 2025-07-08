import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import toast from "react-hot-toast";

const useSwitchStore = create((set, get) => ({
    activeswitches: [],
    expiredswitches: [],
    isfetching: false,
    isswitchcreating: false,
    isswitchpinging: false, 
    isswitchfetching: false,
    switchdata: null,
    allswitches: [],

    fetchSwitches: async () => {
        try {
            set({ isfetching: true });
            const res = await axiosInstance.get("/switch/getswitches");
            // Sort switches by createdAt date (newest first)
            const sortedActive = [...res.data.active].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt));
            const sortedExpired = [...res.data.expired].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt));
            const allSorted = [...sortedActive, ...sortedExpired].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt));
                
            set({ 
                activeswitches: sortedActive,
                expiredswitches: sortedExpired,
                allswitches: allSorted
            });
           
        } catch (error) {
            // console.error("Error fetching switches:", error);
            toast.error("Failed to fetch switches");
        } finally {
            set({ isfetching: false });
        }
    },

    addSwitch: async (switchData) => {
        try {
            set({ isswitchcreating: true });
            console.log("Adding switch with data:", switchData);
            const res = await axiosInstance.post("/switch/createswitch", switchData);
            set((state) => { 
                const newActiveSwitches = [...state.activeswitches, res.data]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                return { 
                    activeswitches: newActiveSwitches,
                    allswitches: [...newActiveSwitches, ...state.expiredswitches]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                };
            });           
            toast.success("Switch added successfully");
            return res.data;
        } catch (error) {
            // console.error("Error adding switch:", error);
            toast.error(error.response?.data?.message || "Failed to add switch");
        } finally {
            set({ isswitchcreating: false });
        }
    },

    pingSwitch: async (switchId) => {
        try {
            set({ isswitchpinging: true });
            const res = await axiosInstance.post(`/switch/pingswitch/${switchId}`);
            // console.log("Ping response:", res.data);
            toast.success("Switch pinged successfully");
        } catch (error) {
            // console.error("Error pinging switch:", error);
            toast.error(error.response?.data?.message || "Failed to ping switch");  
        } finally {
            set({ isswitchpinging: false });
        }
    },

    deleteSwitch: async (switchId) => {
        try {
            await axiosInstance.post(`/switch/deleteswitch/${switchId}`);
            set((state) => {
                const newActive = state.activeswitches.filter(s => s.id !== switchId);
                const newExpired = state.expiredswitches.filter(s => s.id !== switchId);
                return {
                    activeswitches: newActive,
                    expiredswitches: newExpired,
                    allswitches: [...newActive, ...newExpired]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                };
            });
            toast.success("Switch deleted successfully");
        } catch (error) {
            // console.error("Error deleting switch:", error);
            toast.error(error.response?.data?.message || "Failed to delete switch");
        }
    },

    getSwitchById: async (switchId) => {
        try {
            set({ isswitchfetching: true, switchdata: null });
            const res = await axiosInstance.get(`/switch/getswitch/${switchId}`);
            // console.log("Switch details:", res.data);
            set({ switchdata: res.data });
            return res.data;
        } catch (error) {
            // console.error("Error fetching switch by ID:", error);
            toast.error(error.response?.data?.message || "Failed to fetch switch details");
            return null;
        } finally {
            set({ isswitchfetching: false });
        }
    }   
}));

export default useSwitchStore;
