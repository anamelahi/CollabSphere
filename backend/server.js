import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import initializeSocket from "./socket/socketManager.js";
import sessionConfig from "./config/session.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});
const port = 3000;

// Middleware to parse JSON and URL-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log all incoming requests to debug body parsing
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log("Request headers:", req.headers);
    console.log("Request body (before parsing):", req.body);
    next();
});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(session(sessionConfig));

app.use("/api", authRoutes);
app.use("/api", spaceRoutes);
app.use("/api", dashboardRoutes);

initializeSocket(io);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});