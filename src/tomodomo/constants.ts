// ============================================================
// TOMODOMO TAMAGOTCHI SIMULATION
// Constants & Tuning Parameters
//
// All game-balancing values are centralized here.
// Manufacturers can adjust these to tune gameplay feel.
// ============================================================

// --------------- TIME ---------------

/** Real milliseconds per simulation tick (default: 1 minute) */
export const TICK_MS = 60_000;

/** How many real ticks equal one in-game hour */
export const TICKS_PER_GAME_HOUR = 1;

/** How many game hours in one game day */
export const GAME_HOURS_PER_DAY = 24;

// --------------- STAT RANGES ---------------

export const STAT_MIN = 0;
export const STAT_MAX = 100;

// Default starting stats when hatching from egg
export const INITIAL_HUNGER    = 80;
export const INITIAL_HAPPINESS = 80;
export const INITIAL_HEALTH    = 100;
export const INITIAL_ENERGY    = 100;
export const INITIAL_DISCIPLINE = 50;
export const INITIAL_WEIGHT    = 5;    // arbitrary weight units
export const WEIGHT_MIN        = 1;
export const WEIGHT_MAX        = 99;

// --------------- STAT DECAY PER TICK ---------------
// How much each stat drops each tick (awake state)

export const HUNGER_DECAY_RATE      = 2;   // drops 2/tick while awake
export const HAPPINESS_DECAY_RATE   = 1;   // drops 1/tick while awake
export const ENERGY_DECAY_RATE      = 1;   // drops 1/tick during activities
export const ENERGY_IDLE_DECAY_RATE = 0.5; // slower decay when idle

// Stat recovery during sleep
export const ENERGY_SLEEP_RECOVERY    = 5;  // +5/tick while sleeping
export const HEALTH_SLEEP_RECOVERY    = 1;  // +1/tick while sleeping

// --------------- HEALTH DAMAGE THRESHOLDS ---------------
// Health drops when neglected stats fall below these levels

export const HUNGER_CRITICAL_THRESHOLD    = 20;
export const HAPPINESS_CRITICAL_THRESHOLD = 20;
export const ENERGY_CRITICAL_THRESHOLD    = 10;

export const HEALTH_DAMAGE_FROM_HUNGER    = 2; // per tick when starving
export const HEALTH_DAMAGE_FROM_UNHAPPY   = 1; // per tick when very unhappy
export const HEALTH_DAMAGE_FROM_SICK      = 3; // per tick when sick & untreated

// --------------- FEEDING ---------------

export const MEAL_HUNGER_BOOST      = 25;
export const MEAL_WEIGHT_GAIN       = 1;

export const SNACK_HUNGER_BOOST     = 10;
export const SNACK_HAPPINESS_BOOST  = 8;
export const SNACK_WEIGHT_GAIN      = 2;
export const SNACK_DISCIPLINE_LOSS  = 5; // snacks hurt discipline

// Overeating penalty: if hunger >= this when fed
export const OVERFEED_THRESHOLD     = 90;
export const OVERFEED_WEIGHT_EXTRA  = 2;

// --------------- PLAYING ---------------

export const PLAY_HAPPINESS_BOOST   = 20;
export const PLAY_HUNGER_COST       = 5;
export const PLAY_ENERGY_COST       = 10;
export const PLAY_WEIGHT_LOSS       = 1;

// --------------- SLEEPING ---------------

export const SLEEP_START_HOUR = 20; // 8 PM game time
export const SLEEP_END_HOUR   = 7;  // 7 AM game time

/** Happiness lost if forced awake during sleep hours */
export const DISTURB_SLEEP_HAPPINESS_LOSS = 15;

// --------------- MEDICINE ---------------

export const MEDICINE_HEALTH_BOOST     = 30;
export const MEDICINE_HAPPINESS_LOSS   = 10; // tastes bad
export const MEDICINE_CURE_CHANCE      = 0.85; // 85% chance to cure sickness per dose

// --------------- DISCIPLINE ---------------

export const DISCIPLINE_BOOST       = 15;
export const DISCIPLINE_DECAY_RATE  = 0.2; // per tick

// Chance of misbehaving per tick when discipline is low
export const MISBEHAVE_DISCIPLINE_THRESHOLD = 40;
export const MISBEHAVE_CHANCE_PER_TICK      = 0.05; // 5% chance

// --------------- SICKNESS ---------------

/** Chance per tick of getting sick when health < threshold */
export const SICK_HEALTH_THRESHOLD  = 40;
export const SICK_CHANCE_PER_TICK   = 0.03; // 3% per tick

// --------------- BATHROOM ---------------

/** Average ticks between bathroom events */
export const BATHROOM_INTERVAL_TICKS   = 60;  // every ~1 hour
export const BATHROOM_INTERVAL_JITTER  = 20;  // ± 20 ticks
/** Happiness lost per tick if uncleaned waste is present */
export const UNCLEANED_HAPPINESS_LOSS  = 2;
/** Sick chance increase per tick if waste uncleaned > this many ticks */
export const UNCLEANED_SICK_EXTRA_TICKS = 10;
export const UNCLEANED_EXTRA_SICK_CHANCE = 0.05;

// --------------- WEIGHT ---------------

/** Weight above which tomodomo is considered overweight */
export const OVERWEIGHT_THRESHOLD   = 30;
/** Health damage per tick when overweight */
export const OVERWEIGHT_HEALTH_DAMAGE = 0.5;

// --------------- LIFE STAGES ---------------
// Thresholds in total game-hours lived

export const STAGE_EGG_MAX_HOURS    = 1;
export const STAGE_BABY_MAX_HOURS   = 24;
export const STAGE_CHILD_MAX_HOURS  = 72;   // 3 days
export const STAGE_TEEN_MAX_HOURS   = 168;  // 7 days
export const STAGE_ADULT_MAX_HOURS  = 336;  // 14 days
export const STAGE_ELDER_MAX_HOURS  = 672;  // 28 days
// Beyond ELDER_MAX_HOURS → natural death

// --------------- EVOLUTION ---------------
// Care quality score accumulated over life (higher = better care)
// Used to determine which evolution path to take at key ages

export const CARE_QUALITY_MAX = 1000;
export const CARE_QUALITY_GOOD_THRESHOLD = 700;  // ≥ 700 → good evolution
export const CARE_QUALITY_OKAY_THRESHOLD = 400;  // ≥ 400 → okay evolution
// < 400 → poor evolution

// Care quality gains per tick based on stat averages
export const CARE_QUALITY_GAIN_GREAT  = 2;   // all stats ≥ 70
export const CARE_QUALITY_GAIN_OKAY   = 1;   // stats average ≥ 50
export const CARE_QUALITY_LOSS_POOR   = -2;  // any stat < critical threshold

// --------------- ATTENTION CALLS ---------------
// Tomodomo beeps/flashes when it needs attention

export const ATTENTION_HUNGER_THRESHOLD    = 30;
export const ATTENTION_HAPPINESS_THRESHOLD = 30;
export const ATTENTION_HEALTH_THRESHOLD    = 30;
export const ATTENTION_ENERGY_THRESHOLD    = 15;
