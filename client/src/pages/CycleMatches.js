import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    RefreshCw,
    Users,
    ArrowRight,
    Sparkles,
    BookOpen,
    CheckCircle
} from 'lucide-react';

import api from '../config/api';

const CycleMatches = () => {
    const [cycles, setCycles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchCycles = async () => {
        try {
            setLoading(true);
            setError('');

            const response = await api.get('/cycles?limit=10');

            setCycles(response.data || []);
        } catch (err) {
            console.error('Cycle matching error:', err);

            setError(
                err.response?.data?.message ||
                'Failed to find multi-way matches.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCycles();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw
                        className="animate-spin mx-auto mb-4"
                        size={36}
                    />

                    <p className="text-gray-600">
                        Finding skill exchange cycles...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">

            {/* Header */}
            <div className="max-w-6xl mx-auto">

                <div className="text-center mb-10">

                    <div className="flex justify-center mb-4">
                        <div className="p-4 bg-purple-100 rounded-full">
                            <Sparkles
                                size={34}
                                className="text-purple-600"
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900">
                        Multi-way Skill Matches
                    </h1>

                    <p className="text-gray-600 mt-3 max-w-2xl mx-auto">
                        Discover skill exchange chains where three people
                        can help each other learn and teach different skills.
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-center">
                            {error}
                        </div>
                    </div>
                )}

                {/* No cycles */}
                {!error && cycles.length === 0 && (
                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border p-10 text-center">

                        <div className="flex justify-center mb-5">
                            <div className="p-4 bg-gray-100 rounded-full">
                                <Users
                                    size={40}
                                    className="text-gray-500"
                                />
                            </div>
                        </div>

                        <h2 className="text-xl font-semibold text-gray-800">
                            No skill cycles found yet
                        </h2>

                        <p className="text-gray-500 mt-3">
                            We couldn't find a three-person skill exchange
                            chain using the skills currently available.
                        </p>

                        <p className="text-gray-500 mt-2">
                            Add more skills to your profile or connect with
                            more users to increase your chances of finding
                            a multi-way match.
                        </p>

                        <div className="mt-6 flex justify-center gap-3">

                            <Link
                                to="/profile"
                                className="px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                Update Profile
                            </Link>

                            <Link
                                to="/browse"
                                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                            >
                                Browse Users
                            </Link>

                        </div>

                    </div>
                )}

                {/* Cycle Cards */}
                <div className="space-y-8">

                    {cycles.map((cycle, index) => (

                        <div
                            key={cycle.cycleKey}
                            className="bg-white rounded-2xl shadow-sm border overflow-hidden"
                        >

                            {/* Card Header */}
                            <div className="px-6 py-5 border-b bg-gray-50">

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Users
                                                size={22}
                                                className="text-purple-600"
                                            />
                                        </div>

                                        <div>
                                            <h2 className="text-lg font-semibold text-gray-900">
                                                Skill Exchange Cycle #{index + 1}
                                            </h2>

                                            <p className="text-sm text-gray-500">
                                                3 people helping each other
                                            </p>
                                        </div>

                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                        <CheckCircle size={18} />
                                        Cycle Found
                                    </div>

                                </div>

                            </div>

                            {/* People */}
                            <div className="p-6">

                                <div className="flex flex-col md:flex-row items-center justify-center gap-4">

                                    {cycle.users.map((user, userIndex) => (

                                        <React.Fragment key={user._id}>

                                            {/* User */}
                                            <div className="w-full md:w-64">

                                                <div className="border rounded-xl p-5 text-center hover:shadow-md transition">

                                                    {/* Profile photo */}
                                                    <div className="flex justify-center mb-4">

                                                        {user.profilePhoto ? (

                                                            <img
                                                                src={user.profilePhoto}
                                                                alt={user.name}
                                                                className="w-16 h-16 rounded-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 text-xl font-bold">
                                                                {user.name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase()}
                                                            </div>

                                                        )}

                                                    </div>

                                                    <h3 className="font-semibold text-gray-900">
                                                        {user.name}
                                                    </h3>

                                                    <Link
                                                        to={`/user/${user._id}`}
                                                        className="inline-block mt-2 text-sm text-purple-600 hover:underline"
                                                    >
                                                        View Profile
                                                    </Link>

                                                </div>

                                            </div>

                                            {/* Arrow */}
                                            {userIndex <
                                                cycle.users.length - 1 && (

                                                <ArrowRight
                                                    size={28}
                                                    className="text-purple-500 hidden md:block"
                                                />

                                            )}

                                        </React.Fragment>

                                    ))}

                                </div>

                                {/* Close cycle arrow */}
                                {cycle.users.length === 3 && (
                                    <div className="flex justify-center mt-4">
                                        <div className="text-sm text-purple-600 font-medium flex items-center gap-2">
                                            <ArrowRight size={18} />
                                            Exchange returns to the first person
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* Exchanges */}
                            <div className="border-t px-6 py-6">

                                <div className="flex items-center gap-2 mb-5">

                                    <BookOpen
                                        size={20}
                                        className="text-purple-600"
                                    />

                                    <h3 className="font-semibold text-gray-900">
                                        How the exchange works
                                    </h3>

                                </div>

                                <div className="space-y-4">

                                    {cycle.exchanges.map(
                                        (exchange, exchangeIndex) => (

                                            <div
                                                key={exchangeIndex}
                                                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-gray-50 rounded-xl p-4"
                                            >

                                                <div className="font-medium text-gray-800 min-w-fit">
                                                    {exchange.from}
                                                </div>

                                                <ArrowRight
                                                    size={20}
                                                    className="text-gray-400 hidden sm:block"
                                                />

                                                <div className="text-gray-500 hidden sm:block">
                                                    teaches
                                                </div>

                                                <div className="flex flex-wrap gap-2">

                                                    {exchange.skills.map(
                                                        (skill, skillIndex) => (

                                                            <span
                                                                key={skillIndex}
                                                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                                                            >
                                                                {skill}
                                                            </span>

                                                        )
                                                    )}

                                                </div>

                                                <ArrowRight
                                                    size={20}
                                                    className="text-gray-400 hidden sm:block"
                                                />

                                                <div className="font-medium text-gray-800">
                                                    {exchange.to}
                                                </div>

                                            </div>

                                        )
                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

                {/* Refresh */}
                {cycles.length > 0 && (
                    <div className="flex justify-center mt-8">

                        <button
                            onClick={fetchCycles}
                            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 bg-white rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            <RefreshCw size={18} />
                            Refresh Matches
                        </button>

                    </div>
                )}

            </div>
        </div>
    );
};

export default CycleMatches;