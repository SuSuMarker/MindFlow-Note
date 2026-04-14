import { useMemo, useState } from "react";
import { MessageSquare, PanelLeftClose, PanelLeftOpen, Plus, Trash2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { cn } from "@/lib/utils";
import { useLocaleStore } from "@/stores/useLocaleStore";
import { useAIStore } from "@/stores/useAIStore";

interface NoteConversationListProps {
  className?: string;
}

export function NoteConversationList({ className }: NoteConversationListProps) {
  const { t } = useLocaleStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    sessions,
    currentSessionId,
    createSession,
    deleteSession,
    switchSession,
  } = useAIStore(
    useShallow((state) => ({
      sessions: state.sessions,
      currentSessionId: state.currentSessionId,
      createSession: state.createSession,
      deleteSession: state.deleteSession,
      switchSession: state.switchSession,
    })),
  );

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => b.updatedAt - a.updatedAt),
    [sessions],
  );

  const canDeleteSessions = sessions.length > 1;

  return (
    <div
      className={cn(
        "flex flex-col border-r border-border/60 bg-muted/30 transition-all duration-300 ease-in-out",
        isExpanded ? "w-48" : "w-12",
        className,
      )}
    >
      <div className="p-2 border-b border-border/60 flex flex-col gap-2 items-center">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors w-full flex justify-center"
          title={isExpanded ? t.conversationList.collapseList : t.conversationList.expandList}
        >
          {isExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
        </button>

        <button
          onClick={() => createSession()}
          className={cn(
            "flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-all",
            isExpanded ? "w-full py-2 px-3" : "w-8 h-8 rounded-full",
          )}
          title={t.conversationList.newConversation}
        >
          <Plus size={18} />
          {isExpanded && (
            <span className="text-xs font-medium whitespace-nowrap">
              {t.conversationList.newConversation}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {sortedSessions.map((session) => {
          const isActive = session.id === currentSessionId;
          return (
            <div
              key={session.id}
              onClick={() => switchSession(session.id)}
              className={cn(
                "group flex items-center px-2 py-2.5 cursor-pointer transition-all border-l-2",
                isActive
                  ? "border-primary bg-background shadow-sm"
                  : "border-transparent hover:bg-background/50 hover:shadow-sm",
              )}
              title={session.title}
            >
              <div className="min-w-[32px] flex justify-center">
                <MessageSquare
                  size={16}
                  className={cn("text-slate-500", isActive && "text-primary")}
                />
              </div>

              {isExpanded && (
                <>
                  <div className="flex-1 overflow-hidden ml-1">
                    <p
                      className={cn(
                        "text-xs truncate",
                        isActive ? "text-foreground font-medium" : "text-muted-foreground",
                      )}
                    >
                      {session.title}
                    </p>
                  </div>

                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteSession(session.id);
                    }}
                    disabled={!canDeleteSessions}
                    className={cn(
                      "p-1 transition-opacity",
                      canDeleteSessions
                        ? "opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive"
                        : "opacity-30 cursor-not-allowed text-muted-foreground/70",
                    )}
                    title={t.conversationList.deleteConversation}
                  >
                    <Trash2 size={12} />
                  </button>
                </>
              )}
            </div>
          );
        })}

        {sortedSessions.length === 0 && (
          <div className="px-2 py-4 text-center">
            {isExpanded ? (
              <p className="text-xs text-muted-foreground">{t.conversationList.noConversations}</p>
            ) : (
              <MessageSquare size={16} className="mx-auto text-muted-foreground/50" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
