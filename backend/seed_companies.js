const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Company = require('./src/models/Company');
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/testdb";

const seed = async () => {
    try {
        console.log("Connecting to:", uri);
        await mongoose.connect(uri);
        console.log("Connected.");

        const count = await Company.countDocuments();
        if (count > 0) {
            console.log("Companies already exist. Skipping seed.");
            process.exit();
        }

        console.log("Seeding companies...");

        // Create Users for Companies
        const companiesData = [
            { name: "TechCorp", email: "recruit@techcorp.com", pass: "password123", location: "San Francisco, CA" },
            { name: "InnovateX", email: "hiring@innovatex.com", pass: "password123", location: "New York, NY" },
            { name: "DevStudio", email: "jobs@devstudio.com", pass: "password123", location: "Austin, TX" }
        ];

        for (const c of companiesData) {
            // Check if user exists
            let user = await User.findOne({ email: c.email });
            if (!user) {
                const hashedPassword = await bcrypt.hash(c.pass, 10);
                user = await User.create({
                    name: c.name,
                    email: c.email,
                    password: hashedPassword,
                    role: 'company'
                });
                console.log(`Created user: ${c.name}`);
            }

            // Create Company Profile
            await Company.create({
                userId: user._id,
                name: c.name,
                description: `We are a leading tech company in ${c.location}.`,
                // location: c.location, // Removed as not in current schema
                website: `https://${c.name.toLowerCase()}.com`,
                verified: true
            });
            console.log(`Created company profile: ${c.name}`);
        }

        console.log("Seeding complete!");
        process.exit();

    } catch (e) {
        console.error("Seed error:", e);
        process.exit(1);
    }
};

seed();
