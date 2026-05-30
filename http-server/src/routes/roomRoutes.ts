import express from 'express'
import { createRoom, getUserRooms } from '../controllers/RoomContoller.js';

const roomRoutes = express.Router();

roomRoutes.post('/createRoom',createRoom);
roomRoutes.get('/getRooms',getUserRooms);

export default roomRoutes;