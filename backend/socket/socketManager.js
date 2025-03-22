import { Server } from 'socket.io';

// Define Maps at the module level to maintain state across connections
const spaceUsers = new Map();        // Maps spaceId to a Set of userIds
const playerPositions = new Map();   // Maps spaceId to a Map of userId -> position
const socketToUser = new Map();      // Maps socket.id to userId

export default function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173", // Adjust this to match your frontend URL
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);

        // Handle a user joining a space
        socket.on("join-space", (data) => {
            const { spaceId, userId } = data;
            if (!spaceId || !userId) {
                console.log(`Invalid join-space data - userId: ${userId}, spaceId: ${spaceId}, socket: ${socket.id}`);
                return;
            }

            // Associate socket.id with userId
            socketToUser.set(socket.id, userId);
            socket.join(spaceId);
            console.log(`User ${userId} joined space: ${spaceId}`);

            // Initialize space data if it doesn't exist
            if (!spaceUsers.has(spaceId)) {
                spaceUsers.set(spaceId, new Set());
            }
            if (!playerPositions.has(spaceId)) {
                playerPositions.set(spaceId, new Map());
            }

            const users = spaceUsers.get(spaceId);
            const positions = playerPositions.get(spaceId);
            users.add(userId);
            positions.set(userId, { x: 550, y: 350 }); // Default position

            // Notify all clients in the space about the updated user list
            io.to(spaceId).emit("update-users", { users: Array.from(users) });
            // Send initial player positions to the joining client
            socket.emit("init-players", Object.fromEntries(positions));
            console.log(`Users in space ${spaceId}:`, Array.from(users));
        });

        // Handle player movement
        socket.on("move-player", (data) => {
            const { x, y } = data;
            const userId = socketToUser.get(socket.id);
            const spaceId = Array.from(socket.rooms)[1]; // First room is socket.id, second is spaceId

            if (!spaceId || !userId) {
                console.log(`Invalid move-player data - userId: ${userId}, spaceId: ${spaceId}, socket: ${socket.id}`);
                return;
            }

            const positions = playerPositions.get(spaceId);
            if (positions) {
                positions.set(userId, { x, y });
                console.log(`Player ${userId} moved in space ${spaceId}:`, { x, y });
                // Broadcast the movement to all clients in the space
                io.to(spaceId).emit("player-move", { userId, x, y });
            }
        });

        // Handle client disconnection
        socket.on("disconnect", () => {
            const userId = socketToUser.get(socket.id);
            const spaceId = Array.from(socket.rooms)[1];

            if (spaceId && userId) {
                const users = spaceUsers.get(spaceId);
                const positions = playerPositions.get(spaceId);

                if (users) {
                    users.delete(userId);
                    io.to(spaceId).emit("update-users", { users: Array.from(users) });
                    console.log(`User ${userId} disconnected from space ${spaceId}`);
                }
                if (positions) {
                    positions.delete(userId);
                }
            }

            // Clean up the socket mapping
            socketToUser.delete(socket.id);
            console.log("Client disconnected:", socket.id);
        });
    });
}