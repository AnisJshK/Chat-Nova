import express from 'express'
import { createRoom, getUserRooms } from '../controllers/RoomContoller.js';
import { requireAuth } from '../middleware/clerkMiddleware.js';

const roomRoutes = express.Router();

roomRoutes.post('/createRoom',requireAuth,createRoom);
roomRoutes.get('/getRooms',requireAuth,getUserRooms);
roomRoutes.get('/:roomId/join',requireAuth,getUserRooms);

export default roomRoutes;