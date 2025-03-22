import db from "../config/db.js";
import { validate as isUUID } from "uuid"; // Use 'validate' and alias it as 'isUUID'
export const createSpace = async (req, res) => {
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
};

export const joinSpace = async (req, res) => {
    const userId = req.session.userId;
    const { spaceId } = req.body;

    if (!userId || !spaceId) {
        return res.status(400).json({ error: "User ID and Space ID are required" });
    }

    if (!isUUID(spaceId)) {
        return res.status(400).json({ error: "Invalid Space ID format" });
    }

    try {
        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        const checkUser = await db.query(
            "SELECT * FROM user_spaces WHERE user_id = $1 AND space_id = $2::UUID",
            [numericUserId, spaceId]
        );

        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: "User already in this space" });
        }

        await db.query(
            "INSERT INTO user_spaces (user_id, space_id) VALUES ($1, $2::UUID)",
            [numericUserId, spaceId]
        );
        return res.status(200).json({ message: "Successfully joined the space!" });
    } catch (error) {
        console.error("Error joining space:", error);
        return res.status(500).json({ error: "Failed to join space" });
    }
};