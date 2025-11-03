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
      heroTitle: "An Open-Source Quiz Platform",
      heroHighlight: " for Interactive Learning",
      heroDescription: "The complete quiz platform for educators and students. Live competitions, instant feedback, and powerful analytics. No subscriptions, no limits, forever free.",
      startLearning: "Start Creating Now",
      stats: {
        students: "Active Users",
        teachers: "Educators",
        tests: "Quizzes Created"
      },
      whyTitle: "Why Choose QuestEd?",
      whySubtitle: "Everything you need in a quiz platform, completely free and open-source",
      features: {
        liveQuizzes: {
          title: "Live Quiz Competitions",
          description: "Host real-time quiz sessions with join codes, live leaderboards, and instant scoring. Just like Kahoot, but better!"
        },
        classroom: {
          title: "Classroom Management",
          description: "Create unlimited classrooms, invite students, assign quizzes, and track progress all in one place."
        },
        gamified: {
          title: "Gamification Built-In",
          description: "Engage students with points, leaderboards, and competitive gameplay. Make learning fun and addictive."
        },
        analytics: {
          title: "Powerful Analytics",
          description: "Comprehensive insights into student performance, question difficulty, and class progress. Data-driven teaching."
        },
        adaptive: {
          title: "Question Bank",
          description: "Build your question library, import from CSV, reuse questions across quizzes. Save time, teach better."
        },
        feedback: {
          title: "100% Free Forever",
          description: "No premium features locked behind paywalls. No student limits. No quiz limits. Completely free and open-source."
        }
      },
      ctaTitle: "Ready to Transform Your Teaching?",
      ctaDescription: "Join educators worldwide using QuestEd as their free, open-source alternative to expensive quiz platforms",
      ctaButton: "Get Started Free"
    },
    
    // Auth Pages
    auth: {
      loginTitle: "Welcome Back!",
      loginDescription: "Sign in to create and host interactive quizzes",
      signupTitle: "Join QuestEd",
      signupDescription: "Create your free account to start building quizzes",
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
    },
    
    // Question of the Day
    qotd: {
      title: "Question of the Day",
      promptTitle: "Question of the Day!",
      promptText: "Answer today's fun question and see what everyone thinks!",
      answerNow: "Answer Now!",
      resultsText: "Here's what the community thinks!",
      yourChoice: "Your choice",
      totalVotes: "total votes",
      loading: "Loading question...",
      newDaily: "New question every day! Come back tomorrow."
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
      heroTitle: "Eine Open-Source-Quiz-Plattform",
      heroHighlight: " für interaktives Lernen",
      heroDescription: "Die komplette Quiz-Plattform für Lehrer und Schüler. Live-Wettbewerbe, sofortiges Feedback und leistungsstarke Analysen. Keine Abonnements, keine Limits, für immer kostenlos.",
      startLearning: "Jetzt loslegen",
      stats: {
        students: "Aktive Benutzer",
        teachers: "Pädagogen",
        tests: "Quiz erstellt"
      },
      whyTitle: "Warum QuestEd?",
      whySubtitle: "Alles, was Sie in einer Quiz-Plattform benötigen, völlig kostenlos und Open Source",
      features: {
        liveQuizzes: {
          title: "Live-Quiz-Wettbewerbe",
          description: "Veranstalten Sie Echtzeit-Quiz-Sitzungen mit Beitrittscodes, Live-Bestenlisten und sofortiger Bewertung. Wie Kahoot, aber besser!"
        },
        classroom: {
          title: "Klassenverwaltung",
          description: "Erstellen Sie unbegrenzt Klassenräume, laden Sie Schüler ein, weisen Sie Quiz zu und verfolgen Sie den Fortschritt - alles an einem Ort."
        },
        gamified: {
          title: "Eingebaute Gamification",
          description: "Begeistern Sie Schüler mit Punkten, Bestenlisten und Wettbewerben. Machen Sie das Lernen unterhaltsam und süchtig machend."
        },
        analytics: {
          title: "Leistungsstarke Analysen",
          description: "Umfassende Einblicke in Schülerleistung, Fragenschwierigkeit und Klassenfortschritt. Datengesteuertes Lehren."
        },
        adaptive: {
          title: "Fragenbank",
          description: "Bauen Sie Ihre Fragenbibliothek auf, importieren Sie aus CSV, verwenden Sie Fragen in mehreren Quiz wieder. Sparen Sie Zeit, lehren Sie besser."
        },
        feedback: {
          title: "100% kostenlos für immer",
          description: "Keine Premium-Funktionen hinter Bezahlschranken. Keine Schülerlimits. Keine Quiz-Limits. Völlig kostenlos und Open Source."
        }
      },
      ctaTitle: "Bereit, Ihren Unterricht zu transformieren?",
      ctaDescription: "Schließen Sie sich Pädagogen weltweit an, die QuestEd als kostenlose Open-Source-Alternative zu teuren Quiz-Plattformen nutzen",
      ctaButton: "Kostenlos starten"
    },
    
    // Auth Pages
    auth: {
      loginTitle: "Willkommen zurück!",
      loginDescription: "Melden Sie sich an, um interaktive Quiz zu erstellen und zu hosten",
      signupTitle: "Tritt QuestEd bei",
      signupDescription: "Erstellen Sie Ihr kostenloses Konto, um mit der Quiz-Erstellung zu beginnen",
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
    },
    
    // Question of the Day
    qotd: {
      title: "Frage des Tages",
      promptTitle: "Frage des Tages!",
      promptText: "Beantworte die heutige Spaßfrage und sehe, was alle denken!",
      answerNow: "Jetzt antworten!",
      resultsText: "Das denkt die Community!",
      yourChoice: "Deine Wahl",
      totalVotes: "Stimmen insgesamt",
      loading: "Frage wird geladen...",
      newDaily: "Jeden Tag eine neue Frage! Komm morgen wieder."
    }
  }
} as const;

export type Language = keyof typeof translations;
export type TranslationKeys = typeof translations.en;
