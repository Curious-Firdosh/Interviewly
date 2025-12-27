import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import { createSession, endSession, getActiveSessions, getRecentSessions, getSessionbyId, joinSession } from "../controllers/streamController.js";

const router = express.Router();

// api/session
router.post('/' , protectRoute , createSession);
router.get('/active' , protectRoute ,getActiveSessions);
router.get('/my-recent-sessions' , protectRoute ,getRecentSessions);

router.get("/:id" , protectRoute , getSessionbyId);
router.post("/:id/join" , protectRoute ,joinSession)
router.get("/:id/end" , protectRoute , endSession);


export default router