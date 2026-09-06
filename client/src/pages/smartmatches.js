import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Star,
    Clock,
    BookOpen,
    Users,
    ArrowRight,
    RefreshCw
} from 'lucide-react';

import api from '../config/api';

const SmartMatches = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get(
                '/matching/recommendations?limit=10'
            );

            setRecommendations(response.data);

        } catch (err) {
            console.error(err);

            setError(
                err.response?.data?.message ||
                'Failed to load recommendations'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw
                        className="animate-spin mx-auto mb-3"
                        size={32}
                    />

                    <p>
                        Finding your best skill matches...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">

                {/* Header */}
                <div className="flex items-center justify-between mb-8">

                    <div>
                        <div className="flex items-center gap-3">
                            <Sparkles
                                size={32}
                                className="text-purple-600"
                            />

                            <h1 className="text-3xl font-bold">
                                Smart Matches
                            </h1>
                        </div>

                        <p className="text-gray-600 mt-2">
                            Discover people who are a great
                            match for your skills and goals.
                        </p>
                    </div>

                    <button
                        onClick={fetchRecommendations}
                        className="flex items-center gap-2 px-4 py-2
                                   bg-white border rounded-lg
                                   hover:bg-gray-100"
                    >
                        <RefreshCw size={17} />
                        Refresh
                    </button>

                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-700
                                    p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* No recommendations */}
                {!error &&
                    recommendations.length === 0 && (
                        <div className="bg-white rounded-xl
                                        shadow-sm p-10 text-center">

                            <Users
                                size={48}
                                className="mx-auto mb-4
                                           text-gray-400"
                            />

                            <h2 className="text-xl font-semibold">
                                No matches yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Add more skills to your profile
                                to get better recommendations.
                            </p>

                            <Link
                                to="/profile"
                                className="inline-block mt-5
                                           px-5 py-2 bg-blue-600
                                           text-white rounded-lg"
                            >
                                Update Profile
                            </Link>

                        </div>
                    )}

                {/* Recommendation cards */}
                <div className="grid gap-6">

                    {recommendations.map(
                        (recommendation) => {

                            const user =
                                recommendation.user;

                            return (
                                <div
                                    key={user._id}
                                    className="bg-white rounded-xl
                                               shadow-sm border
                                               p-6"
                                >

                                    <div className="flex flex-col
                                                    md:flex-row
                                                    md:items-start
                                                    md:justify-between
                                                    gap-5">

                                        {/* User */}
                                        <div className="flex gap-4">

                                            {user.profilePhoto ? (
                                                <img
                                                    src={
                                                        user.profilePhoto
                                                    }
                                                    alt={user.name}
                                                    className="w-16 h-16
                                                               rounded-full
                                                               object-cover"
                                                />
                                            ) : (
                                                <div
                                                    className="w-16 h-16
                                                               rounded-full
                                                               bg-blue-100
                                                               flex items-center
                                                               justify-center
                                                               text-blue-700
                                                               text-xl
                                                               font-bold"
                                                >
                                                    {user.name
                                                        ?.charAt(0)
                                                        ?.toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <h2 className="text-xl
                                                               font-semibold">
                                                    {user.name}
                                                </h2>

                                                {user.location && (
                                                    <p className="text-gray-500
                                                                  text-sm">
                                                        {user.location}
                                                    </p>
                                                )}

                                                <div className="flex
                                                                items-center
                                                                gap-2 mt-2">

                                                    <Star
                                                        size={16}
                                                        className="text-yellow-500
                                                                   fill-yellow-500"
                                                    />

                                                    <span>
                                                        {user.ratingAverage
                                                            ? user.ratingAverage.toFixed(1)
                                                            : 'New'}
                                                    </span>

                                                </div>
                                            </div>

                                        </div>

                                        {/* Match score */}
                                        <div className="text-center">

                                            <div className="text-3xl
                                                            font-bold
                                                            text-purple-600">
                                                {recommendation.score}%
                                            </div>

                                            <p className="text-sm
                                                          text-gray-500">
                                                Match Score
                                            </p>

                                        </div>

                                    </div>

                                    {/* Skills */}
                                    <div className="grid
                                                    md:grid-cols-2
                                                    gap-5 mt-6">

                                        {/* Learn */}
                                        <div className="bg-blue-50
                                                        rounded-lg p-4">

                                            <div className="flex
                                                            items-center
                                                            gap-2 mb-3">

                                                <BookOpen
                                                    size={18}
                                                    className="text-blue-600"
                                                />

                                                <h3 className="font-semibold">
                                                    You can learn
                                                </h3>

                                            </div>

                                            {recommendation.learnSkills
                                                .length > 0 ? (
                                                <div className="flex
                                                                flex-wrap
                                                                gap-2">

                                                    {recommendation
                                                        .learnSkills
                                                        .map(skill => (
                                                            <span
                                                                key={skill}
                                                                className="px-3
                                                                           py-1
                                                                           bg-white
                                                                           rounded-full
                                                                           text-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}

                                                </div>
                                            ) : (
                                                <p className="text-sm
                                                              text-gray-500">
                                                    No direct learning
                                                    match found.
                                                </p>
                                            )}

                                        </div>

                                        {/* Teach */}
                                        <div className="bg-green-50
                                                        rounded-lg p-4">

                                            <div className="flex
                                                            items-center
                                                            gap-2 mb-3">

                                                <Users
                                                    size={18}
                                                    className="text-green-600"
                                                />

                                                <h3 className="font-semibold">
                                                    You can teach
                                                </h3>

                                            </div>

                                            {recommendation.teachSkills
                                                .length > 0 ? (
                                                <div className="flex
                                                                flex-wrap
                                                                gap-2">

                                                    {recommendation
                                                        .teachSkills
                                                        .map(skill => (
                                                            <span
                                                                key={skill}
                                                                className="px-3
                                                                           py-1
                                                                           bg-white
                                                                           rounded-full
                                                                           text-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}

                                                </div>
                                            ) : (
                                                <p className="text-sm
                                                              text-gray-500">
                                                    No direct teaching
                                                    match found.
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                    {/* Score breakdown */}
                                    <div className="mt-6">

                                        <h3 className="font-semibold mb-3">
                                            Why this person?
                                        </h3>

                                        <div className="grid
                                                        grid-cols-2
                                                        md:grid-cols-4
                                                        gap-3">

                                            <ScoreItem
                                                icon={<BookOpen size={16} />}
                                                label="Skills"
                                                value={
                                                    recommendation
                                                        .breakdown
                                                        .skillCompatibility
                                                }
                                            />

                                            <ScoreItem
                                                icon={<Star size={16} />}
                                                label="Rating"
                                                value={
                                                    recommendation
                                                        .breakdown
                                                        .rating
                                                }
                                            />

                                            <ScoreItem
                                                icon={<Clock size={16} />}
                                                label="Availability"
                                                value={
                                                    recommendation
                                                        .breakdown
                                                        .availability
                                                }
                                            />

                                            <ScoreItem
                                                icon={<Users size={16} />}
                                                label="Proficiency"
                                                value={
                                                    recommendation
                                                        .breakdown
                                                        .proficiency
                                                }
                                            />

                                        </div>

                                    </div>

                                    {/* View profile */}
                                    <div className="mt-6 flex
                                                    justify-end">

                                        <Link
                                            to={`/user/${user._id}`}
                                            className="flex items-center
                                                       gap-2 px-5 py-2
                                                       bg-blue-600
                                                       text-white
                                                       rounded-lg
                                                       hover:bg-blue-700"
                                        >
                                            View Profile
                                            <ArrowRight size={17} />
                                        </Link>

                                    </div>

                                </div>
                            );
                        }
                    )}

                </div>

            </div>
        </div>
    );
};

const ScoreItem = ({
    icon,
    label,
    value
}) => {
    return (
        <div className="border rounded-lg p-3">

            <div className="flex items-center gap-2
                            text-gray-600 text-sm">
                {icon}
                {label}
            </div>

            <div className="font-bold text-lg mt-1">
                {value}%
            </div>

        </div>
    );
};

export default SmartMatches;