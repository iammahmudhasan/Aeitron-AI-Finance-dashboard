import { createContext, useContext, useState, useEffect } from 'react';

const ProjectTaskContext = createContext(null);

const STORAGE_PROJECTS_KEY = 'aeitron_projects_list';
const STORAGE_TASKS_KEY = 'aeitron_tasks_list';

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    name: 'NexusFlow Enterprise Autonomous AI Agent',
    clientName: 'Acme Global Corp',
    company: 'Aeitron AI',
    stage: 'build', // scoping, build, testing, deployed, support
    progress: 68,
    deadline: '2026-10-15',
    budget: 18500,
    spentCost: 8400,
    team: ['Alex Rivera', 'Mahmud Hasan'],
    slaRisk: 'low',
    milestones: [
      { id: 'm1', title: 'Architecture Scoping & Security Review', done: true },
      { id: 'm2', title: 'LLM Function Calling & Webhook Pipeline', done: true },
      { id: 'm3', title: 'ERP & CRM Bi-directional Sync', done: false },
      { id: 'm4', title: 'Penetration Testing & Client UAT', done: false },
    ],
  },
  {
    id: 'proj-2',
    name: 'Craftly Omnichannel Brand Identity & Web App',
    clientName: 'Lumina Health Labs',
    company: 'Craftly',
    stage: 'testing',
    progress: 85,
    deadline: '2026-09-30',
    budget: 12000,
    spentCost: 5600,
    team: ['Salung Prastyo', 'Mahmud Hasan'],
    slaRisk: 'low',
    milestones: [
      { id: 'm1', title: 'Design System & Component Library', done: true },
      { id: 'm2', title: 'Next.js Frontend Scaffolding', done: true },
      { id: 'm3', title: 'Checkout & Payment Gateway Integration', done: true },
      { id: 'm4', title: 'Final Client Sign-off', done: false },
    ],
  },
  {
    id: 'proj-3',
    name: 'Customer Service Voice & WhatsApp Automation',
    clientName: 'Apex Logistics Ltd',
    company: 'Aeitron AI',
    stage: 'scoping',
    progress: 25,
    deadline: '2026-11-05',
    budget: 22000,
    spentCost: 3200,
    team: ['Alex Rivera'],
    slaRisk: 'medium',
    milestones: [
      { id: 'm1', title: 'Knowledge Base Ingestion & Vector DB', done: true },
      { id: 'm2', title: 'Twilio & Meta API Integration', done: false },
      { id: 'm3', title: 'Human-in-the-loop Escalation', done: false },
    ],
  },
  {
    id: 'proj-4',
    name: 'FinTech Micro-Lending Portal Delivery',
    clientName: 'Kite Payments',
    company: 'Craftly',
    stage: 'deployed',
    progress: 100,
    deadline: '2026-09-10',
    budget: 15000,
    spentCost: 7100,
    team: ['Sarah Jenkins', 'Salung Prastyo'],
    slaRisk: 'none',
    milestones: [
      { id: 'm1', title: 'KYC Verification Flow', done: true },
      { id: 'm2', title: 'Credit Scoring Engine', done: true },
      { id: 'm3', title: 'Production Launch & Monitoring', done: true },
    ],
  },
];

const INITIAL_TASKS = [
  {
    id: 'task-1',
    projectId: 'proj-1',
    projectName: 'NexusFlow Enterprise Autonomous AI Agent',
    title: 'Configure Vector DB chunking for 500k client PDF archives',
    status: 'in_progress', // todo, in_progress, review, done
    priority: 'High',
    assignee: 'Alex Rivera',
    dueDate: '2026-09-22',
    hoursSpent: 14.5,
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    projectName: 'NexusFlow Enterprise Autonomous AI Agent',
    title: 'Implement token rate-limiting on agent outbound tools',
    status: 'todo',
    priority: 'Medium',
    assignee: 'Mahmud Hasan',
    dueDate: '2026-09-25',
    hoursSpent: 4.0,
  },
  {
    id: 'task-3',
    projectId: 'proj-2',
    projectName: 'Craftly Omnichannel Brand Identity & Web App',
    title: 'Responsive QA test on Mobile Safari & Android Chrome',
    status: 'review',
    priority: 'Urgent',
    assignee: 'Salung Prastyo',
    dueDate: '2026-09-19',
    hoursSpent: 8.5,
  },
  {
    id: 'task-4',
    projectId: 'proj-2',
    projectName: 'Craftly Omnichannel Brand Identity & Web App',
    title: 'Setup Google Tag Manager and conversion tracking events',
    status: 'done',
    priority: 'Medium',
    assignee: 'Sarah Jenkins',
    dueDate: '2026-09-15',
    hoursSpent: 6.0,
  },
  {
    id: 'task-5',
    projectId: 'proj-3',
    projectName: 'Customer Service Voice & WhatsApp Automation',
    title: 'Draft SOW milestone timeline and SLA guarantee terms',
    status: 'in_progress',
    priority: 'High',
    assignee: 'Mahmud Hasan',
    dueDate: '2026-09-21',
    hoursSpent: 5.5,
  },
];

export function ProjectTaskProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROJECTS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TASKS_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  // Time Tracker state
  const [activeTimer, setActiveTimer] = useState({
    isRunning: false,
    seconds: 0,
    taskId: 'task-1',
    taskTitle: 'Configure Vector DB chunking for 500k client PDF archives',
  });

  useEffect(() => {
    let interval = null;
    if (activeTimer.isRunning) {
      interval = setInterval(() => {
        setActiveTimer((prev) => ({ ...prev, seconds: prev.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeTimer.isRunning]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(projects));
      localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(tasks));
    } catch {
      // ignore
    }
  }, [projects, tasks]);

  const toggleTimer = () => {
    setActiveTimer((prev) => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setActiveTimer((prev) => ({ ...prev, isRunning: false, seconds: 0 }));
  };

  const updateTaskStatus = (taskId, newStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      hoursSpent: 0,
      ...taskData,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const addProject = (projectData) => {
    const newProj = {
      id: `proj-${Date.now()}`,
      progress: 0,
      spentCost: 0,
      slaRisk: 'low',
      milestones: [],
      ...projectData,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  return (
    <ProjectTaskContext.Provider
      value={{
        projects,
        tasks,
        activeTimer,
        toggleTimer,
        resetTimer,
        updateTaskStatus,
        addTask,
        addProject,
      }}
    >
      {children}
    </ProjectTaskContext.Provider>
  );
}

export function useProjectTask() {
  const context = useContext(ProjectTaskContext);
  if (!context) {
    throw new Error('useProjectTask must be used within a ProjectTaskProvider');
  }
  return context;
}
