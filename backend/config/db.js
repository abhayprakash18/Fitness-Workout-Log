const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri || !mongoUri.startsWith('mongodb')) {
    console.error('MongoDB Connection Error: MONGO_URI is missing or invalid in backend/.env');
    process.exit(1);
  }

  const credentials = mongoUri.match(/^mongodb(?:\+srv)?:\/\/([^:]+):([^@]*)@/);
  if (!credentials || !credentials[2]) {
    console.error('MongoDB Connection Error: Add the MongoDB Atlas database password to MONGO_URI in backend/.env');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
