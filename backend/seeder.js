const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Assignment = require('./models/Assignment');
const Submission = require('./models/Submission');
require('dotenv').config();

async function seed() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to MongoDB for seeding');

        // Clear existing data
        await User.deleteMany({});
        await Assignment.deleteMany({});
        await Submission.deleteMany({});
        console.log('Cleared existing data');

        // Create test users
        const teacherPassword = await bcrypt.hash('teacher123', 10);
        const studentPassword = await bcrypt.hash('student123', 10);

        const teacher = await User.create({
            name: 'John Teacher',
            email: 'teacher@test.com',
            password: teacherPassword,
            role: 'teacher'
        });

        const student1 = await User.create({
            name: 'Alice Student',
            email: 'alice@test.com',
            password: studentPassword,
            role: 'student'
        });

        const student2 = await User.create({
            name: 'Bob Student',
            email: 'bob@test.com',
            password: studentPassword,
            role: 'student'
        });

        console.log('Created test users:');
        console.log('Teacher: teacher@test.com / teacher123');
        console.log('Student 1: alice@test.com / student123');
        console.log('Student 2: bob@test.com / student123');

        // Create test assignments
        const assignment1 = await Assignment.create({
            title: 'JavaScript Fundamentals',
            description: 'Write a function that calculates the factorial of a number',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            status: 'Published',
            createdBy: teacher._id
        });

        const assignment2 = await Assignment.create({
            title: 'React Components',
            description: 'Create a simple React component that displays a list of items',
            dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            status: 'Draft',
            createdBy: teacher._id
        });

        const assignment3 = await Assignment.create({
            title: 'Database Design',
            description: 'Design a database schema for a library management system',
            dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            status: 'Completed',
            createdBy: teacher._id
        });

        console.log('Created test assignments:');
        console.log('- JavaScript Fundamentals (Published)');
        console.log('- React Components (Draft)');
        console.log('- Database Design (Completed)');

        // Create test submissions
        await Submission.create({
            assignmentId: assignment1._id,
            studentId: student1._id,
            answer: 'function factorial(n) { return n <= 1 ? 1 : n * factorial(n - 1); }'
        });

        await Submission.create({
            assignmentId: assignment3._id,
            studentId: student1._id,
            answer: 'I designed a library system with tables for books, authors, members, and transactions.',
            reviewed: true
        });

        await Submission.create({
            assignmentId: assignment3._id,
            studentId: student2._id,
            answer: 'My library database includes entities for books, users, borrowing records, and categories.'
        });

        console.log('Created test submissions');
        console.log('✅ Seeding completed successfully!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error.message);
        process.exit(1);
    }
}

seed();