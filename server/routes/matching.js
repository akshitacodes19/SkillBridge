const express = require('express');
const router = express.Router();

const User = require('../models/User');
const  auth  = require('../middleware/auth');

// Convert skill name into a standard format
function normalizeSkill(skill) {
    return skill
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}

// Get skill names from user's offered skills
function getOfferedSkills(user) {
    return (user.skillsOffered || []).map(skill =>
        normalizeSkill(skill.name)
    );
}

// Get skill names from user's wanted skills
function getWantedSkills(user) {
    return (user.skillsWanted || []).map(skill =>
        normalizeSkill(skill.name)
    );
}

// Calculate rating score
function getRatingScore(user) {
    const rating = user.ratingAverage || 0;

    // Convert rating out of 5 into percentage
    return Math.min(rating / 5, 1);
}

// Calculate availability similarity
function getAvailabilityScore(currentUser, candidate) {
    if (!currentUser.availability || !candidate.availability) {
        return 0.5;
    }

    let matches = 0;
    let total = 0;

    const availabilityFields = [
        'weekdays',
        'weekends',
        'evenings',
        'mornings'
    ];

    availabilityFields.forEach(field => {
        const userValue = Boolean(currentUser.availability[field]);
        const candidateValue = Boolean(candidate.availability[field]);

        if (userValue || candidateValue) {
            total++;

            if (userValue === candidateValue) {
                matches++;
            }
        }
    });

    if (total === 0) {
        return 0.5;
    }

    return matches / total;
}

// Calculate proficiency score
function getProficiencyScore(user, candidate) {
    const proficiencyValues = {
        Beginner: 1,
        Intermediate: 2,
        Advanced: 3,
        Expert: 4
    };

    const wantedSkills = getWantedSkills(user);
    const candidateSkills = candidate.skillsOffered || [];

    let bestScore = 0;

    for (const wanted of wantedSkills) {
        for (const offered of candidateSkills) {
            if (
                normalizeSkill(offered.name) === wanted
            ) {
                const value =
                    proficiencyValues[offered.proficiency] || 1;

                const score = value / 4;

                bestScore = Math.max(bestScore, score);
            }
        }
    }

    return bestScore;
}

// Calculate skill compatibility
function getSkillCompatibility(currentUser, candidate) {
    const currentUserWants = getWantedSkills(currentUser);
    const currentUserOffers = getOfferedSkills(currentUser);

    const candidateWants = getWantedSkills(candidate);
    const candidateOffers = getOfferedSkills(candidate);

    if (
        currentUserWants.length === 0 ||
        currentUserOffers.length === 0
    ) {
        return 0;
    }

    // Skills current user can learn from candidate
    const learnMatches = currentUserWants.filter(skill =>
        candidateOffers.includes(skill)
    );

    // Skills candidate can learn from current user
    const teachMatches = candidateWants.filter(skill =>
        currentUserOffers.includes(skill)
    );

    // Two-way compatibility is stronger
    const learnScore =
        learnMatches.length / currentUserWants.length;

    const teachScore =
        teachMatches.length / candidateWants.length;

    return (learnScore + teachScore) / 2;
}

// GET /api/matching/recommendations
router.get('/recommendations', auth, async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);

        if (!currentUser) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Get all public users except current user
        const candidates = await User.find({
            _id: { $ne: currentUser._id },
            isPublic: true
        }).select('-password -email');

        const recommendations = candidates
            .map(candidate => {
                const skillScore =
                    getSkillCompatibility(
                        currentUser,
                        candidate
                    );

                const ratingScore =
                    getRatingScore(candidate);

                const availabilityScore =
                    getAvailabilityScore(
                        currentUser,
                        candidate
                    );

                const proficiencyScore =
                    getProficiencyScore(
                        currentUser,
                        candidate
                    );

                // Final weighted score
                const finalScore =
                    (skillScore * 50) +
                    (ratingScore * 20) +
                    (availabilityScore * 15) +
                    (proficiencyScore * 15);

                const currentUserWants =
                    getWantedSkills(currentUser);

                const currentUserOffers =
                    getOfferedSkills(currentUser);

                const candidateOffers =
                    getOfferedSkills(candidate);

                const candidateWants =
                    getWantedSkills(candidate);

                const learnSkills =
                    currentUserWants.filter(skill =>
                        candidateOffers.includes(skill)
                    );

                const teachSkills =
                    candidateWants.filter(skill =>
                        currentUserOffers.includes(skill)
                    );

                return {
                    user: candidate,
                    score: Math.round(finalScore),

                    learnSkills,
                    teachSkills,

                    breakdown: {
                        skillCompatibility:
                            Math.round(skillScore * 100),

                        rating:
                            Math.round(ratingScore * 100),

                        availability:
                            Math.round(availabilityScore * 100),

                        proficiency:
                            Math.round(proficiencyScore * 100)
                    }
                };
            })
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        const limit = Math.min(
            parseInt(req.query.limit) || 10,
            20
        );

        res.json(
            recommendations.slice(0, limit)
        );

    } catch (error) {
        console.error(
            'Recommendation error:',
            error
        );

        res.status(500).json({
            message: 'Failed to generate recommendations'
        });
    }
});

module.exports = router;