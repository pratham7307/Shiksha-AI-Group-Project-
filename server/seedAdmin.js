const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@gmail.com';
        const adminExists = await User.findOne({ email: adminEmail });

        if (adminExists) {
            console.log('Admin already exists. Updating password...');
            adminExists.password = 'Admin123';
            adminExists.role = 'admin';
            adminExists.isApproved = true;
            await adminExists.save();
            console.log('Admin updated successfully.');
        } else {
            await User.create({
                name: 'Super Admin',
                email: adminEmail,
                password: 'Admin123',
                role: 'admin',
                isApproved: true
            });
            console.log('Admin created successfully.');
        }

        mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
