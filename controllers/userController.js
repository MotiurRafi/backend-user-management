const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    User.getUserByEmail(email, (err, data) => {
        if (err) {
            if (err.kind === "Not Found") {
                // Hash password if user is not found
                bcrypt.hash(password, 5, (err, hashedPassword) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error hashing password', error: err });
                    }
                    const newUser = {
                        name,
                        email,
                        password: hashedPassword,
                        registration_time: new Date(),
                        status: 'active'
                    };

                    // Create user with hashed password
                    User.createUser(newUser, (err, user) => {
                        if (err) {
                            return res.status(500).json({ message: 'Error creating new user', error: err });
                        }
                        res.status(201).json({ message: 'Created user successfully' });
                    });
                });
            } else {
                // Handle other errors when retrieving user
                return res.status(500).json({ message: 'Error retrieving user with email', error: err });
            }
        } else if (data.length > 0) {
            // Respond if user with the given email already exists
            return res.status(400).json({ message: 'Email already in use. Please use a different email.' });
        } else {
            // Hash password if user is not found
            bcrypt.hash(password, 5, (err, hashedPassword) => {
                if (err) {
                    return res.status(500).json({ message: 'Error hashing password', error: err });
                }
                const newUser = {
                    name,
                    email,
                    password: hashedPassword,
                    registration_time: new Date(),
                    status: 'active'
                };

                // Create user with hashed password
                User.createUser(newUser, (err, user) => {
                    if (err) {
                        return res.status(500).json({ message: 'Error creating new user', error: err });
                    }
                    res.status(201).json({ message: 'Created user successfully' });
                });
            });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.getUserByEmail(email, (err, user) => {
        if (err) {
            return res.status(500).json('Error');
        }
        if (!user || user.length === 0) {
            return res.status(404).json('User not found');
        }
        if (user[0].status === 'blocked') {
            return res.status(403).json({ message: 'User is blocked' });
        }
        bcrypt.compare(password, user[0].password, (err, result) => {
            if (err || !result) {
                return res.status(401).json('Invalid password');
            }

            const token = jwt.sign({ id: user[0].id }, 'secret_key', { expiresIn: '1h' });

            User.updateLastLoginTimeById(user[0].id, (err, data) => {
                if (err) {
                    return res.status(500).json('Error updating last login time');
                }
                res.status(200).json({ token, id: user[0].id });
            });
        });
    });
};


exports.getAllUser = (req, res) => {
    User.getAllUser((err, users) => {
        if (err) {
            return res.status(500).json('Error getting users')
        }
        res.status(200).json(users)
    })
}

exports.updateUserStatus = (req, res) => {
    const { userIds, status } = req.body;

    User.updateUsersStatusByIds(userIds, status, (err, data) => {
        if (err) {
            if (err.kind === 'Not Found') {
                return res.status(404).json('User not Found')
            }
            return res.status(500).json('Error updating user status')
        }
        res.status(200).json('Updated user-users status successfully')
    })
}

exports.deleteUsers = (req, res) => {
    const { userIds } = req.body;
    console.log(userIds)
    User.deleteUsersByIds(userIds, (err, data) => {
        if (err) {
            if (err.kind === "Not Found") {
                return res.status(404).json('User not found')
            }
            return res.status(500).json('Error deleting users');
        }
        res.status(200).json('Deleted user-users successfully')
    })
}