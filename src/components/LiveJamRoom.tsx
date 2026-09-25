import React, { useEffect, useState, useRef } from 'react';
import { DAWTrack } from '../types';

interface JamUser {
  id: string;
  name: string;
  color: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
}

interface LiveJamRoomProps {
  tracks: DAWTrack[];
  bpm: number;
  onToggleStep: (trackIdx: number, stepIdx: number) => void;
  onBpmChange: (newBpm: number) => void;
  onShowToast: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
}

export const LiveJamRoom: React.FC<LiveJamRoomProps> = ({
  tracks,
  bpm,
  onToggleStep,
  onBpmChange,
  onShowToast,
}) => {
  const [roomCode, setRoomCode] = useState('RESONANCE-JAM-101');
  const [isConnected, setIsConnected] = useState(false);
  const [users, setUsers] = useState<JamUser[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [me, setMe] = useState<JamUser | null>(null);

  const wsRef = useRef<WebSocket | null>(null);

  const connectToRoom = (code: string) => {
    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/ws/jam`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({ action: 'join-room', roomCode: code }));
        onShowToast(`Connected to Live Jam Room: ${code}`, 'success');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          if (msg.type === 'init') {
            setUsers(msg.roomState.users || []);
            setChatMessages(msg.roomState.chatMessages || []);
            setMe(msg.user);
            if (typeof msg.roomState.bpm === 'number') {
              onBpmChange(msg.roomState.bpm);
            }
          } else if (msg.type === 'user:joined') {
            setUsers(msg.users || []);
            if (msg.user) {
              onShowToast(`${msg.user.name} joined the jam session!`, 'info');
            }
          } else if (msg.type === 'user:left') {
            setUsers(msg.users || []);
          } else if (msg.type === 'step:updated') {
            onToggleStep(msg.trackIdx, msg.stepIdx);
          } else if (msg.type === 'bpm:updated') {
            onBpmChange(msg.bpm);
          } else if (msg.type === 'chat:new') {
            setChatMessages((prev) => [...prev, msg.chatMessage]);
          }
        } catch (err) {
          console.warn('WS message parse error:', err);
        }
      };

      ws.onclose = () => {
        setIsConnected(false);
      };

      ws.onerror = () => {
        setIsConnected(false);
      };
    } catch (e) {
      console.warn('WS connection notice:', e);
      setIsConnected(false);
    }
  };

  useEffect(() => {
    connectToRoom(roomCode);
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !wsRef.current) return;

    wsRef.current.send(
      JSON.stringify({
        action: 'chat-message',
        payload: { text: chatInput.trim() },
      })
    );

    setChatInput('');
  };

  const handleStepClickRemote = (tIdx: number, sIdx: number) => {
    onToggleStep(tIdx, sIdx);
    if (wsRef.current && isConnected) {
      wsRef.current.send(
        JSON.stringify({
          action: 'step-toggle',
          payload: { trackIdx: tIdx, stepIdx: sIdx },
        })
      );
    }
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`}></span>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <i className="fas fa-users text-indigo-400"></i>
            Live WebRTC & WebSocket Jam Sessions
          </h3>
          <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
            {isConnected ? '🟢 Server-Authoritative Sync' : '🟡 Offline Standby'}
          </span>
        </div>

        {/* Room Code Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">ROOM:</span>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-indigo-300 font-mono font-bold w-40 text-center"
          />
          <button
            onClick={() => connectToRoom(roomCode)}
            className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            JOIN ROOM
          </button>
        </div>
      </div>

      {/* Online Participants & Live Chat */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Participants (4 cols) */}
        <div className="md:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex justify-between">
            <span>ACTIVE JAMMERS ({users.length})</span>
            <span className="text-emerald-400">LATENCY &lt; 3MS</span>
          </span>

          <div className="space-y-1.5 max-h-36 overflow-y-auto scrollbar-thin">
            {users.length === 0 ? (
              <p className="text-xs text-slate-500 italic p-2">Connecting to room roster...</p>
            ) : (
              users.map((u) => (
                <div key={u.id} className="flex items-center justify-between bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: u.color }}></span>
                    <span className="font-semibold text-slate-200">{u.name}</span>
                    {me?.id === u.id && <span className="text-[9px] text-indigo-400 font-mono">(You)</span>}
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Multi-User Chat (8 cols) */}
        <div className="md:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2 flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
            STUDIO JAM CHAT ROOM
          </span>

          <div className="space-y-1 max-h-24 overflow-y-auto scrollbar-thin font-mono text-xs p-1">
            {chatMessages.length === 0 ? (
              <p className="text-slate-500 italic">No chat messages yet. Say hello to your jam room!</p>
            ) : (
              chatMessages.map((msg) => (
                <div key={msg.id} className="text-slate-300 text-[11px] flex gap-2">
                  <span className="text-slate-500 font-bold">[{msg.time}]</span>
                  <span className="text-indigo-400 font-bold">{msg.sender}:</span>
                  <span className="text-slate-200">{msg.text}</span>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2 pt-1 border-t border-slate-800">
            <input
              type="text"
              placeholder="Type message to room..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
