import { Play, Pause, RotateCcw, Clock } from 'lucide-react';
import { useProjectTask } from '../../context/ProjectTaskContext';

export default function TimeTrackerWidget() {
  const { activeTimer, toggleTimer, resetTimer } = useProjectTask();

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="hidden xl:flex items-center gap-2 h-10 px-3.5 bg-[#181a22] border border-[#262934] rounded-full shadow-xs shrink-0">
      <Clock size={14} className={activeTimer.isRunning ? 'text-emerald-400 animate-pulse' : 'text-text-muted'} />
      <span className="font-mono text-xs font-semibold text-white">
        {formatTime(activeTimer.seconds)}
      </span>

      <button
        type="button"
        onClick={toggleTimer}
        className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
          activeTimer.isRunning ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
        }`}
        title={activeTimer.isRunning ? 'Pause Timer' : 'Start Billable Work Timer'}
      >
        {activeTimer.isRunning ? <Pause size={10} className="fill-current" /> : <Play size={10} className="fill-current ml-0.5" />}
      </button>

      {activeTimer.seconds > 0 && (
        <button
          type="button"
          onClick={resetTimer}
          className="text-text-muted hover:text-white transition-colors cursor-pointer"
          title="Reset Timer"
        >
          <RotateCcw size={11} />
        </button>
      )}
    </div>
  );
}
