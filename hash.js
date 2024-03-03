
const bcrypt = require('bcrypt');

// Dummy users data
const users = [
    { user_name: "John Doe", email: "john@example.com", password: "password123" },
    { user_name: "Jane Smith", email: "jane@example.com", password: "abc123" },
    { user_name: "Alice Wonderland", email: "alice@example.com", password: "qwerty" }
];



const saltRounds = 10;

users.forEach(user => {
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        if (err) throw err;
        console.log(user.password)
        user.password = hash;
        console.log(user.password) // Replace plain text password with hashed password
    });
});