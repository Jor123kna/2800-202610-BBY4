require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/users');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to database');

        // clear existing users
        await User.deleteMany();

        // create users
        await User.create([
            {
                name: 'Admin User',
                email: 'admin@routerelief.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'John Survivor',
                email: 'john@gmail.com',
                password: 'john123',
                role: 'helper'
            },
            {
                name: 'Sarah Responder',
                email: 'sarah@gmail.com',
                password: 'sarah123',
                role: 'in-need'
            }
        ]);

        console.log('Users seeded successfully');
        mongoose.disconnect();
    })
    .catch((err) => console.log('Error', err));