export const TRACKS = [
  {
    id: 1, name: 'AI Foundations', type: 'Main Course',
    description: 'Master the core concepts of artificial intelligence and machine learning.',
    icon: '🧠', color: 'purple', duration: '8 weeks', lessons: 24
  },
  {
    id: 2, name: 'AI Content Creation', type: 'Main Course',
    description: 'Learn to create compelling content using AI tools and automation.',
    icon: '✍️', color: 'blue', duration: '6 weeks', lessons: 18
  },
  {
    id: 3, name: 'AI Software Dev', type: 'Main Course',
    description: 'Build real-world AI-powered applications and APIs.',
    icon: '💻', color: 'teal', duration: '10 weeks', lessons: 30
  },
  {
    id: 4, name: 'Agentic Automation', type: 'Main Course',
    description: 'Design and deploy autonomous AI agents for real workflows.',
    icon: '🤖', color: 'green', duration: '8 weeks', lessons: 22
  },
  {
    id: 5, name: 'AgentEx Beginner Bootcamp', type: 'Bootcamp',
    description: 'Fast-track into agentic AI. Zero to hero in 4 weeks.',
    icon: '🚀', color: 'orange', duration: '4 weeks', lessons: 12
  },
  {
    id: 6, name: 'AgentEx Intermediate Bootcamp', type: 'Bootcamp',
    description: 'Build multi-agent systems and advanced automation pipelines.',
    icon: '⚡', color: 'yellow', duration: '4 weeks', lessons: 14
  },
  {
    id: 7, name: 'AgentEx Advanced Bootcamp', type: 'Bootcamp',
    description: 'Production-grade agentic systems, evals, and deployment.',
    icon: '🎯', color: 'red', duration: '4 weeks', lessons: 16
  },
]

export const MENTORS = [
  { id: 1, name: 'Priya Nair', specialty: 'AI Foundations & ML', avatar: 'PN', students: 24 },
  { id: 2, name: 'Alex Chen', specialty: 'Software Dev & APIs', avatar: 'AC', students: 18 },
  { id: 3, name: 'Sara Mathew', specialty: 'Content & Automation', avatar: 'SM', students: 20 },
  { id: 4, name: 'Rohan Das', specialty: 'Agentic Systems', avatar: 'RD', students: 15 },
]

export const generateRoadmap = (trackId) => {
  const track = TRACKS.find(t => t.id === trackId)
  return [
    {
      id: 1, title: 'Module 1: Foundations', passingScore: 70, completed: false,
      assessmentUnlocked: false, assessmentPassed: false,
      lessons: [
        { id: 1, title: `Introduction to ${track.name}`, completed: true, locked: false, content: `Welcome to ${track.name}! In this lesson you will understand the core principles, history, and real-world applications. This is the starting point of your journey.\n\nBy the end of this lesson you will:\n• Understand what ${track.name} means\n• Know its real-world applications\n• Be ready for the next lesson` },
        { id: 2, title: 'Key Concepts and Terminology', completed: false, locked: false, content: `Every field has its own language. In this lesson you will master the essential vocabulary and concepts used throughout this course.\n\nTopics covered:\n• Core definitions\n• Industry terminology\n• Practical examples\n• Common misconceptions` },
        { id: 3, title: 'Tools and Environment Setup', completed: false, locked: true, content: `Setting up the right environment is critical. This lesson walks you through every tool you need and how to configure them.\n\nYou will install and configure:\n• Required software\n• Development environment\n• Key extensions and plugins` },
      ]
    },
    {
      id: 2, title: 'Module 2: Core Skills', passingScore: 75, completed: false,
      assessmentUnlocked: false, assessmentPassed: false,
      lessons: [
        { id: 4, title: 'Building Your First Project', completed: false, locked: true, content: 'Hands-on time! You will build your first real project in this field from scratch.' },
        { id: 5, title: 'Working with Data', completed: false, locked: true, content: 'Data is the backbone of AI. Learn how to collect, clean, and use data effectively.' },
        { id: 6, title: 'Testing and Debugging', completed: false, locked: true, content: 'Learn professional debugging techniques and how to write tests for your projects.' },
      ]
    },
    {
      id: 3, title: 'Module 3: Advanced Topics', passingScore: 80, completed: false,
      assessmentUnlocked: false, assessmentPassed: false,
      lessons: [
        { id: 7, title: 'Advanced Patterns', completed: false, locked: true, content: 'Deep dive into advanced techniques used by professionals in the industry.' },
        { id: 8, title: 'Real-World Case Studies', completed: false, locked: true, content: 'Analyze real projects, understand decisions made, and learn from industry leaders.' },
        { id: 9, title: 'Capstone Project', completed: false, locked: true, content: 'Build a complete end-to-end project that showcases everything you have learned.' },
      ]
    },
  ]
}

