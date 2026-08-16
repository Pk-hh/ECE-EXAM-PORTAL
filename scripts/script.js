(function() {
    "use strict";

    // 1. OBFUSCATION UTILS
    const SALT = "JEESECURE_2025_SALT_"; 
    const obfuscate = (str) => {
        try {
            return btoa(unescape(encodeURIComponent(SALT + String(str || ''))));
        } catch(e) {
            return "OBF_" + encodeURIComponent(String(str || ''));
        }
    };
    const deobfuscate = (str) => {
        try {
            if (!str) return '';
            const s = String(str);
            if (s.startsWith("OBF_")) return decodeURIComponent(s.replace("OBF_", ""));
            return decodeURIComponent(escape(atob(s))).replace(SALT, '');
        } catch(e) {
            return String(str || '');
        }
    };
    
    
  },
    function processHardcodedPaper(flatQuestions, paperId) {
        const subjects = { 'Physics': [], 'Chemistry': [], 'Mathematics': [] };
        (flatQuestions || []).forEach((q, idx) => {
            if (!q) return;
            const isMCQ = q.options && q.options.length > 0;
            let hash = q.answerHash;
            if (!hash && q.answer !== undefined && q.answer !== null) {
                hash = obfuscate(String(q.answer));
            }

            // Normalize subject name
            let rawSec = String(q.section || q.subject || (idx < 30 ? 'Physics' : idx < 60 ? 'Chemistry' : 'Mathematics'));
            let targetSubj = 'Physics';
            if (/chem/i.test(rawSec)) targetSubj = 'Chemistry';
            else if (/math/i.test(rawSec)) targetSubj = 'Mathematics';
            else if (/phy/i.test(rawSec)) targetSubj = 'Physics';

            const formattedQ = {
                id: `${targetSubj.substring(0,3).toLowerCase()}_p${paperId}_q${idx+1}`,
                type: isMCQ ? 'MCQ' : 'NUMERICAL',
                section: isMCQ ? 'Section A' : 'Section B',
                content: q.content || '',
                options: q.options || [],
                answerHash: hash,
                timeLimitSec: q.timeLimitSec || (targetSubj === 'Physics' ? 120 : targetSubj === 'Chemistry' ? 90 : 150)
            };
            if (!subjects[targetSubj]) subjects[targetSubj] = [];
            subjects[targetSubj].push(formattedQ);
        });
        return {
            id: paperId,
            title: `JEE Advanced Mock Test ${paperId} (Premium)`,
            durationMinutes: 180,
            sections: Object.keys(subjects).map(s => ({ name: s, questions: subjects[s] }))
        };
    }

    function generatePaperByID(paperId) {
        // PRIORITY 0: Check custom/dynamic papers from Firebase/localStorage
        try {
            const customPapers = JSON.parse(localStorage.getItem("jee_custom_papers") || "[]");
            const custom = customPapers.find(p => String(p.id) === String(paperId));
            if (custom && custom.sections && custom.sections.length > 0) {
                return custom;
            }
        } catch(e) {}

        // Check if marked as deleted
        try {
            const deleted = JSON.parse(localStorage.getItem("jee_deleted_papers") || "[]").map(Number);
            if (deleted.includes(Number(paperId))) {
                return { id: paperId, title: `Mock Paper ${paperId} (Deleted)`, durationMinutes: 180, sections: [] };
            }
        } catch(e) {}

        // PRIORITY 1: Check if Manual Data exists
        if (PAPER_DATABASE[paperId]) {
            return processHardcodedPaper(PAPER_DATABASE[paperId], paperId);
        }
        
        // PRIORITY 2: Procedural Generation (Fallback)
        const subjects = ['Physics', 'Chemistry', 'Mathematics'];
        const sections = subjects.map(subject => {
            const questions = [];
            const topicList = TOPIC_BANKS[subject];
            // 5 MCQs for demo
            for(let i=1; i<=5; i++) {
                const topic = topicList[(paperId + i) % topicList.length];
                const ansIndex = (paperId + i) % 4;
                // Example Math content procedurally generated
                let content = `Concept question on <strong>${topic}</strong>.`;
                if(subject === 'Mathematics') content += " Solve for $x$ in $x^2 + 2x + 1 = 0$.";
                else if(subject === 'Physics') content += " If $F = ma$, find $a$.";
                else content += " Identify the reaction mechanism.";

                questions.push({
                    id: `${subject.substring(0,3)}_p${paperId}_A_${i}`,
                    type: 'MCQ',
                    section: 'Section A',
                    content: content,
                    options: [`Option A ($x=1$)`, `Option B ($x=${i}$)`, `Option C`, `Option D`],
                    answerHash: obfuscate(String(ansIndex))
                });
            }
            // 2 Numericals
            for(let i=1; i<=2; i++) {
                const topic = topicList[(paperId + i + 5) % topicList.length];
                const ansVal = (paperId * i) % 10;
                questions.push({
                    id: `${subject.substring(0,3)}_p${paperId}_B_${i}`,
                    type: 'NUMERICAL',
                    section: 'Section B',
                    content: `Numerical integer problem on <strong>${topic}</strong>. Calculate $\\int_0^1 x dx$.`,
                    answerHash: obfuscate(String(ansVal))
                });
            }
            return { name: subject, questions: questions };
        });

        return { id: paperId, title: `JEE Advanced Mock Test ${paperId}`, durationMinutes: 180, sections: sections };
    }

    // 4. APPLICATION STATE
    let CURRENT_CANDIDATE_ID = "JEEPREMIUM";
    try {
        CURRENT_CANDIDATE_ID = localStorage.getItem("jee_candidate_id") || "JEEPREMIUM";
    } catch(e) {}

    let QUESTION_PACE_INTERVAL = null;
    let QUESTION_TIME_SPENT = 0;

    let ADMIN_STATE = {
        currentTab: 'overview',
        selectedPaperId: 1,
        activePaperData: null,
        editingQuestionIdx: -1
    };

    const STATE = {
        paper: null,
        tempPaper: null,
        sectionIndex: 0,
        questionGlobalIndex: 0,
        answers: {},
        timeRemaining: 0,
        timerInterval: null,
        flatQuestions: [],
        warnings: 0,
        fontSize: 1
    };
    Object.seal(STATE);

    const CONFIG = { marksCorrect: 4, marksWrong: -1, marksUnattempted: 0, maxWarnings: 3 };
    Object.freeze(CONFIG);
    
    const SESSION_KEY = 'jee_sec_session'; 
    const HISTORY_KEY = 'jee_sec_history';
    const PAPER_ORDER_KEY = 'jee_paper_order';

    // 5. SECURITY UTILITIES
    const Security = {
        init: function() {
            window.JEE_SCORE = 0;
            window.DEBUG_MODE = false;
        },
        encryptStorage: function(data) {
            const jsonStr = JSON.stringify(data);
            return obfuscate(jsonStr); 
        },
        decryptStorage: function(rawStr) {
            try {
                if(!rawStr) return null;
                const dec = deobfuscate(rawStr);
                return JSON.parse(dec);
            } catch(e) {
                try { return JSON.parse(rawStr); } catch(err) { return null; }
            }
        }
    };

    // 6. INITIALIZATION
    function populateCalculator() {
        try {
            const keys = [
                'sin','cos','tan','C',
                '(',')','^','/',
                '7','8','9','*',
                '4','5','6','-',
                '1','2','3','+',
                '0','.','='
            ];
            const calcGrid = document.getElementById('calc-keys');
            if (!calcGrid || (calcGrid.children && calcGrid.children.length > 0)) return;
            keys.forEach(k => {
                const btn = document.createElement('button');
                btn.className = `calc-key p-2 rounded text-white font-bold ${k==='C'?'bg-red-600': k==='='?'bg-green-600': ['/','*','-','+'].includes(k)?'bg-orange-500':'bg-gray-600'}`;
                if(k==='0') btn.classList.add('col-span-2');
                btn.innerText = k;
                btn.onclick = () => calcInput(k);
                calcGrid.appendChild(btn);
            });
            setupCalculatorDrag();
        } catch(e) {
            console.warn("populateCalculator error:", e);
        }
    }

    function bootstrapApp() {
        Security.init();
        setupEventListeners();
        populateCalculator();
        renderPaperGrid();
        checkPreviousSession();
        initAdminDashboard();
        window.addEventListener('resize', () => checkOrientation());
        window.addEventListener('beforeunload', (e) => {
            if(!document.getElementById('screen-exam').classList.contains('hidden')) { 
                e.preventDefault(); e.returnValue = ''; 
            }
        });

        // Background sync with Firestore
        try {
            if (typeof FirebaseService !== 'undefined') {
                FirebaseService.getPapers().then(remotePapers => {
                    if (remotePapers && remotePapers.length) {
                        localStorage.setItem("jee_custom_papers", JSON.stringify(remotePapers));
                        renderPaperGrid();
                    }
                }).catch(e => console.warn("Background sync error:", e));
            }
        } catch(e) {}
    }

    // 7. EVENT LISTENERS
    function safeBind(id, event, handler) {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener(event, handler);
        }
    }

    function setupEventListeners() {
        const fsBtn = document.getElementById('btn-go-fullscreen');
        if (fsBtn) {
            fsBtn.onclick = () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(e => console.error(e));
                    fsBtn.innerHTML = '<i class="fas fa-compress mr-2"></i> EXIT FULL SCREEN';
                } else {
                    if (document.exitFullscreen) document.exitFullscreen();
                    fsBtn.innerHTML = '<i class="fas fa-expand mr-2"></i> GO FULL SCREEN';
                }
            };
        }

        safeBind('resume-alert', 'click', resumeExamSession);
        
        const closeInst = () => {
            const scInst = document.getElementById('screen-instructions');
            const scSetup = document.getElementById('screen-setup');
            if (scInst) scInst.classList.add('hidden');
            if (scSetup) scSetup.classList.remove('hidden');
        };
        safeBind('btn-close-inst', 'click', closeInst);
        safeBind('btn-close-inst-bottom', 'click', closeInst);
        safeBind('btn-start-exam', 'click', confirmInstructions);
        
        safeBind('btn-toggle-calc', 'click', toggleCalculator);
        safeBind('btn-mob-calc', 'click', toggleCalculator);
        safeBind('btn-close-calc', 'click', toggleCalculator);
        
        safeBind('btn-show-qp', 'click', showQuestionPaper);
        safeBind('btn-mob-qp', 'click', showQuestionPaper);
        safeBind('btn-close-qp', 'click', () => {
            const modal = document.getElementById('modal-qp');
            if (modal) modal.classList.add('hidden');
        });
        
        safeBind('btn-font-inc', 'click', () => resizeFont(1));
        safeBind('btn-font-dec', 'click', () => resizeFont(-1));
        
        safeBind('btn-mobile-menu', 'click', () => {
            const mob = document.getElementById('mobile-menu');
            if (mob) mob.classList.toggle('hidden');
        });
        safeBind('btn-palette-mob', 'click', togglePaletteMobile);
        safeBind('palette-backdrop', 'click', togglePaletteMobile);
        safeBind('btn-close-palette', 'click', togglePaletteMobile);
        
        safeBind('btn-prev', 'click', prevQuestion);
        safeBind('btn-next', 'click', saveAndNext);
        safeBind('btn-clear', 'click', clearResponse);
        safeBind('btn-review', 'click', markForReview);
        
        safeBind('btn-submit-main', 'click', () => {
            const modal = document.getElementById('modal-submit');
            if (modal) modal.classList.remove('hidden');
        });
        safeBind('btn-cancel-submit', 'click', () => {
            const modal = document.getElementById('modal-submit');
            if (modal) modal.classList.add('hidden');
        });
        safeBind('btn-confirm-submit', 'click', finishExam);
        
        safeBind('btn-retake', 'click', retakeTest);
        safeBind('btn-home', 'click', clearSessionAndHome);
        safeBind('btn-resume-warning', 'click', resumeExam);
        safeBind('lightbox-modal', 'click', closeLightbox);
        safeBind('btn-close-lightbox', 'click', closeLightbox);

        // Admin Portal open triggers
        const btnOpenAdmin = document.getElementById('btn-open-admin');
        if (btnOpenAdmin) {
            btnOpenAdmin.onclick = (e) => {
                e.preventDefault();
                if (typeof FirebaseService !== 'undefined' && FirebaseService.isAdminLoggedIn()) {
                    showAdminScreen();
                } else {
                    const passInput = document.getElementById('admin-auth-pass');
                    if (passInput) passInput.value = '';
                    const modal = document.getElementById('modal-admin-auth');
                    if (modal) modal.classList.remove('hidden');
                    if (passInput) setTimeout(() => passInput.focus(), 50);
                }
            };
        }

        safeBind('btn-cancel-admin-auth', 'click', () => {
            const modal = document.getElementById('modal-admin-auth');
            if (modal) modal.classList.add('hidden');
        });

        const formAdminAuth = document.getElementById('form-admin-auth');
        if (formAdminAuth) {
            formAdminAuth.onsubmit = (e) => {
                e.preventDefault();
                const passInput = document.getElementById('admin-auth-pass');
                const pass = passInput ? passInput.value.trim() : '';
                if (typeof FirebaseService !== 'undefined' && FirebaseService.loginAdmin(pass)) {
                    const modal = document.getElementById('modal-admin-auth');
                    if (modal) modal.classList.add('hidden');
                    if (passInput) passInput.value = '';
                    showAdminScreen();
                } else {
                    alert("Invalid passcode! (Default passcode: admin123)");
                }
            };
        }

        // Candidate identity trigger
        safeBind('btn-candidate-badge', 'click', openCandidateIdModal);

        const formCandidateId = document.getElementById('form-candidate-id');
        if (formCandidateId) {
            formCandidateId.onsubmit = saveCandidateId;
        }

        safeBind('btn-cancel-candidate-id', 'click', () => {
            const modal = document.getElementById('modal-candidate-id');
            if (modal) modal.classList.add('hidden');
        });

        safeBind('btn-cancel-paper-access', 'click', () => {
            const modal = document.getElementById('modal-paper-access');
            if (modal) modal.classList.add('hidden');
        });

        const formPaperAccess = document.getElementById('form-paper-access');
        if (formPaperAccess) {
            formPaperAccess.onsubmit = handlePaperAccessSubmit;
        }
    }

    // 8. LOGIC IMPLEMENTATION
    function updateCandidateIdDisplay() {
        const el = document.getElementById('display-candidate-id');
        if (el) el.innerText = CURRENT_CANDIDATE_ID;
    }

    function openCandidateIdModal() {
        document.getElementById('input-candidate-id').value = CURRENT_CANDIDATE_ID;
        document.getElementById('modal-candidate-id').classList.remove('hidden');
    }

    function saveCandidateId(e) {
        e.preventDefault();
        const newId = document.getElementById('input-candidate-id').value.trim().toUpperCase();
        if (newId) {
            CURRENT_CANDIDATE_ID = newId;
            localStorage.setItem("jee_candidate_id", newId);
            updateCandidateIdDisplay();
            document.getElementById('modal-candidate-id').classList.add('hidden');
            renderPaperGrid();
        }
    }

    function getPaperOrder() {
        let deleted = [];
        try {
            deleted = JSON.parse(localStorage.getItem("jee_deleted_papers") || "[]").map(Number);
        } catch(e) {}

        let order = Array.from({length: 10}, (_, i) => i + 1).filter(pid => !deleted.includes(pid));
        try {
            const customPapers = JSON.parse(localStorage.getItem("jee_custom_papers") || "[]");
            customPapers.forEach(p => {
                const pid = Number(p.id);
                if (pid && !order.includes(pid) && !deleted.includes(pid)) {
                    order.push(pid);
                }
            });
        } catch(e) {}
        return order;
    }

    async function renderPaperGrid() {
        const grid = document.getElementById('paper-grid');
        if (!grid) return;
        const order = getPaperOrder();
        updateCandidateIdDisplay();

        // Look up per-student paper restrictions
        let studentAllowedPapers = null; // null = no restriction (show all)
        try {
            const cleanId = String(CURRENT_CANDIDATE_ID || '').trim().toUpperCase();
            if (cleanId && cleanId !== 'JEEPREMIUM' && typeof FirebaseService !== 'undefined') {
                const students = await FirebaseService.getStudents();
                const matchedStudent = students.find(s => String(s.candidateId).trim().toUpperCase() === cleanId);
                if (matchedStudent) {
                    const allowed = String(matchedStudent.allowedPapers || 'ALL').trim().toUpperCase();
                    if (allowed !== 'ALL') {
                        studentAllowedPapers = allowed.split(',').map(x => x.trim()).filter(Boolean);
                    }
                }
            }
        } catch(e) {}

        let history = {};
        try {
            const rawHist = localStorage.getItem(HISTORY_KEY);
            if (rawHist) {
                const decrypted = Security.decryptStorage(rawHist);
                if (decrypted) history = decrypted;
            }
        } catch (e) { }
        
        grid.innerHTML = order.map((pid, index) => {
            const prev = history[pid] || history[String(pid)];
            const displayNum = pid;
            const paperData = generatePaperByID(pid);
            const accessMode = paperData.accessMode || "PUBLIC";

            // Count total questions & max marks for this paper
            let totalQ = 0;
            let paperMaxMarks = 0;
            const defaultPos = typeof paperData.marksCorrect === 'number' ? paperData.marksCorrect : 4;
            const defaultNeg = typeof paperData.marksNegative === 'number' ? paperData.marksNegative : -1;
            
            if (paperData.sections && paperData.sections.length > 0) {
                paperData.sections.forEach(s => {
                    totalQ += s.questions.length;
                    s.questions.forEach(q => {
                        paperMaxMarks += typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
                    });
                });
            }
            if (totalQ === 0) totalQ = 90;
            if (paperMaxMarks === 0) paperMaxMarks = totalQ * defaultPos;

            const marksLabel = `+${defaultPos} / ${defaultNeg >= 0 ? '+' : ''}${defaultNeg} Marking`;

            // Check if this student is restricted from this paper
            const isStudentLocked = studentAllowedPapers && !studentAllowedPapers.includes(String(pid));

            let accessBadge = '';
            if (isStudentLocked) {
                accessBadge = '<span class="badge-access-whitelist text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-lock mr-1"></i>No Access</span>';
            } else if (accessMode === 'PIN_PROTECTED') {
                accessBadge = '<span class="badge-access-pin text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-key mr-1"></i>PIN</span>';
            } else if (accessMode === 'WHITELIST') {
                accessBadge = '<span class="badge-access-whitelist text-[10px] font-bold px-2 py-0.5 rounded-full"><i class="fas fa-user-lock mr-1"></i>Restricted</span>';
            }

            if (isStudentLocked) {
                // Render a locked/greyed-out card — not clickable
                return `
                <div class="paper-card p-4 relative flex flex-col justify-between opacity-40 cursor-not-allowed select-none" style="filter:grayscale(1)">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="tag-unlocked" style="background:rgba(100,116,139,0.2);color:#64748b"><i class="fas fa-lock mr-1"></i>LOCKED</span>
                            <div class="flex items-center gap-1">
                                ${accessBadge}
                                <span class="text-[10px] text-slate-500 font-mono">Paper ${displayNum}</span>
                            </div>
                        </div>
                        <h3 class="text-slate-400 text-base font-bold mb-1">${paperData.title || ('Mock Exam ' + displayNum)}</h3>
                        <p class="text-slate-600 text-xs mb-3 font-normal">Not available for your account</p>
                        <div class="flex gap-1.5 mb-4">
                            <span class="subj-pill">Physics</span>
                            <span class="subj-pill">Chemistry</span>
                            <span class="subj-pill">Maths</span>
                        </div>
                    </div>
                    <button class="btn-start-test" disabled style="opacity:0.4;cursor:not-allowed"><i class="fas fa-lock mr-1.5 text-xs"></i>Access Denied</button>
                </div>`;
            } else if (prev) {
                const maxDisplay = prev.maxScore || paperMaxMarks;
                return `
                <div class="paper-card paper-card-completed p-4 relative group shadow-lg flex flex-col justify-between" data-pid="${pid}">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="tag-completed"><i class="fas fa-check-circle mr-1"></i>COMPLETED</span>
                            <div class="flex items-center gap-1">
                                ${accessBadge}
                                <span class="text-[10px] text-emerald-300 font-mono">Paper ${displayNum}</span>
                            </div>
                        </div>
                        <h3 class="text-white text-base font-bold mb-1">${paperData.title || ('Mock Exam ' + displayNum)}</h3>
                        <div class="flex gap-1.5 mb-3">
                            <span class="subj-pill">Physics</span>
                            <span class="subj-pill">Chemistry</span>
                            <span class="subj-pill">Maths</span>
                        </div>
                        <div class="mb-3 bg-slate-900/60 rounded-xl p-2.5 border border-emerald-500/20">
                            <div class="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-0.5">Score Achieved</div>
                            <div class="flex items-baseline space-x-1.5">
                                <span class="text-2xl font-black ${prev.score >= 0 ? 'text-emerald-400' : 'text-red-400'}">${prev.score}</span>
                                <span class="text-xs text-slate-500 font-medium">/ ${maxDisplay}</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn-retake-test"><i class="fas fa-redo-alt mr-1.5"></i>Retake Test</button>
                </div>`;
            } else {
                return `
                <div class="paper-card paper-card-unlocked p-4 relative group cursor-pointer flex flex-col justify-between" data-pid="${pid}">
                    <div>
                        <div class="flex items-center justify-between mb-2">
                            <span class="tag-unlocked"><i class="fas fa-unlock-alt mr-1"></i>AVAILABLE</span>
                            <div class="flex items-center gap-1">
                                ${accessBadge}
                                <span class="text-[10px] text-blue-300 font-mono">Paper ${displayNum}</span>
                            </div>
                        </div>
                        <h3 class="text-white text-base font-bold mb-1">${paperData.title || ('Mock Exam ' + displayNum)}</h3>
                        <p class="text-slate-400 text-xs mb-3 font-normal">${totalQ} Questions &bull; ${marksLabel} &bull; ${paperData.durationMinutes || 180} mins</p>
                        <div class="flex gap-1.5 mb-4">
                            <span class="subj-pill">Physics</span>
                            <span class="subj-pill">Chemistry</span>
                            <span class="subj-pill">Maths</span>
                        </div>
                    </div>
                    <button class="btn-start-test"><i class="fas fa-play mr-1.5 text-xs"></i>Start Exam</button>
                </div>`;
            }
        }).join('');
        
        grid.querySelectorAll('[data-pid]').forEach(el => {
            el.onclick = (e) => {
                let pid = el.getAttribute('data-pid');
                if(!pid) pid = e.target.closest('[data-pid]').getAttribute('data-pid');
                if(pid) verifyAndPreparePaper(parseInt(pid));
            };
        });
    }

    async function verifyAndPreparePaper(id) {
        try {
            const paper = generatePaperByID(id);

            if (typeof FirebaseService !== 'undefined') {
                // 1. Always check the student whitelist for per-student paper restrictions
                const cleanId = String(CURRENT_CANDIDATE_ID || '').trim().toUpperCase();
                if (cleanId && cleanId !== 'JEEPREMIUM') {
                    const students = await FirebaseService.getStudents();
                    const matchedStudent = students.find(s => String(s.candidateId).trim().toUpperCase() === cleanId);
                    if (matchedStudent) {
                        const allowed = String(matchedStudent.allowedPapers || 'ALL').trim().toUpperCase();
                        if (allowed !== 'ALL') {
                            const allowedIds = allowed.split(',').map(x => x.trim()).filter(Boolean);
                            if (!allowedIds.includes(String(id))) {
                                alert(`You are not authorized to access Mock Paper ${id}.\nYour allowed papers are: ${allowedIds.join(', ')}`);
                                return;
                            }
                        }
                    }
                }

                // 2. Check paper-level access mode (PIN / WHITELIST)
                const authCheck = await FirebaseService.isCandidateAuthorizedForPaper(CURRENT_CANDIDATE_ID, paper);
                if (authCheck && authCheck.requiresPin) {
                    const tid = document.getElementById('access-target-paper-id');
                    if (tid) tid.value = id;
                    const pinInp = document.getElementById('input-paper-access-pin');
                    if (pinInp) pinInp.value = '';
                    const msg = document.getElementById('paper-access-msg');
                    if (msg) msg.innerText = `"${paper.title || ('Paper ' + id)}" is passcode protected. Please enter access PIN:`;
                    const modal = document.getElementById('modal-paper-access');
                    if (modal) modal.classList.remove('hidden');
                    return;
                }

                if (authCheck && !authCheck.authorized) {
                    alert(authCheck.reason || 'You are not authorized to attempt this mock exam.');
                    return;
                }
            }
            preparePaper(id);
        } catch(e) {
            console.warn('verifyAndPreparePaper fallback:', e);
            preparePaper(id);
        }
    }

    function handlePaperAccessSubmit(e) {
        e.preventDefault();
        const paperId = parseInt(document.getElementById('access-target-paper-id').value);
        const enteredPin = document.getElementById('input-paper-access-pin').value.trim();
        const paper = generatePaperByID(paperId);

        if (paper.accessPin && paper.accessPin !== enteredPin) {
            alert("Invalid Exam Passcode! Please check and try again.");
            return;
        }

        document.getElementById('modal-paper-access').classList.add('hidden');
        preparePaper(paperId);
    }

    function preparePaper(id) {
        STATE.tempPaper = generatePaperByID(id);
        
        // Count total questions, total max score & calculated duration
        let totalQ = 0;
        let sumSec = 0;
        let totalMaxScore = 0;
        const defaultPos = typeof STATE.tempPaper.marksCorrect === 'number' ? STATE.tempPaper.marksCorrect : 4;
        const defaultNeg = typeof STATE.tempPaper.marksNegative === 'number' ? STATE.tempPaper.marksNegative : -1;

        STATE.tempPaper.sections.forEach(s => {
            totalQ += s.questions.length;
            s.questions.forEach(q => {
                sumSec += (q.timeLimitSec || (s.name === 'Physics' ? 120 : s.name === 'Chemistry' ? 90 : 150));
                const qPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
                totalMaxScore += qPos;
            });
        });

        const calcDurationMins = STATE.tempPaper.durationMinutes || Math.max(10, Math.ceil(sumSec / 60));
        STATE.tempPaper.durationMinutes = calcDurationMins;

        document.getElementById('inst-paper-name').innerText = STATE.tempPaper.title;
        document.getElementById('inst-total-q').innerText = totalQ;
        document.getElementById('inst-q-breakdown').innerText = `${STATE.tempPaper.sections.map(s => s.questions.length + ' ' + s.name).join(', ')}`;
        document.getElementById('inst-duration-display').innerText = `${Math.floor(calcDurationMins / 60)}h ${calcDurationMins % 60 ? (calcDurationMins % 60) + 'm' : ''}`;
        document.getElementById('inst-duration-sub').innerText = `${calcDurationMins} minutes total`;

        // Dynamic marking scheme
        const instCorrect = document.getElementById('inst-marks-correct');
        if (instCorrect) instCorrect.innerText = `+${defaultPos}`;
        const instCorrectSub = document.getElementById('inst-marks-correct-sub');
        if (instCorrectSub) instCorrectSub.innerText = `per question (Total ${totalMaxScore} marks)`;
        const instNegative = document.getElementById('inst-marks-negative');
        if (instNegative) instNegative.innerText = `${defaultNeg >= 0 ? '+' : '−'}${Math.abs(defaultNeg)}`;

        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-instructions').classList.remove('hidden');
    }

    function confirmInstructions() { startExam(STATE.tempPaper); }
    function checkPreviousSession() { if(localStorage.getItem(SESSION_KEY)) document.getElementById('resume-alert').classList.remove('hidden'); }
    
    function resumeExamSession() {
        const savedRaw = localStorage.getItem(SESSION_KEY);
        if(!savedRaw) return;
        const saved = Security.decryptStorage(savedRaw);
        if(!saved) { alert("Session corrupted"); localStorage.removeItem(SESSION_KEY); return; }
        
        Object.assign(STATE, saved);
        
        if (STATE.paper && STATE.paper.sections) {
            STATE.flatQuestions = [];
            STATE.paper.sections.forEach((sec, sIdx) => {
                sec.questions.forEach((q, qIdx) => {
                    STATE.flatQuestions.push({ ...q, sectionIndex: sIdx, localIndex: qIdx, sectionName: sec.name });
                });
            });
        }

        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-instructions').classList.add('hidden');
        document.getElementById('screen-exam').classList.remove('hidden');
        document.getElementById('screen-exam').classList.add('flex');
        document.getElementById('exam-name-display').innerText = STATE.paper.title;
        enableProctoring();
        checkOrientation();
        renderSubjectTabs();
        startTimer();
        loadQuestion(saved.questionGlobalIndex);
    }

    function startExam(paper) {
        STATE.paper = paper;
        STATE.timeRemaining = (paper.durationMinutes || 180) * 60;
        STATE.warnings = 0;
        STATE.answers = {};
        STATE.flatQuestions = [];
        STATE.fontSize = 1;

        paper.sections.forEach((sec, sIdx) => {
            const questions = [...sec.questions];
            // Shuffle
            for (let i = questions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questions[i], questions[j]] = [questions[j], questions[i]];
            }
            sec.questions = questions;
            questions.forEach((q, qIdx) => {
                STATE.flatQuestions.push({ ...q, sectionIndex: sIdx, localIndex: qIdx, sectionName: sec.name });
                STATE.answers[q.id] = { value: null, status: 'not-visited', timeSpentSec: 0 };
            });
        });

        document.getElementById('screen-instructions').classList.add('hidden');
        document.getElementById('screen-exam').classList.remove('hidden');
        document.getElementById('screen-exam').classList.add('flex');
        document.getElementById('exam-name-display').innerText = paper.title;

        generateWatermark();
        enableProctoring();
        checkOrientation();
        renderSubjectTabs();
        startTimer();
        loadQuestion(0);
        saveSession();
    }

    function loadQuestion(index) {
        if(index < 0 || index >= STATE.flatQuestions.length) return;
        STATE.questionGlobalIndex = index;
        const q = STATE.flatQuestions[index];
        STATE.sectionIndex = q.sectionIndex;

        renderSubjectTabs();

        const ans = STATE.answers[q.id];
        if(ans.status === 'not-visited') ans.status = 'not-answered';

        document.getElementById('q-num').innerText = q.localIndex + 1;
        document.getElementById('q-type-badge').innerText = q.type;
        
        const secBadge = document.getElementById('section-badge');
        if (secBadge) {
            secBadge.innerText = q.section || (q.type === 'MCQ' ? 'Section A' : 'Section B');
            secBadge.className = (q.section === 'Section B' || q.type !== 'MCQ') ? 'section-b-badge self-start' : 'section-a-badge self-start';
        }
        
        // --- Per-Question Live Pacing Timer ---
        if (QUESTION_PACE_INTERVAL) clearInterval(QUESTION_PACE_INTERVAL);
        QUESTION_TIME_SPENT = ans.timeSpentSec || 0;
        const targetSec = q.timeLimitSec || (q.sectionName === 'Physics' ? 120 : q.sectionName === 'Chemistry' ? 90 : 150);
        
        const targetMinStr = Math.floor(targetSec / 60) + ':' + String(targetSec % 60).padStart(2, '0');
        const targetEl = document.getElementById('q-target-time');
        if (targetEl) targetEl.innerText = `/ ${targetMinStr}`;

        const updatePaceDisplay = () => {
            const m = Math.floor(QUESTION_TIME_SPENT / 60);
            const s = QUESTION_TIME_SPENT % 60;
            const timeEl = document.getElementById('q-pace-time');
            if (timeEl) timeEl.innerText = `${m}:${String(s).padStart(2, '0')}`;

            const widget = document.getElementById('q-pace-widget');
            if (widget) {
                if (QUESTION_TIME_SPENT > targetSec) {
                    widget.className = "hidden sm:inline-flex pace-timer-widget pace-timer-exceeded";
                } else {
                    widget.className = "hidden sm:inline-flex pace-timer-widget pace-timer-normal";
                }
            }
        };
        updatePaceDisplay();

        QUESTION_PACE_INTERVAL = setInterval(() => {
            QUESTION_TIME_SPENT++;
            ans.timeSpentSec = QUESTION_TIME_SPENT;
            updatePaceDisplay();
        }, 1000);

        // --- Per-Question Marks Badge ---
        const qMarksBadge = document.getElementById('q-marks-badge');
        const qPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : (STATE.paper && typeof STATE.paper.marksCorrect === 'number' ? STATE.paper.marksCorrect : 4);
        const qNeg = typeof q.marksNegative === 'number' ? q.marksNegative : (STATE.paper && typeof STATE.paper.marksNegative === 'number' ? STATE.paper.marksNegative : -1);
        if (qMarksBadge) {
            document.getElementById('q-marks-correct-val').innerText = qPos;
            document.getElementById('q-marks-negative-val').innerText = Math.abs(qNeg);
            qMarksBadge.classList.remove('hidden');
        }

        const contentDiv = document.getElementById('question-text');
        contentDiv.innerHTML = q.content;
        contentDiv.style.fontSize = `${STATE.fontSize}rem`;

        // --- Question Image Display (if URL provided) ---
        const qImageWrap = document.getElementById('q-image-wrap');
        const qImage = document.getElementById('q-image');
        const imgUrl = q.imageUrl || q.image;
        if (imgUrl && qImageWrap && qImage) {
            qImage.src = imgUrl;
            qImageWrap.classList.remove('hidden');
        } else if (qImageWrap) {
            qImageWrap.classList.add('hidden');
        }

        const optsDiv = document.getElementById('options-area');
        optsDiv.innerHTML = '';
        optsDiv.style.fontSize = `${STATE.fontSize}rem`;

        if(q.type === 'MCQ') {
            const letters = ['A', 'B', 'C', 'D'];
            q.options.forEach((opt, i) => {
                const isSel = ans.value === i;
                const optEl = document.createElement('div');
                optEl.className = `option-card ${isSel ? 'selected' : ''}`;
                optEl.innerHTML = `
                    <div class="option-letter">${letters[i] || (i + 1)}</div>
                    <div class="text-gray-800 font-medium text-sm md:text-base leading-relaxed flex-1">${opt}</div>
                `;
                optEl.onclick = () => selectOption(i);
                optsDiv.appendChild(optEl);
            });
        } else {
            const wrap = document.createElement('div');
            wrap.className = 'flex flex-col max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4';
            wrap.innerHTML = `<label class="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Numerical Value Answer:</label>`;
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'p-3 bg-white border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none w-full font-mono text-xl text-gray-900 font-bold transition-all';
            input.placeholder = 'e.g. 25 or 3.14';
            input.value = ans.value || '';
            input.oninput = (e) => inputNumerical(e.target.value);
            wrap.appendChild(input);
            optsDiv.appendChild(wrap);
        }

        renderPalette();
        setupImageLightbox();
        
        // MATH RENDER FIX
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.getElementById('question-area'), { 
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false},
                    {left: "\\[", right: "\\]", display: true}
                ],
                throwOnError: false
            });
        }
        
        document.getElementById('btn-prev').disabled = index === 0;
        document.getElementById('btn-next').innerText = index === STATE.flatQuestions.length - 1 ? 'Save & Submit' : 'Save & Next';
        saveSession(); 
    }

    function selectOption(idx) { STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id].value = idx; loadQuestion(STATE.questionGlobalIndex); }
    function inputNumerical(val) { STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id].value = val; }
    
    function saveAndNext() {
        const ans = STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id];
        if(ans.value !== null && ans.value !== "") ans.status = (ans.status.includes('marked')) ? 'marked-answered' : 'answered';
        else if(!ans.status.includes('marked')) ans.status = 'not-answered';
        
        if(STATE.questionGlobalIndex < STATE.flatQuestions.length - 1) loadQuestion(STATE.questionGlobalIndex + 1);
        else document.getElementById('modal-submit').classList.remove('hidden');
    }
    
    function prevQuestion() { loadQuestion(STATE.questionGlobalIndex - 1); }
    function markForReview() {
        const ans = STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id];
        ans.status = (ans.value !== null && ans.value !== "") ? 'marked-answered' : 'marked';
        loadQuestion(STATE.questionGlobalIndex + 1);
    }
    function clearResponse() {
        const ans = STATE.answers[STATE.flatQuestions[STATE.questionGlobalIndex].id];
        ans.value = null; ans.status = 'not-answered';
        loadQuestion(STATE.questionGlobalIndex);
    }
    function resizeFont(d) { STATE.fontSize = Math.min(1.5, Math.max(0.8, STATE.fontSize + d * 0.1)); loadQuestion(STATE.questionGlobalIndex); }

    function renderPalette() {
        const questions = STATE.flatQuestions.filter(q => q.sectionIndex === STATE.sectionIndex);
        if (questions.length === 0) return;
        
        document.getElementById('palette-section-title').innerText = questions[0].sectionName || questions[0].section;
        
        const answeredSec = questions.filter(q => {
            const a = STATE.answers[q.id];
            return a && (a.status === 'answered' || a.status === 'marked-answered');
        }).length;
        
        const statsEl = document.getElementById('palette-stats');
        if (statsEl) {
            statsEl.innerText = `${answeredSec}/${questions.length} Attempted`;
        }

        document.getElementById('question-grid').innerHTML = questions.map(q => {
            const ans = STATE.answers[q.id];
            let cls = "status-btn ";
            if(STATE.questionGlobalIndex === STATE.flatQuestions.indexOf(q)) cls += "st-current ";
            if(ans.status === 'answered') cls += "st-answered";
            else if(ans.status === 'not-answered') cls += "st-not-answered";
            else if(ans.status === 'marked') cls += "st-marked";
            else if(ans.status === 'marked-answered') cls += "st-marked-answered";
            else cls += "st-not-visited";
            
            return `<div data-idx="${STATE.flatQuestions.indexOf(q)}" class="${cls}">${q.localIndex + 1}</div>`;
        }).join('');
        
        document.querySelectorAll('#question-grid div').forEach(el => {
            el.onclick = () => loadQuestion(parseInt(el.getAttribute('data-idx')));
        });
    }

    function renderSubjectTabs() {
        const tabsContainer = document.getElementById('subject-tabs');
        if (!tabsContainer || !STATE.paper) return;

        tabsContainer.innerHTML = STATE.paper.sections.map((sec, idx) => {
            const totalInSec = sec.questions.length;
            const answeredInSec = sec.questions.filter(q => {
                const a = STATE.answers[q.id];
                return a && (a.status === 'answered' || a.status === 'marked-answered');
            }).length;
            
            const isActive = idx === STATE.sectionIndex;
            return `
            <button data-sec="${idx}" class="whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-2 ${isActive ? 'tab-active' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'}">
                <span>${sec.name}</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600 font-mono'}">${answeredInSec}/${totalInSec}</span>
            </button>
            `;
        }).join('');

        tabsContainer.querySelectorAll('button').forEach(el => {
            el.onclick = () => switchSection(parseInt(el.getAttribute('data-sec')));
        });
    }

    function switchSection(secIdx) {
        const idx = STATE.flatQuestions.findIndex(q => q.sectionIndex === secIdx);
        if(idx !== -1) loadQuestion(idx);
    }

    function finishExam() {
        clearInterval(STATE.timerInterval);
        if (QUESTION_PACE_INTERVAL) clearInterval(QUESTION_PACE_INTERVAL);
        disableProctoring();
        localStorage.removeItem(SESSION_KEY);
        document.getElementById('screen-exam').classList.add('hidden');
        document.getElementById('modal-submit').classList.add('hidden');
        document.getElementById('screen-result').classList.remove('hidden');

        let score = 0, correct = 0, wrong = 0;
        let totalMaxScore = 0;
        let tbody = document.getElementById('result-table-body');
        tbody.innerHTML = '';

        const defaultPos = (STATE.paper && typeof STATE.paper.marksCorrect === 'number') ? STATE.paper.marksCorrect : CONFIG.marksCorrect;
        const defaultNeg = (STATE.paper && typeof STATE.paper.marksNegative === 'number') ? STATE.paper.marksNegative : CONFIG.marksWrong;
        
        STATE.flatQuestions.forEach((q, idx) => {
            const qMarksPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
            const qMarksNeg = typeof q.marksNegative === 'number' ? q.marksNegative : defaultNeg;
            totalMaxScore += qMarksPos;

            const ans = STATE.answers[q.id];
            let userDisp = '—';
            let resultStatus = 'Unattempted';
            let rowClass = 'result-row-neutral';
            
            const correctHash = q.answerHash;
            let isCorrect = false;

            if (ans.value !== null && ans.value !== '') {
                if (q.type === 'MCQ') {
                    const selectedText = q.options && q.options[ans.value] !== undefined ? q.options[ans.value] : String(ans.value);
                    userDisp = selectedText;
                    
                    const userHashText = obfuscate(String(selectedText));
                    const userHashIndex = obfuscate(String(ans.value));
                    const userHashLetter = obfuscate(String.fromCharCode(65 + Number(ans.value)));
                    const plainAns = q.answer !== undefined ? String(q.answer).trim() : (correctHash ? deobfuscate(correctHash) : '');
                    
                    if (
                        userHashText === correctHash ||
                        userHashIndex === correctHash ||
                        userHashLetter === correctHash ||
                        (plainAns && (
                            plainAns === String(selectedText).trim() ||
                            plainAns === String(ans.value).trim() ||
                            plainAns.toUpperCase() === String.fromCharCode(65 + Number(ans.value))
                        ))
                    ) {
                        isCorrect = true;
                    }
                } else {
                    userDisp = String(ans.value).trim();
                    const plainAns = q.answer !== undefined ? String(q.answer).trim() : (correctHash ? deobfuscate(correctHash).trim() : '');
                    const userHash = obfuscate(userDisp);
                    
                    if (
                        userHash === correctHash ||
                        (plainAns && (
                            userDisp.toLowerCase() === plainAns.toLowerCase() ||
                            (!isNaN(Number(userDisp)) && !isNaN(Number(plainAns)) && Math.abs(Number(userDisp) - Number(plainAns)) < 0.0001)
                        ))
                    ) {
                        isCorrect = true;
                    }
                }
                
                if (isCorrect) {
                    score += qMarksPos; correct++;
                    resultStatus = 'Correct';
                    rowClass = 'result-row-correct';
                } else {
                    score += qMarksNeg; wrong++;
                    resultStatus = 'Wrong';
                    rowClass = 'result-row-wrong';
                }
            }

            const trunc = (str) => String(str).length > 30 ? String(str).substring(0, 30) + '…' : str;
            
            const resultBadge = resultStatus === 'Correct'
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-bold"><i class="fas fa-check text-[9px]"></i> Correct (+${qMarksPos})</span>`
                : resultStatus === 'Wrong'
                ? `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold"><i class="fas fa-times text-[9px]"></i> Wrong (${qMarksNeg})</span>`
                : `<span class="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs font-semibold">Skipped (0)</span>`;

            tbody.innerHTML += `
                <tr class="border-b border-gray-100 hover:bg-gray-50 transition-colors ${rowClass}">
                    <td class="px-4 py-3 font-bold text-gray-700">${idx + 1}</td>
                    <td class="px-4 py-3 text-gray-500 text-xs font-semibold">${q.sectionName || q.section || '—'}</td>
                    <td class="px-4 py-3 text-gray-700 max-w-[200px] truncate">${trunc(userDisp)}</td>
                    <td class="px-4 py-3">${resultBadge}</td>
                </tr>`;
        });

        document.getElementById('res-score').innerText = score;
        document.getElementById('res-correct').innerText = correct;
        document.getElementById('res-wrong').innerText = wrong;

        const maxScoreEl = document.getElementById('res-max-score');
        if (maxScoreEl) maxScoreEl.innerText = totalMaxScore || 300;

        const resTitle = document.getElementById('result-paper-title');
        if (resTitle && STATE.paper) resTitle.innerText = STATE.paper.title;
        
        const scoreBar = document.getElementById('score-bar');
        if (scoreBar) {
            const denom = totalMaxScore > 0 ? totalMaxScore : 300;
            const pct = Math.max(0, Math.min(100, Math.round((score / denom) * 100)));
            setTimeout(() => { scoreBar.style.width = pct + '%'; }, 100);
        }

        try {
            let hist = {};
            const rawHist = localStorage.getItem(HISTORY_KEY);
            if (rawHist) {
                const decrypted = Security.decryptStorage(rawHist);
                if (decrypted) hist = decrypted;
            }
            const paperId = STATE.paper && STATE.paper.id ? STATE.paper.id : 0;
            if(paperId > 0) {
                hist[paperId] = { score, maxScore: totalMaxScore || 300, timestamp: new Date().toISOString() };
                localStorage.setItem(HISTORY_KEY, Security.encryptStorage(hist));
            }
        } catch(e) { }

        // Log submission to Firebase / Local
        try {
            if (typeof FirebaseService !== 'undefined') {
                FirebaseService.saveSubmission({
                    candidateId: CURRENT_CANDIDATE_ID,
                    paperId: STATE.paper ? STATE.paper.id : 'N/A',
                    paperTitle: STATE.paper ? STATE.paper.title : 'Mock Exam',
                    score: score,
                    correct: correct,
                    wrong: wrong,
                    maxScore: totalMaxScore || 300,
                    totalQuestions: STATE.flatQuestions.length,
                    answers: STATE.answers,
                    timeTakenSeconds: STATE.paper ? ((STATE.paper.durationMinutes * 60) - STATE.timeRemaining) : 0
                });
            }
        } catch(e) {
            console.warn("Could not log test submission:", e);
        }
        
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(tbody, { 
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false}
                ],
                throwOnError: false
            });
        }
    }

    function retakeTest() {
        const pid = STATE.paper.id;
        localStorage.removeItem(SESSION_KEY);
        document.getElementById('screen-result').classList.add('hidden');
        preparePaper(pid);
        confirmInstructions();
    }
    
    function clearSessionAndHome() { localStorage.removeItem(SESSION_KEY); location.reload(); }

    function startTimer() {
        if(STATE.timerInterval) clearInterval(STATE.timerInterval);
        STATE.timerInterval = setInterval(() => {
            STATE.timeRemaining--;
            saveSession();
            if(STATE.timeRemaining <= 0) finishExam();
            const h = Math.floor(STATE.timeRemaining / 3600);
            const m = Math.floor((STATE.timeRemaining % 3600) / 60);
            const s = STATE.timeRemaining % 60;
            document.getElementById('timer-display').innerText = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
        }, 1000);
    }

    function saveSession() {
        const cleanState = {
            paper: STATE.paper, timeRemaining: STATE.timeRemaining, answers: STATE.answers,
            questionGlobalIndex: STATE.questionGlobalIndex, warnings: STATE.warnings
        };
        localStorage.setItem(SESSION_KEY, Security.encryptStorage(cleanState));
    }

    function enableProctoring() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(()=>{});
        document.addEventListener("visibilitychange", visibilityHandler);
        window.addEventListener("blur", triggerWarning);
    }
    
    function disableProctoring() {
        if(document.exitFullscreen) document.exitFullscreen().catch(()=>{});
        document.removeEventListener("visibilitychange", visibilityHandler);
        window.removeEventListener("blur", triggerWarning);
    }
    
    function visibilityHandler() { if(document.hidden) triggerWarning(); }
    
    function triggerWarning() {
        if(document.getElementById('screen-exam').classList.contains('hidden') || !document.getElementById('modal-warning').classList.contains('hidden')) return;
        STATE.warnings++;
        document.getElementById('warning-count').innerText = STATE.warnings;
        saveSession();

        // Log proctoring violation to Firebase
        try {
            if (typeof FirebaseService !== 'undefined') {
                FirebaseService.logViolation({
                    candidateId: CURRENT_CANDIDATE_ID,
                    paperId: STATE.paper ? STATE.paper.id : 'N/A',
                    paperTitle: STATE.paper ? STATE.paper.title : 'Mock Exam',
                    warningCount: STATE.warnings,
                    violationType: document.hidden ? 'Tab Switch / Browser Minimized' : 'Window Focus Lost / Desktop Interaction'
                });
            }
        } catch(e) {
            console.warn("Could not log violation:", e);
        }

        if (STATE.warnings > CONFIG.maxWarnings) { 
            disableProctoring(); 
            alert("Maximum security violations reached. Exam auto-submitted."); 
            finishExam(); 
        } 
        else document.getElementById('modal-warning').classList.remove('hidden');
    }
    
    function resumeExam() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) elem.requestFullscreen().catch(()=>{});
        document.getElementById('modal-warning').classList.add('hidden');
    }

    function checkOrientation() {
        const overlay = document.getElementById('orientation-overlay');
        if(document.getElementById('screen-exam').classList.contains('hidden')) { 
            overlay.classList.add('hidden'); 
            return; 
        }
        if(window.innerHeight > window.innerWidth) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    function generateWatermark() {
        const c = document.getElementById('exam-watermark');
        c.innerHTML = "";
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        const userString = CURRENT_CANDIDATE_ID;

        const count = 50; 
        let html = "";
        for(let i=0; i<count; i++) {
            html += `
            <div class="watermark-item">
                <div>ID: ${userString}</div>
                <div class="watermark-ts">${dateString} ${timeString}</div>
            </div>`;
        }
        c.innerHTML = html;
        setTimeout(generateWatermark, 60000);
    }

    function toggleCalculator() { document.getElementById('calc-modal').classList.toggle('hidden'); document.getElementById('mobile-menu').classList.add('hidden'); }
    function togglePaletteMobile() { document.getElementById('palette-sidebar').classList.toggle('translate-x-full'); document.getElementById('palette-backdrop').classList.toggle('hidden'); }
    function showQuestionPaper() {
        const content = document.getElementById('qp-content');
        content.innerHTML = STATE.flatQuestions.map((q, idx) => `
            <div class="mb-4 border-b pb-2"><div class="font-bold text-gray-700 mb-1">Q${idx+1}. ${q.type}</div><div class="mb-1">${q.content}</div></div>`).join('');
        
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(content, { 
                delimiters: [
                    {left: "$$", right: "$$", display: true},
                    {left: "$", right: "$", display: false},
                    {left: "\\(", right: "\\)", display: false},
                    {left: "\\[", right: "\\]", display: true}
                ],
                throwOnError: false
            });
        }
        
        document.getElementById('modal-qp').classList.remove('hidden');
    }
    
    let calcExp = "";
    function calcInput(v) { if(v === 'C') calcExp = ""; else calcExp += v; document.getElementById('calc-display').value = calcExp; }
    
    function setupCalculatorDrag() {
        const el = document.getElementById('calc-modal'), h = document.getElementById('calc-header');
        let isDown = false, off = [0,0];
        const start = (x,y) => { isDown = true; off = [el.offsetLeft - x, el.offsetTop - y]; };
        const move = (x,y) => { if(isDown) { el.style.left = (x + off[0]) + 'px'; el.style.top = (y + off[1]) + 'px'; }};
        h.addEventListener('mousedown', e => start(e.clientX, e.clientY));
        document.addEventListener('mouseup', () => isDown = false);
        document.addEventListener('mousemove', e => move(e.clientX, e.clientY));
        h.addEventListener('touchstart', e => start(e.touches[0].clientX, e.touches[0].clientY));
        document.addEventListener('touchend', () => isDown = false);
        document.addEventListener('touchmove', e => move(e.touches[0].clientX, e.touches[0].clientY));
    }
    
    function closeLightbox() { document.getElementById('lightbox-modal').classList.add('hidden'); }
    function setupImageLightbox() {
        document.querySelectorAll('#question-text img, #options-area img').forEach(img => {
            img.onclick = (e) => { e.stopPropagation(); document.getElementById('lightbox-img').src = img.src; document.getElementById('lightbox-modal').classList.remove('hidden'); };
            img.onerror = function() {
                this.onerror = null;
                this.parentElement.innerHTML += '<div class="text-xs text-red-500 italic text-center p-2 border border-red-200 bg-red-50 rounded mt-2">Image Error</div>';
                this.style.display = 'none';
            };
        });
    }

    // =============================================
    // 9. ADMIN DASHBOARD & FIREBASE CONTROLLER
    // =============================================
    function initAdminDashboard() {
        // Setup Admin Auth Triggers
        const btnOpenAdmin = document.getElementById('btn-open-admin');
        if (btnOpenAdmin) {
            btnOpenAdmin.onclick = () => {
                if (FirebaseService.isAdminLoggedIn()) {
                    showAdminScreen();
                } else {
                    document.getElementById('modal-admin-auth').classList.remove('hidden');
                }
            };
        }

        const btnCancelAuth = document.getElementById('btn-cancel-admin-auth');
        if (btnCancelAuth) {
            btnCancelAuth.onclick = () => document.getElementById('modal-admin-auth').classList.add('hidden');
        }

        const formAuth = document.getElementById('form-admin-auth');
        if (formAuth) {
            formAuth.onsubmit = (e) => {
                e.preventDefault();
                const pass = document.getElementById('admin-auth-pass').value.trim();
                if (FirebaseService.loginAdmin(pass)) {
                    document.getElementById('modal-admin-auth').classList.add('hidden');
                    document.getElementById('admin-auth-pass').value = '';
                    showAdminScreen();
                } else {
                    alert("Invalid passcode! (Demo passcode: admin123)");
                }
            };
        }

        const btnAdminLogout = document.getElementById('btn-admin-logout');
        if (btnAdminLogout) {
            btnAdminLogout.onclick = () => {
                FirebaseService.logoutAdmin();
                hideAdminScreen();
            };
        }

        const btnAdminExit = document.getElementById('btn-admin-exit');
        if (btnAdminExit) {
            btnAdminExit.onclick = hideAdminScreen;
        }

        // Tab Navigation
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.onclick = () => switchAdminTab(btn.getAttribute('data-admin-tab'));
        });

        // Question Editor Real-time KaTeX preview listener
        const qeContent = document.getElementById('qe-content');
        if (qeContent) {
            qeContent.addEventListener('input', () => updateQePreview());
        }

        const qeType = document.getElementById('qe-type');
        if (qeType) {
            qeType.addEventListener('change', (e) => {
                const optContainer = document.getElementById('qe-options-container');
                if (optContainer) optContainer.style.display = e.target.value === 'MCQ' ? 'block' : 'none';
            });
        }

        // Image URL live preview in question editor
        const qeImageUrl = document.getElementById('qe-image-url');
        if (qeImageUrl) {
            qeImageUrl.addEventListener('input', () => {
                const url = qeImageUrl.value.trim();
                const wrap = document.getElementById('qe-image-preview-wrap');
                const img  = document.getElementById('qe-image-preview');
                if (url && wrap && img) {
                    img.src = url;
                    wrap.classList.remove('hidden');
                } else if (wrap) {
                    wrap.classList.add('hidden');
                }
            });
        }

        // Modal triggers
        const btnCloseQe = document.getElementById('btn-close-qe');
        if (btnCloseQe) btnCloseQe.onclick = closeQuestionEditor;
        const btnCancelQe = document.getElementById('btn-cancel-qe');
        if (btnCancelQe) btnCancelQe.onclick = closeQuestionEditor;
        const btnSaveQe = document.getElementById('btn-save-qe');
        if (btnSaveQe) btnSaveQe.onclick = saveQuestionFromEditor;

        const btnAddQ = document.getElementById('btn-admin-add-question');
        if (btnAddQ) btnAddQ.onclick = () => openQuestionEditor(-1);

        const btnAddPaper = document.getElementById('btn-admin-add-paper');
        if (btnAddPaper) btnAddPaper.onclick = () => openPaperEditor(null);

        const btnEditPaper = document.getElementById('btn-admin-edit-paper');
        if (btnEditPaper) btnEditPaper.onclick = () => openPaperEditor(ADMIN_STATE.selectedPaperId);

        const btnDelPaper = document.getElementById('btn-admin-del-paper');
        if (btnDelPaper) {
            btnDelPaper.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                btnDelPaper.disabled = true;
                try {
                    await deleteSelectedPaper();
                } finally {
                    btnDelPaper.disabled = false;
                }
            };
        }

        const btnCancelPe = document.getElementById('btn-cancel-pe');
        if (btnCancelPe) btnCancelPe.onclick = () => document.getElementById('modal-paper-editor').classList.add('hidden');

        const formPe = document.getElementById('form-paper-editor');
        if (formPe) formPe.onsubmit = savePaperFromEditor;

        const peAccessMode = document.getElementById('pe-access-mode');
        if (peAccessMode) {
            peAccessMode.onchange = (e) => {
                const mode = e.target.value;
                document.getElementById('pe-pin-field').classList.toggle('hidden', mode !== 'PIN_PROTECTED');
                document.getElementById('pe-whitelist-field').classList.toggle('hidden', mode !== 'WHITELIST');
            };
        }

        // --- Google Sheets Paper Importer ---
        const btnImportSheet = document.getElementById('btn-admin-import-sheet');
        if (btnImportSheet) {
            btnImportSheet.onclick = openSheetImportModal;
        }

        const btnCloseSheet = document.getElementById('btn-close-sheet-import');
        if (btnCloseSheet) btnCloseSheet.onclick = () => document.getElementById('modal-sheet-import').classList.add('hidden');

        const btnCancelSheet = document.getElementById('btn-cancel-sheet-import');
        if (btnCancelSheet) btnCancelSheet.onclick = () => document.getElementById('modal-sheet-import').classList.add('hidden');

        const btnCopySheetTpl = document.getElementById('btn-copy-sheet-template');
        if (btnCopySheetTpl) btnCopySheetTpl.onclick = copySheetTemplate;

        const btnDlSheetTpl = document.getElementById('btn-dl-sheet-template');
        if (btnDlSheetTpl) btnDlSheetTpl.onclick = downloadSheetTemplateCSV;

        const btnParseSheet = document.getElementById('btn-parse-sheet');
        if (btnParseSheet) btnParseSheet.onclick = previewParsedSheet;

        const btnSaveSheet = document.getElementById('btn-save-sheet-import');
        if (btnSaveSheet) btnSaveSheet.onclick = saveSheetImport;

        // --- Google Sheets Student Whitelist Importer ---
        const btnImportStudents = document.getElementById('btn-admin-import-students');
        if (btnImportStudents) btnImportStudents.onclick = () => document.getElementById('modal-student-import').classList.remove('hidden');

        const btnCloseStudImp = document.getElementById('btn-close-student-import');
        if (btnCloseStudImp) btnCloseStudImp.onclick = () => document.getElementById('modal-student-import').classList.add('hidden');

        const btnCancelStudImp = document.getElementById('btn-cancel-student-import');
        if (btnCancelStudImp) btnCancelStudImp.onclick = () => document.getElementById('modal-student-import').classList.add('hidden');

        const btnCopyStudTpl = document.getElementById('btn-copy-student-template');
        if (btnCopyStudTpl) btnCopyStudTpl.onclick = copyStudentTemplate;

        const btnSaveStudImp = document.getElementById('btn-save-student-import');
        if (btnSaveStudImp) btnSaveStudImp.onclick = saveStudentImport;

        // Single student editor
        const btnAddStudent = document.getElementById('btn-admin-add-student');
        if (btnAddStudent) btnAddStudent.onclick = () => openStudentEditor();

        const btnCancelSt = document.getElementById('btn-cancel-st');
        if (btnCancelSt) btnCancelSt.onclick = () => document.getElementById('modal-student-editor').classList.add('hidden');

        const formSt = document.getElementById('form-student-editor');
        if (formSt) {
            formSt.onsubmit = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await saveSingleStudent();
            };
        }

        const btnSaveSingleSt = document.getElementById('btn-save-single-student');
        if (btnSaveSingleSt) {
            btnSaveSingleSt.onclick = async (e) => {
                e.preventDefault();
                e.stopPropagation();
                await saveSingleStudent();
            };
        }

        const btnClearStudents = document.getElementById('btn-clear-students');
        if (btnClearStudents) {
            btnClearStudents.onclick = async () => {
                if (confirm("Clear all authorized students in whitelist?")) {
                    localStorage.removeItem("jee_custom_students");
                    renderAdminStudents();
                }
            };
        }

        // Result Modifier Modal
        const btnCancelResEdit = document.getElementById('btn-cancel-res-edit');
        if (btnCancelResEdit) btnCancelResEdit.onclick = () => document.getElementById('modal-result-editor').classList.add('hidden');

        const formResEdit = document.getElementById('form-result-editor');
        if (formResEdit) formResEdit.onsubmit = saveModifiedResult;

        const btnCloseSubView = document.getElementById('btn-close-sub-view');
        if (btnCloseSubView) btnCloseSubView.onclick = () => document.getElementById('modal-submission-view').classList.add('hidden');

        const btnExportSubs = document.getElementById('btn-export-submissions');
        if (btnExportSubs) btnExportSubs.onclick = exportSubmissionsJSON;

        const btnClearVios = document.getElementById('btn-clear-violations');
        if (btnClearVios) btnClearVios.onclick = clearViolationsLog;

        const btnSeed = document.getElementById('btn-admin-seed');
        if (btnSeed) btnSeed.onclick = seedDefaultPapersToFirebase;

        const formFb = document.getElementById('form-firebase-config');
        if (formFb) formFb.onsubmit = saveFirebaseConfigForm;

        const btnResetLocal = document.getElementById('btn-admin-reset-local');
        if (btnResetLocal) {
            btnResetLocal.onclick = async () => {
                await FirebaseService.saveConfig({ apiKey: "", authDomain: "", projectId: "", storageBucket: "", messagingSenderId: "", appId: "" });
                updateFirebaseStatusBadges();
                alert("Reset to Local Fallback mode.");
            };
        }

        const btnSavePin = document.getElementById('btn-save-admin-pin');
        if (btnSavePin) {
            btnSavePin.onclick = () => {
                const pin = document.getElementById('admin-new-pin').value.trim();
                if (pin.length < 4) {
                    alert("Passcode must be at least 4 characters.");
                    return;
                }
                localStorage.setItem("jee_admin_pin", pin);
                document.getElementById('admin-new-pin').value = '';
                alert("Admin passcode updated successfully!");
            };
        }

        // Filter for questions subject
        const subjFilter = document.getElementById('admin-subject-filter');
        if (subjFilter) {
            subjFilter.onchange = () => renderAdminQuestionsTable();
        }

        const paperSelect = document.getElementById('admin-paper-select');
        if (paperSelect) {
            paperSelect.onchange = (e) => {
                ADMIN_STATE.selectedPaperId = parseInt(e.target.value);
                ADMIN_STATE.activePaperData = generatePaperByID(ADMIN_STATE.selectedPaperId);
                renderAdminQuestionsTable();
            };
        }

        updateFirebaseStatusBadges();
    }

    function updateFirebaseStatusBadges() {
        const isOnline = FirebaseService.isOnline();
        const cfg = FirebaseService.getConfig();
        const badge = document.getElementById('admin-fb-badge');
        const statusText = document.getElementById('admin-fb-status');
        const livePill = document.getElementById('fb-live-pill');
        const desc = document.getElementById('fb-status-desc');

        if (isOnline) {
            if (badge) { badge.className = "badge-online text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"; }
            if (statusText) statusText.innerText = "Firebase Connected";
            if (livePill) {
                livePill.className = "badge-online px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5";
                livePill.innerHTML = '<span class="w-2 h-2 rounded-full bg-current"></span> Connected (' + (cfg.projectId || 'Firestore') + ')';
            }
            if (desc) desc.innerText = "Live Cloud Firestore database is active and syncing real-time.";
        } else {
            if (badge) { badge.className = "badge-offline text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1"; }
            if (statusText) statusText.innerText = "Local Fallback";
            if (livePill) {
                livePill.className = "badge-offline px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5";
                livePill.innerHTML = '<span class="w-2 h-2 rounded-full bg-current"></span> Offline / Local Fallback';
            }
            if (desc) desc.innerText = "Running with smart localStorage fallback. Enter your Firebase project keys below to connect.";
        }
    }

    function showAdminScreen() {
        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-exam').classList.add('hidden');
        document.getElementById('screen-instructions').classList.add('hidden');
        document.getElementById('screen-result').classList.add('hidden');
        document.getElementById('screen-admin').classList.remove('hidden');
        updateFirebaseStatusBadges();
        switchAdminTab(ADMIN_STATE.currentTab || 'overview');
    }

    function hideAdminScreen() {
        document.getElementById('screen-admin').classList.add('hidden');
        document.getElementById('screen-setup').classList.remove('hidden');
        renderPaperGrid();
    }

    function switchAdminTab(tabName) {
        ADMIN_STATE.currentTab = tabName;
        document.querySelectorAll('[data-admin-tab]').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-admin-tab') === tabName);
        });

        const tabs = ['overview', 'papers', 'students', 'submissions', 'violations', 'settings'];
        tabs.forEach(t => {
            const view = document.getElementById(`admin-view-${t}`);
            if (view) view.classList.toggle('hidden', t !== tabName);
        });

        if (tabName === 'overview') renderAdminOverview();
        else if (tabName === 'papers') renderAdminPapers();
        else if (tabName === 'students') renderAdminStudents();
        else if (tabName === 'submissions') renderAdminSubmissions();
        else if (tabName === 'violations') renderAdminViolations();
        else if (tabName === 'settings') renderAdminSettings();
    }

    async function renderAdminOverview() {
        const subs = await FirebaseService.getSubmissions();
        const vios = await FirebaseService.getViolations();

        // Metrics
        const totalSubs = subs.length;
        let avgScore = 0;
        if (totalSubs > 0) {
            const sum = subs.reduce((acc, s) => acc + (Number(s.score) || 0), 0);
            avgScore = Math.round(sum / totalSubs);
        }

        document.getElementById('stat-total-subs').innerText = totalSubs;
        document.getElementById('stat-avg-score').innerHTML = `${avgScore} <span class="text-sm font-normal text-slate-400">/ 300</span>`;
        document.getElementById('stat-total-vios').innerText = vios.length;

        // Recent Submissions
        const recentSubsCont = document.getElementById('admin-recent-subs');
        if (recentSubsCont) {
            if (subs.length === 0) {
                recentSubsCont.innerHTML = '<div class="p-3 bg-slate-900/60 rounded-xl text-center text-slate-500">No test submissions yet.</div>';
            } else {
                recentSubsCont.innerHTML = subs.slice(0, 5).map(s => {
                    const timeStr = s.timestamp ? new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    return `
                    <div class="p-2.5 bg-slate-900/70 rounded-xl flex items-center justify-between border border-slate-800">
                        <div class="flex items-center gap-2">
                            <div class="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px]">U</div>
                            <div>
                                <div class="font-bold text-white">${s.candidateId || 'Candidate'} &bull; ${s.paperTitle || ('Paper ' + s.paperId)}</div>
                                <div class="text-[10px] text-slate-500">${timeStr} &bull; ${s.correct || 0} Correct, ${s.wrong || 0} Wrong</div>
                            </div>
                        </div>
                        <div class="font-mono font-bold text-sm ${s.score >= 0 ? 'text-emerald-400' : 'text-red-400'}">${s.score} / 300</div>
                    </div>`;
                }).join('');
            }
        }

        // Recent Violations
        const recentViosCont = document.getElementById('admin-recent-vios');
        if (recentViosCont) {
            if (vios.length === 0) {
                recentViosCont.innerHTML = '<div class="p-3 bg-slate-900/60 rounded-xl text-center text-slate-500">No security violations logged.</div>';
            } else {
                recentViosCont.innerHTML = vios.slice(0, 5).map(v => {
                    const timeStr = v.timestamp ? new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent';
                    return `
                    <div class="p-2.5 bg-slate-900/70 rounded-xl flex items-center justify-between border border-amber-500/15">
                        <div>
                            <div class="font-bold text-amber-300 text-xs">${v.violationType || 'Security Alert'}</div>
                            <div class="text-[10px] text-slate-500">${v.candidateId || 'Candidate'} &bull; ${timeStr}</div>
                        </div>
                        <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">Warning ${v.warningCount || 1}/3</span>
                    </div>`;
                }).join('');
            }
        }
    }

    function renderAdminPapers() {
        const select = document.getElementById('admin-paper-select');
        if (!select) return;

        const order = getPaperOrder();
        if (order.length === 0) {
            select.innerHTML = `<option value="">No papers available</option>`;
            ADMIN_STATE.activePaperData = null;
            const tbody = document.getElementById('admin-questions-tbody');
            if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500 text-xs">All papers have been deleted. Click "Add New Paper" or "Import from Google Sheets" to create papers.</td></tr>`;
            return;
        }

        if (!order.includes(ADMIN_STATE.selectedPaperId)) {
            ADMIN_STATE.selectedPaperId = order[0];
        }

        select.innerHTML = order.map(pid => `
            <option value="${pid}" ${pid === ADMIN_STATE.selectedPaperId ? 'selected' : ''}>Mock Paper ${pid}</option>
        `).join('');

        ADMIN_STATE.activePaperData = generatePaperByID(ADMIN_STATE.selectedPaperId);
        
        // Update access tag
        const accessTag = document.getElementById('admin-paper-access-tag');
        if (accessTag && ADMIN_STATE.activePaperData) {
            const mode = ADMIN_STATE.activePaperData.accessMode || "PUBLIC";
            accessTag.className = mode === 'PUBLIC' ? 'badge-access-public text-[10px] font-bold px-2 py-0.5 rounded-full'
                : mode === 'PIN_PROTECTED' ? 'badge-access-pin text-[10px] font-bold px-2 py-0.5 rounded-full'
                : 'badge-access-whitelist text-[10px] font-bold px-2 py-0.5 rounded-full';
            accessTag.innerText = mode;
        }

        renderAdminQuestionsTable();
    }

    function renderAdminQuestionsTable() {
        const tbody = document.getElementById('admin-questions-tbody');
        if (!tbody || !ADMIN_STATE.activePaperData) return;

        const filter = document.getElementById('admin-subject-filter')?.value || 'ALL';
        
        let allQuestions = [];
        let totalDurationSec = 0;

        ADMIN_STATE.activePaperData.sections.forEach(sec => {
            sec.questions.forEach((q, idx) => {
                const targetSec = q.timeLimitSec || (sec.name === 'Physics' ? 120 : sec.name === 'Chemistry' ? 90 : 150);
                totalDurationSec += targetSec;
                allQuestions.push({ ...q, sectionName: sec.name, globalIdx: allQuestions.length, inSecIdx: idx, timeLimitSec: targetSec });
            });
        });

        const calcDurationEl = document.getElementById('admin-calc-duration');
        if (calcDurationEl) {
            const mins = Math.ceil(totalDurationSec / 60);
            calcDurationEl.innerText = `Est. Duration: ${mins} mins (${totalDurationSec}s total)`;
        }

        if (filter !== 'ALL') {
            allQuestions = allQuestions.filter(q => q.sectionName === filter);
        }

        const countEl = document.getElementById('admin-question-count');
        if (countEl) countEl.innerText = allQuestions.length;

        const defaultPos = typeof ADMIN_STATE.activePaperData.marksCorrect === 'number' ? ADMIN_STATE.activePaperData.marksCorrect : 4;
        const defaultNeg = typeof ADMIN_STATE.activePaperData.marksNegative === 'number' ? ADMIN_STATE.activePaperData.marksNegative : -1;

        tbody.innerHTML = allQuestions.map((q, idx) => {
            const truncContent = q.content.replace(/<[^>]*>?/gm, '').substring(0, 60);
            const qPos = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
            const qNeg = typeof q.marksNegative === 'number' ? q.marksNegative : defaultNeg;
            const imgUrl = q.imageUrl || q.image;
            const imageCell = imgUrl 
                ? `<a href="${imgUrl}" target="_blank" class="inline-flex items-center gap-1 text-[10px] text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20" title="View Question Image"><i class="fas fa-image"></i> View</a>` 
                : `<span class="text-slate-600 text-xs">—</span>`;

            return `
            <tr>
                <td class="font-mono text-slate-400 font-bold">${idx + 1}</td>
                <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${q.sectionName === 'Physics' ? 'bg-blue-500/15 text-blue-400' : q.sectionName === 'Chemistry' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-purple-500/15 text-purple-400'}">${q.sectionName}</span></td>
                <td><span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">${q.type}</span></td>
                <td class="text-slate-200 text-xs">${truncContent}${q.content.length > 60 ? '…' : ''}</td>
                <td>${imageCell}</td>
                <td><span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 font-mono">+${qPos} / ${qNeg}</span></td>
                <td class="font-mono text-xs text-sky-400">${q.timeLimitSec}s</td>
                <td class="font-mono text-xs text-amber-300 font-semibold truncate max-w-[120px]">${q.options && q.answerHash ? '(Encoded Option)' : (q.answer || '—')}</td>
                <td class="text-right whitespace-nowrap">
                    <button class="btn-edit-q text-blue-400 hover:text-blue-300 px-1.5 py-1" data-q-idx="${q.globalIdx}" title="Edit Question"><i class="fas fa-edit"></i></button>
                    <button class="btn-del-q text-red-400 hover:text-red-300 px-1.5 py-1" data-q-idx="${q.globalIdx}" title="Delete Question"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-edit-q').forEach(btn => {
            btn.onclick = () => openQuestionEditor(parseInt(btn.getAttribute('data-q-idx')));
        });
        tbody.querySelectorAll('.btn-del-q').forEach(btn => {
            btn.onclick = () => deleteQuestionFromPaper(parseInt(btn.getAttribute('data-q-idx')));
        });
    }

    function openQuestionEditor(qIdx) {
        ADMIN_STATE.editingQuestionIdx = qIdx;
        const modal = document.getElementById('modal-question-editor');
        const title = document.getElementById('qe-modal-title');
        
        let q = null;
        if (qIdx >= 0 && ADMIN_STATE.activePaperData) {
            let count = 0;
            for (const sec of ADMIN_STATE.activePaperData.sections) {
                for (const quest of sec.questions) {
                    if (count === qIdx) { q = { ...quest, sectionName: sec.name }; break; }
                    count++;
                }
                if (q) break;
            }
        }

        if (q) {
            title.innerText = `Edit Question #${qIdx + 1}`;
            document.getElementById('qe-subject').value = q.sectionName || 'Physics';
            document.getElementById('qe-type').value = q.type || 'MCQ';
            document.getElementById('qe-section').value = q.section || 'Section A';
            document.getElementById('qe-time-sec').value = q.timeLimitSec || 120;
            document.getElementById('qe-content').value = q.content || '';
            document.getElementById('qe-answer').value = q.answer || (q.options ? q.options[0] : '');
            
            // Marks & Image
            const defaultPos = ADMIN_STATE.activePaperData?.marksCorrect ?? 4;
            const defaultNeg = ADMIN_STATE.activePaperData?.marksNegative ?? -1;
            document.getElementById('qe-marks-correct').value = typeof q.marksCorrect === 'number' ? q.marksCorrect : defaultPos;
            document.getElementById('qe-marks-negative').value = typeof q.marksNegative === 'number' ? q.marksNegative : defaultNeg;
            
            const imgUrl = q.imageUrl || q.image || '';
            document.getElementById('qe-image-url').value = imgUrl;
            const previewWrap = document.getElementById('qe-image-preview-wrap');
            const previewImg = document.getElementById('qe-image-preview');
            if (imgUrl && previewWrap && previewImg) {
                previewImg.src = imgUrl;
                previewWrap.classList.remove('hidden');
            } else if (previewWrap) {
                previewWrap.classList.add('hidden');
            }

            const optCont = document.getElementById('qe-options-container');
            if (optCont) optCont.style.display = q.type === 'MCQ' ? 'block' : 'none';

            if (q.options && q.options.length) {
                q.options.forEach((opt, i) => {
                    const el = document.getElementById(`qe-opt-${i}`);
                    if (el) el.value = opt || '';
                });
            }
        } else {
            title.innerText = "Add New Question";
            document.getElementById('qe-subject').value = 'Physics';
            document.getElementById('qe-type').value = 'MCQ';
            document.getElementById('qe-section').value = 'Section A';
            document.getElementById('qe-time-sec').value = 120;
            document.getElementById('qe-content').value = '';
            document.getElementById('qe-answer').value = '';
            document.getElementById('qe-marks-correct').value = ADMIN_STATE.activePaperData?.marksCorrect ?? 4;
            document.getElementById('qe-marks-negative').value = ADMIN_STATE.activePaperData?.marksNegative ?? -1;
            document.getElementById('qe-image-url').value = '';
            const previewWrap = document.getElementById('qe-image-preview-wrap');
            if (previewWrap) previewWrap.classList.add('hidden');

            for (let i = 0; i < 4; i++) {
                const el = document.getElementById(`qe-opt-${i}`);
                if (el) el.value = `Option ${String.fromCharCode(65 + i)}`;
            }
            const optCont = document.getElementById('qe-options-container');
            if (optCont) optCont.style.display = 'block';
        }

        updateQePreview();
        modal.classList.remove('hidden');
    }

    function updateQePreview() {
        const box = document.getElementById('qe-preview-box');
        const content = document.getElementById('qe-content')?.value || '';
        if (!box) return;

        box.innerHTML = content || '<span class="text-slate-500 italic">No content typed yet...</span>';
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(box, {
                delimiters: [
                    { left: "$$", right: "$$", display: true },
                    { left: "$", right: "$", display: false },
                    { left: "\\(", right: "\\)", display: false },
                    { left: "\\[", right: "\\]", display: true }
                ],
                throwOnError: false
            });
        }
    }

    function closeQuestionEditor() {
        document.getElementById('modal-question-editor').classList.add('hidden');
    }

    async function saveQuestionFromEditor() {
        const subject = document.getElementById('qe-subject').value;
        const type = document.getElementById('qe-type').value;
        const section = document.getElementById('qe-section').value;
        const timeSec = parseInt(document.getElementById('qe-time-sec').value) || 120;
        const content = document.getElementById('qe-content').value.trim();
        const answer = document.getElementById('qe-answer').value.trim();
        const marksCorrect = parseFloat(document.getElementById('qe-marks-correct').value) || 4;
        const marksNegative = parseFloat(document.getElementById('qe-marks-negative').value) || -1;
        const imageUrl = document.getElementById('qe-image-url').value.trim();

        if (!content) { alert("Question content cannot be empty."); return; }
        if (!answer) { alert("Please provide a correct answer."); return; }

        let options = [];
        if (type === 'MCQ') {
            for (let i = 0; i < 4; i++) {
                const optVal = document.getElementById(`qe-opt-${i}`)?.value.trim();
                if (optVal) options.push(optVal);
            }
            if (options.length < 2) { alert("MCQ questions require at least 2 options."); return; }
        }

        let paper = ADMIN_STATE.activePaperData || generatePaperByID(ADMIN_STATE.selectedPaperId);
        let targetSec = paper.sections.find(s => s.name === subject);
        if (!targetSec) {
            targetSec = { name: subject, questions: [] };
            paper.sections.push(targetSec);
        }

        const newQ = {
            id: `${subject.substring(0, 3)}_p${paper.id}_q${Date.now()}`,
            type: type,
            section: section,
            timeLimitSec: timeSec,
            content: content,
            options: options,
            answer: answer,
            answerHash: obfuscate(answer),
            marksCorrect: marksCorrect,
            marksNegative: marksNegative,
            imageUrl: imageUrl,
            image: imageUrl
        };

        if (ADMIN_STATE.editingQuestionIdx >= 0) {
            let count = 0;
            for (const sec of paper.sections) {
                for (let i = 0; i < sec.questions.length; i++) {
                    if (count === ADMIN_STATE.editingQuestionIdx) {
                        sec.questions[i] = newQ;
                        break;
                    }
                    count++;
                }
            }
        } else {
            targetSec.questions.push(newQ);
        }

        await FirebaseService.savePaper(paper);
        ADMIN_STATE.activePaperData = paper;
        closeQuestionEditor();
        renderAdminQuestionsTable();
        alert("Question saved successfully!");
    }

    async function deleteQuestionFromPaper(qIdx) {
        if (!confirm("Are you sure you want to delete this question?")) return;
        const paper = ADMIN_STATE.activePaperData;
        if (!paper) return;

        let count = 0, found = false;
        for (const sec of paper.sections) {
            for (let i = 0; i < sec.questions.length; i++) {
                if (count === qIdx) {
                    sec.questions.splice(i, 1);
                    found = true;
                    break;
                }
                count++;
            }
            if (found) break;
        }

        await FirebaseService.savePaper(paper);
        renderAdminQuestionsTable();
    }

    function openPaperEditor(paperId) {
        const modal = document.getElementById('modal-paper-editor');
        const title = document.getElementById('pe-modal-title');
        
        if (paperId) {
            const paper = generatePaperByID(paperId);
            title.innerText = `Edit Paper #${paperId} Settings & Access`;
            document.getElementById('pe-paper-id').value = paperId;
            document.getElementById('pe-title').value = paper.title || `JEE Mock Paper ${paperId}`;
            document.getElementById('pe-duration').value = paper.durationMinutes || 180;
            document.getElementById('pe-num-id').value = paperId;
            document.getElementById('pe-num-id').disabled = true;
            document.getElementById('pe-marks-correct').value = typeof paper.marksCorrect === 'number' ? paper.marksCorrect : 4;
            document.getElementById('pe-marks-negative').value = typeof paper.marksNegative === 'number' ? paper.marksNegative : -1;

            const mode = paper.accessMode || "PUBLIC";
            document.getElementById('pe-access-mode').value = mode;
            document.getElementById('pe-access-pin').value = paper.accessPin || "";
            document.getElementById('pe-whitelist-ids').value = (paper.allowedCandidates || []).join(', ');
            document.getElementById('pe-pin-field').classList.toggle('hidden', mode !== 'PIN_PROTECTED');
            document.getElementById('pe-whitelist-field').classList.toggle('hidden', mode !== 'WHITELIST');
        } else {
            title.innerText = "Create New Mock Paper";
            document.getElementById('pe-paper-id').value = '';
            document.getElementById('pe-title').value = 'JEE Advanced Mock Test';
            document.getElementById('pe-duration').value = 180;
            document.getElementById('pe-num-id').value = 11;
            document.getElementById('pe-num-id').disabled = false;
            document.getElementById('pe-marks-correct').value = 4;
            document.getElementById('pe-marks-negative').value = -1;
            document.getElementById('pe-access-mode').value = "PUBLIC";
            document.getElementById('pe-access-pin').value = "";
            document.getElementById('pe-whitelist-ids').value = "";
            document.getElementById('pe-pin-field').classList.add('hidden');
            document.getElementById('pe-whitelist-field').classList.add('hidden');
        }
        modal.classList.remove('hidden');
    }

    async function savePaperFromEditor(e) {
        e.preventDefault();
        const paperId = parseInt(document.getElementById('pe-num-id').value);
        const title = document.getElementById('pe-title').value.trim();
        const duration = parseInt(document.getElementById('pe-duration').value);
        const marksCorrect = parseFloat(document.getElementById('pe-marks-correct').value) || 4;
        const marksNegative = parseFloat(document.getElementById('pe-marks-negative').value) || -1;
        const accessMode = document.getElementById('pe-access-mode').value;
        const accessPin = document.getElementById('pe-access-pin').value.trim();
        const whitelistRaw = document.getElementById('pe-whitelist-ids').value.trim();
        const allowedCandidates = whitelistRaw ? whitelistRaw.split(',').map(x => x.trim().toUpperCase()).filter(Boolean) : [];

        let paper = generatePaperByID(paperId);
        paper.id = paperId;
        paper.title = title;
        paper.durationMinutes = duration;
        paper.marksCorrect = marksCorrect;
        paper.marksNegative = marksNegative;
        paper.accessMode = accessMode;
        paper.accessPin = accessPin;
        paper.allowedCandidates = allowedCandidates;

        await FirebaseService.savePaper(paper);
        document.getElementById('modal-paper-editor').classList.add('hidden');
        renderAdminPapers();
        alert(`Paper #${paperId} saved successfully!`);
    }

    async function deleteSelectedPaper() {
        // Always read from the select element directly in case ADMIN_STATE is stale
        const selectEl = document.getElementById('admin-paper-select');
        const paperId = selectEl ? parseInt(selectEl.value) : ADMIN_STATE.selectedPaperId;
        
        if (!paperId || isNaN(paperId)) {
            alert("No paper selected to delete. Please select a paper first.");
            return;
        }

        if (!confirm(`Are you sure you want to DELETE Mock Paper ${paperId}?\nThis cannot be undone.`)) return;

        // Update ADMIN_STATE to match
        ADMIN_STATE.selectedPaperId = paperId;

        try {
            await FirebaseService.deletePaper(paperId);
        } catch(err) {
            console.error("Error deleting paper:", err);
            alert("Error deleting paper. Please try again.");
            return;
        }
        
        // Pick next available paper after deletion
        const remaining = getPaperOrder();
        ADMIN_STATE.selectedPaperId = remaining.length > 0 ? remaining[0] : null;
        ADMIN_STATE.activePaperData = ADMIN_STATE.selectedPaperId ? generatePaperByID(ADMIN_STATE.selectedPaperId) : null;
        
        renderAdminPapers();
        renderPaperGrid();
        alert(`Mock Paper #${paperId} has been successfully deleted!`);
    }

    // --- Google Sheets & CSV Paper Import Controller ---
    function openSheetImportModal() {
        document.getElementById('sheet-target-paper-id').value = ADMIN_STATE.selectedPaperId || 1;
        document.getElementById('sheet-target-title').value = `JEE Mock Paper ${ADMIN_STATE.selectedPaperId || 1} (Imported)`;
        document.getElementById('sheet-paste-area').value = '';
        document.getElementById('sheet-parse-status').classList.add('hidden');
        document.getElementById('modal-sheet-import').classList.remove('hidden');
    }

    function copySheetTemplate() {
        const sample = `Subject\tType\tSection\tQuestion\tOptionA\tOptionB\tOptionC\tOptionD\tCorrectAnswer\tTimeSeconds\tImageURL\tMarksCorrect\tMarksNegative
Physics\tMCQ\tSection A\tIf force $F = ma$, what is the dimension of force?\t$[MLT^{-2}]$\t$[MLT^{-1}]$\t$[ML^2T^{-2}]$\t$[M^0LT^{-2}]$\t$[MLT^{-2}]\t120\thttps://i.imgur.com/example.png\t4\t-1
Physics\tNUMERICAL\tSection B\tCalculate value of $\\int_0^2 x^2 dx$ to nearest integer.\t\t\t\t\t3\t150\t\t4\t-1
Chemistry\tMCQ\tSection A\tWhich of the following has highest electronegativity?\tFluorine\tChlorine\tBromine\tIodine\tFluorine\t90\t\t4\t-1
Mathematics\tMCQ\tSection A\tFind roots of $x^2 - 5x + 6 = 0$.\t$x=2, 3$\t$x=1, 6$\t$x=-2, -3$\t$x=0, 5$\t$x=2, 3$\t150\t\t4\t-1`;
        
        navigator.clipboard.writeText(sample).then(() => {
            alert("Sample Google Sheets template copied to clipboard! Paste it in Google Sheets or the textarea below.");
        });
    }

    function downloadSheetTemplateCSV() {
        const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(
`Subject,Type,Section,Question,OptionA,OptionB,OptionC,OptionD,CorrectAnswer,TimeSeconds,ImageURL,MarksCorrect,MarksNegative
Physics,MCQ,Section A,"If force F=ma, what is the dimension of force?","[MLT^-2]","[MLT^-1]","[ML^2T^-2]","[M^0LT^-2]","[MLT^-2]",120,https://i.imgur.com/example.png,4,-1
Physics,NUMERICAL,Section B,"Calculate value of integral_0^2 x^2 dx to nearest integer.",,,,,3,150,,4,-1
Chemistry,MCQ,Section A,"Which has highest electronegativity?",Fluorine,Chlorine,Bromine,Iodine,Fluorine,90,,4,-1
Mathematics,MCQ,Section A,"Find roots of x^2 - 5x + 6 = 0.","x=2, 3","x=1, 6","x=-2, -3","x=0, 5","x=2, 3",150,,4,-1`
        );
        const a = document.createElement('a');
        a.href = csvContent;
        a.download = "jee_mock_paper_template.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    function parseSheetText(rawText) {
        const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return [];

        // Detect delimiter (Tab or Comma or Semicolon)
        const firstLine = lines[0];
        let delimiter = '\t';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(';') && !firstLine.includes(',')) delimiter = ';';
        else if (firstLine.includes(',')) delimiter = ',';

        const hasHeader = firstLine.toLowerCase().includes('subject') || firstLine.toLowerCase().includes('question');
        const dataLines = hasHeader ? lines.slice(1) : lines;

        const parsedQuestions = [];
        dataLines.forEach((line, i) => {
            // Simple split handling quotes if CSV
            let cols = [];
            if (delimiter === ',') {
                const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
                let match;
                while ((match = regex.exec(line)) !== null && cols.length < 16) {
                    let val = match[1] || '';
                    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1).replace(/""/g, '"');
                    cols.push(val.trim());
                    if (regex.lastIndex >= line.length) break;
                }
            } else {
                cols = line.split(delimiter).map(c => c.trim());
            }

            if (cols.length >= 4) {
                const subject = cols[0] || 'Physics';
                const type = (cols[1] || 'MCQ').toUpperCase().includes('NUM') ? 'NUMERICAL' : 'MCQ';
                const section = cols[2] || (type === 'MCQ' ? 'Section A' : 'Section B');
                const content = cols[3] || '';
                
                let options = [];
                let answer = '';
                let timeSec = 120;

                if (type === 'MCQ') {
                    options = [cols[4] || 'A', cols[5] || 'B', cols[6] || 'C', cols[7] || 'D'];
                    answer = cols[8] || options[0];
                    timeSec = parseInt(cols[9]) || (subject === 'Physics' ? 120 : subject === 'Chemistry' ? 90 : 150);
                } else {
                    answer = cols[8] || cols[4] || '0';
                    timeSec = parseInt(cols[9]) || (subject === 'Physics' ? 150 : subject === 'Chemistry' ? 120 : 180);
                }

                const imageUrl = cols[10] || '';
                const marksCorrect = (cols[11] !== undefined && cols[11] !== '') ? (parseFloat(cols[11]) || 4) : 4;
                const marksNegative = (cols[12] !== undefined && cols[12] !== '') ? (parseFloat(cols[12]) || -1) : -1;

                if (content) {
                    parsedQuestions.push({
                        id: `${subject.substring(0, 3)}_imp_q${i + 1}`,
                        subject: subject,
                        type: type,
                        section: section,
                        content: content,
                        options: options,
                        answer: answer,
                        answerHash: obfuscate(answer),
                        timeLimitSec: timeSec,
                        imageUrl: imageUrl,
                        image: imageUrl,
                        marksCorrect: marksCorrect,
                        marksNegative: marksNegative
                    });
                }
            }
        });

        return parsedQuestions;
    }

    function previewParsedSheet() {
        const raw = document.getElementById('sheet-paste-area').value.trim();
        const statusBox = document.getElementById('sheet-parse-status');
        if (!raw) {
            statusBox.className = "p-3 rounded-xl text-xs font-medium bg-red-950/50 border border-red-800 text-red-300";
            statusBox.innerText = "Please paste rows from your Google Sheet or CSV first.";
            statusBox.classList.remove('hidden');
            return;
        }

        const questions = parseSheetText(raw);
        if (questions.length === 0) {
            statusBox.className = "p-3 rounded-xl text-xs font-medium bg-amber-950/50 border border-amber-800 text-amber-300";
            statusBox.innerText = "No valid questions detected. Ensure your columns match: Subject, Type, Section, Question, OptionA, OptionB, OptionC, OptionD, Answer, TimeSeconds.";
            statusBox.classList.remove('hidden');
            return;
        }

        const phyCount = questions.filter(q => q.subject === 'Physics').length;
        const chemCount = questions.filter(q => q.subject === 'Chemistry').length;
        const mathCount = questions.filter(q => q.subject === 'Mathematics' || q.subject === 'Maths').length;
        const totalSec = questions.reduce((sum, q) => sum + q.timeLimitSec, 0);
        const estMins = Math.ceil(totalSec / 60);

        statusBox.className = "p-3 rounded-xl text-xs font-medium bg-emerald-950/50 border border-emerald-800 text-emerald-300";
        statusBox.innerHTML = `<strong>Valid Structure:</strong> Successfully parsed <strong>${questions.length} questions</strong> (${phyCount} Physics, ${chemCount} Chemistry, ${mathCount} Mathematics). Total estimated duration: <strong>${estMins} minutes</strong>. Ready to import!`;
        statusBox.classList.remove('hidden');
    }

    async function saveSheetImport() {
        const raw = document.getElementById('sheet-paste-area').value.trim();
        const paperId = parseInt(document.getElementById('sheet-target-paper-id').value) || 1;
        const paperTitle = document.getElementById('sheet-target-title').value.trim() || `JEE Mock Paper ${paperId}`;
        const questions = parseSheetText(raw);

        if (questions.length === 0) {
            alert("No questions to import. Please check your pasted data.");
            return;
        }

        const totalSec = questions.reduce((sum, q) => sum + q.timeLimitSec, 0);
        const durationMins = Math.max(10, Math.ceil(totalSec / 60));

        const sections = [
            { name: "Physics", questions: questions.filter(q => q.subject.toLowerCase().includes('phys')) },
            { name: "Chemistry", questions: questions.filter(q => q.subject.toLowerCase().includes('chem')) },
            { name: "Mathematics", questions: questions.filter(q => q.subject.toLowerCase().includes('math')) }
        ].filter(s => s.questions.length > 0);

        const newPaper = {
            id: paperId,
            title: paperTitle,
            durationMinutes: durationMins,
            accessMode: "PUBLIC",
            sections: sections
        };

        await FirebaseService.savePaper(newPaper);
        document.getElementById('modal-sheet-import').classList.add('hidden');
        ADMIN_STATE.selectedPaperId = paperId;
        ADMIN_STATE.activePaperData = newPaper;
        renderAdminPapers();
        alert(`Successfully imported ${questions.length} questions into Paper #${paperId} with duration ${durationMins} minutes!`);
    }

    // --- Google Sheets & CSV Student Whitelist Import Controller ---
    function copyStudentTemplate() {
        const sample = `CandidateID\tCandidateName\tAllowedPapers\tBatch\tEmail
JEE2026-001\tRahul Sharma\tALL\tBatch-A\trahul@example.com
JEE2026-002\tPriya Patel\t1,2,3\tBatch-A\tpriya@example.com
JEE2026-003\tAmit Verma\t1\tBatch-B\tamit@example.com`;
        navigator.clipboard.writeText(sample).then(() => {
            alert("Sample Student Whitelist template copied to clipboard!");
        });
    }

    function parseStudentText(rawText) {
        const lines = rawText.trim().split(/\r?\n/).filter(line => line.trim().length > 0);
        if (lines.length === 0) return [];

        const firstLine = lines[0];
        let delimiter = '\t';
        if (firstLine.includes('\t')) delimiter = '\t';
        else if (firstLine.includes(',')) delimiter = ',';

        const hasHeader = firstLine.toLowerCase().includes('candidate') || firstLine.toLowerCase().includes('roll');
        const dataLines = hasHeader ? lines.slice(1) : lines;

        const students = [];
        dataLines.forEach(line => {
            const cols = line.split(delimiter).map(c => c.trim());
            if (cols.length >= 1 && cols[0]) {
                students.push({
                    candidateId: cols[0].toUpperCase(),
                    name: cols[1] || 'Student',
                    allowedPapers: cols[2] || 'ALL',
                    batch: cols[3] || 'General',
                    email: cols[4] || ''
                });
            }
        });

        return students;
    }

    async function saveStudentImport() {
        const raw = document.getElementById('student-paste-area').value.trim();
        const students = parseStudentText(raw);

        if (students.length === 0) {
            alert("No candidate rows detected.");
            return;
        }

        await FirebaseService.saveStudents(students);
        document.getElementById('modal-student-import').classList.add('hidden');
        renderAdminStudents();
        alert(`Successfully imported ${students.length} authorized students to whitelist!`);
    }

    function openStudentEditor() {
        document.getElementById('st-candidate-id').value = '';
        document.getElementById('st-name').value = '';
        document.getElementById('st-papers').value = 'ALL';
        document.getElementById('st-batch').value = 'Batch A';
        document.getElementById('st-email').value = '';
        document.getElementById('modal-student-editor').classList.remove('hidden');
    }

    async function saveSingleStudent() {
        const candIdInput = document.getElementById('st-candidate-id');
        const candId = candIdInput ? candIdInput.value.trim().toUpperCase() : '';
        const name = (document.getElementById('st-name')?.value || '').trim() || 'Student';
        const papers = (document.getElementById('st-papers')?.value || '').trim() || 'ALL';
        const batch = (document.getElementById('st-batch')?.value || '').trim() || 'General';
        const email = (document.getElementById('st-email')?.value || '').trim();

        if (!candId) {
            alert("Please enter a Candidate Roll Number / ID.");
            if (candIdInput) candIdInput.focus();
            return;
        }

        const btn = document.getElementById('btn-save-single-student');
        if (btn) { btn.disabled = true; btn.innerText = 'Saving...'; }

        try {
            await FirebaseService.saveStudents([{
                candidateId: candId,
                name: name,
                allowedPapers: papers,
                batch: batch,
                email: email
            }]);

            const modal = document.getElementById('modal-student-editor');
            if (modal) modal.classList.add('hidden');
            await renderAdminStudents();
            alert('Student "' + candId + '" saved to whitelist successfully!');
        } catch(err) {
            console.error('Error saving student:', err);
            alert('Error saving student. Please try again.');
        } finally {
            if (btn) { btn.disabled = false; btn.innerText = 'Save Student'; }
        }
    }

    async function renderAdminStudents() {
        const tbody = document.getElementById('admin-students-tbody');
        if (!tbody) return;

        const students = await FirebaseService.getStudents();
        const countEl = document.getElementById('admin-student-count');
        if (countEl) countEl.innerText = students.length;

        if (students.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center py-6 text-slate-500 text-xs">No authorized candidates registered yet. Click "Import Students Sheet" or "Add Student".</td></tr>`;
            return;
        }

        tbody.innerHTML = students.map(st => `
            <tr>
                <td class="font-bold text-white font-mono">${st.candidateId}</td>
                <td class="text-slate-200 text-xs">${st.name || '—'}</td>
                <td><span class="px-2 py-0.5 rounded text-[10px] font-bold ${st.allowedPapers === 'ALL' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-purple-500/15 text-purple-400'}">${st.allowedPapers || 'ALL'}</span></td>
                <td class="text-slate-400 text-xs">${st.batch || '—'}</td>
                <td class="text-slate-400 text-xs">${st.email || '—'}</td>
                <td class="text-right">
                    <button class="btn-del-student text-red-400 hover:text-red-300 px-2 py-1 text-xs" data-cand-id="${st.candidateId}" title="Remove Access"><i class="fas fa-trash-alt"></i></button>
                </td>
            </tr>
        `).join('');

        tbody.querySelectorAll('.btn-del-student').forEach(btn => {
            btn.onclick = async () => {
                const cid = btn.getAttribute('data-cand-id');
                if (confirm(`Remove candidate "${cid}" from whitelist?`)) {
                    await FirebaseService.deleteStudent(cid);
                    renderAdminStudents();
                }
            };
        });
    }

    // --- Submissions & Results Modification Controller ---
    async function renderAdminSubmissions() {
        const tbody = document.getElementById('admin-submissions-tbody');
        if (!tbody) return;

        const subs = await FirebaseService.getSubmissions();
        if (subs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500 text-xs">No exam submissions recorded yet.</td></tr>`;
            return;
        }

        tbody.innerHTML = subs.map(s => {
            const dateStr = s.timestamp ? new Date(s.timestamp).toLocaleString() : 'N/A';
            return `
            <tr>
                <td class="font-bold text-white flex items-center gap-1.5"><i class="fas fa-user-circle text-blue-400"></i> ${s.candidateId || 'Candidate'}</td>
                <td class="text-slate-300 text-xs">${s.paperTitle || ('Paper ' + s.paperId)}</td>
                <td class="font-mono font-bold text-sm ${s.score >= 0 ? 'text-emerald-400' : 'text-red-400'}">${s.score} / ${s.maxScore || 300}</td>
                <td class="text-emerald-400 font-bold text-xs">${s.correct || 0}</td>
                <td class="text-red-400 font-bold text-xs">${s.wrong || 0}</td>
                <td class="text-slate-400 text-xs">${dateStr}</td>
                <td class="text-right whitespace-nowrap">
                    <button class="btn-view-sub text-blue-400 hover:text-blue-300 text-xs font-semibold px-2 py-1 bg-blue-500/10 rounded-lg border border-blue-500/20 mr-1" data-sub-id="${s.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-edit-sub text-amber-400 hover:text-amber-300 text-xs font-semibold px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 mr-1" data-sub-id="${s.id}" title="Modify Result">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-del-sub text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 bg-red-500/10 rounded-lg border border-red-500/20" data-sub-id="${s.id}" title="Delete Result">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>`;
        }).join('');

        tbody.querySelectorAll('.btn-view-sub').forEach(btn => {
            btn.onclick = () => viewSubmissionDetails(btn.getAttribute('data-sub-id'));
        });
        tbody.querySelectorAll('.btn-edit-sub').forEach(btn => {
            btn.onclick = () => openResultEditor(btn.getAttribute('data-sub-id'));
        });
        tbody.querySelectorAll('.btn-del-sub').forEach(btn => {
            btn.onclick = () => deleteSubmissionRecord(btn.getAttribute('data-sub-id'));
        });
    }

    async function openResultEditor(subId) {
        const subs = await FirebaseService.getSubmissions();
        const sub = subs.find(s => s.id === subId);
        if (!sub) return;

        document.getElementById('res-edit-id').value = subId;
        document.getElementById('res-edit-candidate').value = `${sub.candidateId || 'JEEPREMIUM'} • ${sub.paperTitle || ('Paper ' + sub.paperId)}`;
        document.getElementById('res-edit-score').value = sub.score !== undefined ? sub.score : 0;
        document.getElementById('res-edit-correct').value = sub.correct !== undefined ? sub.correct : 0;
        document.getElementById('res-edit-wrong').value = sub.wrong !== undefined ? sub.wrong : 0;
        document.getElementById('res-edit-notes').value = sub.adminNotes || '';

        document.getElementById('modal-result-editor').classList.remove('hidden');
    }

    async function saveModifiedResult(e) {
        e.preventDefault();
        const subId = document.getElementById('res-edit-id').value;
        const score = parseInt(document.getElementById('res-edit-score').value) || 0;
        const correct = parseInt(document.getElementById('res-edit-correct').value) || 0;
        const wrong = parseInt(document.getElementById('res-edit-wrong').value) || 0;
        const notes = document.getElementById('res-edit-notes').value.trim();

        await FirebaseService.updateSubmission(subId, {
            score: score,
            correct: correct,
            wrong: wrong,
            adminNotes: notes
        });

        document.getElementById('modal-result-editor').classList.add('hidden');
        renderAdminSubmissions();
        alert("Result modified and updated successfully in Firestore!");
    }

    async function deleteSubmissionRecord(subId) {
        if (!confirm("Are you sure you want to DELETE this student submission record?")) return;
        await FirebaseService.deleteSubmission(subId);
        renderAdminSubmissions();
    }

    async function viewSubmissionDetails(subId) {
        const subs = await FirebaseService.getSubmissions();
        const sub = subs.find(s => s.id === subId);
        if (!sub) return;

        document.getElementById('sub-view-candidate').innerText = `Candidate: ${sub.candidateId || 'JEEPREMIUM'}`;
        document.getElementById('sub-view-meta').innerText = `${sub.paperTitle || 'Mock Exam'} • Score: ${sub.score}/${sub.maxScore || 300} • ${sub.correct || 0} Correct, ${sub.wrong || 0} Incorrect`;

        const cont = document.getElementById('sub-view-answers');
        if (cont && sub.answers) {
            const keys = Object.keys(sub.answers);
            if (keys.length === 0) {
                cont.innerHTML = '<p class="text-slate-500 italic">No answers recorded.</p>';
            } else {
                cont.innerHTML = keys.map((qId, i) => {
                    const ans = sub.answers[qId];
                    const val = ans.value !== null && ans.value !== '' ? ans.value : 'Skipped';
                    const timeSpent = ans.timeSpentSec ? `Time spent: ${ans.timeSpentSec}s` : '';
                    return `
                    <div class="p-2.5 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
                        <div>
                            <span class="font-bold text-white">Q${i + 1} (${qId})</span>
                            <span class="text-slate-400 ml-2">Marked: <strong class="text-blue-400 font-mono">${val}</strong></span>
                            ${timeSpent ? `<span class="text-sky-400 text-[10px] ml-2 font-mono">(${timeSpent})</span>` : ''}
                        </div>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold ${ans.status.includes('answered') ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-700 text-slate-400'}">${ans.status}</span>
                    </div>`;
                }).join('');
            }
        }

        document.getElementById('modal-submission-view').classList.remove('hidden');
    }

    async function exportSubmissionsJSON() {
        const subs = await FirebaseService.getSubmissions();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(subs, null, 2));
        const a = document.createElement('a');
        a.setAttribute("href", dataStr);
        a.setAttribute("download", `jee_exam_submissions_${Date.now()}.json`);
        document.body.appendChild(a);
        a.click();
        a.remove();
    }

    async function renderAdminViolations() {
        const tbody = document.getElementById('admin-violations-tbody');
        if (!tbody) return;

        const vios = await FirebaseService.getViolations();
        if (vios.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500 text-xs">No proctoring violations recorded. Clean session record!</td></tr>`;
            return;
        }

        tbody.innerHTML = vios.map(v => {
            const dateStr = v.timestamp ? new Date(v.timestamp).toLocaleString() : 'N/A';
            return `
            <tr>
                <td class="text-slate-400 text-xs">${dateStr}</td>
                <td class="font-bold text-white">${v.candidateId || 'Candidate'}</td>
                <td class="text-slate-300 text-xs">${v.paperTitle || ('Paper ' + v.paperId)}</td>
                <td class="text-amber-400 font-bold text-xs"><i class="fas fa-exclamation-circle mr-1"></i> ${v.violationType || 'Focus Lost'}</td>
                <td><span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/30">Warning ${v.warningCount || 1}/3</span></td>
            </tr>`;
        }).join('');
    }

    function clearViolationsLog() {
        if (!confirm("Clear all security incident logs?")) return;
        localStorage.removeItem("jee_custom_violations");
        renderAdminViolations();
    }

    function renderAdminSettings() {
        const cfg = FirebaseService.getConfig();
        document.getElementById('fb-cfg-project').value = cfg.projectId || '';
        document.getElementById('fb-cfg-key').value = cfg.apiKey || '';
        document.getElementById('fb-cfg-auth').value = cfg.authDomain || '';
        document.getElementById('fb-cfg-bucket').value = cfg.storageBucket || '';
        document.getElementById('fb-cfg-sender').value = cfg.messagingSenderId || '';
        document.getElementById('fb-cfg-app').value = cfg.appId || '';
        updateFirebaseStatusBadges();
    }

    async function saveFirebaseConfigForm(e) {
        e.preventDefault();
        const newCfg = {
            projectId: document.getElementById('fb-cfg-project').value.trim(),
            apiKey: document.getElementById('fb-cfg-key').value.trim(),
            authDomain: document.getElementById('fb-cfg-auth').value.trim(),
            storageBucket: document.getElementById('fb-cfg-bucket').value.trim(),
            messagingSenderId: document.getElementById('fb-cfg-sender').value.trim(),
            appId: document.getElementById('fb-cfg-app').value.trim()
        };

        const res = await FirebaseService.saveConfig(newCfg);
        updateFirebaseStatusBadges();
        alert(res.message);
    }

    async function seedDefaultPapersToFirebase() {
        if (!confirm("This will upload all 10 built-in mock exam papers into Firestore. Proceed?")) return;
        const order = Array.from({ length: 10 }, (_, i) => i + 1);
        let count = 0;
        for (const pid of order) {
            const paper = generatePaperByID(pid);
            await FirebaseService.savePaper(paper);
            count++;
        }
        alert(`Successfully synced ${count} papers to backend!`);
        renderAdminPapers();
    }

    // Boot application when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootstrapApp);
    } else {
        bootstrapApp();
    }
})();

