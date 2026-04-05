import db from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runFullMigration() {
    try {
        console.log('🚀 Starting Master Migration for all 7 tables...');

        // 1. ECO QUOTES
        const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'eco-quotes.json'), 'utf8'));
        for (let q of quotes) {
            await db.query('INSERT IGNORE INTO eco_quotes (id, quote, author) VALUES (?, ?, ?)', [q.id, q.quote, q.author]);
        }
        console.log('✅ 1. Quotes migrated!');

        // 2. WASTE CATEGORIES
        const waste = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'waste-categories.json'), 'utf8'));
        for (let w of waste) {
            await db.query(
                `INSERT IGNORE INTO waste_categories (id, name, icon, color, description, examples, disposalInstructions, recyclable, environmentalImpact) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [w.id, w.name, w.icon, w.color, w.description, JSON.stringify(w.examples), w.disposalInstructions, w.recyclable ? 1 : 0, w.environmentalImpact]
            );
        }
        console.log('✅ 2. Waste Categories migrated!');

        // 3. RECYCLING CENTERS
        const centers = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'recycling-centers.json'), 'utf8'));
        for (let c of centers) {
            await db.query(
                `INSERT IGNORE INTO recycling_centers (id, name, address, latitude, longitude, phone, email, acceptedWaste, operatingHours) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [c.id, c.name, c.address, c.latitude, c.longitude, c.phone, c.email, JSON.stringify(c.acceptedWaste), c.operatingHours]
            );
        }
        console.log('✅ 3. Recycling Centers migrated!');

        // 4 & 5. USERS & ACTIVITIES (Nested Logic)
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf8'));
        for (let u of users) {
            await db.query(
                `INSERT IGNORE INTO users (id, fullName, email, password, role, rewardPoints, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [u.id, u.fullName, u.email, u.password, u.role, u.rewardPoints, u.createdAt]
            );

            if (u.recyclingHistory) {
                for (let act of u.recyclingHistory) {
                    await db.query(
                        `INSERT IGNORE INTO activities (id, userId, wasteType, quantity, centerId, pointsEarned, date) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                        [act.id, u.id, act.wasteType, act.quantity, act.centerId, act.pointsEarned, act.date]
                    );
                }
            }
        }
        console.log('✅ 4 & 5. Users and Activities migrated!');

        // 6. REWARDS
        const rewards = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'rewards.json'), 'utf8'));
        for (let r of rewards) {
            await db.query(
                `INSERT IGNORE INTO rewards (id, userId, activityId, points, type, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [r.id, r.userId, r.activityId, r.points, r.type, r.description, r.createdAt]
            );
        }
        console.log('✅ 6. Rewards migrated!');

        // 7. FEEDBACK (Updated with your exact Navicat columns)
        if (fs.existsSync(path.join(__dirname, 'data', 'feedback.json'))) {
            const feedback = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'feedback.json'), 'utf8'));
            for (let f of feedback) {
                await db.query(
                    `INSERT IGNORE INTO feedback (id, userId, userName, type, message, rating, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [f.id, f.userId, f.userName, f.type, f.message, f.rating, f.createdAt]
                );
            }
        }
        console.log('✅ 7. Feedback migrated!');

        console.log('\n✨ ALL 7 TABLES SUCCESSFULLY MOVED TO NAVICAT! ✨');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Error:', err);
        process.exit(1);
    }
}

runFullMigration();