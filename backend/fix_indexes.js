const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const fixIndexes = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internship_portal';
        console.log('Connecting to:', uri);
        await mongoose.connect(uri);
        console.log('Connected to database.');

        const db = mongoose.connection.db;
        const collection = db.collection('roles');

        console.log('Checking indexes on "roles" collection...');
        const indexes = await collection.indexes();
        console.log('Current indexes:', indexes.map(idx => idx.name));

        const slugIndexExists = indexes.some(idx => idx.name === 'slug_1');

        if (slugIndexExists) {
            console.log('Found stray index "slug_1". Dropping it...');
            await collection.dropIndex('slug_1');
            console.log('Index "slug_1" dropped successfully.');
        } else {
            console.log('No "slug_1" index found. Nothing to do.');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error fixing indexes:', error);
        process.exit(1);
    }
};

fixIndexes();
