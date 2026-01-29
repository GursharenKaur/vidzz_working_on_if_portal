const mongoose = require('mongoose');
const Company = require('./src/models/Company');
require('dotenv').config();

const uri = process.env.MONGO_URI || "mongodb://localhost:27017/internship_portal"; // Fallback

const checkCompanies = async () => {
    try {
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected to DB");
        const companies = await Company.find();
        console.log(`Found ${companies.length} companies:`);
        companies.forEach(c => console.log(`- ${c.name} (ID: ${c._id})`));
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkCompanies();
