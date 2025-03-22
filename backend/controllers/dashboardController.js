import db from "../config/db.js";

export const getDashboard = async (req, res) => {
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

        const user = {
            userId: result.rows[0].user_id,
            name: `${result.rows[0].first_name} ${result.rows[0].last_name}`,
            email: result.rows[0].email,
        };

        const spaces = result.rows
            .filter((row) => row.space_id !== null)
            .map((row) => ({
                spaceId: row.space_id,
                spaceName: row.space_name,
                ownerName: `${row.owner_first_name} ${row.owner_last_name}`,
            }));

        res.json({ user, spaces });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};