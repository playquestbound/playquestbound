// ============================================================
// TOMODOMO TAMAGOTCHI SIMULATION
// Type Definitions
// ============================================================

// --------------- ENUMS ---------------

export enum LifeStage {
  EGG   = "EGG",
  BABY  = "BABY",
  CHILD = "CHILD",
  TEEN  = "TEEN",
  ADULT = "ADULT",
  ELDER = "ELDER",
  DEAD  = "DEAD",
}

export enum EvolutionPath {
  NONE  = "NONE",   // Still in early stage
  GREAT = "GREAT",  // Well-cared-for evolution
  OKAY  = "OKAY",   // Average care evolution
  POOR  = "POOR",   // Neglected evolution
}

export enum DisplayState {
  IDLE      = "IDLE",
  HAPPY     = "HAPPY",
  SAD       = "SAD",
  SLEEPING  = "SLEEPING",
  EATING    = "EATING",
  PLAYING   = "PLAYING",
  SICK      = "SICK",
  ANGRY     = "ANGRY",
  DEAD      = "DEAD",
  EGG       = "EGG",
}

export enum Action {
  FEED_MEAL     = "FEED_MEAL",
  FEED_SNACK    = "FEED_SNACK",
  PLAY          = "PLAY",
  SLEEP         = "SLEEP",
  WAKE          = "WAKE",
  GIVE_MEDICINE = "GIVE_MEDICINE",
  FLUSH_TOILET  = "FLUSH_TOILET",
  DISCIPLINE    = "DISCIPLINE",
  TAP_EGG       = "TAP_EGG",
}

export enum GameEvent {
  HATCHED          = "HATCHED",
  HUNGRY           = "HUNGRY",
  UNHAPPY          = "UNHAPPY",
  LOW_ENERGY       = "LOW_ENERGY",
  LOW_HEALTH       = "LOW_HEALTH",
  SICK             = "SICK",
  CURED            = "CURED",
  BATHROOM_NEEDED  = "BATHROOM_NEEDED",
  BATHROOM_CLEANED = "BATHROOM_CLEANED",
  MISBEHAVING      = "MISBEHAVING",
  FELL_ASLEEP      = "FELL_ASLEEP",
  WOKE_UP          = "WOKE_UP",
  STAGE_CHANGED    = "STAGE_CHANGED",
  EVOLVED          = "EVOLVED",
  DIED             = "DIED",
  OVERWEIGHT       = "OVERWEIGHT",
}

// --------------- STAT BLOCK ---------------

export interface TomodomoStats {
  /** How fed the tomodomo is (0 = starving, 100 = full) */
  hunger: number;
  /** Emotional happiness (0 = very sad, 100 = very happy) */
  happiness: number;
  /** Overall health (0 = dead, 100 = perfectly healthy) */
  health: number;
  /** Energy level (0 = exhausted, 100 = full of energy) */
  energy: number;
  /** Discipline / obedience (0 = wild, 100 = very disciplined) */
  discipline: number;
  /** Body weight in game units */
  weight: number;
}

// --------------- CORE STATE ---------------

export interface TomodomoState {
  /** Unique ID for this tomodomo instance */
  id: string;
  /** Player-given name */
  name: string;

  /** Current stats */
  stats: TomodomoStats;

  /** Current life stage */
  stage: LifeStage;
  /** Evolution path determined at stage transitions */
  evolutionPath: EvolutionPath;
  /** Accumulated care quality score (0–1000) */
  careQuality: number;

  /** Total game-hours lived */
  ageInHours: number;
  /** Current in-game hour (0–23) */
  gameHour: number;

  /** Whether tomodomo is currently sleeping */
  isSleeping: boolean;
  /** Whether tomodomo is currently sick */
  isSick: boolean;
  /** Whether there is uncleaned waste present */
  hasWaste: boolean;
  /** Ticks since waste appeared (for escalating penalties) */
  wasteAge: number;
  /** Whether tomodomo is currently misbehaving */
  isMisbehaving: boolean;

  /** Ticks remaining until next bathroom event */
  ticksUntilBathroom: number;

  /** Current animation / display state for the screen */
  displayState: DisplayState;

  /** Whether tomodomo needs user attention right now */
  needsAttention: boolean;
  /** Reasons why attention is needed */
  attentionReasons: GameEvent[];

  /** Number of times player has tapped the egg */
  eggTapCount: number;

  /** Total simulation ticks elapsed since creation */
  totalTicks: number;
}

// --------------- RESULT TYPES ---------------

/** Returned by performAction() */
export interface ActionResult {
  success: boolean;
  message: string;
  statChanges: Partial<TomodomoStats>;
  eventsTriggered: GameEvent[];
}

/** Returned by tick() each update cycle */
export interface TickResult {
  stateSnapshot: TomodomoState;
  eventsTriggered: GameEvent[];
  displayState: DisplayState;
  needsAttention: boolean;
}
