const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser()); // Enable cookie parsing




router.post('/register', async (req, res) => {
    const { username, role, email, password, phonenumber } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, role, email, password: hashedPassword, phonenumber });

        await newUser.save();

        const payload = { userId: newUser.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10d' });

        res.status(200).json({ token, message: 'Success' });
    }
    catch (err) {
        console.error(err.message);
        res.json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // const payload = { userId: user.id };
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000,  // 1 day
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Only secure in production
            sameSite: "lax"
        });
        // console.log(req.cookies.token);

        res.json({ message: "Login successful", token });
    } catch (err) {
        console.error(err.message);
        res.json({ message: 'Server error' });
    }
});

// router.post('/login', async (req, res) => {
//     const { email, username, phoneNumber, password } = req.body;

//     try {
//         console.log(req.body);

//         // Find user by email, username, or phone number
//         const user = await User.findOne({
//             $or: [{ email }, { username }, { phoneNumber }]
//         });
//         console.log(phoneNumber, user);

//         if (!user) return res.status(400).json({ message: 'User not found' });

//         // Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//         // Generate JWT token
//         const token = jwt.sign(
//             { id: user._id, role: user.role },
//             process.env.JWT_SECRET,
//             { expiresIn: "1d" }
//         );

//         // Set token in cookies
//         res.cookie('token', token, {
//             maxAge: 24 * 60 * 60 * 1000, // 1 day
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production', // Secure in production
//             sameSite: "lax"
//         });

//         res.json({ message: "Login successful", token });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).json({ message: 'Server error' });
//     }
// });



router.get('/cookie', (req, res) => {
    try {

        let Token = req.cookies.token;
        console.log(Token, req.cookies);
        res.render('index', { token: Token })
    } catch (error) {
        console.error("Error in cookie route:", error.message);
        res.status(500).json({ message: error.message });
    }
});


router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logout successful" });
});


router.post('/sendOTP', async (req, res) => {
    try {


        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = crypto.randomBytes(3).toString('hex');

        const otpExpires = Date.now() + 3600000; // 1 hour
        req.session.otp = otp;

        console.log(req.session.otp, otp);


        req.session.otpExpires = Date.now() + 3600000; // 1 hour

        const mailOptions = {
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send(error.toString());
            }
            res.status(200).send('Success');
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
})



router.post('/resetPassword', async (req, res) => {
    try {
        // Get user's email and OTP from request body
        const { email, otp, newPassword } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP
        if (req.session.otp !== otp) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // Return JWT token and success message
        res.status(200).json({ token, message: 'Success' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

})

module.exports = router;