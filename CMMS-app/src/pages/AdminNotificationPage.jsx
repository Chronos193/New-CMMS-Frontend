import React, { useState, useEffect } from 'react';
import AdminNavBar from '../components/utils/AdminNavBar';
import api from '../Api';

export default function AdminNotificationPage() {
    const [profile, setProfile] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [targets, setTargets] = useState('');
    const [allStudents, setAllStudents] = useState(false);
    const [status, setStatus] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileRes, notifRes, studentsRes] = await Promise.all([
                    api.get('/api/profile/'),
                    api.get('/api/notifications/'),
                    api.get('/api/admin/notifications/students/')
                ]);
                setProfile(profileRes.data);
                setNotifications(notifRes.data?.results || notifRes.data || []);
                setStudents(studentsRes.data || []);
            } catch (err) {
                console.error('Failed to fetch admin profile/notifications/students:', err);
            }
        };
        fetchData();
    }, []);

    // Auto-select students whose roll_no, email, or name exactly matches a token in Recipients
    useEffect(() => {
        if (!students.length) return;
        const tokens = targets.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        if (tokens.length === 0) return;

        const autoSelected = new Set(selectedStudentIds);
        let changed = false;
        for (const s of students) {
            const rollMatch = s.roll_no && tokens.includes(s.roll_no.toLowerCase());
            const emailMatch = s.email && tokens.includes(s.email.toLowerCase());
            const nameMatch = s.name && tokens.includes(s.name.toLowerCase());
            if (rollMatch || emailMatch || nameMatch) {
                if (!autoSelected.has(s.id)) {
                    autoSelected.add(s.id);
                    changed = true;
                }
            }
        }
        if (changed) setSelectedStudentIds(autoSelected);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targets, students]);

    // Helper: toggle student selection and sync Recipients field
    const toggleStudent = (student) => {
        const next = new Set(selectedStudentIds);
        const studentLabel = student.name || student.roll_no || student.email;
        if (next.has(student.id)) {
            // Deselect — remove name from Recipients
            next.delete(student.id);
            const currentTokens = targets.split(',').map(t => t.trim()).filter(Boolean);
            const filtered = currentTokens.filter(t => t.toLowerCase() !== studentLabel.toLowerCase());
            setTargets(filtered.join(', '));
        } else {
            // Select — replace the search token that matched this student with their full name
            next.add(student.id);
            const currentTokens = targets.split(',').map(t => t.trim()).filter(Boolean);
            const sRoll = (student.roll_no || '').toLowerCase();
            const sEmail = (student.email || '').toLowerCase();
            const sName = (student.name || '').toLowerCase();

            // Find the token that was used to search for this student and replace it
            let replaced = false;
            const updatedTokens = currentTokens.map(t => {
                if (replaced) return t;
                const tl = t.toLowerCase();
                // If token is a partial/full match on roll_no, email, or name, replace it
                const isMatch = (sRoll && sRoll.includes(tl)) || (sEmail && sEmail.includes(tl)) || (sName && sName.includes(tl));
                if (isMatch && tl !== studentLabel.toLowerCase()) {
                    replaced = true;
                    return studentLabel;
                }
                return t;
            });
            // If no token was replaced (e.g. already exact match), just add if not present
            if (!replaced && !updatedTokens.some(t => t.toLowerCase() === studentLabel.toLowerCase())) {
                updatedTokens.push(studentLabel);
            }
            setTargets(updatedTokens.join(', '));
        }
        setSelectedStudentIds(next);
    };

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

    const buildNotificationPayload = ({ title, content, allStudents, userIds, emails, rollNos }) => ({
        title,
        content,
        all_students: allStudents,
        user_ids: userIds && userIds.length > 0 ? userIds : undefined,
        emails: emails && emails.length > 0 ? emails : undefined,
        roll_nos: rollNos && rollNos.length > 0 ? rollNos : undefined,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const cleanTitle = title.trim();
        const cleanContent = content.trim();

        if (!cleanTitle || !cleanContent) {
            setStatus({ type: 'error', message: 'Please provide both title and message.' });
            return;
        }

        if (!allStudents && !targets.trim() && selectedStudentIds.size === 0) {
            setStatus({ type: 'error', message: 'Please select students, provide identifiers or enable all students.' });
            return;
        }

        let userIds = [];
        let emails = [];
        let rollNos = [];

        if (selectedStudentIds.size > 0) {
            userIds = Array.from(selectedStudentIds);
        } else if (!allStudents) {
            const parsed = targets
                .split(',')
                .map(value => value.trim())
                .filter(Boolean);

            if (parsed.length === 0) {
                setStatus({ type: 'error', message: 'Please enter valid student identifiers.' });
                return;
            }

            // Auto-detect: if value contains '@' treat as email, otherwise as roll number
            for (const val of parsed) {
                if (val.includes('@')) {
                    emails.push(val);
                } else {
                    rollNos.push(val);
                }
            }
        }

        const payload = buildNotificationPayload({
            title: cleanTitle,
            content: cleanContent,
            allStudents,
            userIds,
            emails,
            rollNos,
        });

        setSubmitting(true);
        setStatus(null);

        try {
            const res = await api.post('/api/admin/notifications/send/', payload);
            setStatus({ type: 'success', message: res.data.message || 'Notification(s) sent successfully.' });
            setTitle('');
            setContent('');
            setTargets('');
            setSelectedStudentIds(new Set());
            setAllStudents(false);
        } catch (err) {
            const errMessage = err.response?.data?.error || (err.response?.data?.message || err.message);
            setStatus({ type: 'error', message: errMessage || 'Failed to send notification.' });
            console.error('Notification send error:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-12">
            <AdminNavBar profile={profile} notifications={notifications} onOpenNotifications={handleOpenNotifications} />
            <main className="max-w-[1100px] mx-auto px-4 md:px-10 py-8">
                <div className="bg-white rounded-2xl p-7 md:p-8 shadow-sm shadow-indigo-100/50 mb-7 border border-slate-100">
                    <h1 className="text-2xl font-extrabold tracking-tight">Admin Notification Sender</h1>
                    <p className="text-slate-500 text-sm mt-2">Send targeted notifications to one or more students.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block">
                                <span className="font-semibold text-slate-700">Title</span>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                                    required
                                />
                            </label>
                            <label className="block">
                                <span className="font-semibold text-slate-700">Message</span>
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm min-h-[90px] focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                                    required
                                />
                            </label>
                        </div>

                        <div className="flex items-start gap-3">
                            <input
                                id="allStudents"
                                type="checkbox"
                                checked={allStudents}
                                onChange={e => setAllStudents(e.target.checked)}
                                className="mt-1 h-4 w-4 text-indigo-600 border-slate-300 rounded"
                            />
                            <label htmlFor="allStudents" className="text-sm font-medium text-slate-700">Send to all students</label>
                        </div>

                        <div className="grid grid-cols-1 gap-4 items-end">
                            <label className="block">
                                <span className="font-semibold text-slate-700">Recipients {allStudents ? '(ignored)' : '(search by roll no, email, or name)'}</span>
                                <input
                                    type="text"
                                    value={targets}
                                    onChange={e => setTargets(e.target.value)}
                                    disabled={allStudents}
                                    className="mt-1 w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500"
                                    placeholder="e.g. 220716, John, student@iitk.ac.in (min 4 chars to search)"
                                />
                            </label>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-3">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-semibold text-slate-700">Student Lookup</span>
                                <span className="text-xs text-slate-500">{students.length} students loaded</span>
                            </div>
                            <div className="flex gap-2 mb-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const tokens = targets.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length >= 4);
                                        const filtered = students.filter(s =>
                                            tokens.some(token =>
                                                (s.roll_no || '').toLowerCase().includes(token) ||
                                                (s.email || '').toLowerCase().includes(token) ||
                                                (s.name || '').toLowerCase().includes(token)
                                            )
                                        );
                                        setSelectedStudentIds(new Set(filtered.map(s => s.id)));
                                        setTargets(filtered.map(s => s.name || s.roll_no || s.email).join(', '));
                                    }}
                                    className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-md"
                                >Select All Matches</button>
                                <button
                                    type="button"
                                    onClick={() => { setSelectedStudentIds(new Set()); setTargets(''); }}
                                    className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded-md"
                                >Clear</button>
                            </div>

                            <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-white">
                                {(() => {
                                    const tokens = targets.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length >= 4);
                                    if (tokens.length === 0) {
                                        return <p className="text-xs text-slate-400">Type at least 4 characters in Recipients to see matching students.</p>;
                                    }
                                    const filteredStudents = students.filter(s =>
                                        tokens.some(token =>
                                            (s.roll_no || '').toLowerCase().includes(token) ||
                                            (s.email || '').toLowerCase().includes(token) ||
                                            (s.name || '').toLowerCase().includes(token)
                                        )
                                    );
                                    if (filteredStudents.length === 0) {
                                        return <p className="text-xs text-slate-400">No students match the entered query.</p>;
                                    }
                                    return filteredStudents.map(student => (
                                        <label key={student.id} className="block text-sm text-slate-700 px-1 py-0.5 hover:bg-slate-50 rounded-md">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudentIds.has(student.id)}
                                                onChange={() => toggleStudent(student)}
                                                className="mr-2"
                                            />
                                            {student.name} ({student.roll_no || student.email})
                                        </label>
                                    ));
                                })()}
                            </div>
                            <p className="text-xs text-slate-400 mt-2">Selected: {selectedStudentIds.size}</p>
                        </div>

                        {status && (
                            <div className={`rounded-lg px-4 py-3 text-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 text-white font-semibold px-6 py-2.5 text-sm hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {submitting ? 'Sending...' : 'Send Notification'}
                        </button>
                        <p className="text-xs text-slate-400">Use this tool to create a message for specific student recipients or broadcast all students.</p>
                    </form>
                </div>
            </main>
        </div>
    );
}
