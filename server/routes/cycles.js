const express = require('express');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

// Normalize skill names
function normalizeSkill(skill) {
    return skill
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

// Get offered skills
function getOfferedSkills(user) {
    return (user.skillsOffered || []).map(skill =>
        normalizeSkill(skill.name)
    );
}

// Get wanted skills
function getWantedSkills(user) {
    return (user.skillsWanted || []).map(skill =>
        normalizeSkill(skill.name)
    );
}

// Check whether user A can learn something from user B
function canLearnFrom(userA, userB) {
    const wanted = getWantedSkills(userA);
    const offered = getOfferedSkills(userB);

    return wanted.some(skill =>
        offered.includes(skill)
    );
}

// Get matching skills between two users
function getMatchingSkills(userA, userB) {
    const wanted = getWantedSkills(userA);
    const offered = getOfferedSkills(userB);

    return wanted.filter(skill =>
        offered.includes(skill)
    );
}

/*
    GET /api/cycles

    Finds multi-user skill exchange cycles.

    Example:

    User A wants Python
    User B offers Python and wants React
    User C offers React and wants JavaScript
    User A offers JavaScript

    Cycle:

    A → B → C → A
*/

router.get('/', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Get all public users except current user
        const users = await User.find({
            _id: { $ne: currentUser._id },
            isPublic: true
        }).select('-password -email');

        const allUsers = [
            currentUser,
            ...users
        ];

        const cycles = [];

        /*
            We search for cycles of exactly 3 people.

            A → B
            B → C
            C → A

            This keeps the algorithm simple and
            understandable for an interview.
        */

        for (let i = 0; i < allUsers.length; i++) {
            const userA = allUsers[i];

            for (let j = 0; j < allUsers.length; j++) {
                const userB = allUsers[j];

                if (
                    userA._id.toString() ===
                    userB._id.toString()
                ) {
                    continue;
                }

                // A must be able to learn from B
                if (!canLearnFrom(userA, userB)) {
                    continue;
                }

                for (let k = 0; k < allUsers.length; k++) {
                    const userC = allUsers[k];

                    // Users must be different
                    if (
                        userC._id.toString() ===
                        userA._id.toString() ||
                        userC._id.toString() ===
                        userB._id.toString()
                    ) {
                        continue;
                    }

                    // B must be able to learn from C
                    if (!canLearnFrom(userB, userC)) {
                        continue;
                    }

                    // C must be able to learn from A
                    if (!canLearnFrom(userC, userA)) {
                        continue;
                    }

                    const aToB = getMatchingSkills(
                        userA,
                        userB
                    );

                    const bToC = getMatchingSkills(
                        userB,
                        userC
                    );

                    const cToA = getMatchingSkills(
                        userC,
                        userA
                    );

                    /*
                        We only want cycles that contain
                        the currently logged-in user.
                    */
                    const containsCurrentUser =
                        userA._id.toString() ===
                            currentUser._id.toString() ||
                        userB._id.toString() ===
                            currentUser._id.toString() ||
                        userC._id.toString() ===
                            currentUser._id.toString();

                    if (!containsCurrentUser) {
                        continue;
                    }

                    /*
                        Prevent duplicate cycles.

                        We create a sorted ID combination
                        so A-B-C and B-C-A aren't returned
                        as separate cycles.
                    */
                    const ids = [
                        userA._id.toString(),
                        userB._id.toString(),
                        userC._id.toString()
                    ].sort();

                    const cycleKey = ids.join('-');

                    const alreadyExists = cycles.some(
                        cycle =>
                            cycle.cycleKey === cycleKey
                    );

                    if (alreadyExists) {
                        continue;
                    }

                    cycles.push({
                        cycleKey,

                        users: [
                            {
                                _id: userA._id,
                                name: userA.name,
                                profilePhoto:
                                    userA.profilePhoto
                            },
                            {
                                _id: userB._id,
                                name: userB.name,
                                profilePhoto:
                                    userB.profilePhoto
                            },
                            {
                                _id: userC._id,
                                name: userC.name,
                                profilePhoto:
                                    userC.profilePhoto
                            }
                        ],

                        exchanges: [
                            {
                                from: userA.name,
                                to: userB.name,
                                skills: aToB
                            },
                            {
                                from: userB.name,
                                to: userC.name,
                                skills: bToC
                            },
                            {
                                from: userC.name,
                                to: userA.name,
                                skills: cToA
                            }
                        ]
                    });
                }
            }
        }

        /*
            Limit results so the response doesn't become
            unnecessarily large.
        */
        const limit = Math.min(
            parseInt(req.query.limit) || 10,
            20
        );

        res.json(
            cycles.slice(0, limit)
        );

    } catch (error) {
        console.error(
            'Cycle matching error:',
            error
        );

        res.status(500).json({
            message:
                'Failed to find skill exchange cycles'
        });
    }
});

module.exports = router;