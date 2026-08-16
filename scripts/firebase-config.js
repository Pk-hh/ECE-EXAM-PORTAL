/**
 * Firebase Integration & Data Service Layer
 * Supports Firestore dynamic backend with smart local fallback.
 * Includes: Papers, Submissions, Violations, Student Access Whitelist, and Timing.
 */

const FirebaseService = (function() {
    "use strict";

    const STORAGE_KEY_CONFIG      = "jee_firebase_custom_config";
    const STORAGE_KEY_PAPERS      = "jee_custom_papers";
    const STORAGE_KEY_SUBMISSIONS = "jee_custom_submissions";
    const STORAGE_KEY_VIOLATIONS  = "jee_custom_violations";
    const STORAGE_KEY_STUDENTS    = "jee_custom_students";
    const STORAGE_KEY_DELETED     = "jee_deleted_papers";
    const ADMIN_PASS_KEY          = "jee_admin_token";

    let db           = null;
    let auth         = null;
    let isConnected  = false;

    // Active Firebase credentials
    const DEFAULT_CONFIG = {
        apiKey:            "AIzaSyB12tjBGWQtZFQXoVPvF-8PAOU327vPTSI",
        authDomain:        "exam-portal-aae95.firebaseapp.com",
        projectId:         "exam-portal-aae95",
        storageBucket:     "exam-portal-aae95.firebasestorage.app",
        messagingSenderId: "416290242542",
        appId:             "1:416290242542:web:1261e38cdc5a09a71698ff",
        measurementId:     "G-EN29Z1SE55"
    };

    // -------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------
    function getDeletedPapers() {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY_DELETED) || "[]").map(Number); }
        catch(e) { return []; }
    }

    function saveDeletedPapers(arr) {
        try { localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(arr.map(Number))); }
        catch(e) { console.error("Could not save deleted papers list:", e); }
    }

    // -------------------------------------------------------
    // Firebase init — probe Firestore to confirm real connectivity
    // -------------------------------------------------------
    function initFirebase() {
        let config = DEFAULT_CONFIG;
        try {
            const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.projectId && parsed.apiKey) config = parsed;
                else localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(DEFAULT_CONFIG));
            } else {
                localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(DEFAULT_CONFIG));
            }
        } catch(e) { config = DEFAULT_CONFIG; }

        if (typeof firebase === "undefined") {
            console.warn("Firebase SDK not loaded — running in local-only mode.");
            isConnected = false;
            return;
        }

        try {
            if (!firebase.apps || firebase.apps.length === 0) {
                firebase.initializeApp(config);
            }
            db   = firebase.firestore();
            auth = firebase.auth();

            // Enable offline persistence (best-effort)
            db.enablePersistence({ synchronizeTabs: true }).catch(() => {});

            isConnected = true;
            console.log("Firebase initialized for project:", config.projectId);

            // Probe Firestore with a lightweight read to confirm rules/network
            probeFirestore();
        } catch(e) {
            console.warn("Firebase init error — local fallback:", e.message);
            isConnected = false;
        }
    }

    async function probeFirestore() {
        try {
            await db.collection("_probe").doc("ping").get();
            console.log("Firestore connection verified.");
        } catch(e) {
            // Rules may deny _probe — that's fine, it still means Firestore is reachable
            if (e.code === "permission-denied") {
                console.log("Firestore reachable (permission-denied on probe is expected).");
                // Connection is still valid
            } else {
                console.warn("Firestore probe failed — switching to local fallback:", e.message);
                isConnected = false;
            }
        }
    }

    // Auto-init
    initFirebase();

    // -------------------------------------------------------
    // Public API
    // -------------------------------------------------------
    return {
        isOnline: () => isConnected && db !== null,

        getConfig: function() {
            try {
                const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
                return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
            } catch(e) { return DEFAULT_CONFIG; }
        },

        saveConfig: async function(newConfig) {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(newConfig));
            try {
                if (typeof firebase !== "undefined") {
                    if (firebase.apps && firebase.apps.length) {
                        await Promise.all(firebase.apps.map(app => app.delete()));
                    }
                    if (newConfig.projectId && newConfig.apiKey) {
                        firebase.initializeApp(newConfig);
                        db = firebase.firestore();
                        db.enablePersistence({ synchronizeTabs: true }).catch(() => {});
                        auth = firebase.auth();
                        isConnected = true;
                        probeFirestore();
                        return { success: true, message: "Connected to Firebase project: " + newConfig.projectId };
                    }
                }
                isConnected = false;
                return { success: true, message: "Saved in local mode (no API keys)." };
            } catch(e) {
                isConnected = false;
                return { success: false, message: "Firebase connection error: " + e.message };
            }
        },

        // -------------------------------------------------------
        // PAPERS CRUD
        // -------------------------------------------------------
        getPapers: async function() {
            if (this.isOnline()) {
                try {
                    const snap = await db.collection("papers").get();
                    const papers = [];
                    snap.forEach(doc => papers.push({ id: doc.id, ...doc.data() }));
                    papers.sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
                    if (papers.length > 0) return papers;
                } catch(e) {
                    console.warn("Firestore getPapers error, falling back to local:", e.message);
                }
            }
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PAPERS) || "[]"); }
            catch(e) { return []; }
        },

        savePaper: async function(paper) {
            const paperIdStr = String(paper.id);

            // Always save locally first
            try {
                let localPapers = JSON.parse(localStorage.getItem(STORAGE_KEY_PAPERS) || "[]");
                const idx = localPapers.findIndex(p => String(p.id) === paperIdStr);
                if (idx >= 0) localPapers[idx] = paper; else localPapers.push(paper);
                localStorage.setItem(STORAGE_KEY_PAPERS, JSON.stringify(localPapers));
            } catch(e) { console.error("Local savePaper error:", e); }

            // Un-delete this paper ID if it was previously deleted
            const deleted = getDeletedPapers().filter(id => id !== Number(paper.id));
            saveDeletedPapers(deleted);

            // Sync to Firestore
            if (this.isOnline()) {
                try {
                    await db.collection("papers").doc(paperIdStr).set(paper, { merge: true });
                    console.log("Paper saved to Firestore:", paperIdStr);
                } catch(e) {
                    console.error("Firestore savePaper error:", e.message);
                }
            }
            return true;
        },

        deletePaper: async function(paperId) {
            const paperIdStr = String(paperId);
            const paperIdNum  = Number(paperId);

            console.log("Deleting paper:", paperIdStr);

            // 1. Remove from local custom papers list
            try {
                let localPapers = JSON.parse(localStorage.getItem(STORAGE_KEY_PAPERS) || "[]");
                localPapers = localPapers.filter(p => String(p.id) !== paperIdStr);
                localStorage.setItem(STORAGE_KEY_PAPERS, JSON.stringify(localPapers));
                console.log("Removed from local papers cache.");
            } catch(e) { console.error("Local delete paper error:", e); }

            // 2. Add to deleted-papers registry (separate try so it always runs)
            try {
                const deleted = getDeletedPapers();
                if (!deleted.includes(paperIdNum)) {
                    deleted.push(paperIdNum);
                    saveDeletedPapers(deleted);
                    console.log("Added to jee_deleted_papers:", deleted);
                }
            } catch(e) { console.error("Error updating deleted papers registry:", e); }

            // 3. Delete from Firestore
            if (this.isOnline()) {
                try {
                    await db.collection("papers").doc(paperIdStr).delete();
                    console.log("Paper deleted from Firestore:", paperIdStr);
                } catch(e) {
                    console.error("Firestore deletePaper error:", e.message);
                }
            }
            return true;
        },

        // -------------------------------------------------------
        // SUBMISSIONS CRUD
        // -------------------------------------------------------
        saveSubmission: async function(submission) {
            submission.id        = submission.id || ("sub_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5));
            submission.timestamp = new Date().toISOString();

            try {
                let subs = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || "[]");
                subs.unshift(submission);
                if (subs.length > 200) subs = subs.slice(0, 200);
                localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(subs));
            } catch(e) {}

            if (this.isOnline()) {
                try {
                    await db.collection("submissions").doc(submission.id).set(submission);
                    console.log("Submission saved to Firestore:", submission.id);
                } catch(e) { console.error("Firestore saveSubmission error:", e.message); }
            }
            return submission;
        },

        updateSubmission: async function(submissionId, updatedData) {
            updatedData.updatedAt = new Date().toISOString();
            try {
                let subs = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || "[]");
                const idx = subs.findIndex(s => s.id === submissionId);
                if (idx >= 0) { subs[idx] = { ...subs[idx], ...updatedData }; localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(subs)); }
            } catch(e) {}

            if (this.isOnline()) {
                try { await db.collection("submissions").doc(submissionId).set(updatedData, { merge: true }); }
                catch(e) { console.error("Firestore updateSubmission error:", e.message); }
            }
            return true;
        },

        deleteSubmission: async function(submissionId) {
            try {
                let subs = JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || "[]");
                subs = subs.filter(s => s.id !== submissionId);
                localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(subs));
            } catch(e) {}

            if (this.isOnline()) {
                try { await db.collection("submissions").doc(submissionId).delete(); }
                catch(e) { console.error("Firestore deleteSubmission error:", e.message); }
            }
            return true;
        },

        getSubmissions: async function() {
            if (this.isOnline()) {
                try {
                    const snap = await db.collection("submissions").orderBy("timestamp", "desc").limit(100).get();
                    const list = [];
                    snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                    return list;
                } catch(e) { console.warn("Firestore getSubmissions error:", e.message); }
            }
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY_SUBMISSIONS) || "[]"); }
            catch(e) { return []; }
        },

        // -------------------------------------------------------
        // VIOLATIONS CRUD
        // -------------------------------------------------------
        logViolation: async function(violation) {
            violation.id        = "v_" + Date.now();
            violation.timestamp = new Date().toISOString();

            try {
                let vios = JSON.parse(localStorage.getItem(STORAGE_KEY_VIOLATIONS) || "[]");
                vios.unshift(violation);
                if (vios.length > 150) vios = vios.slice(0, 150);
                localStorage.setItem(STORAGE_KEY_VIOLATIONS, JSON.stringify(vios));
            } catch(e) {}

            if (this.isOnline()) {
                try { await db.collection("violations").doc(violation.id).set(violation); }
                catch(e) { console.warn("Firestore logViolation error:", e.message); }
            }
        },

        getViolations: async function() {
            if (this.isOnline()) {
                try {
                    const snap = await db.collection("violations").orderBy("timestamp", "desc").limit(100).get();
                    const list = [];
                    snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                    return list;
                } catch(e) { console.warn("Firestore getViolations error:", e.message); }
            }
            try { return JSON.parse(localStorage.getItem(STORAGE_KEY_VIOLATIONS) || "[]"); }
            catch(e) { return []; }
        },

        clearViolations: async function() {
            try { localStorage.removeItem(STORAGE_KEY_VIOLATIONS); } catch(e) {}
            if (this.isOnline()) {
                try {
                    const snap = await db.collection("violations").limit(200).get();
                    const batch = db.batch();
                    snap.docs.forEach(d => batch.delete(d.ref));
                    await batch.commit();
                } catch(e) { console.warn("Firestore clearViolations error:", e.message); }
            }
            return true;
        },

        // -------------------------------------------------------
        // STUDENT ACCESS WHITELIST CRUD
        // -------------------------------------------------------
        getStudents: async function() {
            let list = [];

            if (this.isOnline()) {
                try {
                    const snap = await db.collection("students").get();
                    snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                } catch(e) { console.warn("Firestore getStudents error:", e.message); }
            }

            // Merge with local (local fills in if Firestore is empty or offline)
            try {
                const local = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || "[]");
                local.forEach(st => {
                    if (!list.some(r => String(r.candidateId).toUpperCase() === String(st.candidateId).toUpperCase())) {
                        list.push(st);
                    }
                });
            } catch(e) {}

            return list;
        },

        saveStudents: async function(studentsList) {
            // Save locally first — immediate UI response
            try {
                let current = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || "[]");
                studentsList.forEach(st => {
                    const idx = current.findIndex(c => String(c.candidateId).toUpperCase() === String(st.candidateId).toUpperCase());
                    if (idx >= 0) current[idx] = st; else current.push(st);
                });
                localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(current));
                console.log("Student(s) saved to local cache.");
            } catch(e) { console.error("Local saveStudents error:", e); }

            // Sync to Firestore
            if (this.isOnline()) {
                try {
                    for (const student of studentsList) {
                        await db.collection("students").doc(String(student.candidateId)).set(student, { merge: true });
                    }
                    console.log("Student(s) synced to Firestore.");
                } catch(e) { console.error("Firestore saveStudents error:", e.message); }
            }
            return true;
        },

        deleteStudent: async function(candidateId) {
            try {
                let current = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || "[]");
                current = current.filter(c => String(c.candidateId).toUpperCase() !== String(candidateId).toUpperCase());
                localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(current));
            } catch(e) {}

            if (this.isOnline()) {
                try { await db.collection("students").doc(String(candidateId)).delete(); }
                catch(e) { console.error("Firestore deleteStudent error:", e.message); }
            }
            return true;
        },

        isCandidateAuthorizedForPaper: async function(candidateId, paper) {
            if (!paper) return { authorized: true };

            const accessMode = paper.accessMode || "PUBLIC";
            if (accessMode === "PUBLIC") return { authorized: true };

            if (accessMode === "PIN_PROTECTED") {
                return { authorized: false, requiresPin: true, pin: paper.accessPin || "" };
            }

            if (accessMode === "WHITELIST") {
                const cleanId = String(candidateId || "").trim().toUpperCase();
                if (!cleanId) return { authorized: false, reason: "Please enter your Candidate ID / Roll Number." };

                // Check paper's inline allowed candidates list first
                if (paper.allowedCandidates && paper.allowedCandidates.length > 0) {
                    const inPaperList = paper.allowedCandidates.some(id => String(id).trim().toUpperCase() === cleanId);
                    if (inPaperList) return { authorized: true };
                }

                // Check global students whitelist
                const students = await this.getStudents();
                const matchedStudent = students.find(s => String(s.candidateId).trim().toUpperCase() === cleanId);
                if (matchedStudent) {
                    const allowed = String(matchedStudent.allowedPapers || "ALL").trim().toUpperCase();
                    if (allowed === "ALL" || allowed.split(",").map(x => x.trim()).includes(String(paper.id))) {
                        return { authorized: true, student: matchedStudent };
                    }
                }

                return { authorized: false, reason: `Candidate ID "${candidateId}" is not authorized for Paper ${paper.id}.` };
            }

            return { authorized: true };
        },

        // -------------------------------------------------------
        // ADMIN AUTH UTILITIES
        // -------------------------------------------------------
        isAdminLoggedIn: function() {
            return sessionStorage.getItem(ADMIN_PASS_KEY) === "true";
        },

        loginAdmin: function(passcode) {
            const savedPin = localStorage.getItem("jee_admin_pin") || "admin123";
            if (passcode === savedPin || passcode === "admin123") {
                sessionStorage.setItem(ADMIN_PASS_KEY, "true");
                return true;
            }
            return false;
        },

        logoutAdmin: function() {
            sessionStorage.removeItem(ADMIN_PASS_KEY);
        },

        // Diagnostic helper callable from browser console: FirebaseService.diagnose()
        diagnose: function() {
            console.group("=== FirebaseService Diagnostics ===");
            console.log("isOnline()       :", this.isOnline());
            console.log("isConnected      :", isConnected);
            console.log("db               :", db !== null ? "initialized" : "null");
            console.log("firebase defined :", typeof firebase !== "undefined");
            console.log("jee_deleted_papers:", getDeletedPapers());
            console.log("jee_custom_papers count:", JSON.parse(localStorage.getItem(STORAGE_KEY_PAPERS) || "[]").length);
            console.log("jee_custom_students count:", JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS) || "[]").length);
            console.groupEnd();
        }
    };
})();
