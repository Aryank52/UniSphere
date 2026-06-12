"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClubs = getClubs;
exports.createClub = createClub;
const Club_1 = require("../models/Club");
const User_1 = require("../models/User");
async function getClubs(req, res) {
    try {
        const clubs = await Club_1.Club.findAll({
            where: { status: 'ACTIVE' },
            include: [{ model: User_1.User, as: 'creator', attributes: ['id', 'name', 'email', 'department', 'profileImage', 'role'] }]
        });
        res.status(200).json(clubs);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to retrieve clubs' });
    }
}
async function createClub(req, res) {
    const { name, description, bannerImage } = req.body;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const existing = await Club_1.Club.findOne({ where: { name } });
        if (existing) {
            res.status(400).json({ message: 'Club name already exists' });
            return;
        }
        const newClub = await Club_1.Club.create({
            name,
            description,
            bannerImage: bannerImage || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
            creatorId: req.user.id,
            membersCount: 1,
            status: 'PENDING'
        });
        res.status(201).json(newClub);
    }
    catch (err) {
        res.status(500).json({ message: err.message || 'Failed to propose club' });
    }
}
