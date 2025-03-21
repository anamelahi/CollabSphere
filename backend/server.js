import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import cors from "cors";
import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import authMiddleware from "./middlewares/authMiddleware.js";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { error, log } from "console";
import { validate as isUUID } from "uuid";

dotenv.config();

const app = express();
const server = http.createServer(app);
const port = 3000;
const saltRounds = 10;

// Database Connection
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
});
db.connect().catch((err) => console.error("Database connection error:", err));

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// WebSocket Server
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    }
});

let players = {}; // Store player positions
const spaceUsers = {}; 
const userSocketMap = {}; 

io.on("connection", (socket) => {
    socket.on("join-space", ({ spaceId, userId }) => {
        if (!userId) {
            console.error("Received undefined userId for socket:", socket.id);
            return;
        }

        socket.join(spaceId);
        userSocketMap[socket.id] = { spaceId, userId };

        if (!spaceUsers[spaceId]) spaceUsers[spaceId] = new Set();
        spaceUsers[spaceId].add(userId);

        console.log(`User ${userId} joined space: ${spaceId}`);
        console.log(`Users in space ${spaceId}: `, Array.from(spaceUsers[spaceId]));

        // Send updated user list to everyone in the room
        io.to(spaceId).emit("update-users", { users: Array.from(spaceUsers[spaceId]) });
    });

    socket.on("move-player", ({ x, y }) => {
        if (userSocketMap[socket.id]) {
            const { userId } = userSocketMap[socket.id];
            socket.broadcast.emit("player-move", { userId, x, y });
        }
    });

    socket.on("disconnect", () => {
        if (userSocketMap[socket.id]) {
            const { spaceId, userId } = userSocketMap[socket.id];

            if (spaceUsers[spaceId]) {
                spaceUsers[spaceId].delete(userId); // Remove the user from the Set

                // Send updated user list
                io.to(spaceId).emit("update-users", { users: Array.from(spaceUsers[spaceId]) });
            }

            delete userSocketMap[socket.id];

            console.log(`User ${userId} disconnected from space ${spaceId}`);
        }
    });
});


// **User Registration**
app.post("/register", async (req, res) => {
    const { fName, lName, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const query = await db.query(
            "INSERT INTO user_credentials (first_name, last_name, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
            [fName, lName, email, hashedPassword]
        );

        res.json({ message: "User created successfully", userId: query.rows[0].id });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
});

// **User Login**
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = await db.query("SELECT * FROM user_credentials WHERE email = $1", [email]);

        if (query.rows.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = query.rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }

        req.session.userId = user.id;

        return res.json({ message: "User logged in successfully", userId: user.id });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Login failed" });
    }
});

// **User Logout**
app.post("/logout", (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
});

// **Create Space**
app.post("/api/spaces", async (req, res) => {
    const { email, spaceName, config } = req.body;

    if (!email || !spaceName) {
        return res.status(400).json({ error: "Email and space name are required" });
    }

    try {
        const ownerResult = await db.query("SELECT id FROM user_credentials WHERE email = $1", [email]);

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const owner_id = ownerResult.rows[0].id;
        const configData = JSON.stringify(config || {});

        const spaceResult = await db.query(
            "INSERT INTO spaces (name, owner_id, config) VALUES ($1, $2, $3) RETURNING *",
            [spaceName, owner_id, configData]
        );

        await db.query("INSERT INTO user_spaces (user_id, space_id) VALUES ($1, $2)", [owner_id, spaceResult.rows[0].id]);

        res.status(201).json(spaceResult.rows[0]);
    } catch (error) {
        console.error("Error creating space:", error);
        res.status(500).json({ error: "Failed to create space" });
    }
});

app.get("/session", (req, res) => {
    console.log("Current Session Data:", req.session);
    res.json(req.session);
});

// Join Space
app.post("/api/join-space", async (req, res) => {
    console.log("Session Data:", req.session);
    console.log("Request Body:", req.body);

    const userId = req.session.userId; // Extract userId from session
    const { spaceId } = req.body;

    console.log("Extracted userId:", userId);
    console.log("Extracted spaceId:", spaceId);
    console.log("Type of userId:", typeof userId);
    console.log("Type of spaceId:", typeof spaceId);

    if (!userId || !spaceId) {
        return res.status(400).json({ error: "User ID and Space ID are required" });
    }

    try {
        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        // Check if user is already in the space
        const checkUser = await db.query(
            "SELECT * FROM user_spaces WHERE user_id = $1 AND space_id = $2::UUID",
            [numericUserId, spaceId]
        );
        console.log(checkUser.rows[0]);
        

        if (checkUser.rows.length > 0) {
            // alert("User already in this space");

            return res.status(400).json({ error: "User already in this space" });
        }

        // Add user to the space
        await db.query(
            "INSERT INTO user_spaces (user_id, space_id) VALUES ($1, $2::UUID)",
            [numericUserId, spaceId]
        );
        // const joinedSpace = await db.query("SELECT * FROM user_spaces WHERE user_id = $1 AND space_id = $2::UUID",[numericUserId,spaceId])
        // console.log(joinedSpace.rows[0]);
        
        return res.status(200).json({ message: "Successfully joined the space!" });
        // return res.status(200).json(joinedSpace.rows[0]);
    } catch (error) {
        console.error("Error joining space:", error);
        return res.status(500).json({ error: "Failed to join space" });
    }
});


// **Dashboard Data**
app.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT 
                u.id AS user_id, 
                u.first_name, 
                u.last_name, 
                u.email, 
                s.id AS space_id, 
                s.name AS space_name, 
                owner.id AS owner_id, 
                owner.first_name AS owner_first_name, 
                owner.last_name AS owner_last_name
            FROM user_credentials u
            LEFT JOIN user_spaces us ON u.id = us.user_id
            LEFT JOIN spaces s ON us.space_id = s.id
            LEFT JOIN user_credentials owner ON s.owner_id = owner.id
            WHERE u.id = $1`,
            [req.session.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User not found or no spaces created/joined yet" });
        }

        // Logged-in user details
        const user = {
            userId: result.rows[0].user_id,
            name: `${result.rows[0].first_name} ${result.rows[0].last_name}`,
            email: result.rows[0].email
        };

        // Spaces joined or created by the user
        const spaces = result.rows
            .filter(row => row.space_id !== null)
            .map(row => ({
                spaceId: row.space_id,
                spaceName: row.space_name,
                ownerName: `${row.owner_first_name} ${row.owner_last_name}` // Display the creator's name
            }));

        res.json({ user, spaces });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});


// Start the server
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
