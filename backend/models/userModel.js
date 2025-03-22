// Placeholder for user-related database queries
export const getUserByEmail = async (email) => {
    const result = await db.query("SELECT * FROM user_credentials WHERE email = $1", [email]);
    return result.rows[0];
};