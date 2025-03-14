const players = {};

export const setupSocket = (io) => {
    io.on("connection", (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("new-player", (playerData) => {
            players[socket.id] = playerData;
            io.emit("update-players", players);
        });

        socket.on("player-move", (movementData) => {
            if (players[socket.id]) {
                players[socket.id].x = movementData.x;
                players[socket.id].y = movementData.y;
                io.emit("update-players", players);
            }
        });

        socket.on("disconnect", () => {
            delete players[socket.id];
            io.emit("update-players", players);
        });
    });
};
