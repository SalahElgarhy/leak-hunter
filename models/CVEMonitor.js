const mongoose = require('mongoose');

const cveSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Content: { type: String, required: true }, // نعدّل content إلى Content
    Published: { type: String, required: true }, // نعدّل published إلى Published
    Description: { type: String, required: true }, // نعدّل description إلى Description
    Severity: { type: String, required: true }, // نعدّل severity إلى Severity
    "Detection Date": { type: String, required: true }, // نعدّل detectionDate إلى Detection Date
    Type: { type: String, required: true }, // نعدّل type إلى Type
});

const CVE = mongoose.model('CVE', cveSchema, 'CVE'); // نتأكد من اسم الـ collection

module.exports = CVE;   