import db from "../config/db.js";

export const createSpace = async (req, res) => {
    const { email, spaceName, config = {} } = req.body;
    if (!email || !spaceName) return res.status(400).json({ error: "Email and space name are required" });

    try {
        const ownerResult = await db.query("SELECT id FROM user_credentials WHERE email = $1", [email]);
        if (ownerResult.rows.length === 0) return res.status(404).json({ error: "User not found" });

        const owner_id = ownerResult.rows[0].id;
        const spaceResult = await db.query("INSERT INTO spaces (name, owner_id, config) VALUES ($1, $2, $3) RETURNING *", [spaceName, owner_id, config]);
        await db.query("INSERT INTO user_spaces (user_id, space_id) VALUES ($1, $2)", [owner_id, spaceResult.rows[0].id]);

        res.status(201).json(spaceResult.rows[0]);
    } catch (error) {
        res.status(500).json({ error: "Failed to create space" });
    }
};

export const getUserDashboard = async (req, res) => {
    try {
        const result = await db.query(
            `SELECT u.id AS user_id, u.first_name, u.last_name, s.name AS space_name, s.id AS space_id
             FROM user_credentials u
             LEFT JOIN spaces s ON u.id = s.owner_id
             WHERE u.id = $1`,
            [req.session.userId]
        );

        if (result.rows.length === 0) return res.status(400).json({ message: "User not found or no spaces created yet" });

        const user = { id: result.rows[0].user_id, name: `${result.rows[0].first_name} ${result.rows[0].last_name}` };
        const spaces = result.rows.map(row => ({ spaceId: row.space_id, space_name: row.space_name }));

        res.json({ user, spaces });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};
