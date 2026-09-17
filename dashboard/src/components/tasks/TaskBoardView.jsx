import { useState, useEffect } from 'react';
import { CheckSquare, Plus, Clock, Calendar, User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useProjectTask } from '../../context/ProjectTaskContext';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-slate-500/30 text-slate-400' },
  { id: 'in_progress', title: 'In Progress', color: 'border-amber-500/30 text-amber-400' },
  { id: 'review', title: 'In Review / QA', color: 'border-purple-500/30 text-purple-400' },
  { id: 'done', title: 'Completed', color: 'border-emerald-500/30 text-emerald-400' },
];

const PRIORITY_COLORS = {
  Urgent: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  High: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Medium: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
  Low: 'bg-slate-500/15 text-slate-400 border-slate-500/30',
};

export default function TaskBoardView() {
  const { tasks, projects, updateTaskStatus, addTask } = useProjectTask();
  const [selectedProjectFilter, setSelectedProjectFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    projectId: projects[0]?.id || 'proj-1',
    priority: 'Medium',
    assignee: 'Mahmud Hasan',
    dueDate: '',
  });

  useEffect(() => {
    const handler = () => setModalOpen(true);
    window.addEventListener('open-new-task-modal', handler);
    return () => window.removeEventListener('open-new-task-modal', handler);
  }, []);

  const filteredTasks = selectedProjectFilter === 'all'
    ? tasks
    : tasks.filter((t) => t.projectId === selectedProjectFilter);

  const handleCreateTask = (e) => {
    e.preventDefault();
    const proj = projects.find((p) => p.id === form.projectId);
    addTask({
      ...form,
      projectName: proj?.name || 'Enterprise Project',
      status: 'todo',
    });
    setModalOpen(false);
    setForm({ title: '', projectId: projects[0]?.id || 'proj-1', priority: 'Medium', assignee: 'Mahmud Hasan', dueDate: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Task & Team Workflow Board</h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25">
              Live Kanban
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1">
            Day-to-day execution layer: track task progression, dependencies, assignees, and billable hours
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Project Filter */}
          <select
            value={selectedProjectFilter}
            onChange={(e) => setSelectedProjectFilter(e.target.value)}
            className="h-10 bg-[#181a22] border border-[#262934] rounded-full px-4 text-xs font-semibold text-white outline-none"
          >
            <option value="all">All Active Projects ({tasks.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="h-10 flex items-center gap-2 px-5 bg-accent hover:bg-accent-hover text-white text-xs sm:text-sm font-semibold rounded-full transition-all shadow-md shadow-accent/20 cursor-pointer active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* 4-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-[#14161f] border border-border/80 rounded-2xl p-4 flex flex-col gap-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border/50">
                <span className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </span>
                <span className="w-5 h-5 rounded-full bg-[#1e212d] text-[11px] font-bold text-white flex items-center justify-center">
                  {colTasks.length}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-bg-card border border-border/80 hover:border-accent/40 rounded-xl p-4 shadow-xs space-y-3 transition-all group"
                  >
                    {/* Project & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold text-text-muted truncate max-w-[140px]">
                        {task.projectName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.Medium}`}>
                        {task.priority}
                      </span>
                    </div>

                    {/* Task Title */}
                    <p className="text-xs font-semibold text-white group-hover:text-accent transition-colors leading-snug">
                      {task.title}
                    </p>

                    {/* Meta: Hours, Due Date, Assignee */}
                    <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-text-muted">
                      <span className="flex items-center gap-1 font-mono text-emerald-400">
                        <Clock size={11} />
                        {task.hoursSpent}h logged
                      </span>

                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {task.dueDate}
                      </span>
                    </div>

                    {/* Quick Move Status Buttons */}
                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="font-semibold text-text-secondary flex items-center gap-1">
                        <User size={10} className="text-accent" />
                        {task.assignee}
                      </span>

                      <div className="flex items-center gap-1">
                        {col.id !== 'todo' && (
                          <button
                            type="button"
                            onClick={() => {
                              const order = ['todo', 'in_progress', 'review', 'done'];
                              const prevIdx = order.indexOf(col.id) - 1;
                              if (prevIdx >= 0) updateTaskStatus(task.id, order[prevIdx]);
                            }}
                            className="p-1 rounded-md hover:bg-[#202330] text-text-muted hover:text-white cursor-pointer"
                            title="Move back"
                          >
                            <ArrowLeft size={12} />
                          </button>
                        )}
                        {col.id !== 'done' && (
                          <button
                            type="button"
                            onClick={() => {
                              const order = ['todo', 'in_progress', 'review', 'done'];
                              const nextIdx = order.indexOf(col.id) + 1;
                              if (nextIdx < order.length) updateTaskStatus(task.id, order[nextIdx]);
                            }}
                            className="p-1 rounded-md hover:bg-[#202330] text-text-muted hover:text-white cursor-pointer"
                            title="Move forward"
                          >
                            <ArrowRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="h-32 border-2 border-dashed border-border/40 rounded-xl flex items-center justify-center text-text-muted text-xs">
                    No tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-bold text-white">Create New Task</h3>
              <button onClick={() => setModalOpen(false)} className="text-text-muted hover:text-white cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
              <div>
                <label className="block text-text-muted mb-1 font-semibold">Task Description / Deliverable</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement webhook retry queue"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-semibold">Assign to Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.company})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent 🔥</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-semibold">Due Date</label>
                  <input
                    type="date"
                    required
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-semibold">Assignee</label>
                <select
                  value={form.assignee}
                  onChange={(e) => setForm({ ...form, assignee: e.target.value })}
                  className="w-full bg-[#181a22] border border-[#262934] rounded-xl px-3 py-2 text-white outline-none"
                >
                  <option value="Mahmud Hasan">Mahmud Hasan (CEO/COO)</option>
                  <option value="Salung Prastyo">Salung Prastyo (Sales Lead)</option>
                  <option value="Sarah Jenkins">Sarah Jenkins (Finance Manager)</option>
                  <option value="Alex Rivera">Alex Rivera (AI Ops Lead)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-text-muted hover:text-white bg-[#181a22] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-accent hover:bg-accent-hover text-white font-semibold cursor-pointer shadow-md shadow-accent/20"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
