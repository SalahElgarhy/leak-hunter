const express = require('express');
const mongoose = require('mongoose');
const validator = require('validator');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// استيراد النماذج
const Breach = require('./models/breachModel');
const Monitor = require('./models/monitorModel');
const CVE = require('./models/CVEMonitor');

// إعداد التطبيق
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());  // لتحليل بيانات JSON

// اتصال MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

// API Route للبحث عن التسريبات باستخدام الدومين
app.get('/api/breaches/domain/:domain', async (req, res) => {
    const { domain } = req.params;

    if (!domain || domain.trim() === '') {
        return res.status(400).json({ message: 'Domain parameter is required' });
    }

    try {
        const breaches = await Breach.find({ domain: domain }).select('username password');

        if (breaches.length === 0) {
            return res.status(404).json({ message: 'No breaches found for this domain' });
        }

        const leakedData = breaches.map(breach => ({
            email: breach.username,
            password: breach.password
        }));

        res.status(200).json(leakedData);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// API Route للبحث عن التسريبات باستخدام البريد الإلكتروني
app.get('/api/breaches/:email', async (req, res) => {
    const { email } = req.params;

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const breaches = await Breach.find({ username: email }).select('username password');
        if (breaches.length === 0) {
            return res.status(404).json({ message: 'No breaches found for this email' });
        }

        const leakedData = breaches.map(breach => ({
            email: breach.username,
            password: breach.password
        }));

        res.status(200).json(leakedData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// API للحصول على آخر التسريبات
app.get('/api/latest-breaches', async (req, res) => {
    try {
        const breaches = await Monitor.find({}).sort({ "Detection Date": -1 }).limit(20);
        res.status(200).json(breaches);
    } catch (err) {
        console.error('Error fetching latest breaches:', err.message);
        res.status(500).json({ message: 'Internal server error while fetching breaches.' });
    }
});

// API للحصول على بيانات CVE مع دعم البحث
app.get('/cve-data', async (req, res) => {
    const { search } = req.query;
    let query = {};

    if (search) {
        query = {
            $or: [
                { Title: { $regex: search, $options: 'i' } },
                { Description: { $regex: search, $options: 'i' } },
                { Type: { $regex: search, $options: 'i' } }
            ]
        };
    }

    try {
        const cves = await CVE.find(query).limit(20);
        if (!cves || cves.length === 0) {
            return res.status(200).json([]); // رجّع array فاضية
        }
        res.status(200).json(cves);
    } catch (err) {
        console.error('Error fetching CVE data:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// خدمة الملفات الثابتة (HTML, CSS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// الاستماع على المنفذ المحدد
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});




