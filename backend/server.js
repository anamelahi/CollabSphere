import express from "express"
import pg from "pg"
import bodyParser from "body-parser";
import cors from "cors"
import bcrypt from "bcrypt"
import passport from "passport";
import { Strategy } from "passport-local";
import session from "express-session";
import authMiddleware from "./middlewares/authMiddleware.js";
import env from "dotenv"



const app = express();
const port = 3000;
const saltRounds = 10;
env.config();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: process.env.DATABASE_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
})
db.connect();
app.use(session({
    secret: 'SECRET',
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 24*60*60*1000,
    }
}))
app.use(passport.initialize());


app.post("/register", async(req,res)=>{
    const fName = req.body.fName;
    const lName = req.body.lName;
    const email = req.body.email;
    const pass = req.body.password;
    try {
        const hashedPassword = await bcrypt.hash(pass, saltRounds);
        let query = await db.query("INSERT INTO user_credentials (first_name, last_name, email, password) VALUES ($1,$2,$3,$4) RETURNING id",[fName,lName,email,hashedPassword])
        res.json({message: "User created successfully"});
        console.log(query.rows[0]);
    } catch (error) {
        res.json({message: "Error hashing password"});
    }
})
app.post("/login",async(req,res)=>{
    const email = req.body.email;
    const pass = req.body.password;
    try {
        let query = await db.query("SELECT * FROM user_credentials WHERE email = $1",[email]);

        if(query.rows.length === 0){
            return res.status(400).json({message: "User not found"});
        }

        const user = query.rows[0];
        const isPasswordValid =await bcrypt.compare(pass,user.password);

        if(!isPasswordValid){
           return res.status(400).json({message:"INVALID PASSWORD"});
        }

        req.session.userId = user.id; //set session

        return res.json({message: "User logged in successfully", userId:user.id});
    } catch (error) {
        return res.json({message: "Invalid email"});
    }
})

app.post("/logout", (req,res)=>{
    req.session.destroy((error)=>{
        if(error){
            res.status(500).json({message:"Logout Failed."})
        }
        res.clearCookie("connect.sid");
        res.json({message:"logged out successful"})
    });
});

app.post("/api/spaces", async (req, res) => {
    const { email, spaceName, config } = req.body; // Extract email here

    if (!email || !spaceName) {
        return res.status(400).json({ error: "Email and space name are required" });
    }

    try {
        const ownerResult = await db.query("SELECT id FROM user_credentials WHERE email = $1", [email]);

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const owner_id = ownerResult.rows[0].id;

        // Insert space into the database
        const spaceResult = await db.query(
            "INSERT INTO spaces (name, owner_id, config) VALUES ($1, $2, $3) RETURNING *",
            [spaceName, owner_id, config || {}]
        );

        const space = spaceResult.rows[0];

        // Add entry in `user_spaces` table
        await db.query("INSERT INTO user_spaces (user_id, space_id) VALUES ($1, $2)", [owner_id, space.id]);

        // res.json({space:spaceResult.rows[0]});
        res.status(201).json(space);
    } catch (error) {
        console.error("Error creating space:", error);
        res.status(500).json({ error: "Failed to create space" });
    }
});



app.get('/dashboard', authMiddleware ,async(req,res)=>{
    try {
        const user = await db.query("SELECT id, first_name, last_name, email FROM user_credentials WHERE id = $1",[req.session.userId]);
        const spaces = await db.query("SELECT name,owner_id FROM spaces WHERE owner_id = $1",[req.session.userId]);
        if(user.rows.length === 0){
            return res.status(400).json({message:"User not found"});
        }
        if (spaces.rows.length === 0) {
            return res.json({message:"NO SPACES CREATED YET"})
        }
        
        res.json({user:user.rows[0], spaces:spaces.rows});
        // console.log(user.rows[0]);
        
    } catch (error) {
        return res.status(500).json({message:"Error fetching user"})
    }
})
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})