import { MessageSquare, X, ArrowRight } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export default function TeamMessageToast({ onNavigate }) {
  const { messageToast, dismissMessageToast } = useNotifications();

  if (!messageToast) return null;

  const { title, message, senderName, avatar, channelName } = messageToast;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md w-full animate-bounce-short sm:w-96">
      <div className="bg-bg-card/95 backdrop-blur-md border border-accent/40 shadow-2xl rounded-2xl p-3.5 flex items-start gap-3 ring-1 ring-accent/20">
        {avatar ? (
          <img
            src={avatar}
            alt={senderName || 'Team'}
            className="w-10 h-10 rounded-xl object-cover border border-border shrink-0 shadow-xs"
          />
        ) : (
          <div className="w-10 h-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center shrink-0 shadow-xs">
            <MessageSquare size={20} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="text-xs font-bold text-text truncate flex items-center gap-1.5">
              <span>{senderName || title}</span>
              {channelName && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-accent/10 text-accent font-semibold">
                  {channelName}
                </span>
              )}
            </div>
            <button
              onClick={dismissMessageToast}
              className="text-text-muted hover:text-text p-1 rounded-lg hover:bg-bg transition-colors"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>

          <p className="text-xs text-text-muted mt-1 line-clamp-2 leading-relaxed font-normal">
            {message}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              Real-Time Team Message
            </span>
            {onNavigate && (
              <button
                onClick={() => {
                  dismissMessageToast();
                  onNavigate('messages');
                }}
                className="text-[11px] font-semibold text-accent hover:text-accent-hover flex items-center gap-1 transition-colors"
              >
                <span>View Chat</span>
                <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
