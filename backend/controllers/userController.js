const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = (req, res) => {
    const { name, email, password } = req.body;
    const checkQuery = `
    SELECT * FROM users
    WHERE email = ?
    `;
    db.query(
        checkQuery,
        [email],
        async (err, result) => {
            if(err){
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if(result.length > 0){
                return res.status(400).json({
                    message: "Email already registered"
                });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = `
            INSERT INTO users(name, email, password)
            VALUES(?, ?, ?)
            `;
            db.query(
                insertQuery,
                [name, email, hashedPassword],
                (err, result) => {
                    if(err){
                        console.log(err);
                        return res.status(500).json({
                            message: "Error inserting user"
                        });
                    }
                    return res.status(201).json({
                        message: "User Registered Successfully"
                    });
                }
            );
        }
    );
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const query = `
    SELECT *
    FROM users
    WHERE email = ?
    `;
    db.query(
        query,
        [email],
        async (err, result) => {
            if(err) {
                console.log(err);
                return res.status(500).json({
                    message: "Database Error"
                });
            }
            if(result.length == 0) {
                return res.status(400).json({
                    message: "User Not Found"
                });
            }
            const storedPassword = result[0].password;
            const isMatch = await bcrypt.compare(password, storedPassword);
            if(!isMatch) {
                return res.status(400).json({
                    message: "Invalid Password"
                });
            }
            const token = jwt.sign(
                {
                    id: result[0].id, 
                    email: result[0].email
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "7d"
                }
            )
            return res.status(200).json({
                message: "Login SuccessFul",
                token: token
            });
        }
    );
}
module.exports = {
    registerUser,
    loginUser
};