export const ASSESSMENT_QUESTIONS = {
  1: [
    { id: 1, question: 'What does AI stand for?', options: ['Automated Intelligence', 'Artificial Intelligence', 'Augmented Interface', 'Applied Integration'], answer: 1 },
    { id: 2, question: 'Which of the following is a type of machine learning?', options: ['Supervised learning', 'Directed learning', 'Manual learning', 'Static learning'], answer: 0 },
    { id: 3, question: 'What is a neural network inspired by?', options: ['Computer circuits', 'The human brain', 'Mathematical equations', 'Database schemas'], answer: 1 },
    { id: 4, question: 'What is the main goal of a learning management system?', options: ['Store files', 'Automate learning journeys', 'Send emails', 'Track attendance only'], answer: 1 },
    { id: 5, question: 'Which tool is commonly used for AI development?', options: ['Photoshop', 'Python', 'Excel', 'Notepad'], answer: 1 },
  ],
  2: [
    { id: 1, question: 'What does API stand for?', options: ['Application Program Interface', 'Automated Programming Integration', 'Applied Process Input', 'None of the above'], answer: 0 },
    { id: 2, question: 'Which HTTP method is used to create data?', options: ['GET', 'DELETE', 'POST', 'PATCH'], answer: 2 },
    { id: 3, question: 'What is debugging?', options: ['Writing code', 'Finding and fixing errors', 'Deploying apps', 'Writing tests'], answer: 1 },
    { id: 4, question: 'What is version control used for?', options: ['Styling apps', 'Tracking code changes', 'Database queries', 'UI design'], answer: 1 },
    { id: 5, question: 'What does "refactoring" mean?', options: ['Rewriting code for clarity without changing behavior', 'Adding new features', 'Deleting old files', 'Testing the app'], answer: 0 },
  ],
  3: [
    { id: 1, question: 'What is a capstone project?', options: ['First project', 'Final comprehensive project', 'A test', 'A demo'], answer: 1 },
    { id: 2, question: 'What is a design pattern?', options: ['A CSS style', 'A reusable solution to common problems', 'A database schema', 'A type of API'], answer: 1 },
    { id: 3, question: 'What does "scalability" mean?', options: ['Making code shorter', 'Ability to handle growth', 'Writing tests', 'Styling'], answer: 1 },
    { id: 4, question: 'What is a case study?', options: ['A legal document', 'Analysis of a real-world example', 'A code file', 'A design file'], answer: 1 },
    { id: 5, question: 'What is deployment?', options: ['Writing code', 'Testing code', 'Making the app available to users', 'Debugging'], answer: 2 },
  ],
}

export const MENTOR_STUDENTS = [
  { id: 1, name: 'Arun Kumar', track: 'AI Foundations', progress: 75, streak: 7, modulesCompleted: 2, lastActive: '2 hours ago', assessmentScore: 85 },
  { id: 2, name: 'Meena Pillai', track: 'AI Software Dev', progress: 45, streak: 3, modulesCompleted: 1, lastActive: '1 day ago', assessmentScore: 72 },
  { id: 3, name: 'Rahul Sharma', track: 'AI Foundations', progress: 100, streak: 14, modulesCompleted: 3, lastActive: 'Today', assessmentScore: 92 },
  { id: 4, name: 'Divya Nair', track: 'Agentic Automation', progress: 30, streak: 2, modulesCompleted: 0, lastActive: '3 days ago', assessmentScore: 0 },
]
