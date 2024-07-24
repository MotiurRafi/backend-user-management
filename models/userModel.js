const db = require('../config/db')

class User {
    constructor(user) {
        this.name = user.name
        this.email = user.email
        this.pass = user.pass
        this.status = user.status
        this.last_login = user.last_login
        this.reg_time = user.reg_time
    }

    static createUser(nUser, result) {
        db.query('INSERT INTO users SET ?', nUser, (err, res) => {
            if (err) {
                console.log('Error:', err);
                return result(err, null);
            }
            console.log('Created User:', { id: res.insertId, ...nUser });
            result(null, { id: res.insertId, ...nUser });
        })
    }

    static getUserById(uId, result) {
        db.query('SELECT * FROM users WHERE id = ?', uId, (err, res) => {
            if (err) {
                console.log('Error finding user using id:', err);
                return result(err, null)
            }
            if (res.length) {
                console.log('User found')
                return result(null, res)
            }
            console.log('No user found')
            result({ kind: 'Not Found' }, null)
        })
    }
    static getUserByEmail(uEmail, result) {
        db.query('SELECT * FROM users WHERE email = ?', uEmail, (err, res) => {
            if (err) {
                console.log('Error finding user using email:', err);
                return result(err, null);
            }
            if (res.length) {
                console.log('User found');
                return result(null, res)
            }
            console.log('No user - found')
            result({ kind: 'Not Found' }, null)
        })
    }
    static getAllUser(result) {
        db.query('SELECT  id, name, email, last_login, status  FROM users', (err, res) => {
            if (err) {
                console.log('Error finding users:', err);
                return result(err, null)
            }
            if (res.length) {
                console.log('Users found')
                return result(null, res)
            }
            console.log('No user Found')
            result({ kind: 'Not Found' }, null)
        })
    }
    static updateLastLoginTimeById(uId, result) {
        db.query('UPDATE users SET last_login = ? WHERE id = ?', [new Date(), uId], (err, res) => {
            if (err) {
                console.log('Error updating last login time:', err);
                return result(err, null)
            }
            console.log('Last login time updated')
            result(null, res)
        })
    }
    static updateUsersStatusByIds(uIds, status, result) {
        db.query('UPDATE users SET status = ? WHERE id IN (?)', [status, uIds], (err, res) => {
            if (err) {
                console.error('Error updating status:', err);
                return result(err, null);
            }
            if (res.affectedRows > 0) {
                console.log('Updated user status successfully');
                return result(null, {message: "Updated user status successfully"});
            }
            console.log('No users updated');
            result({ kind: 'Not Found' }, null);
        });
    }
    

    static deleteUsersByIds(uIds, result) {
        db.query('DELETE FROM users WHERE id IN (?)', [uIds], (err, res) => {
            if (err) {
                console.log('Error deleting user:', err);
                return result(err, null)
            }
            if (res.affectedRows) {
                console.log('Deleted user successfully');
                return result(null, "Deleted user successfully");
            }
            console.log('No user found')
            result({ kind: 'Not Found' }, null)
        })

    }
}
module.exports = User