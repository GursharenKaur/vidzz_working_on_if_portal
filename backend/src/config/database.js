const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/internship_portal', {
      // These options are no longer needed in Mongoose 6+, but keeping them doesn't hurt usually. 
      // However, to be clean and modern with Mongoose 7 (as per package.json), we can remove them if we want, 
      // but for safety I will omit them as defaults are good in v6+.
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
