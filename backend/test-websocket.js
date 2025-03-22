import { io } from "socket.io-client";

// Simulate two users
const user1 = io("http://localhost:3000", { withCredentials: true });
const user2 = io("http://localhost:3000", { withCredentials: true });

// Space ID to use (replace with a valid spaceId from your database)
const spaceId = "7d751a4e-ce94-4827-83fe-7765a2071d83";

// User 1 setup
user1.on("connect", () => {
    console.log("User 1 connected");

    // User 1 joins the space
    user1.emit("join-space", { spaceId, userId: "1" });

    // User 1 moves after 2 seconds
    setTimeout(() => {
        user1.emit("move-player", { x: 100, y: 200 });
    }, 2000);

    // User 1 disconnects after 5 seconds
    setTimeout(() => {
        user1.disconnect();
    }, 5000);
});

user1.on("update-users", (data) => {
    console.log("User 1 - Users in space:", data.users);
});

user1.on("player-move", (data) => {
    console.log("User 1 - Player moved:", data);
});

user1.on("init-players", (players) => {
    console.log("User 1 - Initial players:", players);
});

user1.on("disconnect", () => {
    console.log("User 1 disconnected");
});

// User 2 setup
user2.on("connect", () => {
    console.log("User 2 connected");

    // User 2 joins the same space after 1 second
    setTimeout(() => {
        user2.emit("join-space", { spaceId, userId: "2" });
    }, 1000);

    // User 2 moves after 3 seconds
    setTimeout(() => {
        user2.emit("move-player", { x: 300, y: 400 });
    }, 3000);

    // User 2 stays connected longer to observe User 1's disconnection
});

user2.on("update-users", (data) => {
    console.log("User 2 - Users in space:", data.users);
});

user2.on("player-move", (data) => {
    console.log("User 2 - Player moved:", data);
});

user2.on("init-players", (players) => {
    console.log("User 2 - Initial players:", players);
});

user2.on("disconnect", () => {
    console.log("User 2 disconnected");
});