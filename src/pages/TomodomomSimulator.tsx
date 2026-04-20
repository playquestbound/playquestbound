import React, { useState, useEffect, useRef, useCallback } from "react";
import { TomodomoSimulation } from "@/tomodomo/simulation";
import { Action, LifeStage, DisplayState, TomodomoState, GameEvent } from "@/tomodomo/types";

// ── Local types ────────────────────────────────────────────────
interface LogEntry { id: number; text: string; time: string }
type MenuMode  = "main" | "food";
type FoodChoice = "meal" | "snack";

// ── Menu definition ────────────────────────────────────────────
const MENU_ITEMS = [
  { id: "food",       icon: "🍽️",  label: "FOOD"  },
  { id: "play",       icon: "🎮",  label: "PLAY"  },
  { id: "sleep",      icon: "💤",  label: "SLEEP" },
  { id: "medicine",   icon: "💊",  label: "MEDS"  },
  { id: "clean",      icon: "🚽",  label: "CLEAN" },
  { id: "discipline", icon: "😤",  label: "SCOLD" },
  { id: "status",     icon: "📊",  label: "INFO"  },
] as const;

// ── Character art (2 animation frames per state) ──────────────
const CHAR_ART: Record<DisplayState, [string, string]> = {
  [DisplayState.EGG]:      ["  🥚  ",     "  🥚  "    ],
  [DisplayState.IDLE]:     [" (^‿^) ",    " (^‿^)  "  ],
  [DisplayState.HAPPY]:    ["\\(★‿★)/",   " (★‿★)  "  ],
  [DisplayState.SAD]:      [" (╥‿╥) ",    "  (╥‿╥)  " ],
  [DisplayState.SLEEPING]: ["(-ω-)zzz",   "(-ω-) zz"  ],
  [DisplayState.EATING]:   [" (●‿●)🍴",  "(●‿●) 🍴"  ],
  [DisplayState.PLAYING]:  ["\\(^‿^)/",   " \\(^‿^)/ " ],
  [DisplayState.SICK]:     [" (~‿~)💧",   "(~‿~) 💧"  ],
  [DisplayState.ANGRY]:    [" (>‿<)😤",   "(>‿<)😤 "  ],
  [DisplayState.DEAD]:     ["  R.I.P  ",  "  💀💀💀  " ],
};

// ── Helpers ────────────────────────────────────────────────────
function toHearts(v: number, n = 4): string {
  const f = Math.round((v / 100) * n);
  return "♥".repeat(f) + "♡".repeat(n - f);
}

let _logId = 0;
function mkLog(text: string): LogEntry {
  return { id: ++_logId, text, time: new Date().toLocaleTimeString("en", { hour12: false }) };
}

