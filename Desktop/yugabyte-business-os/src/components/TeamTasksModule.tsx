import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  User, 
  Clock, 
  Check, 
  X, 
  AlertCircle,
  CalendarDays
} from 'lucide-react';
import { Task } from '../types';

interface TeamTasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export default function TeamTasksModule({ tasks, setTasks }: TeamTasksProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  // Form Fields
  const [taskTitle, setTaskTitle] = useState('');
  const [taskType, setTaskType] = useState<'Follow-up' | 'Meeting' | 'Reminder'>('Follow-up');
  const [clientName, setClientName] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [assignedTo, setAssignedTo] = useState('Ashok Mahajan');

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      type: taskType,
      clientName: clientName || 'General Account',
      dateTime: dateTime || new Date().toISOString().substring(0, 16),
      description,
      completed: false,
      assignedTo,
      priority
    };

    setTasks(prev => [newTask, ...prev]);

    // reset Form
    setTaskTitle('');
    setClientName('');
    setDateTime('');
    setDescription('');
    setPriority('Medium');
    setShowAddForm(false);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, completed: !t.completed };
      }
      return t;
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 font-sans">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare size={18} className="text-blue-400" />
            <span>Team Activities & Task Coordination</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Delegate client follow-ups, schedule gold purity reviews, coordinate metallurgical molds, and dispatch collections reminders.
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-505 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 cursor-pointer"
        >
          {showAddForm ? <X size={14} /> : <Plus size={14} />}
          <span>{showAddForm ? "Cancel Capture" : "New Team Task"}</span>
        </button>
      </div>

      {/* Task Creation form */}
      {showAddForm && (
        <form onSubmit={handleCreateTask} className="p-5 bg-slate-900 border border-blue-500/20 rounded-2xl space-y-4">
          <h3 className="text-xs font-bold text-blue-400 uppercase font-mono tracking-wider">
            Log Corporate Activity Task
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Task Summary / Action Name</label>
              <input 
                type="text" 
                required
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="Gold purity MCX rates review" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Activity Classification</label>
              <select 
                value={taskType}
                onChange={e => setTaskType(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-350 focus:outline-none focus:border-blue-500"
              >
                <option value="Follow-up">Pre-Sale Follow-up</option>
                <option value="Meeting">Strategic Client Meeting</option>
                <option value="Reminder">Dunning Collection / Accounting Alert</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Priority Weights</label>
              <select 
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-350 focus:outline-none focus:border-blue-500"
              >
                <option value="High">High Priority SLA (Red Alert)</option>
                <option value="Medium">Medium Priority SLA</option>
                <option value="Low">Low Priority SLA</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Associated Client Firm</label>
              <input 
                type="text" 
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Rajputana Royal Jewels" 
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Due Date & Time</label>
              <input 
                type="datetime-local" 
                value={dateTime}
                onChange={e => setDateTime(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Assigned Executive Agent</label>
              <select 
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-350 focus:outline-none focus:border-blue-500"
              >
                <option value="Ashok Mahajan">Ashok Mahajan (Jewellery Rep)</option>
                <option value="Shreya Patra">Shreya Patra (Manufacturing Engineer)</option>
                <option value="Sultan Khan">Sultan Khan (Mercantile Broker)</option>
                <option value="Sakshi Shaw">Sakshi Shaw (Wholesales Lead)</option>
                <option value="Sneha Dhar">Sneha Dhar (Accounts Executor)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-slate-505 uppercase font-bold mb-1">Description / Instruction guidelines</label>
            <textarea 
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Conduct gold-spot indexing over Bandra, Mumbai gold bazaar tickers before raising quote." 
              className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none font-sans"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:border-slate-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white rounded-lg flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>Record System Task</span>
            </button>
          </div>
        </form>
      )}

      {/* Task Stack List layouts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority: High */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <span className="text-xs font-bold text-rose-500 font-sans tracking-tight">🔴 Critical Actions Priority</span>
            <span className="text-[10px] font-mono font-bold bg-rose-500/10 text-rose-450 border border-rose-500/15 px-2 py-0.5 rounded">
              {tasks.filter(t => t.priority === 'High' && !t.completed).length} active
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.priority === 'High').map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </div>

        {/* Priority: Medium */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <span className="text-xs font-bold text-blue-400 font-sans tracking-tight">🔵 Normal Operations Priority</span>
            <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/15 px-2 py-0.5 rounded">
              {tasks.filter(t => t.priority === 'Medium' && !t.completed).length} active
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.priority === 'Medium').map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </div>

        {/* Priority: Low / Completed */}
        <div className="bg-slate-900/10 border border-slate-900 rounded-2xl p-4 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-slate-900 pb-2.5">
            <span className="text-xs font-bold text-slate-500 font-sans tracking-tight">🟢 Completed Tasks Ledger</span>
            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/15 px-2 py-0.5 rounded">
              {tasks.filter(t => t.completed).length} done
            </span>
          </div>

          <div className="space-y-3">
            {tasks.filter(t => t.priority === 'Low' || t.completed).map(task => (
              <TaskCard key={task.id} task={task} onToggle={handleToggleTask} onDelete={handleDeleteTask} />
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

interface TaskCardProps {
  key?: string;
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <div className={`p-4 bg-slate-900/70 border rounded-xl flex flex-col justify-between transition-all ${
      task.completed 
        ? 'border-slate-950 bg-slate-950/20 opacity-45' 
        : 'border-slate-850 hover:border-slate-800'
    }`}>
      <div className="flex items-start gap-3">
        <input 
          type="checkbox" 
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          className="mt-1 shrink-0 rounded border-slate-800 focus:ring-0 text-blue-600 bg-transparent"
        />
        <div className="flex-1">
          <h4 className={`text-xs font-bold leading-tight ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {task.title}
          </h4>
          <span className="text-[9px] font-mono font-bold text-slate-550 block mt-1 uppercase">
            {task.type} · client: {task.clientName}
          </span>
          <p className="text-[11px] text-slate-400 mt-2 font-sans leading-normal">
            {task.description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-950/40 flex items-center justify-between text-[9px] font-mono text-slate-550 leading-none">
        <div className="flex items-center gap-1.5">
          <CalendarDays size={11} className="text-slate-500" />
          <span>{task.dateTime.replace('T', ' ')}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-slate-400">Rep: {task.assignedTo}</span>
          <button 
            onClick={() => onDelete(task.id)}
            className="text-slate-600 hover:text-rose-455 transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </div>
      </div>
    </div>
  );
}
