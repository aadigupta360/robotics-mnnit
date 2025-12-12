const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// --- CONFIGURATION ---
// TODO: PASTE YOUR SHEETDB URL HERE
const SHEETDB_URL = 'https://sheetdb.io/api/v1/3p91wguzf86ja'; 

// --- DB SYSTEM ---
const DB_FILE = 'database.json';
const defaultData = {
    adminPassHash: bcrypt.hashSync("robotics123", 10),
    events: [
        { id: 1, title: 'ARMAGEDDON', prize: '₹ 6,00,000', desc: 'Combat robotics championship.', image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600', teamSize: '3-5 Members', eventCode: 'ARM25', probStmt: '#' },
        { id: 2, title: 'NANO NAVIGATOR', prize: '₹ 2,00,000', desc: 'Micromouse maze solving.', image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=600', teamSize: '1-4 Members', eventCode: 'NAV25', probStmt: '#' },
        { id: 3, title: 'SKY MANEUVER', prize: '₹ 2,50,000', desc: 'Drone Racing.', image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600', teamSize: '1-3 Members', eventCode: 'SKY25', probStmt: '#' }
    ],
    pastGlory: [
        { id: 1, title: 'ROBOWARS 2023', image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600' },
        { id: 2, title: 'DRONE RACING 2023', image: 'https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=600' }
    ],
    projects: [
        { id: 1, name: '6-DOF ARM', image: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=600', shortDesc: 'Robotic Arm.', fullDesc: 'High precision mechanical arm designed for industrial automation.', youtube: 'https://youtube.com', github: 'https://github.com' },
        { id: 2, name: 'AI DRONE', image: 'https://images.pexels.com/photos/2085831/pexels-photo-2085831.jpeg?auto=compress&cs=tinysrgb&w=1260', shortDesc: 'Autonomous Drone.', fullDesc: 'LIDAR equipped drone capable of SLAM and autonomous navigation.', youtube: '#', github: '#' }
    ],
    gallery: [
        { id: 1, title: 'WORKSHOP', image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600' }
    ],
    sdc: [
        { id: 1, title: 'THE VISION', desc: 'L3 Autonomous Vehicle.', icon: 'fa-car' }
    ],
    team: [
        { id: 1, name: 'Aditya Gupta', role: 'President', category: 'lead', image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400' },
        { id: 2, name: 'Kritika Agarwal', role: 'Tech Lead', category: 'member', image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }
    ],
    teams: []
};

let db = defaultData;
if (fs.existsSync(DB_FILE)) {
    try { db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); } catch (err) { console.error("DB Error"); }
} else { saveDB(); }

function saveDB() { fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2)); }

const isAdmin = (req, res, next) => { if (req.cookies.admin_session === 'logged_in_valid_token') next(); else res.redirect('/admin-login'); };
const isUser = (req, res, next) => { if (req.cookies.user_session) next(); else res.redirect('/login'); };

// --- ROUTES ---
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/projects', (req, res) => res.sendFile(path.join(__dirname, 'views', 'projects.html')));
app.get('/gallery', (req, res) => res.sendFile(path.join(__dirname, 'views', 'gallery.html')));
app.get('/sdc', (req, res) => res.sendFile(path.join(__dirname, 'views', 'sdc.html')));
app.get('/team', (req, res) => res.sendFile(path.join(__dirname, 'views', 'team.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'team-login.html')));
app.get('/admin-login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin-login.html')));
app.get('/admin', isAdmin, (req, res) => res.sendFile(path.join(__dirname, 'views', 'admin.html')));
app.get('/dashboard', isUser, (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));

// --- API ---
app.get('/api/events', (req, res) => res.json(db.events));
app.get('/api/past-glory', (req, res) => res.json(db.pastGlory));
app.get('/api/projects', (req, res) => res.json(db.projects));
app.get('/api/gallery', (req, res) => res.json(db.gallery));
app.get('/api/sdc', (req, res) => res.json(db.sdc));
app.get('/api/team', (req, res) => res.json(db.team));
app.get('/api/registrations', isAdmin, (req, res) => {
    let allRegs = [];
    db.teams.forEach(t => { t.members.forEach(m => { allRegs.push({ name: m.name, email: m.email, event: t.eventName, teamId: t.teamId }); }); });
    res.json(allRegs);
});

// --- API: REGISTER (SHEETDB) ---
app.post('/api/register', async (req, res) => {
    const { type, name, email, eventId, joinTeamId } = req.body;

    if (type === 'create') {
        // 1. Local Create
        const event = db.events.find(e => e.id == eventId);
        const code = event && event.eventCode ? event.eventCode : "EVT";
        const teamId = `ROBO-${code}-${Math.floor(1000 + Math.random() * 9000)}`;
        db.teams.push({ teamId, eventId, eventName: event ? event.title : "Unknown", members: [{ name, email }] });
        saveDB();

        // 2. SheetDB Create (New Row)
        if(SHEETDB_URL.includes('http')) {
            try {
                await fetch(SHEETDB_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: [{ "Team_ID": teamId, "Event": event.title, "Member_1": `${name} (${email})` }] })
                });
            } catch(e) { console.error("SheetDB Error:", e); }
        }
        res.json({ success: true, message: `Team Created! ID: ${teamId}`, teamId });

    } else if (type === 'join') {
        // 1. Local Join
        const team = db.teams.find(t => t.teamId === joinTeamId);
        if (!team) return res.status(404).json({ success: false, message: "Invalid Team ID" });
        if(team.members.find(m => m.email === email)) return res.status(400).json({ success: false, message: "Email already in team." });
        
        team.members.push({ name, email });
        saveDB();

        // 2. SheetDB Join (Update Row)
        if(SHEETDB_URL.includes('http')) {
            try {
                const memberKey = `Member_${team.members.length}`; // e.g. Member_2
                // PATCH: Update row where Team_ID matches
                await fetch(`${SHEETDB_URL}/Team_ID/${joinTeamId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: { [memberKey]: `${name} (${email})` } })
                });
            } catch(e) { console.error("SheetDB Error:", e); }
        }
        res.json({ success: true, message: "Joined Team Successfully!", teamId: joinTeamId });
    }
});

const handleCrud = (route, key) => {
    app.post(route, isAdmin, (req, res) => { db[key].push({ id: Date.now(), ...req.body }); saveDB(); res.json({ success: true }); });
    app.delete(route + '/:id', isAdmin, (req, res) => { db[key] = db[key].filter(i => i.id != req.params.id); saveDB(); res.json({ success: true }); });
};
handleCrud('/api/projects', 'projects');
handleCrud('/api/events', 'events');
handleCrud('/api/past-glory', 'pastGlory');
handleCrud('/api/sdc', 'sdc');
handleCrud('/api/gallery', 'gallery');
handleCrud('/api/team', 'team');

app.post('/api/login', (req, res) => {
    if (req.body.username === 'admin' && bcrypt.compareSync(req.body.password, db.adminPassHash)) {
        res.cookie('admin_session', 'logged_in_valid_token', { httpOnly: true });
        res.json({ success: true, redirect: '/admin' });
    } else res.status(401).json({ success: false, message: 'Invalid Credentials' });
});

app.post('/api/user-login', (req, res) => {
    const { teamId, email } = req.body;
    const team = db.teams.find(t => t.teamId === teamId);
    if (!team) return res.status(404).json({ success: false, message: 'Team ID not found' });
    const member = team.members.find(m => m.email === email);
    if (!member) return res.status(401).json({ success: false, message: 'Email not registered' });
    res.cookie('user_session', JSON.stringify({ teamId, email, name: member.name }), { httpOnly: true });
    res.json({ success: true, redirect: '/dashboard' });
});

app.post('/api/logout', (req, res) => { res.clearCookie('admin_session'); res.clearCookie('user_session'); res.json({ success: true }); });

app.get('/api/user-dashboard', isUser, (req, res) => {
    const session = JSON.parse(req.cookies.user_session);
    const team = db.teams.find(t => t.teamId === session.teamId);
    if(team) res.json({ team, currentUser: session });
    else res.status(404).json({ error: "Team not found" });
});

app.listen(PORT, () => { console.log(`Server running at http://localhost:${PORT}`); });
