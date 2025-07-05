import setRedisTTL from "../redisserver/setRedisTTL.js";
import Switch from "../schema/Switch.schema.js";
import { redis } from "../redisserver/redis.config.js";
import { deletePayload } from "./payload.controller.js";

export const createSwitch = async (req, res) => {
    try {
        const { name,description ,interval } = req.body;
        const userId = req.user._id;
        if (!name || !interval) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const newSwitch = await Switch.create({
            userId,
            name,
            description: description || "No description provided",
            interval,
            lastping: new Date(),
        });
        if (!newSwitch) {
            return res.status(500).json({ message: "failed to create switch" })
        }
        console.log("switch created suceessfully")
        // Set Redis TTL for the switch
        await setRedisTTL(newSwitch._id, newSwitch.interval);
        return res.status(200).json(newSwitch);
    } catch (error) {
        console.log("Error in swithcontroller", error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

// export const getSwitches = async (req, res) => {
//     try {
//         const switches = await Switch.find({ userId: req.user._id ,status:{$ne:"expired"}}).sort({ createdAt: -1 });
//         if (!switches || switches.length === 0) {
//             return res.status(404).json({ message: "No switches found" });
//         }
//         return res.status(200).json(switches);
//     } catch (error) {
//         console.log("Error in getSwitches", error);
//         return res.status(500).json({ message: "Internal Server Error" });
//     }
// }

export const getSwitches = async (req, res) => {
    try {
        const userId = req.user._id;

        const [activeSwitches, expiredSwitches] = await Promise.all([
            Switch.find({ userId, status: "active" }).sort({ createdAt: -1 }),
            Switch.find({ userId, status: "expired" }).sort({ createdAt: -1 }),
        ]);
        
        if(!activeSwitches && !expiredSwitches) {
            return  res.status(400).json({message:"No switch exist for user"})
        }

        return res.status(200).json({
            active: activeSwitches,
            expired: expiredSwitches,
        });
    } catch (error) {
        console.log("Error in getSwitches", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}


export const pingSwitch=async(req,res)=>{
    try {
        const {id}= req.params;
        const userId=req.user._id;
        const updated=await Switch.findOneAndUpdate(
            { _id: id, userId: userId },
            { lastping: new Date(), status: "active" }, // Reset status to active on ping
            { new: true }
        )
        if (!updated) {
            console.log("Switch not found or already expired");
            return res.status(404).json({ message: "Internal server error" });
        }
        // Reset Redis TTL for the switch
        await setRedisTTL(updated._id, updated.interval);
        return res.status(200).json(updated);
    } catch (error) {
        console.log("Error in pingSwitch", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const deleteSwitch = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const deletedSwitch = await Switch.findOneAndDelete({ _id: id, userId: userId });
        if (!deletedSwitch) {
            return res.status(404).json({ message: "Switch not found" });
        }
        redis.del(`switch:${deletedSwitch._id}`); // Remove from Redis
        await deletePayload(id); // Delete associated payload
        return res.status(200).json({ message: "Switch deleted successfully" });
    } catch (error) {
        console.log("Error in deleteSwitch", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const getSwitchById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        const switchData = await Switch.findOne({ _id: id, userId: userId });
        if (!switchData) {
            return res.status(404).json({ message: "Switch not found" });
        }
        return res.status(200).json(switchData);
    } catch (error) {
        console.log("Error in getSwitchById", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}