import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../config/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { User as UserIcon, MapPin, Users, Layers, MessageCircle, Flag, BarChart2, Ban, UserCheck } from 'lucide-react';

const summaryColors = [
  'bg-[#7B466A]',
  'bg-[#9F6496]',
  'bg-[#BA6E8F]',
  'bg-[#D391B0]',
  'bg-[#8E5A80]',
  'bg-[#6F456F]'
];

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('skills');
  const [users, setUsers] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [platformMessages, setPlatformMessages] = useState([]);
  const [messageTitle, setMessageTitle] = useState('');
  const [messageText, setMessageText] = useState('');

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    totalSkills: 0,
    totalSkillSwaps: 0,
    averageUserRating: 0
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Fetch all users for skill moderation
  useEffect(() => {
    if (
      activeTab === 'skills' ||
      activeTab === 'users' ||
      activeTab === 'swaps' ||
      activeTab === 'reports'
    ) {
      setLoading(true);
      setError('');
      api.get(
        activeTab === 'swaps'
          ? '/swaps/admin/all'
          : '/users/all'
      )
        .then(res => {
          if (activeTab === 'swaps') {
            setSwaps(res.data);
          } else {
            setUsers(res.data);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch users:', err);
          setError('Failed to fetch users. Please check your admin permissions.');
          setLoading(false);
        });
    }
  }, [activeTab]);
  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/users/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'messages') {
      const fetchPlatformMessages = async () => {
        try {
          setLoading(true);
          setError('');

          const res = await api.get('/platform-messages/admin/all');
          setPlatformMessages(res.data);
        } catch (err) {
          console.error('Failed to fetch platform messages:', err);
          setError('Failed to fetch platform messages.');
        } finally {
          setLoading(false);
        }
      };

      fetchPlatformMessages();
    }
  }, [activeTab]);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Remove a skill (offered or wanted)
  const handleRejectSkill = async (userId, skillId, type) => {
    setError('');
    setSuccess('');

    try {
      const endpoint =
        type === 'offered'
          ? `/users/admin/skills-offered/${userId}/${skillId}`
          : `/users/admin/skills-wanted/${userId}/${skillId}`;

      await api.delete(endpoint);

      setSuccess('Skill rejected successfully.');

      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user._id !== userId) return user;

          return {
            ...user,
            skillsOffered:
              type === 'offered'
                ? user.skillsOffered.filter(skill => skill._id !== skillId)
                : user.skillsOffered,
            skillsWanted:
              type === 'wanted'
                ? user.skillsWanted.filter(skill => skill._id !== skillId)
                : user.skillsWanted
          };
        })
      );

    } catch (err) {
      console.error('Failed to reject skill:', err);
      console.error('Response:', err.response?.data);

      setError(
        err.response?.data?.message ||
        'Failed to reject skill. Please try again.'
      );
    }
  };
  const handleBanUser = async (userId) => {
    try {
      await api.put(`/users/${userId}/ban`);

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? { ...user, isBanned: true }
            : user
        )
      );

      setSuccess('User banned successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Ban user error:', error);
      setError(error.response?.data?.message || 'Failed to ban user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUnbanUser = async (userId) => {
    try {
      await api.put(`/users/${userId}/unban`);

      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? { ...user, isBanned: false }
            : user
        )
      );

      setSuccess('User unbanned successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Unban user error:', error);
      setError(error.response?.data?.message || 'Failed to unban user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSendPlatformMessage = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!messageTitle.trim() || !messageText.trim()) {
      setError('Please enter both a title and message.');
      return;
    }

    try {
      const res = await api.post('/platform-messages/admin', {
        title: messageTitle,
        message: messageText
      });

      setPlatformMessages(prevMessages => [
        res.data,
        ...prevMessages
      ]);

      setMessageTitle('');
      setMessageText('');

      setSuccess('Platform message sent successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Failed to send platform message:', err);
      setError(
        err.response?.data?.message ||
        'Failed to send platform message.'
      );
    }
  };

  // Dashboard summary data (mocked for now)
  const summary = [
    {
      label: 'Total Users',
      value: stats.totalUsers,
      icon: <Users className="w-6 h-6" />
    },
    {
      label: 'Active Users',
      value: stats.activeUsers,
      icon: <UserCheck className="w-6 h-6" />
    },
    {
      label: 'Banned Users',
      value: stats.bannedUsers,
      icon: <Ban className="w-6 h-6" />
    },
    {
      label: 'Total Skills',
      value: stats.totalSkills,
      icon: <Layers className="w-6 h-6" />
    },
    {
      label: 'Total Skill Swaps',
      value: stats.totalSkillSwaps,
      icon: <MessageCircle className="w-6 h-6" />
    },
    {
      label: 'Average User Rating',
      value: `${stats.averageUserRating}/5`,
      icon: <BarChart2 className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8F6FA] flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between bg-white rounded-b-3xl shadow-lg px-10 py-8 border-b-4 border-[#D391B0] mt-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold text-[#5D3C64]">Hi, Admin</h1>
          <p className="text-lg text-[#7B466A]">Ready to moderate skills and manage the platform?</p>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0">
          <button
            className="bg-[#D391B0] text-[#0C0420] px-6 py-3 rounded-lg font-bold shadow hover:bg-[#BA6E8F] border border-[#7B466A] transition-colors"
            onClick={() => navigate('/')}
          >
            Back to Main
          </button>
          <button
            className="bg-[#7B466A] text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-[#5D3C64] border border-[#5D3C64] transition-colors"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/admin/login');
            }}
          >
            Logout
          </button>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="w-full max-w-7xl grid grid-cols-2 md:grid-cols-4 gap-6 mt-8 mb-8">
        {summary.map((item, idx) => (
          <div key={item.label} className={`rounded-2xl shadow ${summaryColors[idx]} text-white p-6 flex flex-col items-center`}>
            {item.icon}
            <span className="text-2xl font-bold mt-2">{item.value}</span>
            <span className="mt-1 text-sm font-medium">{item.label}</span>
          </div>
        ))}
      </div>
      {/* Main Content Area */}
      <div className="w-full max-w-7xl flex gap-8">
        {/* Sidebar */}
        <div className="w-64 bg-white border border-[#E5D0E3] rounded-3xl shadow-lg flex flex-col py-8 px-4 gap-2">
          <button className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'skills' ? 'bg-[#D391B0] text-[#0C0420] shadow' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('skills')}><Layers className="w-5 h-5" /> Skill Moderation</button>
          <button className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'users' ? 'bg-[#D391B0] text-[#0C0420] shadow' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('users')}><Users className="w-5 h-5" /> User Management</button>
          <button className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'swaps' ? 'bg-[#D391B0] text-[#0C0420] shadow' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('swaps')}><BarChart2 className="w-5 h-5" /> Swap Monitoring</button>
          <button className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'messages' ? 'bg-[#D391B0] text-[#0C0420] shadow' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('messages')}><MessageCircle className="w-5 h-5" /> Platform Messages</button>
          <button className={`flex items-center gap-3 text-left px-4 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'reports' ? 'bg-[#D391B0] text-[#0C0420] shadow' : 'hover:bg-gray-100 text-[#5D3C64]'}`} onClick={() => setActiveTab('reports')}><Flag className="w-5 h-5" /> Reports</button>
        </div>
        {/* Main Content */}
        <div className="flex-1 min-h-[500px] bg-white rounded-3xl shadow-lg border-2 border-[#9F6496] p-10 flex flex-col gap-8 animate-fade-in transition-all duration-500 mt-0">
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#5D3C64]">Skill Moderation</h2>
              <p className="mb-4 text-[#7B466A]">Review and reject inappropriate or spammy skill descriptions here.</p>
              {loading ? <LoadingSpinner /> : (
                <>
                  {error && <div className="text-red-600 mb-4 font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow">{error}</div>}
                  {success && <div className="text-green-600 mb-4 font-semibold bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow">{success}</div>}
                  <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                    {users.length === 0 && <div className="text-gray-400">No users found.</div>}
                    {users.filter(user => user._id !== 'admin').map(user => (
                      <div key={user._id} className="w-full bg-white/80 rounded-2xl shadow-lg border-2 border-[#D391B0] p-8 flex flex-col md:flex-row items-center gap-8 hover:shadow-2xl transition-shadow mx-auto relative">
                        {/* Avatar */}
                        <div className="flex-shrink-0 flex flex-col items-center justify-center">
                          {user.profilePhoto ? (
                            <img src={user.profilePhoto} alt="avatar" className="w-28 h-28 rounded-full object-cover border-4 border-[#7B466A] shadow-lg" />
                          ) : (
                            <div className="w-28 h-28 bg-[#7B466A] rounded-full flex items-center justify-center text-5xl text-white font-bold shadow-lg border-4 border-[#7B466A]">
                              <UserIcon className="w-14 h-14" />
                            </div>
                          )}
                        </div>
                        {/* User Info and Skills */}
                        <div className="flex-1 flex flex-col gap-3 justify-center">
                          <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
                            <span className="font-bold text-2xl text-[#0C0420]">{user.name}</span>
                            {user.location && (
                              <span className="flex items-center gap-1 text-[#7B466A] text-base mt-1 md:mt-0"><MapPin className="w-5 h-5" />{user.location}</span>
                            )}
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold text-[#5D3C64] block mb-1">Skills Offered:</span>
                            <div className="flex flex-wrap gap-3">
                              {user.skillsOffered && user.skillsOffered.length > 0 ? user.skillsOffered.map(skill => (
                                <span key={skill._id} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-[#D391B0] bg-white text-[#7B466A] font-semibold shadow-sm text-base">
                                  {skill.name}
                                  <button className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-[#D391B0] hover:bg-[#BA6E8F] transition-colors" onClick={() => handleRejectSkill(user._id, skill._id, 'offered')}>Reject</button>
                                </span>
                              )) : <span className="text-gray-400 ml-2">None</span>}
                            </div>
                          </div>
                          <div className="mt-2">
                            <span className="font-semibold text-[#5D3C64] block mb-1">Skills Wanted:</span>
                            <div className="flex flex-wrap gap-3">
                              {user.skillsWanted && user.skillsWanted.length > 0 ? user.skillsWanted.map(skill => (
                                <span key={skill._id} className="inline-flex items-center gap-2 px-5 py-2 rounded-full border-2 border-[#7B466A] bg-white text-[#0C0420] font-semibold shadow-sm text-base">
                                  {skill.name}
                                  <button className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold text-white bg-[#7B466A] hover:bg-[#5D3C64] transition-colors" onClick={() => handleRejectSkill(user._id, skill._id, 'wanted')}>Reject</button>
                                </span>
                              )) : <span className="text-gray-400 ml-2">None</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === 'users' && (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold mb-2 text-[#5D3C64]">
                User Management
              </h2>

              <p className="text-[#7B466A] mb-6">
                Ban users, view user details, and manage user accounts here.
              </p>

              {users
                .filter(user => user._id !== 'admin')
                .map(user => (
                  <div
                    key={user._id}
                    className="w-full bg-white rounded-2xl shadow-lg border-2 border-[#D391B0] p-6 mb-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">

                      {/* User information */}
                      <div className="flex items-center gap-4">

                        {user.profilePhoto ? (
                          <img
                            src={user.profilePhoto}
                            alt={user.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-[#7B466A]"
                          />
                        ) : (
                          <div className="w-20 h-20 bg-[#7B466A] rounded-full flex items-center justify-center text-white">
                            <UserIcon className="w-10 h-10" />
                          </div>
                        )}

                        <div>
                          <h3 className="text-xl font-bold text-[#0C0420]">
                            {user.name}
                          </h3>

                          <p className="text-gray-600">
                            {user.email}
                          </p>

                          {user.location && (
                            <p className="flex items-center gap-1 text-[#7B466A] mt-1">
                              <MapPin className="w-4 h-4" />
                              {user.location}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status and buttons */}
                      <div className="flex items-center gap-3">

                        {user.isBanned ? (
                          <>
                            <span className="px-3 py-2 rounded-full bg-red-100 text-red-700 font-semibold">
                              Banned
                            </span>

                            <button
                              onClick={() => handleUnbanUser(user._id)}
                              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                            >
                              <UserCheck className="w-4 h-4" />
                              Unban
                            </button>
                          </>
                        ) : (
                          <>
                            <span className="px-3 py-2 rounded-full bg-green-100 text-green-700 font-semibold">
                              Active
                            </span>

                            <button
                              onClick={() => {
                                if (
                                  window.confirm(
                                    `Are you sure you want to ban ${user.name}?`
                                  )
                                ) {
                                  handleBanUser(user._id);
                                }
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                              <Ban className="w-4 h-4" />
                              Ban User
                            </button>
                          </>
                        )}

                      </div>
                    </div>
                  </div>
                ))}

              {users.filter(user => user._id !== 'admin').length === 0 && (
                <div className="text-gray-400">
                  No users found.
                </div>
              )}
            </div>
          )}
          {activeTab === 'swaps' && (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold mb-4 text-[#5D3C64]">
                Swap Monitoring
              </h2>

              <p className="text-[#7B466A] mb-6">
                Monitor all skill swaps and their current status here.
              </p>

              {loading ? (
                <LoadingSpinner />
              ) : swaps.length === 0 ? (
                <div className="text-gray-400">
                  No skill swaps found.
                </div>
              ) : (
                <div className="space-y-5">
                  {swaps.map(swap => (
                    <div
                      key={swap._id}
                      className="bg-white rounded-2xl shadow-lg border-2 border-[#D391B0] p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                        <div>
                          <h3 className="text-lg font-bold text-[#0C0420]">
                            {swap.requester?.name || 'Unknown User'}
                            {' → '}
                            {swap.recipient?.name || 'Unknown User'}
                          </h3>

                          <p className="text-gray-600 mt-1">
                            Offered: {swap.offeredSkill?.name || 'N/A'}
                          </p>

                          <p className="text-gray-600">
                            Requested: {swap.requestedSkill?.name || 'N/A'}
                          </p>
                        </div>

                        <span
                          className={`px-4 py-2 rounded-full font-semibold capitalize ${swap.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : swap.status === 'accepted'
                              ? 'bg-blue-100 text-blue-700'
                              : swap.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : swap.status === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {swap.status}
                        </span>

                      </div>

                      {swap.message && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-500">Message</p>
                          <p className="text-gray-700 mt-1">
                            {swap.message}
                          </p>
                        </div>
                      )}

                      <div className="mt-4 text-sm text-gray-500">
                        Created: {new Date(swap.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'messages' && (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold mb-4 text-[#5D3C64]">
                Platform Messages
              </h2>

              <p className="text-[#7B466A] mb-6">
                Send platform-wide messages and alerts to all users.
              </p>

              {error && (
                <div className="text-red-600 mb-4 font-semibold bg-red-50 border border-red-200 rounded-lg px-4 py-2 shadow">
                  {error}
                </div>
              )}

              {success && (
                <div className="text-green-600 mb-4 font-semibold bg-green-50 border border-green-200 rounded-lg px-4 py-2 shadow">
                  {success}
                </div>
              )}

              {/* Send Message Form */}
              <form
                onSubmit={handleSendPlatformMessage}
                className="bg-[#F8F6FA] border-2 border-[#D391B0] rounded-2xl p-6 mb-8"
              >
                <h3 className="text-xl font-bold text-[#5D3C64] mb-4">
                  Create New Message
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#5D3C64] mb-2">
                    Title
                  </label>

                  <input
                    type="text"
                    value={messageTitle}
                    onChange={(e) => setMessageTitle(e.target.value)}
                    placeholder="Enter message title"
                    maxLength={100}
                    className="w-full px-4 py-3 border-2 border-[#E5D0E3] rounded-lg focus:outline-none focus:border-[#9F6496]"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-[#5D3C64] mb-2">
                    Message
                  </label>

                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Enter platform-wide message"
                    maxLength={1000}
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-[#E5D0E3] rounded-lg resize-none focus:outline-none focus:border-[#9F6496]"
                  />
                </div>

                <button
                  type="submit"
                  className="bg-[#7B466A] text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-[#5D3C64] transition-colors"
                >
                  Send Message
                </button>
              </form>

              {/* Message History */}
              <div>
                <h3 className="text-xl font-bold text-[#5D3C64] mb-4">
                  Message History
                </h3>

                {loading ? (
                  <LoadingSpinner />
                ) : platformMessages.length === 0 ? (
                  <div className="text-gray-400">
                    No platform messages yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {platformMessages.map(message => (
                      <div
                        key={message._id}
                        className="bg-white border-2 border-[#D391B0] rounded-2xl p-5 shadow"
                      >
                        <h4 className="text-lg font-bold text-[#0C0420]">
                          {message.title}
                        </h4>

                        <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                          {message.message}
                        </p>

                        <p className="text-sm text-gray-500 mt-3">
                          Sent: {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === 'reports' && (
            <div className="max-h-[60vh] overflow-y-auto pr-2">
              <h2 className="text-2xl font-bold mb-4 text-[#5D3C64]">
                Reports
              </h2>

              <p className="text-[#7B466A] mb-6">
                Download reports for individual users.
              </p>

              <div className="bg-white rounded-lg shadow-sm border border-[#E8DDEB] p-5">
                <h3 className="text-lg font-semibold text-[#5D3C64] mb-2">
                  Individual User Report
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  Select a user to download their review and feedback report as a CSV file.
                </p>

                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-[#5D3C64]">
                          {user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {user.email}
                        </p>
                      </div>

                      <button
                        onClick={async () => {
                          try {
                            const adminToken = localStorage.getItem('adminToken');

                            const response = await api.get(
                              `/users/${user._id}/reviews/export`,
                              {
                                responseType: 'blob',
                                headers: {
                                  Authorization: `Bearer ${adminToken}`
                                }
                              }
                            );

                            const blob = new Blob([response.data], {
                              type: 'text/csv'
                            });

                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');

                            link.href = url;
                            link.download = `${user.name}-review-report.csv`;

                            document.body.appendChild(link);
                            link.click();
                            link.remove();

                            window.URL.revokeObjectURL(url);
                          } catch (err) {
                            console.error('Failed to download user report:', err);
                            console.error('Status:', err.response?.status);
                            console.error('Response:', err.response?.data);
                          }
                        }}
                        className="px-4 py-2 bg-[#7B466A] text-white rounded-lg hover:bg-[#5D3C64] transition"
                      >
                        Download Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 