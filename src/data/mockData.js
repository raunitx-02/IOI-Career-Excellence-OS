// ============================================================
// MOCK DATA LAYER — IOI Career Excellence Leaderboard
// Simulates a real backend. All data is realistic and demo-ready.
// ============================================================

import { addMonths, subMonths, format, startOfMonth } from 'date-fns';

// -----------------------------------------------------------
// CENTERS
// -----------------------------------------------------------
export const CENTERS = [
  { id: 'BLR', name: 'BLR', abbr: 'BLR', city: 'Bangalore', color: 'hsl(246,80%,58%)', emoji: '🌿' },
  { id: 'NOI', name: 'NOI', abbr: 'NOI', city: 'Noida',     color: 'hsl(214,82%,54%)', emoji: '🏙️' },
  { id: 'PUN', name: 'PUN', abbr: 'PUN', city: 'Pune',      color: 'hsl(270,72%,56%)', emoji: '🎓' },
  { id: 'LKO', name: 'LKO', abbr: 'LKO', city: 'Lucknow',   color: 'hsl(24,85%,52%)', emoji: '🕌' },
];

// -----------------------------------------------------------
// SCHOOL CATEGORIES
// -----------------------------------------------------------
export const SCHOOL_CATEGORIES = [
  { id: 'SOT', name: 'School of Technology',  shortName: 'Technology',  icon: '💻', color: 'hsl(246,80%,58%)' },
  { id: 'SOM', name: 'School of Management',  shortName: 'Management',  icon: '📊', color: 'hsl(270,72%,56%)' },
  { id: 'SOH', name: 'School of Healthcare',  shortName: 'Healthcare',  icon: '🏥', color: 'hsl(142,68%,42%)' },
];

// -----------------------------------------------------------
// BATCHES — Global batch codes, same across all 4 centers
// SOT = School of Technology | SOM = School of Management
// SOH = School of Healthcare (MIT = Med Imaging Tech, MLT = Med Lab Tech)
// -----------------------------------------------------------
export const BATCHES = [
  { id: 'SOT25B1',    schoolId: 'SOT', name: 'SOT 2025 — Batch 1', shortName: 'SOT25B1',     year: '2025', subSpec: null },
  { id: 'SOT25B2',    schoolId: 'SOT', name: 'SOT 2025 — Batch 2', shortName: 'SOT25B2',     year: '2025', subSpec: null },
  { id: 'SOM25B1',    schoolId: 'SOM', name: 'SOM 2025 — Batch 1', shortName: 'SOM25B1',     year: '2025', subSpec: null },
  { id: 'SOM25B2',    schoolId: 'SOM', name: 'SOM 2025 — Batch 2', shortName: 'SOM25B2',     year: '2025', subSpec: null },
  { id: 'SOH-MIT25B1', schoolId: 'SOH', name: 'SOH-MIT 2025 — Batch 1', shortName: 'SOH-MIT25B1', year: '2025', subSpec: 'MIT' },
  { id: 'SOH-MIT25B2', schoolId: 'SOH', name: 'SOH-MIT 2025 — Batch 2', shortName: 'SOH-MIT25B2', year: '2025', subSpec: 'MIT' },
  { id: 'SOH-MLT25B1', schoolId: 'SOH', name: 'SOH-MLT 2025 — Batch 1', shortName: 'SOH-MLT25B1', year: '2025', subSpec: 'MLT' },
  { id: 'SOH-MLT25B2', schoolId: 'SOH', name: 'SOH-MLT 2025 — Batch 2', shortName: 'SOH-MLT25B2', year: '2025', subSpec: 'MLT' },
];

// -----------------------------------------------------------
// CLASSROOMS — 1 group per center+batch combination
// -----------------------------------------------------------
export const CLASSROOMS = CENTERS.flatMap(c =>
  BATCHES.map(b => (
    { id: `${c.id}-${b.id}`, batchId: b.id, centerId: c.id, name: `${b.shortName} — ${c.abbr}` }
  ))
);

