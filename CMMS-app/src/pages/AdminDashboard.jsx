import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/utils/NavBar';
import { 
    LayoutDashboard, 
    UtensilsCrossed, 
    PackagePlus, 
    ClipboardCheck, 
    MessageSquareWarning, 
    ReceiptText,
    Settings,
    ChevronRight,
    Loader2
} from 'lucide-react';
import api from '../Api';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch profile
                const profileRes = await api.get('/api/profile/');
                setProfile(profileRes.data);

                // Fetch notifications
                const notifRes = await api.get('/api/notifications/');
                setNotifications(notifRes.data?.results || notifRes.data || []);
            } catch (err) {
                console.error("Error fetching admin dashboard data:", err);
                // Fallback for visual testing
                setProfile({
                    name: "Admin User",
                    role: "admin",
                    email: "admin@iitk.ac.in"
                });
                setNotifications([
                    { id: 1, title: "System Update", content: "New menu management features added.", category: "unseen", time: new Date().toISOString() }
                ]);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const handleOpenNotifications = async () => {
        const hasUnseen = notifications.some(n => n.category === 'unseen');
        if (!hasUnseen) return;
        setNotifications(prev => prev.map(n => ({ ...n, category: 'seen' })));
        try {
            await api.post('/api/notifications/mark-seen/');
        } catch (error) {
            console.error('Failed to mark notifications as seen:', error);
        }
    };

    const adminCards = [
        {
            title: "Menu Management",
            desc: "Update daily menus, breakfast, lunch, and dinner items.",
            icon: UtensilsCrossed,
            link: "/admin-menu",
            color: "from-blue-600 to-indigo-600",
            bgLight: "bg-blue-50"
        },
        {
            title: "Extras Management",
            desc: "Manage extra meal items, availability, and pricing.",
            icon: PackagePlus,
            link: "/admin-extras",
            color: "from-purple-600 to-violet-600",
            bgLight: "bg-purple-50"
        },
        {
            title: "Rebate Requests",
            desc: "Review and approve student leave and rebate applications.",
            icon: ClipboardCheck,
            link: "/admin-rebate",
            color: "from-emerald-600 to-teal-600",
            bgLight: "bg-emerald-50"
        },
        {
            title: "Feedback & Complaints",
            desc: "Monitor student feedback and address reported issues.",
            icon: MessageSquareWarning,
            link: "/admin-feedback",
            color: "from-amber-600 to-orange-600",
            bgLight: "bg-amber-50"
        },
        {
            title: "Billing & Accounts",
            desc: "Overview of mess dues, collections, and billing cycles.",
            icon: ReceiptText,
            link: "/admin-billing",
            color: "from-rose-600 to-pink-600",
            bgLight: "bg-rose-50"
        }
    ];

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            <NavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />
            
            <header className="bg-white border-b border-slate-200 pt-24 pb-10 px-6 sm:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
                            <p className="text-slate-500 mt-1">Welcome back, {profile?.name}. Manage your mess operations here.</p>
                        </div>
                        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-2 rounded-full border border-indigo-100 self-start md:self-auto">
                            <Settings className="w-5 h-5 text-indigo-600" />
                            <span className="text-indigo-700 font-medium text-sm capitalize">{profile?.role} Access</span>
                        </div>
                    </motion.div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 sm:px-12 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminCards.map((card, idx) => (
                        <motion.div
                            key={card.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            onClick={() => navigate(card.link)}
                            className="group cursor-pointer bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col h-full"
                        >
                            <div className={`${card.bgLight} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <card.icon className={`w-8 h-8 text-slate-700`} />
                            </div>
                            
                            <h3 className="text-xl font-bold text-slate-800 mb-2">{card.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                                {card.desc}
                            </p>
                            
                            <div className="flex items-center text-indigo-600 font-semibold text-sm group-hover:translate-x-1 transition-transform">
                                Open Module <ChevronRight className="w-4 h-4 ml-1" />
                            </div>
                            
                            <div className={`mt-4 h-1 w-full rounded-full opacity-20 bg-gradient-to-r ${card.color}`} />
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-8 shadow-lg shadow-indigo-100 flex flex-col justify-between text-white"
                    >
                        <div>
                            <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                <LayoutDashboard className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Quick Stats</h3>
                            <p className="text-indigo-100 text-sm opacity-90">
                                View daily collection and occupancy reports at a glance.
                            </p>
                        </div>
                        <button className="mt-8 bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors w-full">
                            View Reports
                        </button>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}
