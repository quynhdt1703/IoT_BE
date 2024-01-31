const User = require('../model/user');
const Device = require('../model/device');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const { rawListeners } = require('../model/device');

module.exports = {
    login: async (req, res) => {
        console.log(req.body)
        try {
            const user = await User.findByCredentials(req.body.username, req.body.password)
            const token = await user.generateAuthToken()
            res.status(200).send({ user, token })
        } catch (e) {
            res.status(400).send(e)
        }
    },
    getAllUser: async (req, res) => {
        console.log(req.user)
        let users = await User.find();
        if (users)
            res.status(200).send({ users })
        if (users.length === 0)
            res.status(404).send({
                error: "Not found"
            })
    },
    Signup: async (req, res) => {
        try {
            // console.log(req.body)
            if (!req.body.username || !req.body.password) {
                res.status(401).send({
                    error: "Invalid username or password"
                })
            }
            let existedUser = await User.findOne({ username: req.body.username });
            if (existedUser) {
                res.status(401).send({
                    error: "Account exist"
                })
            } else {
                // console.log(req.body)
                const user = new User({
                    ...req.body,
                    _id: new mongoose.Types.ObjectId,
                })
                try {
                    try {
                        await user.save()
                    } catch (e) {
                        console.log(e)
                    }
                    const token = await user.generateAuthToken()
                    res.status(200).json({
                        code: 200,
                        message: 'Get all data user successfully',
                        data: user,
                        token: token
                    })
                } catch (e) {
                    res.status(400).send(e)
                }
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                success: false,
                error: "Internal Server Error!"
            })
        }
    },
    logout: async (req, res) => {
        try {
            req.user.tokens = req.user.tokens.filter((token) => {
                return token.token !== req.token
            })
            await req.user.save()

            res.status(200).send("log out successfully")

        } catch (e) {
            res.status(500).send()
        }
    },
    getUserAndDevices: async (req, res) => {
        try {
            let user = await User.findById(req.params.userId);
            if (!user) {
                res.send({
                    error: "User doesn't exist!"
                })
            } else {
                devices = await Device.find({ userId: req.params.userId })
                res.send({
                    user: user,
                    devices: devices
                })
            }
        } catch (error) {
            res.status(500).send({
                success: false,
                error: "Internal Server Error!"
            })
        }
    },
    getCurrentUser: async (req, res) => {
        try {
            let user = req.user
            res.send(user)
        } catch (error) {
            res.status(500).send({
                success: false,
                error: "Internal Server Error!"
            })
        }
    },
    deleteUser: async (req, res) => {
        try {
            // Lấy userId từ tham số trong URL
            let userId = req.params.userId;
            console.log(req.params);
            // Kiểm tra xem userId có hợp lệ không
            if (!userId) {
                return res.status(400).json({ error: 'Invalid userId' });
            }
            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(userId)
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Kiểm tra quyền của người dùng (ví dụ: chỉ admin mới có quyền xóa người dùng)
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Permission denied' });
            }
            // Xóa người dùng từ cơ sở dữ liệu
            await User.findByIdAndDelete(userId)
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    updateUser: async (req, res) => {
        try {
            let userId = req.params.userId;
            let { newRole } = req.body;

            // Kiểm tra quyền của người thực hiện thao tác (chỉ admin mới có quyền)
            if (req.user.role !== 'admin') {
                return res.status(403).json({ error: 'Permission denied' });
            }

            // Kiểm tra xem userId và newRole có tồn tại không
            if (!userId || !newRole) {
                return res.status(400).json({ error: 'Invalid userId or newRole' });
            }

            // Kiểm tra xem người dùng có tồn tại không
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            // Kiểm tra xem newRole có hợp lệ không (chỉ 'admin' hoặc 'user')
            if (!['admin', 'user'].includes(newRole)) {
                return res.status(400).json({ error: 'Invalid newRole value' });
            }

            // Cập nhật vai trò của người dùng
            user.role = newRole;
            await user.save();

            res.status(200).json({ message: 'Role updated successfully', user });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}