// -----------------------------------------------------------
// HELPER
// -----------------------------------------------------------
function rng(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// -----------------------------------------------------------
// FACULTY — 5 per center (20 total); each assigned to ONE school category
// schoolId controls what batches/students they can access
// -----------------------------------------------------------
const FACULTY_NAMES = {
  BLR: ['Dr. Ananya Reddy', 'Prof. Kiran Nair', 'Ms. Deepika Menon', 'Mr. Suresh Kumar', 'Dr. Lakshmi Iyer'],
  NOI: ['Dr. Priya Sharma', 'Prof. Rajesh Gupta', 'Ms. Neha Singh', 'Mr. Vijay Malhotra', 'Dr. Sunita Yadav'],
  PUN: ['Dr. Pooja Desai', 'Prof. Manish Patil', 'Ms. Sneha Joshi', 'Mr. Rahul Kulkarni', 'Dr. Meera Deshpande'],
  LKO: ['Dr. Ritu Mishra', 'Prof. Anil Verma', 'Ms. Kavita Trivedi', 'Mr. Sunil Kapoor', 'Dr. Alka Srivastava'],
};

// Assign school categories: indices 0-1 → SOT, 2-3 → SOM, 4 → SOH
const FACULTY_SCHOOL_MAP = ['SOT', 'SOT', 'SOM', 'SOM', 'SOH'];
const SCHOOL_BATCHES = {
  SOT: ['SOT25B1', 'SOT25B2'],
  SOM: ['SOM25B1', 'SOM25B2'],
  SOH: ['SOH-MIT25B1', 'SOH-MIT25B2', 'SOH-MLT25B1', 'SOH-MLT25B2'],
};

export const FACULTY = CENTERS.flatMap(c =>
  FACULTY_NAMES[c.id].map((name, i) => {
    const schoolId = FACULTY_SCHOOL_MAP[i];
    return {
      id: `FAC-${c.id}-${i + 1}`,
      name,
      centerId: c.id,
      email: `${name.split(' ').pop().toLowerCase()}@${c.id.toLowerCase()}.pwioi.edu`,
      role: 'faculty',
      schoolId,
      assignedBatches: SCHOOL_BATCHES[schoolId],
      specializations: pick([['Communication', 'Leadership'], ['Analytics', 'Strategy'], ['Creative', 'Debate']]),
    };
  })
);

// -----------------------------------------------------------
// STUDENTS (20 per center = 80 total)
// -----------------------------------------------------------
const FIRST_NAMES = ['Aarav', 'Aisha', 'Arjun', 'Anaya', 'Arnav', 'Bhavya', 'Chinmay', 'Dhruv', 'Divya', 'Esha',
  'Farhan', 'Gauri', 'Harsh', 'Ishaan', 'Ishita', 'Jai', 'Kavya', 'Karan', 'Lavanya', 'Manav',
  'Meera', 'Nandini', 'Nikhil', 'Nisha', 'Om', 'Priya', 'Rahul', 'Riya', 'Rohan', 'Sahil',
  'Sakshi', 'Siddharth', 'Sneha', 'Tanvi', 'Tushar', 'Uday', 'Varsha', 'Vikram', 'Yash', 'Zara'];
const LAST_NAMES_BY_CENTER = {
  BLR: ['Reddy', 'Nair', 'Iyer', 'Menon', 'Kumar', 'Krishnan', 'Pillai', 'Rao', 'Subramaniam', 'Naidu', 'Hegde', 'Pai', 'Shetty', 'Bhat', 'Achary', 'Kamath', 'Mallya', 'Gowda', 'Naik', 'Shanbhag'],
  NOI: ['Sharma', 'Gupta', 'Singh', 'Malhotra', 'Yadav', 'Verma', 'Tripathi', 'Srivastava', 'Agarwal', 'Chauhan', 'Tiwari', 'Joshi', 'Mishra', 'Pandey', 'Dubey', 'Rastogi', 'Saxena', 'Bhatnagar', 'Chaudhary', 'Dixit'],
  PUN: ['Patil', 'Desai', 'Kulkarni', 'Joshi', 'Deshpande', 'Kadam', 'Pawar', 'Gaikwad', 'Jadhav', 'Shinde', 'More', 'Kale', 'Bhosale', 'Waghmare', 'Mane', 'Rane', 'Salunkhe', 'Chavan', 'Thorat', 'Gade'],
  LKO: ['Mishra', 'Verma', 'Trivedi', 'Kapoor', 'Srivastava', 'Awasthi', 'Saxena', 'Srivastav', 'Bajpai', 'Shukla', 'Pandey', 'Kushwaha', 'Yadav', 'Chandra', 'Lal', 'Singh', 'Gupta', 'Tiwari', 'Dixit', 'Nath'],
};

let studentCounter = 0;
const usedNames = new Set();

export const STUDENTS = CENTERS.flatMap(center => {
  return Array.from({ length: 50 }, (_, i) => {
    studentCounter++;
    // Spread students across all 8 batches (i % 8 → batch index)
    const batch = BATCHES[i % BATCHES.length];
    
    // Explicitly match the single classroom ID per batch
    const classroomId = `${center.id}-${batch.id}`;
    
    let baseScore, firstName, lastName, fullName;
    do {
      const rand1 = seededRng(studentCounter * 137 + 42);
      const rand2 = seededRng(studentCounter * 99 + 7);
      baseScore = Math.round(rand1() * 30 + 55);
      
      firstName = FIRST_NAMES[Math.floor(rand1() * FIRST_NAMES.length)];
      lastName = LAST_NAMES_BY_CENTER[center.id][Math.floor(rand2() * 20)];
      fullName = `${firstName} ${lastName}`;
      if (usedNames.has(fullName)) {
        studentCounter++; // increment to mutate seed and try again
      }
    } while (usedNames.has(fullName));
    
    usedNames.add(fullName);
    
    return {
      id: `STU-${center.id}-${String(i + 1).padStart(2, '0')}`,
      name: fullName,
      centerId: center.id,
      batchId: batch.id,
      schoolId: batch.schoolId,
      classroomId,
      email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}${studentCounter}@student.pwioi.edu`,
      role: 'student',
      baseScore,
      photoSeed: studentCounter,
    };
  });
});

// -----------------------------------------------------------
// SCORING WEIGHTS (configurable)
// -----------------------------------------------------------
export const DEFAULT_WEIGHTS = {
  attendance: 20,
  ragImprovement: 25,
  assessments: 35,
  participation: 20,
};

// -----------------------------------------------------------
// MONTHLY SCORE ENGINE
// -----------------------------------------------------------
function computeMonthlyScore(student, month, weights = DEFAULT_WEIGHTS) {
  const rand = seededRng(student.id.charCodeAt(4) * month * 7 + month * 13 + 77);
  const base = student.baseScore;

  const attendancePct = Math.min(100, Math.max(60, base + (rand() - 0.5) * 20));
  const ragScore = Math.min(100, Math.max(40, base + (rand() - 0.5) * 25));
  const assessmentScore = Math.min(100, Math.max(40, base + (rand() - 0.4) * 25));
  const participationScore = Math.min(100, Math.max(40, base + (rand() - 0.5) * 22));

  const total =
    (attendancePct * weights.attendance +
      ragScore * weights.ragImprovement +
      assessmentScore * weights.assessments +
      participationScore * weights.participation) / 100;

  return {
    studentId: student.id,
    month,
    attendancePct: Math.round(attendancePct),
    ragScore: Math.round(ragScore),
    assessmentScore: Math.round(assessmentScore),
    participationScore: Math.round(participationScore),
    total: Math.round(total * 10) / 10,
  };
}

// Generate 8 months of scores (Sep 2025 - Apr 2026)
export const CURRENT_CYCLE = 8; // latest month index (April 2026)
const NUM_MONTHS = 8;

export const MONTHLY_SCORES = [];
for (let m = 1; m <= NUM_MONTHS; m++) {
  STUDENTS.forEach(student => {
    MONTHLY_SCORES.push(computeMonthlyScore(student, m));
  });
}

// -----------------------------------------------------------
// LEADERBOARD SNAPSHOTS (rank per month, per scope)
// -----------------------------------------------------------
function buildLeaderboard(scores, centerId, batchId, classroomId) {
  let filtered = scores;
  if (classroomId) filtered = filtered.filter(s => {
    const st = STUDENTS.find(x => x.id === s.studentId);
    return st?.classroomId === classroomId;
  });
  else if (batchId) filtered = filtered.filter(s => {
    const st = STUDENTS.find(x => x.id === s.studentId);
    return st?.batchId === batchId;
  });
  else if (centerId) filtered = filtered.filter(s => {
    const st = STUDENTS.find(x => x.id === s.studentId);
    return st?.centerId === centerId;
  });

  return filtered
    .sort((a, b) => {
      if (b.total !== a.total) return b.total - a.total;
      if (b.ragScore !== a.ragScore) return b.ragScore - a.ragScore;
      if (b.assessmentScore !== a.assessmentScore) return b.assessmentScore - a.assessmentScore;
      if (b.participationScore !== a.participationScore) return b.participationScore - a.participationScore;
      return b.attendancePct - a.attendancePct;
    })
    .map((s, i) => ({ ...s, rank: i + 1 }));
}

export const LEADERBOARD = {};
for (let m = 1; m <= NUM_MONTHS; m++) {
  const monthScores = MONTHLY_SCORES.filter(s => s.month === m);
  LEADERBOARD[`global-${m}`] = buildLeaderboard(monthScores, null, null, null);
  CENTERS.forEach(c => {
    LEADERBOARD[`center-${c.id}-${m}`] = buildLeaderboard(monthScores, c.id, null, null);
    BATCHES.forEach(b => {
      // Key: center+batch combo for scoped leaderboard
      LEADERBOARD[`batch-${c.id}-${b.id}-${m}`] = buildLeaderboard(
        monthScores.filter(s => {
          const st = STUDENTS.find(x => x.id === s.studentId);
          return st?.centerId === c.id && st?.batchId === b.id;
        }), null, null, null
      );
    });
    CLASSROOMS.filter(cl => cl.centerId === c.id).forEach(cl => {
      LEADERBOARD[`classroom-${cl.id}-${m}`] = buildLeaderboard(monthScores, null, null, cl.id);
    });
  });
}

// -----------------------------------------------------------
// BADGES
// -----------------------------------------------------------
export const BADGE_DEFS = [
  { id: 'attendance-hero', name: 'Attendance Hero', icon: '🟢', rarity: 'bronze', desc: 'Maintained 90%+ attendance for a month', category: 'attendance' },
  { id: 'growth-champion', name: 'Growth Champion', icon: '📈', rarity: 'silver', desc: 'Improved RAG score by 15+ points', category: 'improvement' },
  { id: 'comm-star', name: 'Communication Star', icon: '⭐', rarity: 'gold', desc: 'Rated Outstanding in participation 3 months in a row', category: 'communication' },
  { id: 'participation-pro', name: 'Participation Pro', icon: '🎤', rarity: 'bronze', desc: 'High or Outstanding participation every session', category: 'participation' },
  { id: 'debate-warrior', name: 'Debate Warrior', icon: '⚔️', rarity: 'silver', desc: 'Won or reached finals in 2+ debate events', category: 'battleground' },
  { id: 'roleplay-master', name: 'Roleplay Master', icon: '🎭', rarity: 'gold', desc: 'Highest rubric score in a roleplay event', category: 'battleground' },
  { id: 'class-president', name: 'Class President Pick', icon: '🏛️', rarity: 'elite', desc: 'Nominated as Class President by faculty', category: 'leadership' },
  { id: 'event-leader', name: 'Event Leader', icon: '🎯', rarity: 'silver', desc: 'Led or organized a battleground event', category: 'leadership' },
  { id: 'semester-topper', name: 'Semester Topper', icon: '🥇', rarity: 'elite', desc: '#1 rank in batch for a semester', category: 'academic' },
  { id: 'consistency-legend', name: 'Consistency Legend', icon: '🔥', rarity: 'gold', desc: 'Top 10% for 3 consecutive months', category: 'consistency' },
  { id: 'top10-club', name: 'Top 10 Club', icon: '🏆', rarity: 'bronze', desc: 'Reached top 10 in batch leaderboard', category: 'academic' },
  { id: 'streaks-master', name: 'Streak Keeper', icon: '⚡', rarity: 'silver', desc: 'Maintained a 4-week attendance streak', category: 'consistency' },
  { id: 'most-improved', name: 'Most Improved', icon: '🚀', rarity: 'gold', desc: 'Highest rank jump in a single month', category: 'improvement' },
  { id: 'pitch-star', name: 'Pitch Star', icon: '💡', rarity: 'silver', desc: 'Won or runner-up in pitch speaking event', category: 'battleground' },
  { id: 'collaboration', name: 'Team Player', icon: '🤝', rarity: 'bronze', desc: 'Participated in 3+ group events', category: 'participation' },
];

// Assign badges to students (seeded)
export const STUDENT_BADGES = STUDENTS.flatMap(student => {
  const rand = seededRng(student.id.charCodeAt(5) * 31 + 19);
  const count = Math.floor(rand() * 5); // 0-4 badges per student
  const shuffled = [...BADGE_DEFS].sort(() => rand() - 0.5);
  return shuffled.slice(0, count).map(badge => ({
    studentId: student.id,
    badgeId: badge.id,
    unlockedAt: new Date(2024, 6 + Math.floor(rand() * 6), Math.floor(rand() * 28) + 1).toISOString(),
  }));
});

// -----------------------------------------------------------
// REWARDS CATALOG
// -----------------------------------------------------------
export const REWARDS = [
  { id: 'linkedin-endorse', name: 'LinkedIn Skill Endorsement', type: 'professional', icon: '💼', desc: 'Get endorsed by IOI faculty on LinkedIn for key skills', eligibilityScore: 75, centerId: null },
  { id: 'class-president', name: 'Group Leader / Class President', type: 'role', icon: '🏛️', desc: 'Lead your class for the month — gain real leadership experience', eligibilityScore: 80, centerId: null },
  { id: 'event-host', name: 'Event Host Priority', type: 'opportunity', icon: '🎤', desc: 'First right to host and lead IOI in-house and external events', eligibilityScore: 72, centerId: null },
  { id: 'placement-early', name: 'Early Placement Drive Access', type: 'placement', icon: '🚀', desc: 'Early bird access — get exclusive first access to placement drives', eligibilityScore: 78, centerId: null },
  { id: 'gift-coupon', name: 'Gift Coupon — Semester Topper', type: 'material', icon: '🎁', desc: 'Gift coupon for semester rank #1 student per batch', eligibilityScore: 90, centerId: null },
  { id: 'mentorship', name: 'Senior Mentor Session', type: 'mentorship', icon: '🧭', desc: 'One-on-one mentoring session with IOI senior faculty / alumni', eligibilityScore: 70, centerId: null },
  { id: 'hall-of-fame', name: 'Hall of Fame Feature', type: 'recognition', icon: '⭐', desc: 'Featured on the IOI Hall of Fame wall displayed in center', eligibilityScore: 85, centerId: null },
  { id: 'debate-winner-cert', name: 'Debate Champion Certificate', type: 'certificate', icon: '📜', desc: 'Official certificate for battleground debate winners', eligibilityScore: 0, centerId: null },
];

// Reward redemptions
export const REWARD_REDEMPTIONS = STUDENTS.slice(0, 15).map((student, i) => ({
  id: `RR-${i + 1}`,
  studentId: student.id,
  rewardId: REWARDS[i % REWARDS.length].id,
  status: pick(['approved', 'approved', 'approved', 'pending', 'pending']),
  requestedAt: new Date(2024, 8 + (i % 3), i + 1).toISOString(),
}));

// -----------------------------------------------------------
// EVENTS — BATTLEGROUND
// -----------------------------------------------------------
export const EVENTS = [
  {
    id: 'EVT-001',
    title: 'Grand Debate Championship — Q3',
    type: 'debate',
    centerId: null,
    isCrossCenter: true,
    status: 'completed',
    rounds: 3,
    participantCount: 24,
    startDate: '2024-09-15',
    endDate: '2024-09-22',
    judgeIds: ['FAC-BLR-1', 'FAC-NOI-2'],
    winnerId: 'STU-BLR-03',
  },
  {
    id: 'EVT-002',
    title: 'Corporate Roleplay Simulation',
    type: 'roleplay',
    centerId: 'BLR',
    isCrossCenter: false,
    status: 'completed',
    rounds: 2,
    participantCount: 15,
    startDate: '2024-10-05',
    endDate: '2024-10-08',
    judgeIds: ['FAC-BLR-2'],
    winnerId: 'STU-BLR-07',
  },
  {
    id: 'EVT-003',
    title: 'Pitch Perfect — Startup Ideas',
    type: 'pitch',
    centerId: null,
    isCrossCenter: true,
    status: 'active',
    rounds: 2,
    participantCount: 32,
    startDate: '2024-11-01',
    endDate: '2024-11-10',
    judgeIds: ['FAC-BLR-1', 'FAC-PUN-3'],
    winnerId: null,
  },
  {
    id: 'EVT-004',
    title: 'Communication Bootcamp Challenge',
    type: 'communication',
    centerId: 'NOI',
    isCrossCenter: false,
    status: 'upcoming',
    rounds: 1,
    participantCount: 20,
    startDate: '2024-12-01',
    endDate: '2024-12-03',
    judgeIds: ['FAC-NOI-1'],
    winnerId: null,
  },
  {
    id: 'EVT-005',
    title: 'Pune Inter-Batch Group Task Olympics',
    type: 'group',
    centerId: 'PUN',
    isCrossCenter: false,
    status: 'completed',
    rounds: 2,
    participantCount: 18,
    startDate: '2024-10-20',
    endDate: '2024-10-21',
    judgeIds: ['FAC-PUN-2'],
    winnerId: 'STU-PUN-05',
  },
];

// -----------------------------------------------------------
// STREAKS
// -----------------------------------------------------------
export const STREAKS = STUDENTS.map(student => {
  const rand = seededRng(student.id.charCodeAt(5) * 47 + 23);
  return {
    studentId: student.id,
    attendanceStreak: Math.floor(rand() * 12),
    participationStreak: Math.floor(rand() * 8),
    improvementStreak: Math.floor(rand() * 6),
    goalStreak: Math.floor(rand() * 5),
  };
});

// -----------------------------------------------------------
// QUESTS
// -----------------------------------------------------------
export const QUESTS = [
  { id: 'Q-W1', type: 'weekly', title: 'Perfect Attendance Week', desc: 'Attend all classes this week', xpReward: 50, icon: '✅' },
  { id: 'Q-W2', type: 'weekly', title: 'Speak Up Twice', desc: 'Get high participation rating in 2 sessions', xpReward: 40, icon: '🎤' },
  { id: 'Q-W3', type: 'weekly', title: 'Score Booster', desc: 'Score 10% higher than last test', xpReward: 60, icon: '📊' },
  { id: 'Q-W4', type: 'weekly', title: 'Event Warrior', desc: 'Register for one battleground event', xpReward: 35, icon: '⚔️' },
  { id: 'Q-M1', type: 'monthly', title: 'Top 10 Achiever', desc: 'Reach top 10 in batch leaderboard', xpReward: 150, icon: '🏆' },
  { id: 'Q-M2', type: 'monthly', title: 'Rank Climber', desc: 'Improve rank by at least 5 positions', xpReward: 120, icon: '📈' },
  { id: 'Q-M3', type: 'monthly', title: 'Attendance Perfect', desc: 'Maintain 90%+ attendance all month', xpReward: 100, icon: '🟢' },
  { id: 'Q-M4', type: 'monthly', title: 'Badge Collector', desc: 'Earn 2 new badges this month', xpReward: 130, icon: '🎖️' },
];

// Assign quests to students
export const STUDENT_QUESTS = STUDENTS.map(student => {
  const rand = seededRng(student.id.charCodeAt(4) * 53 + 41);
  return QUESTS.map(q => ({
    studentId: student.id,
    questId: q.id,
    progress: Math.round(rand() * 100),
    completed: rand() > 0.55,
  }));
}).flat();

// -----------------------------------------------------------
// XP & LEVELS
// -----------------------------------------------------------
const LEVELS = [
  { level: 1, name: 'Beginner', minXp: 0 },
  { level: 2, name: 'Explorer', minXp: 200 },
  { level: 3, name: 'Achiever', minXp: 500 },
  { level: 4, name: 'Performer', minXp: 900 },
  { level: 5, name: 'Champion', minXp: 1400 },
  { level: 6, name: 'Elite', minXp: 2000 },
  { level: 7, name: 'Legend', minXp: 2800 },
];

function getLevel(xp) {
  let out = LEVELS[0];
  for (const l of LEVELS) { if (xp >= l.minXp) out = l; }
  const next = LEVELS.find(l => l.minXp > xp) || LEVELS[LEVELS.length - 1];
  const progress = next.minXp > out.minXp ? ((xp - out.minXp) / (next.minXp - out.minXp)) * 100 : 100;
  return { ...out, xp, nextLevel: next, progress: Math.round(progress) };
}

export const STUDENT_XP = STUDENTS.map(student => {
  const rand = seededRng(student.id.charCodeAt(6) * 61 + 17);
  const xp = Math.round(rand() * 2400 + 200);
  return { studentId: student.id, xp, ...getLevel(xp) };
});

// -----------------------------------------------------------
// ANNOUNCEMENTS
// -----------------------------------------------------------
export const ANNOUNCEMENTS = [
  { id: 'ANN-1', centerId: null, title: 'November Monthly Results Published!', body: 'The November leaderboard has been finalized. Check your rank and badge unlocks.', publishedAt: '2024-11-30', tag: 'results' },
  { id: 'ANN-2', centerId: 'BLR', title: 'Bangalore — Debate Championship Registration Open', body: 'All Bangalore students can now register for the Q4 Grand Debate. Limited spots!', publishedAt: '2024-11-25', tag: 'event' },
  { id: 'ANN-3', centerId: null, title: 'Pitch Perfect 2024 — Round 1 Scores Released', body: 'Round 1 scores for the Cross-Center Pitch Perfect event are now visible in Battleground.', publishedAt: '2024-11-10', tag: 'event' },
  { id: 'ANN-4', centerId: 'NOI', title: 'Noida Excellence Awards Ceremony', body: 'Attending Noida students and faculty are invited to the Q3 Excellence Awards on Dec 5.', publishedAt: '2024-11-20', tag: 'recognition' },
  { id: 'ANN-5', centerId: null, title: 'New Quest System Launched!', body: 'Weekly and monthly quests are now live. Complete quests to earn XP and unlock achievements.', publishedAt: '2024-10-01', tag: 'platform' },
];

// -----------------------------------------------------------
// NOTIFICATIONS
// -----------------------------------------------------------
export const NOTIFICATIONS_TEMPLATES = [
  { type: 'badge', title: 'Badge Unlocked!', message: 'You earned the Attendance Hero badge.', icon: '🟢' },
  { type: 'rank', title: 'Rank Improved!', message: 'You moved up 3 positions this month!', icon: '📈' },
  { type: 'reward', title: 'Reward Eligible', message: 'You qualify for LinkedIn Skill Endorsement.', icon: '💼' },
  { type: 'result', title: 'Monthly Results Published', message: 'November leaderboard is now live.', icon: '🏆' },
  { type: 'event', title: 'Event Registration Reminder', message: 'Pitch Perfect 2024 closes in 2 days.', icon: '⚔️' },
  { type: 'quest', title: 'Quest Complete!', message: 'You completed "Perfect Attendance Week". +50 XP!', icon: '✅' },
];

// -----------------------------------------------------------
// AUDIT LOG SAMPLES
// -----------------------------------------------------------
export const AUDIT_LOGS = [
  { id: 'AL-001', action: 'scores.submitted', performedBy: 'FAC-BLR-1', targetType: 'monthly_cycle', targetId: 'CYCLE-3', timestamp: '2024-11-28T09:15:00Z', details: 'Submitted attendance and participation scores for BLR-A-1' },
  { id: 'AL-002', action: 'leaderboard.published', performedBy: 'ADMIN-BLR', targetType: 'leaderboard', targetId: 'center-BLR-3', timestamp: '2024-11-30T18:00:00Z', details: 'Published November leaderboard for Bangalore center' },
  { id: 'AL-003', action: 'badge.granted', performedBy: 'FAC-NOI-2', targetType: 'student', targetId: 'STU-NOI-05', timestamp: '2024-11-29T14:22:00Z', details: 'Manually granted Debate Warrior badge' },
  { id: 'AL-004', action: 'reward.approved', performedBy: 'ADMIN-PUN', targetType: 'reward_redemption', targetId: 'RR-3', timestamp: '2024-11-27T11:00:00Z', details: 'Approved LinkedIn Endorsement reward for STU-PUN-02' },
  { id: 'AL-005', action: 'weights.updated', performedBy: 'SUPER-ADMIN', targetType: 'scoring_policy', targetId: 'global', timestamp: '2024-10-01T08:00:00Z', details: 'Updated scoring weights: Attendance 20%, RAG 25%, Assessment 35%, Participation 20%' },
  { id: 'AL-006', action: 'event.created', performedBy: 'FAC-LKO-3', targetType: 'event', targetId: 'EVT-004', timestamp: '2024-11-15T16:00:00Z', details: 'Created Communication Bootcamp Challenge for Lucknow' },
];

// -----------------------------------------------------------
// PLACEMENT READINESS (per student)
// -----------------------------------------------------------
export const PLACEMENT_READINESS = STUDENTS.map(student => {
  const rand = seededRng(student.id.charCodeAt(5) * 71 + 29);
  return {
    studentId: student.id,
    communicationScore: Math.round(rand() * 40 + 55),
    leadershipScore: Math.round(rand() * 45 + 40),
    consistencyScore: Math.round(rand() * 40 + 50),
    technicalScore: Math.round(rand() * 35 + 55),
    overallReadiness: Math.round(rand() * 35 + 55),
  };
});

// -----------------------------------------------------------
// NOMINATIONS
// -----------------------------------------------------------
export const NOMINATIONS = [
  { id: 'NOM-1', studentId: 'STU-BLR-01', nominatedBy: 'FAC-BLR-1', type: 'class-president', reason: 'Exceptional leadership and consistent engagement throughout the semester.', status: 'approved', cycleId: 3 },
  { id: 'NOM-2', studentId: 'STU-NOI-03', nominatedBy: 'FAC-NOI-2', type: 'most-improved', reason: 'Made a remarkable jump from rank 15 to rank 4 in a single month.', status: 'approved', cycleId: 3 },
  { id: 'NOM-3', studentId: 'STU-PUN-07', nominatedBy: 'FAC-PUN-1', type: 'communication-star', reason: 'Outstanding communication across roleplay, debate, and class participation.', status: 'pending', cycleId: 3 },
  { id: 'NOM-4', studentId: 'STU-LKO-02', nominatedBy: 'FAC-LKO-2', type: 'event-leader', reason: 'Organized and led the group task event with exceptional coordination.', status: 'approved', cycleId: 3 },
];

// -----------------------------------------------------------
// HELPER: Get student data enriched with all related records
// -----------------------------------------------------------
export function getStudentProfile(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return null;

  const center = CENTERS.find(c => c.id === student.centerId);
  const batch = BATCHES.find(b => b.id === student.batchId);
  const classroom = CLASSROOMS.find(c => c.id === student.classroomId);
  const scores = MONTHLY_SCORES.filter(s => s.studentId === studentId);
  const badges = STUDENT_BADGES.filter(b => b.studentId === studentId)
    .map(b => ({ ...b, badge: BADGE_DEFS.find(d => d.id === b.badgeId) }));
  const streaks = STREAKS.find(s => s.studentId === studentId);
  const xpData = STUDENT_XP.find(x => x.studentId === studentId);
  const quests = STUDENT_QUESTS.filter(q => q.studentId === studentId)
    .map(q => ({ ...q, quest: QUESTS.find(d => d.id === q.questId) }));
  const placement = PLACEMENT_READINESS.find(p => p.studentId === studentId);
  const redemptions = REWARD_REDEMPTIONS.filter(r => r.studentId === studentId);
  const nominations = NOMINATIONS.filter(n => n.studentId === studentId);

  // Get ranks for all months (scoped to center+batch)
  const ranks = {};
  for (let m = 1; m <= NUM_MONTHS; m++) {
    const lb = LEADERBOARD[`batch-${student.centerId}-${student.batchId}-${m}`] || [];
    const entry = lb.find(e => e.studentId === studentId);
    if (entry) ranks[m] = entry.rank;
  }

  return {
    ...student, center, batch, classroom, scores, badges, streaks,
    xpData, quests, placement, redemptions, nominations, ranks,
    currentRank: ranks[CURRENT_CYCLE],
    prevRank: ranks[CURRENT_CYCLE - 1],
    rankDelta: ranks[CURRENT_CYCLE] && ranks[CURRENT_CYCLE - 1]
      ? ranks[CURRENT_CYCLE - 1] - ranks[CURRENT_CYCLE]
      : 0,
  };
}

// -----------------------------------------------------------
// HELPER: Center analytics
// -----------------------------------------------------------
export function getCenterAnalytics(centerId) {
  const students = STUDENTS.filter(s => s.centerId === centerId);
  const monthScores = MONTHLY_SCORES.filter(s => students.some(st => st.id === s.studentId));

  const avgScore = (month) => {
    const scores = monthScores.filter(s => s.month === month);
    if (!scores.length) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s.total, 0) / scores.length * 10) / 10;
  };

  const avgAttendance = (month) => {
    const scores = monthScores.filter(s => s.month === month);
    if (!scores.length) return 0;
    return Math.round(scores.reduce((sum, s) => sum + s.attendancePct, 0) / scores.length);
  };

  const months = Array.from({ length: CURRENT_CYCLE }, (_, i) => i + 1);

  return {
    totalStudents: students.length,
    avgScores: months.map(m => ({ month: m, value: avgScore(m) })),
    avgAttendance: months.map(m => ({ month: m, value: avgAttendance(m) })),
    topStudents: LEADERBOARD[`center-${centerId}-${CURRENT_CYCLE}`]?.slice(0, 5)
      .map(e => ({ ...e, student: STUDENTS.find(s => s.id === e.studentId) })) || [],
    badgeCount: STUDENT_BADGES.filter(b => students.some(s => s.id === b.studentId)).length,
    activeEvents: EVENTS.filter(e => e.centerId === centerId || e.isCrossCenter).length,
  };
}

// -----------------------------------------------------------
// USERS (login credentials)
// -----------------------------------------------------------
export const DEMO_USERS = [
  { id: 'SUPER-ADMIN', email: 'superadmin@pwioi.edu', password: 'admin123', role: 'superAdmin', name: 'Raghav Kapoor', centerId: null },
  { id: 'ADMIN-BLR', email: 'admin.blr@pwioi.edu', password: 'admin123', role: 'centerAdmin', name: 'Ananya Krishnamurthy', centerId: 'BLR' },
  { id: 'ADMIN-NOI', email: 'admin.noi@pwioi.edu', password: 'admin123', role: 'centerAdmin', name: 'Suresh Agarwal', centerId: 'NOI' },
  { id: 'ADMIN-PUN', email: 'admin.pun@pwioi.edu', password: 'admin123', role: 'centerAdmin', name: 'Pooja Kulkarni', centerId: 'PUN' },
  { id: 'ADMIN-LKO', email: 'admin.lko@pwioi.edu', password: 'admin123', role: 'centerAdmin', name: 'Rakesh Mishra', centerId: 'LKO' },
  // Faculty — each has schoolId so they see only their school's batches
  ...FACULTY.slice(0, 4).map(f => ({ id: f.id, email: f.email, password: 'faculty123', role: 'faculty', name: f.name, centerId: f.centerId, schoolId: f.schoolId, assignedBatches: f.assignedBatches })),
  ...STUDENTS.slice(0, 5).map(s => ({ id: s.id, email: s.email, password: 'student123', role: 'student', name: s.name, centerId: s.centerId, batchId: s.batchId, schoolId: s.schoolId, studentId: s.id })),
  { id: 'MGMT-01', email: 'management@pwioi.edu', password: 'mgmt123', role: 'management', name: 'Dr. Priya Mehta', centerId: null },
];

export { LEVELS, getLevel };
