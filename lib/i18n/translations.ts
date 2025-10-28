// Translation dictionaries for English and German
export const translations = {
  en: {
    // Navigation & Branding
    brandName: "QuestEd",
    login: "Login",
    logout: "Logout",
    signup: "Sign Up",
    getStarted: "Get Started",
    signIn: "Sign In",
    
    // Home Page
    home: {
      heroTitle: "Master German with",
      heroHighlight: " Interactive Quizzes",
      heroDescription: "Experience the perfect blend of Kahoot's excitement and Duolingo's effectiveness. Live quizzes, instant feedback, and competitive learning.",
      startLearning: "Start Learning Now",
      stats: {
        students: "Active Students",
        teachers: "Teachers",
        tests: "Tests Completed"
      },
      whyTitle: "Why Choose QuestEd?",
      whySubtitle: "Powerful features designed for modern language learning",
      features: {
        liveQuizzes: {
          title: "Live Quizzes",
          description: "Real-time interactive tests with instant feedback and live leaderboards. Feel the adrenaline!"
        },
        classroom: {
          title: "Classroom Management",
          description: "Effortlessly organize students, assign tests, and track progress all in one place."
        },
        gamified: {
          title: "Gamified Learning",
          description: "Earn points, climb leaderboards, and compete with classmates to stay motivated."
        },
        analytics: {
          title: "Detailed Analytics",
          description: "Comprehensive insights into performance, progress, and areas for improvement."
        },
        adaptive: {
          title: "Adaptive Testing",
          description: "Smart question selection that adapts to your skill level for optimal learning."
        },
        feedback: {
          title: "Instant Feedback",
          description: "Get immediate results and explanations to reinforce learning in real-time."
        }
      },
      ctaTitle: "Ready to Transform Your German Learning?",
      ctaDescription: "Join hundreds of PICT students already mastering German through interactive quizzes",
      ctaButton: "Create Free Account"
    },
    
    // Auth Pages
    auth: {
      loginTitle: "Welcome Back!",
      loginDescription: "Sign in to continue your German learning journey",
      signupTitle: "Join QuestEd",
      signupDescription: "Create your account to start learning German",
      email: "Email",
      password: "Password",
      name: "Full Name",
      rollNumber: "Roll Number",
      role: "I am a",
      student: "Student",
      teacher: "Teacher",
      loginButton: "Sign In",
      signupButton: "Create Account",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      backToHome: "Back to Home",
      emailPlaceholder: "your@email.com",
      passwordPlaceholder: "Enter your password",
      namePlaceholder: "Sriram Kommalapudi",
      rollNumberPlaceholder: "e.g., 12345"
    },
    
    // Student Dashboard
    student: {
      portal: "Student Portal",
      welcome: "Welcome back",
      welcomeMessage: "Ready to take on some challenges today?",
      stats: {
        testsCompleted: "Tests Completed",
        avgScore: "Avg Score",
        streak: "Day Streak"
      },
      availableTests: "Available Tests",
      recentResults: "Recent Results",
      noTests: "No tests available",
      noTestsMessage: "Check back later for new assignments from your teachers",
      noResults: "No results yet",
      noResultsMessage: "Complete some tests to see your results here",
      takeTest: "Take Test",
      viewResult: "View Result",
      liveNow: "LIVE NOW",
      deadline: "Deadline",
      questions: "questions",
      score: "Score",
      joinLive: "Join Live Quiz",
      joinCode: "Enter 6-digit join code",
      join: "Join",
      invalidCode: "Please enter a valid 6-digit code",
      joining: "Joining..."
    },
    
    // Teacher Dashboard
    teacher: {
      portal: "Teacher Portal",
      welcome: "Welcome",
      stats: {
        totalClasses: "Total Classes",
        totalTests: "Total Tests",
        activeStudents: "Active Students"
      },
      quickActions: "Quick Actions",
      quickActionsDescription: "Common tasks and shortcuts",
      createClassroom: "Create New Classroom",
      createClassroomDesc: "Set up a new class",
      createTest: "Create New Test",
      createTestDesc: "Design a new quiz",
      viewAnalytics: "View Analytics",
      viewAnalyticsDesc: "Check performance",
      myClassrooms: "My Classrooms",
      myTests: "My Tests",
      noClassrooms: "No classrooms yet",
      noClassroomsMessage: "Create your first classroom to get started",
      noTests: "No tests yet",
      noTestsMessage: "Create your first test to get started",
      students: "students",
      live: "Live",
      deadlineMode: "Deadline",
      active: "Active",
      completed: "Completed",
      viewLive: "View Live"
    },
    
    // Classroom Creation
    classroom: {
      title: "Create Classroom",
      description: "Set up a new classroom for your students",
      name: "Classroom Name",
      namePlaceholder: "e.g., German A1 - Section A",
      desc: "Description",
      descPlaceholder: "Brief description of the classroom",
      cancel: "Cancel",
      create: "Create Classroom",
      creating: "Creating..."
    },
    
    // Test Creation
    test: {
      createTitle: "Create Test",
      createDescription: "Design a new German language quiz",
      title: "Test Title",
      titlePlaceholder: "e.g., German Vocabulary - Week 5",
      selectClassroom: "Select Classroom",
      chooseClassroom: "Choose a classroom",
      mode: "Test Mode",
      liveMode: "Live Mode",
      liveModeDesc: "Real-time quiz with join code",
      deadlineMode: "Deadline Mode",
      deadlineModeDesc: "Students complete before deadline",
      timeLimit: "Time Limit (minutes per question)",
      deadline: "Deadline",
      questions: "Questions",
      addQuestion: "Add Question",
      questionText: "Question",
      questionPlaceholder: "Enter your question",
      options: "Options",
      optionPlaceholder: "Option",
      correctAnswer: "Correct Answer",
      selectCorrect: "Select correct answer",
      removeQuestion: "Remove Question",
      cancel: "Cancel",
      createTest: "Create Test",
      creating: "Creating..."
    },
    
    // Quiz Taking
    quiz: {
      timeRemaining: "Time Remaining",
      question: "Question",
      of: "of",
      submit: "Submit Test",
      submitting: "Submitting...",
      nextQuestion: "Next Question",
      correct: "Correct!",
      incorrect: "Incorrect!",
      timeUp: "Time's up!",
      loading: "Loading test..."
    },
    
    // Results Page
    results: {
      title: "Test Results",
      yourScore: "Your Score",
      outOf: "out of",
      excellent: "Excellent work! Keep it up!",
      good: "Good job! Keep practicing!",
      needsWork: "Keep practicing! You'll improve!",
      answerReview: "Answer Review",
      yourAnswer: "Your Answer",
      correctAnswer: "Correct Answer",
      retakeTest: "Retake Test",
      backToDashboard: "Back to Dashboard",
      noSubmission: "No submission found",
      noSubmissionMessage: "You haven't submitted this test yet"
    },
    
    // Live Test Control
    liveTest: {
      title: "Live Test Control",
      description: "Manage your live quiz session",
      status: "Status",
      inactive: "Inactive",
      active: "Active",
      joinCode: "Join Code",
      copyCode: "Copy Code",
      copied: "Copied!",
      startTest: "Start Test",
      stopTest: "Stop Test",
      starting: "Starting...",
      stopping: "Stopping...",
      participants: "Active Participants",
      leaderboard: "Live Leaderboard",
      noParticipants: "Waiting for students to join...",
      backToDashboard: "Back to Dashboard",
      points: "points",
      shareCode: "Share this code with students",
      testStats: "Test Statistics",
      totalQuestions: "Total Questions",
      timePerQuestion: "Time per Question",
      minutes: "minutes"
    },
    
    // Common
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      view: "View",
      back: "Back",
      next: "Next",
      previous: "Previous",
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      yes: "Yes",
      no: "No"
    }
  },
  de: {
    // Navigation & Branding
    brandName: "QuestEd",
    login: "Anmelden",
    logout: "Abmelden",
    signup: "Registrieren",
    getStarted: "Jetzt starten",
    signIn: "Einloggen",
    
    // Home Page
    home: {
      tagline: "PICT College Deutsch-Testplattform",
      heroTitle: "Meistere Deutsch mit",
      heroHighlight: " interaktiven Quiz",
      heroDescription: "Erlebe die perfekte Mischung aus Kahoots Spannung und Duolingos Effektivität. Live-Quiz, sofortiges Feedback und wettbewerbsorientiertes Lernen.",
      startLearning: "Jetzt lernen",
      stats: {
        students: "Aktive Studenten",
        teachers: "Lehrer",
        tests: "Tests abgeschlossen"
      },
      whyTitle: "Warum QuestEd?",
      whySubtitle: "Leistungsstarke Funktionen für modernes Sprachenlernen",
      features: {
        liveQuizzes: {
          title: "Live-Quiz",
          description: "Echtzeit-interaktive Tests mit sofortigem Feedback und Live-Bestenlisten. Spüre das Adrenalin!"
        },
        classroom: {
          title: "Klassenverwaltung",
          description: "Organisiere mühelos Schüler, weise Tests zu und verfolge den Fortschritt an einem Ort."
        },
        gamified: {
          title: "Spielerisches Lernen",
          description: "Sammle Punkte, erklimme Bestenlisten und trete gegen Mitschüler an, um motiviert zu bleiben."
        },
        analytics: {
          title: "Detaillierte Analysen",
          description: "Umfassende Einblicke in Leistung, Fortschritt und Verbesserungsbereiche."
        },
        adaptive: {
          title: "Adaptives Testen",
          description: "Intelligente Fragenauswahl, die sich an dein Niveau anpasst für optimales Lernen."
        },
        feedback: {
          title: "Sofortiges Feedback",
          description: "Erhalte sofortige Ergebnisse und Erklärungen zur Festigung des Lernens in Echtzeit."
        }
      },
      ctaTitle: "Bereit, dein Deutschlernen zu transformieren?",
      ctaDescription: "Schließe dich Hunderten von PICT-Studenten an, die bereits Deutsch durch interaktive Quiz meistern",
      ctaButton: "Kostenloses Konto erstellen"
    },
    
    // Auth Pages
    auth: {
      loginTitle: "Willkommen zurück!",
      loginDescription: "Melde dich an, um deine Deutschlernreise fortzusetzen",
      signupTitle: "Tritt QuestEd bei",
      signupDescription: "Erstelle dein Konto, um Deutsch zu lernen",
      email: "E-Mail",
      password: "Passwort",
      name: "Vollständiger Name",
      rollNumber: "Matrikelnummer",
      role: "Ich bin",
      student: "Student",
      teacher: "Lehrer",
      loginButton: "Anmelden",
      signupButton: "Konto erstellen",
      noAccount: "Kein Konto?",
      hasAccount: "Bereits ein Konto?",
      backToHome: "Zurück zur Startseite",
      emailPlaceholder: "deine@email.com",
      passwordPlaceholder: "Gib dein Passwort ein",
      namePlaceholder: "Max Mustermann",
      rollNumberPlaceholder: "z.B. 12345"
    },
    
    // Student Dashboard
    student: {
      portal: "Studentenportal",
      welcome: "Willkommen zurück",
      welcomeMessage: "Bereit für neue Herausforderungen heute?",
      stats: {
        testsCompleted: "Tests abgeschlossen",
        avgScore: "Durchschn. Punktzahl",
        streak: "Tage Serie"
      },
      availableTests: "Verfügbare Tests",
      recentResults: "Letzte Ergebnisse",
      noTests: "Keine Tests verfügbar",
      noTestsMessage: "Schaue später nach neuen Aufgaben von deinen Lehrern",
      noResults: "Noch keine Ergebnisse",
      noResultsMessage: "Absolviere einige Tests, um deine Ergebnisse hier zu sehen",
      takeTest: "Test absolvieren",
      viewResult: "Ergebnis ansehen",
      liveNow: "LIVE JETZT",
      deadline: "Frist",
      questions: "Fragen",
      score: "Punktzahl",
      joinLive: "Live-Quiz beitreten",
      joinCode: "6-stelligen Code eingeben",
      join: "Beitreten",
      invalidCode: "Bitte gib einen gültigen 6-stelligen Code ein",
      joining: "Trete bei..."
    },
    
    // Teacher Dashboard
    teacher: {
      portal: "Lehrerportal",
      welcome: "Willkommen",
      stats: {
        totalClasses: "Gesamte Klassen",
        totalTests: "Gesamte Tests",
        activeStudents: "Aktive Studenten"
      },
      quickActions: "Schnellaktionen",
      quickActionsDescription: "Häufige Aufgaben und Verknüpfungen",
      createClassroom: "Neues Klassenzimmer erstellen",
      createClassroomDesc: "Richte eine neue Klasse ein",
      createTest: "Neuen Test erstellen",
      createTestDesc: "Entwerfe ein neues Quiz",
      viewAnalytics: "Analysen ansehen",
      viewAnalyticsDesc: "Leistung überprüfen",
      myClassrooms: "Meine Klassenzimmer",
      myTests: "Meine Tests",
      noClassrooms: "Noch keine Klassenzimmer",
      noClassroomsMessage: "Erstelle dein erstes Klassenzimmer, um zu beginnen",
      noTests: "Noch keine Tests",
      noTestsMessage: "Erstelle deinen ersten Test, um zu beginnen",
      students: "Studenten",
      live: "Live",
      deadlineMode: "Frist",
      active: "Aktiv",
      completed: "Abgeschlossen",
      viewLive: "Live ansehen"
    },
    
    // Classroom Creation
    classroom: {
      title: "Klassenzimmer erstellen",
      description: "Richte ein neues Klassenzimmer für deine Schüler ein",
      name: "Klassenzimmername",
      namePlaceholder: "z.B. Deutsch A1 - Sektion A",
      desc: "Beschreibung",
      descPlaceholder: "Kurze Beschreibung des Klassenzimmers",
      cancel: "Abbrechen",
      create: "Klassenzimmer erstellen",
      creating: "Erstelle..."
    },
    
    // Test Creation
    test: {
      createTitle: "Test erstellen",
      createDescription: "Entwerfe ein neues Deutschsprachen-Quiz",
      title: "Testtitel",
      titlePlaceholder: "z.B. Deutsches Vokabular - Woche 5",
      selectClassroom: "Klassenzimmer auswählen",
      chooseClassroom: "Wähle ein Klassenzimmer",
      mode: "Testmodus",
      liveMode: "Live-Modus",
      liveModeDesc: "Echtzeit-Quiz mit Beitrittscode",
      deadlineMode: "Fristmodus",
      deadlineModeDesc: "Studenten vervollständigen vor Frist",
      timeLimit: "Zeitlimit (Minuten pro Frage)",
      deadline: "Frist",
      questions: "Fragen",
      addQuestion: "Frage hinzufügen",
      questionText: "Frage",
      questionPlaceholder: "Gib deine Frage ein",
      options: "Optionen",
      optionPlaceholder: "Option",
      correctAnswer: "Richtige Antwort",
      selectCorrect: "Wähle richtige Antwort",
      removeQuestion: "Frage entfernen",
      cancel: "Abbrechen",
      createTest: "Test erstellen",
      creating: "Erstelle..."
    },
    
    // Quiz Taking
    quiz: {
      timeRemaining: "Verbleibende Zeit",
      question: "Frage",
      of: "von",
      submit: "Test abgeben",
      submitting: "Sende...",
      nextQuestion: "Nächste Frage",
      correct: "Richtig!",
      incorrect: "Falsch!",
      timeUp: "Zeit abgelaufen!",
      loading: "Lade Test..."
    },
    
    // Results Page
    results: {
      title: "Testergebnisse",
      yourScore: "Deine Punktzahl",
      outOf: "von",
      excellent: "Ausgezeichnete Arbeit! Weiter so!",
      good: "Gute Arbeit! Übe weiter!",
      needsWork: "Übe weiter! Du wirst dich verbessern!",
      answerReview: "Antwortüberprüfung",
      yourAnswer: "Deine Antwort",
      correctAnswer: "Richtige Antwort",
      retakeTest: "Test wiederholen",
      backToDashboard: "Zurück zum Dashboard",
      noSubmission: "Keine Abgabe gefunden",
      noSubmissionMessage: "Du hast diesen Test noch nicht abgegeben"
    },
    
    // Live Test Control
    liveTest: {
      title: "Live-Test-Steuerung",
      description: "Verwalte deine Live-Quiz-Sitzung",
      status: "Status",
      inactive: "Inaktiv",
      active: "Aktiv",
      joinCode: "Beitrittscode",
      copyCode: "Code kopieren",
      copied: "Kopiert!",
      startTest: "Test starten",
      stopTest: "Test stoppen",
      starting: "Starte...",
      stopping: "Stoppe...",
      participants: "Aktive Teilnehmer",
      leaderboard: "Live-Bestenliste",
      noParticipants: "Warte auf Studenten zum Beitreten...",
      backToDashboard: "Zurück zum Dashboard",
      points: "Punkte",
      shareCode: "Teile diesen Code mit Studenten",
      testStats: "Teststatistiken",
      totalQuestions: "Gesamtfragen",
      timePerQuestion: "Zeit pro Frage",
      minutes: "Minuten"
    },
    
    // Common
    common: {
      loading: "Lädt...",
      error: "Fehler",
      success: "Erfolg",
      save: "Speichern",
      cancel: "Abbrechen",
      delete: "Löschen",
      edit: "Bearbeiten",
      view: "Ansehen",
      back: "Zurück",
      next: "Weiter",
      previous: "Vorherige",
      search: "Suchen",
      filter: "Filtern",
      sort: "Sortieren",
      yes: "Ja",
      no: "Nein"
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