// ── Component ──────────────────────────────────────────────────
export default function TomodomomSimulator() {
  const simRef = useRef<TomodomoSimulation | null>(null);
  if (!simRef.current) simRef.current = new TomodomoSimulation("Tomo");

  const [tomoName, setTomoName]   = useState("Tomo");
  const [state, setState]         = useState<TomodomoState>(() => simRef.current!.getState() as TomodomoState);
  const [menuIndex, setMenuIndex] = useState(0);
  const [menuMode, setMenuMode]   = useState<MenuMode>("main");
  const [foodChoice, setFoodChoice] = useState<FoodChoice>("meal");
  const [showStats, setShowStats] = useState(false);
  const [eventLog, setEventLog]   = useState<LogEntry[]>([]);
  const [tickMs, setTickMs]       = useState(2000);
  const [isPaused, setIsPaused]   = useState(false);
  const [feedback, setFeedback]   = useState("");
  const [animFrame, setAnimFrame] = useState(0);

  // Animation flip
  useEffect(() => {
    const id = setInterval(() => setAnimFrame(f => 1 - f), 600);
    return () => clearInterval(id);
  }, []);

  // Tick loop
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(() => {
      const result = simRef.current!.tick();
      setState(result.stateSnapshot);
      if (result.eventsTriggered.length > 0) {
        setEventLog(prev =>
          [...result.eventsTriggered.map(e => mkLog(e.replace(/_/g, " "))), ...prev].slice(0, 60)
        );
      }
    }, tickMs);
    return () => clearInterval(id);
  }, [isPaused, tickMs]);

  // Show feedback briefly
  const flash = useCallback((msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(""), 2500);
  }, []);

  // Perform action and sync state
  const doAction = useCallback((action: Action) => {
    const result = simRef.current!.performAction(action);
    setState(simRef.current!.getState() as TomodomoState);
    flash(result.message);
    setEventLog(prev => [
      mkLog(`▶ ${action.replace(/_/g, " ")} ${result.success ? "✓" : "✗"}`),
      ...result.eventsTriggered.map(e => mkLog(e.replace(/_/g, " "))),
      ...prev,
    ].slice(0, 60));
  }, [flash]);

  // ── 3 Button Handlers ──────────────────────────────────────
  const handleA = useCallback(() => {
    if (state.stage === LifeStage.EGG || state.stage === LifeStage.DEAD) {
      doAction(Action.TAP_EGG); return;
    }
    if (menuMode === "food") { setFoodChoice("meal"); return; }
    setShowStats(false);
    setMenuIndex(i => (i - 1 + MENU_ITEMS.length) % MENU_ITEMS.length);
  }, [state.stage, menuMode, doAction]);

  const handleB = useCallback(() => {
    if (state.stage === LifeStage.EGG) { doAction(Action.TAP_EGG); return; }
    if (state.stage === LifeStage.DEAD) return;

    if (menuMode === "food") {
      doAction(foodChoice === "meal" ? Action.FEED_MEAL : Action.FEED_SNACK);
      setMenuMode("main");
      return;
    }

    const id = MENU_ITEMS[menuIndex].id;
    switch (id) {
      case "food":       setMenuMode("food"); break;
      case "play":       doAction(Action.PLAY); break;
      case "sleep":      doAction(state.isSleeping ? Action.WAKE : Action.SLEEP); break;
      case "medicine":   doAction(Action.GIVE_MEDICINE); break;
      case "clean":      doAction(Action.FLUSH_TOILET); break;
      case "discipline": doAction(Action.DISCIPLINE); break;
      case "status":     setShowStats(s => !s); break;
    }
  }, [state.stage, state.isSleeping, menuMode, menuIndex, foodChoice, doAction]);

  const handleC = useCallback(() => {
    if (state.stage === LifeStage.EGG || state.stage === LifeStage.DEAD) {
      doAction(Action.TAP_EGG); return;
    }
    if (menuMode === "food") {
      if (foodChoice === "snack") setMenuMode("main");
      else setFoodChoice("snack");
      return;
    }
    setShowStats(false);
    setMenuIndex(i => (i + 1) % MENU_ITEMS.length);
  }, [state.stage, menuMode, foodChoice, doAction]);

  // Keyboard support
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      switch (e.key) {
        case "a": case "ArrowLeft":  handleA(); break;
        case "s": case " ": e.preventDefault(); handleB(); break;
        case "d": case "ArrowRight": handleC(); break;
        case "p": setIsPaused(p => !p); break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleA, handleB, handleC]);

  const resetSim = () => {
    simRef.current = new TomodomoSimulation(tomoName);
    setState(simRef.current.getState() as TomodomoState);
    setMenuIndex(0); setMenuMode("main"); setFoodChoice("meal");
    setShowStats(false); setEventLog([]); setFeedback("");
  };

  // ── Screen render ──────────────────────────────────────────
  const charLine = CHAR_ART[state.displayState][animFrame];

  const ScreenContent = () => {
    // Stats overlay
    if (showStats && state.stage !== LifeStage.EGG) {
      const st = state.stats;
      return (
        <div className="font-mono text-xs text-green-300 px-2 py-1 leading-snug">
          <div className="text-green-400 text-center text-xs font-bold mb-1">─ STATS ─</div>
          <div>HNG  {toHearts(st.hunger)}</div>
          <div>HAP  {toHearts(st.happiness)}</div>
          <div>HLT  {toHearts(st.health)}</div>
          <div>ENR  {toHearts(st.energy)}</div>
          <div>DIS  {toHearts(st.discipline)}</div>
          <div className="text-green-500 mt-0.5">WT: {st.weight.toFixed(1)}</div>
        </div>
      );
    }

    // Food submenu
    if (menuMode === "food") {
      return (
        <div className="flex flex-col items-center justify-center h-full gap-2 font-mono">
          <div className="text-green-400 text-xs font-bold">─ FOOD ─</div>
          <div className={`text-sm px-4 py-0.5 rounded font-bold ${foodChoice === "meal" ? "bg-green-400 text-black" : "text-green-400"}`}>
            MEAL
          </div>
          <div className={`text-sm px-4 py-0.5 rounded font-bold ${foodChoice === "snack" ? "bg-green-400 text-black" : "text-green-400"}`}>
            SNACK
          </div>
          <div className="text-green-800 text-xs mt-1">[A/C]=pick  [B]=ok</div>
        </div>
      );
    }

    // Default character view
    return (
      <div className="flex flex-col items-center justify-between h-full py-1">
        {/* Top status row */}
        <div className="flex items-center justify-between w-full px-2 text-xs font-mono text-green-600">
          <span>{state.isSleeping ? "💤" : "\u00a0\u00a0"}</span>
          <span className="text-green-400 text-xs">{state.name}</span>
          <span>
            {state.isSick  ? "🤢" : "\u00a0\u00a0"}
            {state.hasWaste ? "🚽" : "\u00a0\u00a0"}
          </span>
        </div>

        {/* Character */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="text-xl font-mono text-green-200 select-none tracking-wide">{charLine}</div>
          <div className="text-xs font-mono text-green-600">
            {state.stage === LifeStage.EGG
              ? `tap to hatch (${state.eggTapCount}/3)`
              : `${state.stage} · ${state.ageInHours}h · ${state.gameHour}:00`}
          </div>
          {state.needsAttention && (
            <div className="text-xs font-mono text-yellow-400 animate-pulse">!! ATTENTION !!</div>
          )}
          {feedback && (
            <div className="text-xs font-mono text-cyan-400 text-center px-1 leading-tight" style={{ maxWidth: 190 }}>
              {feedback.slice(0, 50)}
            </div>
          )}
        </div>

        <div />
      </div>
    );
  };

  // ── Stat bar ───────────────────────────────────────────────
  const StatBar = ({ label, val, color }: { label: string; val: number; color: string }) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 text-xs w-7 text-right">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-gray-400 text-xs w-7">{Math.round(val)}</span>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-6 px-4 gap-6">
      <div className="text-center">
        <h1 className="text-xl font-bold tracking-[0.3em] text-purple-300">TOMODOMO</h1>
        <p className="text-gray-600 text-xs tracking-widest">DEVICE SIMULATOR</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-3xl">

        {/* ══ Device Shell ══════════════════════════════════ */}
        <div className="flex flex-col items-center">
          <div
            className="flex flex-col items-center gap-5 px-5 pt-5 pb-6 shadow-2xl"
            style={{
              width: 250,
              background: "linear-gradient(160deg, #a855f7 0%, #7c3aed 50%, #6d28d9 100%)",
              borderRadius: 48,
              boxShadow: "0 8px 32px rgba(124,58,237,0.5), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            {/* Screen bezel */}
            <div
              className="w-full rounded-2xl overflow-hidden"
              style={{
                border: "4px solid #3b0764",
                boxShadow: "0 0 0 1px #581c87, inset 0 2px 8px rgba(0,0,0,0.8)",
              }}
            >
              {/* LCD screen */}
              <div
                style={{
                  width: "100%",
                  height: 210,
                  background: "#0a1f12",
                  boxShadow: "inset 0 0 20px rgba(0,200,80,0.08)",
                  position: "relative",
                }}
              >
                {/* Main content area */}
                <div style={{ position: "absolute", inset: "6px 4px 34px", overflow: "hidden" }}>
                  <ScreenContent />
                </div>

                {/* Menu icon bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0, left: 0, right: 0,
                    height: 32,
                    borderTop: "1px solid #0d3320",
                    background: "#060f09",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-around",
                    padding: "0 2px",
                  }}
                >
                  {MENU_ITEMS.map((item, i) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        opacity: menuMode === "main" && i === menuIndex ? 1 : 0.3,
                        transform: menuMode === "main" && i === menuIndex ? "scale(1.2)" : "scale(1)",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: 13, lineHeight: 1 }}>{item.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative speaker dots */}
            <div className="flex gap-1 self-end pr-1 -mt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-1 h-1 rounded-full bg-purple-900 opacity-60" />
              ))}
            </div>

            {/* 3 Buttons */}
            <div className="flex justify-between w-full px-1">
              {[
                { label: "A", fn: handleA, sub: "◀ / meal" },
                { label: "B", fn: handleB, sub: "select"   },
                { label: "C", fn: handleC, sub: "▶ / back" },
              ].map(({ label, fn, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <button
                    onPointerDown={fn}
                    className="select-none active:translate-y-0.5 transition-transform"
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "linear-gradient(145deg, #4c1d95, #2e1065)",
                      border: "2px solid #7c3aed",
                      color: "#c4b5fd",
                      fontSize: 18,
                      fontWeight: "bold",
                      cursor: "pointer",
                      boxShadow: "0 5px 0 #1e1b4b, 0 7px 14px rgba(0,0,0,0.6)",
                      userSelect: "none",
                    }}
                  >
                    {label}
                  </button>
                  <span className="text-purple-400 text-xs opacity-50">{sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="text-center text-gray-700 text-xs mt-3 space-x-1">
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">A</kbd>
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">S</kbd>
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">D</kbd>
            <span className="text-gray-700">or</span>
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">◀</kbd>
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">space</kbd>
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">▶</kbd>
            <span className="mx-1 text-gray-700">·</span>
            <kbd className="bg-gray-800 text-gray-500 px-1.5 py-0.5 rounded text-xs">P</kbd>
            <span className="text-gray-700">=pause</span>
          </div>
        </div>

        {/* ══ Debug Panel ═══════════════════════════════════ */}
        <div className="flex flex-col gap-3 flex-1" style={{ minWidth: 260 }}>

          {/* Identity card */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <input
                    className="bg-transparent text-purple-300 font-bold text-base border-b border-purple-900 focus:border-purple-500 focus:outline-none w-28"
                    value={tomoName}
                    onChange={e => setTomoName(e.target.value)}
                    title="Name (takes effect on Reset)"
                  />
                  <span className="text-gray-700 text-xs">← reset to apply</span>
                </div>
                <div className="text-gray-500 text-xs">
                  {state.stage} · Age {state.ageInHours}h · {String(state.gameHour).padStart(2,"0")}:00
                </div>
                <div className="text-gray-600 text-xs mt-0.5">
                  Evolution: <span className="text-purple-400">{state.evolutionPath}</span>
                  {" · "}Care: <span className="text-purple-400">{state.careQuality}/1000</span>
                </div>
              </div>
              <button
                onClick={resetSim}
                className="text-xs bg-red-950 hover:bg-red-900 text-red-400 border border-red-900 px-3 py-1.5 rounded-lg transition-colors ml-2"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-gray-600 text-xs uppercase tracking-wider mb-3">Stats</div>
            <div className="flex flex-col gap-2.5">
              <StatBar label="HNG" val={state.stats.hunger}     color="bg-orange-500" />
              <StatBar label="HAP" val={state.stats.happiness}  color="bg-pink-500"   />
              <StatBar label="HLT" val={state.stats.health}     color="bg-green-500"  />
              <StatBar label="ENR" val={state.stats.energy}     color="bg-yellow-500" />
              <StatBar label="DIS" val={state.stats.discipline} color="bg-blue-500"   />
              <StatBar label="WGT" val={(state.stats.weight / 99) * 100} color="bg-gray-500" />
            </div>
            {/* Status flags */}
            <div className="flex flex-wrap gap-2 mt-3 text-xs">
              {state.isSleeping    && <span className="bg-blue-950  text-blue-300   px-2 py-0.5 rounded-full">💤 Sleeping</span>}
              {state.isSick        && <span className="bg-red-950   text-red-400    px-2 py-0.5 rounded-full">🤢 Sick</span>}
              {state.hasWaste      && <span className="bg-yellow-950 text-yellow-500 px-2 py-0.5 rounded-full">🚽 Waste ({state.wasteAge}t)</span>}
              {state.isMisbehaving && <span className="bg-orange-950 text-orange-400 px-2 py-0.5 rounded-full">😤 Misbehaving</span>}
            </div>
          </div>

          {/* Tick speed */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-gray-600 text-xs uppercase tracking-wider">Simulation Speed</div>
              <button
                onClick={() => setIsPaused(p => !p)}
                className={`text-xs px-3 py-1 rounded-lg border transition-colors ${
                  isPaused
                    ? "bg-green-950 border-green-800 text-green-400 hover:bg-green-900"
                    : "bg-yellow-950 border-yellow-900 text-yellow-400 hover:bg-yellow-900"
                }`}
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { label: "0.5s", ms: 500   },
                { label: "1s",   ms: 1000  },
                { label: "2s",   ms: 2000  },
                { label: "5s",   ms: 5000  },
                { label: "60s",  ms: 60000 },
              ].map(({ label, ms }) => (
                <button
                  key={ms}
                  onClick={() => setTickMs(ms)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    tickMs === ms
                      ? "bg-purple-900 border-purple-700 text-purple-200"
                      : "bg-gray-800 border-gray-700 text-gray-500 hover:bg-gray-750"
                  }`}
                >
                  {label}/tick
                </button>
              ))}
            </div>
            <div className="text-gray-700 text-xs mt-2">1 tick = 1 in-game hour</div>
          </div>

          {/* Event log */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex-1">
            <div className="flex items-center justify-between mb-2">
              <div className="text-gray-600 text-xs uppercase tracking-wider">Event Log</div>
              {eventLog.length > 0 && (
                <button onClick={() => setEventLog([])} className="text-gray-700 hover:text-gray-500 text-xs">
                  clear
                </button>
              )}
            </div>
            <div className="overflow-y-auto space-y-0.5" style={{ maxHeight: 180, fontFamily: "monospace" }}>
              {eventLog.length === 0 && <div className="text-gray-800 text-xs">No events yet…</div>}
              {eventLog.map(e => (
                <div key={e.id} className="flex gap-2 text-xs leading-relaxed">
                  <span className="text-gray-700 shrink-0">{e.time}</span>
                  <span className={e.text.startsWith("▶") ? "text-purple-400" : "text-green-500"}>{e.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
