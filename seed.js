require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/users');
const Location = require('./models/locations');
const Post = require('./models/posts');

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to database');

        // Clear existing data
        await User.deleteMany();
        await Location.deleteMany();
        await Post.deleteMany();
        console.log('Cleared existing data');

        // Create 3 sample users
        const users = await User.create([
            {
                name: 'Admin User',
                email: 'admin@routerelief.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'John Lee',
                email: 'john@gmail.com',
                password: 'john123',
                role: 'in-need'
            },
            {
                name: 'Sarah Chen',
                email: 'sarah@gmail.com',
                password: 'sarah123',
                role: 'helper'
            }
        ]);
        console.log('Users seeded');

        // Create 5 Vancouver food locations
        const locations = await Location.create([
            {
                name: 'Greater Vancouver Food Bank',
                address: '1234 Main St, Vancouver, BC',
                lat: 49.2588,
                lng: -123.1009,
                type: 'food bank',
                status: 'open',
                hours: 'Mon-Fri 9am-5pm',
                phone: '604-876-3601',
                updatedBy: users[2]._id
            },
            {
                name: 'Carnegie Community Centre',
                address: '401 Main St, Vancouver, BC',
                lat: 49.2799,
                lng: -123.0993,
                type: 'community kitchen',
                status: 'open',
                hours: 'Daily 8am-11pm',
                phone: '604-665-2289',
                updatedBy: users[2]._id
            },
            {
                name: 'Union Gospel Mission',
                address: '616 East Hastings St, Vancouver, BC',
                lat: 49.2820,
                lng: -123.0864,
                type: 'shelter',
                status: 'open',
                hours: 'Daily 24 hours',
                phone: '604-253-3323',
                updatedBy: users[2]._id
            },
            {
                name: 'Mount Pleasant Community Fridge',
                address: '1 Kingsway, Vancouver, BC',
                lat: 49.2622,
                lng: -123.1017,
                type: 'community fridge',
                status: 'limited',
                hours: 'Daily 24 hours',
                phone: null,
                updatedBy: users[2]._id
            },
            {
                name: 'Strathcona Community Fridge',
                address: '601 Keefer St, Vancouver, BC',
                lat: 49.2793,
                lng: -123.0900,
                type: 'community fridge',
                status: 'open',
                hours: 'Daily 24 hours',
                phone: null,
                updatedBy: users[2]._id
            }
        ]);
        console.log('Locations seeded');

        // Create 3 blog posts
        const posts = await Post.create([
            {
                author: users[1]._id,
                content: 'I am located near Main St and need food for my family of 4. Can anyone help?',
                title: 'Room for four',
                neighbourhood: 'Mount Pleasant'
            },
            {
                author: users[2]._id,
                content: 'We have extra food supplies at Union Gospel Mission today. Come before 6pm!',
                title: 'Extra food',
                neighbourhood: 'Hastings'
            },
            {
                author: users[1]._id,
                content: 'The community fridge on Kingsway is running low. Responders please restock!',
                title: 'Low fridge stock',
                neighbourhood: 'Kingsway'
            }
        ]);
        console.log('Posts seeded');

        console.log('All seed data inserted successfully');
        mongoose.disconnect();
    })
    .catch((err) => {
        console.log('Seed error', err);
        mongoose.disconnect();
    });