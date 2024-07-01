const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const useragent = require('express-useragent');
const requestIp = require('request-ip');
const {OTP}=require('./otpSchema');
const {sendOTP}=require('./mailer')
const cors = require('cors');

const app = express();
app.use(
    cors({
      credentials: true,
      origin: "http://192.168.33.5:3000",
    })
);
app.use(bodyParser.json());
app.use(useragent.express());
app.use(requestIp.mw());  
// Replace the following with your MongoDB Atlas connection string
const mongoURI = 'mongodb+srv://jainamparekh1104:FMOrTDF2oRGvdBQM@cluster0.jjfdbso.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// MongoDB connection
mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// User Schema
const loginSchema = new mongoose.Schema({
    ip: String,
    browser: String,
    os: String,
    device: String,
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    logins: [loginSchema]
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
    }
    next();
});

userSchema.methods.comparePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

// Register endpoint
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).send('User created successfully!');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

function extractIPv4(ip) {
    if (ip.includes('::ffff:')) {
        return ip.split('::ffff:')[1];
    }
    return ip;
}
// Login endpoint
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).send('Authentication failed');
        }
        const rawIp = req.clientIp;
        const ip=extractIPv4(rawIp);
        const ua = req.useragent;
        const loginInfo = {
            ip: ip,
            browser: ua.browser,
            os: ua.os,
            device: ua.isDesktop ? 'Desktop' : ua.isMobile ? 'Mobile' : 'Tablet'
        };

        user.logins.push(loginInfo);
        await user.save();
        const allowedStartHour = 10; // 10 AM
        const allowedEndHour = 13; // 1 PM (13 in 24-hour format)
        // Get the current time in the user's local timezone (assuming server in the same timezone)
        const currentTime = new Date();
        const currentHour = currentTime.getHours();
        if(loginInfo.device==='Mobile' || loginInfo.device==='Tablet'){
            if (currentHour < allowedStartHour || currentHour >= allowedEndHour) {
                return res.status(403).send({
                    message: "You cannot access from mobile or tablet outside of 10 AM to 1 PM."
                });
            }
        }
        res.status(200).json({ message: 'Login successful',info:loginInfo});
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message);
    }
});

app.post("/getHistory",async(req,res)=>{
    const email=req.body.email;
    console.log(email);
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // If no user is found, send a 404 Not Found status
            return res.status(404).send('User not found');
        }
        // Send the login history if the user is found
        res.json(user.logins);
    } catch (error) {
        console.error('Failed to fetch user:', error);
        res.status(500).send('Internal Server Error');
    }

})

app.post('/send-otp', async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Set expiry 10 minutes from now
    await OTP.create({ email, otp, expiresAt });
    await sendOTP(email, otp);
    res.send({ message: 'OTP sent to your email' });
});
  
  // Verify OTP
app.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  const foundOTP = await OTP.findOne({ email, otp });

  if (!foundOTP) {
    return res.status(400).send({ message: 'OTP is incorrect' });
  }

  if (new Date() > foundOTP.expiresAt) {
    return res.status(400).send({ message: 'OTP has expired' });
  }

  // Optionally delete OTP after use
  await OTP.deleteOne({ _id: foundOTP._id });

  res.send({ message: '1' });
});

app.get("/hello",async(req,res)=>{
    res.send("hello world");
})
  
// Server setup
const PORT = 4000;
app.listen(PORT,'192.168.33.5',() => {
    console.log(`Server running on ${PORT}`);
});
