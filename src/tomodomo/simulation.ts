// ============================================================
// TOMODOMO TAMAGOTCHI SIMULATION
// Core Simulation Engine
//
// Usage:
//   const sim = new TomodomoSimulation("Tomo");
//   sim.start();                      // begins the tick loop
//   sim.performAction(Action.FEED_MEAL);
//   sim.stop();
//
// For embedded hardware: call tick() manually at your
// preferred interval instead of using start()/stop().
// ============================================================

import {
  LifeStage, EvolutionPath, DisplayState, Action, GameEvent,
  TomodomoStats, TomodomoState, ActionResult, TickResult,
} from "./types";

import {
  TICK_MS, TICKS_PER_GAME_HOUR, GAME_HOURS_PER_DAY,
  STAT_MIN, STAT_MAX,
  INITIAL_HUNGER, INITIAL_HAPPINESS, INITIAL_HEALTH,
  INITIAL_ENERGY, INITIAL_DISCIPLINE, INITIAL_WEIGHT,
  WEIGHT_MIN, WEIGHT_MAX,
  HUNGER_DECAY_RATE, HAPPINESS_DECAY_RATE,
  ENERGY_DECAY_RATE, ENERGY_IDLE_DECAY_RATE,
  ENERGY_SLEEP_RECOVERY, HEALTH_SLEEP_RECOVERY,
  HUNGER_CRITICAL_THRESHOLD, HAPPINESS_CRITICAL_THRESHOLD, ENERGY_CRITICAL_THRESHOLD,
  HEALTH_DAMAGE_FROM_HUNGER, HEALTH_DAMAGE_FROM_UNHAPPY, HEALTH_DAMAGE_FROM_SICK,
  MEAL_HUNGER_BOOST, MEAL_WEIGHT_GAIN,
  SNACK_HUNGER_BOOST, SNACK_HAPPINESS_BOOST, SNACK_WEIGHT_GAIN, SNACK_DISCIPLINE_LOSS,
  OVERFEED_THRESHOLD, OVERFEED_WEIGHT_EXTRA,
  PLAY_HAPPINESS_BOOST, PLAY_HUNGER_COST, PLAY_ENERGY_COST, PLAY_WEIGHT_LOSS,
  SLEEP_START_HOUR, SLEEP_END_HOUR,
  DISTURB_SLEEP_HAPPINESS_LOSS,
  MEDICINE_HEALTH_BOOST, MEDICINE_HAPPINESS_LOSS, MEDICINE_CURE_CHANCE,
  DISCIPLINE_BOOST, DISCIPLINE_DECAY_RATE,
  MISBEHAVE_DISCIPLINE_THRESHOLD, MISBEHAVE_CHANCE_PER_TICK,
  SICK_HEALTH_THRESHOLD, SICK_CHANCE_PER_TICK,
  BATHROOM_INTERVAL_TICKS, BATHROOM_INTERVAL_JITTER,
  UNCLEANED_HAPPINESS_LOSS, UNCLEANED_SICK_EXTRA_TICKS, UNCLEANED_EXTRA_SICK_CHANCE,
  OVERWEIGHT_THRESHOLD, OVERWEIGHT_HEALTH_DAMAGE,
  STAGE_EGG_MAX_HOURS, STAGE_BABY_MAX_HOURS, STAGE_CHILD_MAX_HOURS,
  STAGE_TEEN_MAX_HOURS, STAGE_ADULT_MAX_HOURS, STAGE_ELDER_MAX_HOURS,
  CARE_QUALITY_MAX, CARE_QUALITY_GOOD_THRESHOLD, CARE_QUALITY_OKAY_THRESHOLD,
  CARE_QUALITY_GAIN_GREAT, CARE_QUALITY_GAIN_OKAY, CARE_QUALITY_LOSS_POOR,
  ATTENTION_HUNGER_THRESHOLD, ATTENTION_HAPPINESS_THRESHOLD,
  ATTENTION_HEALTH_THRESHOLD, ATTENTION_ENERGY_THRESHOLD,
} from "./constants";

// ============================================================
// HELPERS
// ============================================================

function clamp(value: number, min = STAT_MIN, max = STAT_MAX): number {
  return Math.max(min, Math.min(max, value));
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(): string {
  return `tomo-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

// ============================================================
// SIMULATION CLASS
// ============================================================

export class TomodomoSimulation {

  private state: TomodomoState;
  private tickerHandle: ReturnType<typeof setInterval> | null = null;
  private eventListeners: Map<GameEvent, Array<(state: TomodomoState) => void>> = new Map();

  // ---- Construction & Initialization ----

  constructor(name: string = "Tomodomo") {
    this.state = this.createInitialState(name);
  }

  private createInitialState(name: string): TomodomoState {
    return {
      id: generateId(),
      name,
      stats: {
        hunger:     STAT_MAX,
        happiness:  STAT_MAX,
        health:     STAT_MAX,
        energy:     STAT_MAX,
        discipline: INITIAL_DISCIPLINE,
        weight:     INITIAL_WEIGHT,
      },
      stage:         LifeStage.EGG,
      evolutionPath: EvolutionPath.NONE,
      careQuality:   500, // start at midpoint

      ageInHours:   0,
      gameHour:     8,   // start at 8 AM

      isSleeping:        false,
      isSick:            false,
      hasWaste:          false,
      wasteAge:          0,
      isMisbehaving:     false,
      ticksUntilBathroom: this.nextBathroomInterval(),

      displayState:    DisplayState.EGG,
      needsAttention:  false,
      attentionReasons: [],

      eggTapCount: 0,
      totalTicks:  0,
    };
  }

  // ---- Public API ----

  /** Get a read-only snapshot of the current state */
  getState(): Readonly<TomodomoState> {
    return { ...this.state, stats: { ...this.state.stats } };
  }

  /**
   * Start the automatic tick loop.
   * Each tick fires every TICK_MS milliseconds.
   * On embedded hardware, call tick() manually instead.
   */
  start(): void {
    if (this.tickerHandle !== null) return;
    this.tickerHandle = setInterval(() => this.tick(), TICK_MS);
  }

  /** Stop the automatic tick loop */
  stop(): void {
    if (this.tickerHandle !== null) {
      clearInterval(this.tickerHandle);
      this.tickerHandle = null;
    }
  }

  /**
   * Advance the simulation by one tick.
   * Call this manually at your hardware timer interval if not using start().
   */
  tick(): TickResult {
    const events: GameEvent[] = [];

    if (this.state.stage === LifeStage.EGG) {
      return this.buildTickResult(events);
    }
    if (this.state.stage === LifeStage.DEAD) {
      return this.buildTickResult(events);
    }

    this.state.totalTicks++;
    this.advanceGameTime(events);
    this.decayStats(events);
    this.applyHealthDamage(events);
    this.processBathroomCycle(events);
    this.processSickness(events);
    this.processMisbehavior(events);
    this.processOverweight(events);
    this.updateCareQuality();
    this.checkStageProgression(events);
    this.updateAttentionState(events);
    this.updateDisplayState();
    this.checkDeath(events);

    events.forEach(e => this.emitEvent(e));
    return this.buildTickResult(events);
  }

  /**
   * Perform a player action.
   * Returns an ActionResult describing what happened.
   */
  performAction(action: Action): ActionResult {
    if (this.state.stage === LifeStage.DEAD) {
      return this.failResult("Tomodomo has passed away.");
    }

    switch (action) {
      case Action.TAP_EGG:       return this.actionTapEgg();
      case Action.FEED_MEAL:     return this.actionFeedMeal();
      case Action.FEED_SNACK:    return this.actionFeedSnack();
      case Action.PLAY:          return this.actionPlay();
      case Action.SLEEP:         return this.actionSleep();
      case Action.WAKE:          return this.actionWake();
      case Action.GIVE_MEDICINE: return this.actionGiveMedicine();
      case Action.FLUSH_TOILET:  return this.actionFlushToilet();
      case Action.DISCIPLINE:    return this.actionDiscipline();
      default:
        return this.failResult("Unknown action.");
    }
  }

  /** Register a listener for a specific game event */
  on(event: GameEvent, handler: (state: TomodomoState) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(handler);
  }

  /** Remove a listener */
  off(event: GameEvent, handler: (state: TomodomoState) => void): void {
    const handlers = this.eventListeners.get(event);
    if (!handlers) return;
    const idx = handlers.indexOf(handler);
    if (idx !== -1) handlers.splice(idx, 1);
  }

  // ---- Tick Sub-steps ----

  private advanceGameTime(events: GameEvent[]): void {
    // Advance age & game clock
    if (this.state.totalTicks % TICKS_PER_GAME_HOUR === 0) {
      this.state.ageInHours++;
      this.state.gameHour = (this.state.gameHour + 1) % GAME_HOURS_PER_DAY;
    }

    // Auto-sleep at night (if not already sleeping)
    const hour = this.state.gameHour;
    const isSleepTime = hour >= SLEEP_START_HOUR || hour < SLEEP_END_HOUR;

    if (isSleepTime && !this.state.isSleeping) {
      this.state.isSleeping = true;
      events.push(GameEvent.FELL_ASLEEP);
    }
    if (!isSleepTime && this.state.isSleeping) {
      this.state.isSleeping = false;
      events.push(GameEvent.WOKE_UP);
    }
  }

  private decayStats(events: GameEvent[]): void {
    const s = this.state.stats;

    if (this.state.isSleeping) {
      // Sleeping: recover energy & health, hunger still decays (slower)
      s.energy    = clamp(s.energy + ENERGY_SLEEP_RECOVERY);
      s.health    = clamp(s.health + HEALTH_SLEEP_RECOVERY);
      s.hunger    = clamp(s.hunger - HUNGER_DECAY_RATE / 2);
      s.discipline = clamp(s.discipline - DISCIPLINE_DECAY_RATE / 2);
    } else {
      // Awake
      s.hunger     = clamp(s.hunger - HUNGER_DECAY_RATE);
      s.happiness  = clamp(s.happiness - HAPPINESS_DECAY_RATE);
      s.discipline = clamp(s.discipline - DISCIPLINE_DECAY_RATE);

      // Energy decays slower when idle
      const energyDecay = this.state.isMisbehaving
        ? ENERGY_DECAY_RATE
        : ENERGY_IDLE_DECAY_RATE;
      s.energy = clamp(s.energy - energyDecay);
    }

    // Uncleaned waste degrades happiness
    if (this.state.hasWaste) {
      s.happiness = clamp(s.happiness - UNCLEANED_HAPPINESS_LOSS);
      this.state.wasteAge++;
    }
  }

  private applyHealthDamage(events: GameEvent[]): void {
    const s = this.state.stats;
    let healthDmg = 0;

    if (s.hunger <= HUNGER_CRITICAL_THRESHOLD)       healthDmg += HEALTH_DAMAGE_FROM_HUNGER;
    if (s.happiness <= HAPPINESS_CRITICAL_THRESHOLD) healthDmg += HEALTH_DAMAGE_FROM_UNHAPPY;
    if (this.state.isSick)                           healthDmg += HEALTH_DAMAGE_FROM_SICK;

    if (healthDmg > 0) {
      s.health = clamp(s.health - healthDmg);
    }
  }

  private processBathroomCycle(events: GameEvent[]): void {
    if (this.state.stage === LifeStage.BABY) return; // handled separately below

    this.state.ticksUntilBathroom--;
    if (this.state.ticksUntilBathroom <= 0 && !this.state.hasWaste) {
      this.state.hasWaste = true;
      this.state.wasteAge = 0;
      this.state.ticksUntilBathroom = this.nextBathroomInterval();
      events.push(GameEvent.BATHROOM_NEEDED);
    }
  }

  private processSickness(events: GameEvent[]): void {
    if (this.state.isSick) return;

    const s = this.state.stats;
    let sickChance = 0;
    if (s.health < SICK_HEALTH_THRESHOLD) sickChance += SICK_CHANCE_PER_TICK;
    if (this.state.hasWaste && this.state.wasteAge > UNCLEANED_SICK_EXTRA_TICKS) {
      sickChance += UNCLEANED_EXTRA_SICK_CHANCE;
    }

    if (sickChance > 0 && Math.random() < sickChance) {
      this.state.isSick = true;
      events.push(GameEvent.SICK);
    }
  }

  private processMisbehavior(events: GameEvent[]): void {
    if (this.state.isSleeping || this.state.isMisbehaving) return;

    const { discipline } = this.state.stats;
    if (discipline < MISBEHAVE_DISCIPLINE_THRESHOLD) {
      if (Math.random() < MISBEHAVE_CHANCE_PER_TICK) {
        this.state.isMisbehaving = true;
        events.push(GameEvent.MISBEHAVING);
      }
    }
  }

  private processOverweight(events: GameEvent[]): void {
    if (this.state.stats.weight > OVERWEIGHT_THRESHOLD) {
      this.state.stats.health = clamp(this.state.stats.health - OVERWEIGHT_HEALTH_DAMAGE);
      events.push(GameEvent.OVERWEIGHT);
    }
  }

  private updateCareQuality(): void {
    const s = this.state.stats;
    const avg = (s.hunger + s.happiness + s.health + s.energy) / 4;
    const anyCritical = (
      s.hunger <= HUNGER_CRITICAL_THRESHOLD ||
      s.happiness <= HAPPINESS_CRITICAL_THRESHOLD ||
      s.health <= ATTENTION_HEALTH_THRESHOLD
    );

    let delta = 0;
    if (anyCritical) {
      delta = CARE_QUALITY_LOSS_POOR;
    } else if (avg >= 70) {
      delta = CARE_QUALITY_GAIN_GREAT;
    } else if (avg >= 50) {
      delta = CARE_QUALITY_GAIN_OKAY;
    }

    this.state.careQuality = clamp(this.state.careQuality + delta, 0, CARE_QUALITY_MAX);
  }

  private checkStageProgression(events: GameEvent[]): void {
    const age = this.state.ageInHours;
    const prev = this.state.stage;
    let next: LifeStage | null = null;

    if (prev === LifeStage.BABY  && age >= STAGE_BABY_MAX_HOURS)  next = LifeStage.CHILD;
    if (prev === LifeStage.CHILD && age >= STAGE_CHILD_MAX_HOURS) next = LifeStage.TEEN;
    if (prev === LifeStage.TEEN  && age >= STAGE_TEEN_MAX_HOURS)  next = LifeStage.ADULT;
    if (prev === LifeStage.ADULT && age >= STAGE_ADULT_MAX_HOURS) next = LifeStage.ELDER;

    if (next !== null) {
      this.state.stage = next;
      this.resolveEvolution();
      events.push(GameEvent.STAGE_CHANGED);
      events.push(GameEvent.EVOLVED);
    }
  }

  private resolveEvolution(): void {
    const cq = this.state.careQuality;
    if (cq >= CARE_QUALITY_GOOD_THRESHOLD) {
      this.state.evolutionPath = EvolutionPath.GREAT;
    } else if (cq >= CARE_QUALITY_OKAY_THRESHOLD) {
      this.state.evolutionPath = EvolutionPath.OKAY;
    } else {
      this.state.evolutionPath = EvolutionPath.POOR;
    }
  }

  private updateAttentionState(): void {
    const s = this.state.stats;
    const reasons: GameEvent[] = [];

    if (s.hunger    <= ATTENTION_HUNGER_THRESHOLD)    reasons.push(GameEvent.HUNGRY);
    if (s.happiness <= ATTENTION_HAPPINESS_THRESHOLD) reasons.push(GameEvent.UNHAPPY);
    if (s.health    <= ATTENTION_HEALTH_THRESHOLD)    reasons.push(GameEvent.LOW_HEALTH);
    if (s.energy    <= ATTENTION_ENERGY_THRESHOLD && !this.state.isSleeping) {
      reasons.push(GameEvent.LOW_ENERGY);
    }
    if (this.state.isSick)        reasons.push(GameEvent.SICK);
    if (this.state.hasWaste)      reasons.push(GameEvent.BATHROOM_NEEDED);
    if (this.state.isMisbehaving) reasons.push(GameEvent.MISBEHAVING);

    this.state.attentionReasons = reasons;
    this.state.needsAttention   = reasons.length > 0;
  }

  private updateDisplayState(): void {
    const s = this.state.stats;

    if (this.state.stage === LifeStage.DEAD) {
      this.state.displayState = DisplayState.DEAD;
      return;
    }
    if (this.state.isSleeping) {
      this.state.displayState = DisplayState.SLEEPING;
      return;
    }
    if (this.state.isSick) {
      this.state.displayState = DisplayState.SICK;
      return;
    }
    if (this.state.isMisbehaving) {
      this.state.displayState = DisplayState.ANGRY;
      return;
    }
    if (s.happiness <= ATTENTION_HAPPINESS_THRESHOLD || s.hunger <= ATTENTION_HUNGER_THRESHOLD) {
      this.state.displayState = DisplayState.SAD;
      return;
    }
    if (s.happiness >= 70 && s.hunger >= 50 && s.health >= 70) {
      this.state.displayState = DisplayState.HAPPY;
      return;
    }
    this.state.displayState = DisplayState.IDLE;
  }

  private checkDeath(events: GameEvent[]): void {
    const { health, hunger } = this.state.stats;
    const naturalDeath = this.state.ageInHours >= STAGE_ELDER_MAX_HOURS;
    const healthDeath  = health <= 0;
    const starveDeath  = hunger <= 0 && health <= 0;

    if (naturalDeath || healthDeath || starveDeath) {
      this.state.stage        = LifeStage.DEAD;
      this.state.displayState = DisplayState.DEAD;
      this.state.needsAttention = false;
      events.push(GameEvent.DIED);
      this.stop();
    }
  }

  // ---- Actions ----

  private actionTapEgg(): ActionResult {
    if (this.state.stage !== LifeStage.EGG) {
      return this.failResult("Tomodomo has already hatched!");
    }

    this.state.eggTapCount++;

    // Requires 3 taps to hatch
    if (this.state.eggTapCount < 3) {
      return {
        success: true,
        message: `The egg wobbles! (Tap ${this.state.eggTapCount}/3)`,
        statChanges: {},
        eventsTriggered: [],
      };
    }

    // Hatch
    this.state.stage = LifeStage.BABY;
    this.state.displayState = DisplayState.HAPPY;
    this.state.stats = {
      hunger:     INITIAL_HUNGER,
      happiness:  INITIAL_HAPPINESS,
      health:     INITIAL_HEALTH,
      energy:     INITIAL_ENERGY,
      discipline: INITIAL_DISCIPLINE,
      weight:     INITIAL_WEIGHT,
    };
    this.state.ticksUntilBathroom = this.nextBathroomInterval();
    this.emitEvent(GameEvent.HATCHED);

    return {
      success: true,
      message: `${this.state.name} has hatched! Welcome to the world!`,
      statChanges: {},
      eventsTriggered: [GameEvent.HATCHED],
    };
  }

  private actionFeedMeal(): ActionResult {
    if (!this.canInteract()) return this.failResult("Cannot interact right now.");
    if (this.state.isSleeping) return this.failResult(`${this.state.name} is sleeping.`);

    const s = this.state.stats;
    const overfed = s.hunger >= OVERFEED_THRESHOLD;
    const weightGain = MEAL_WEIGHT_GAIN + (overfed ? OVERFEED_WEIGHT_EXTRA : 0);
    const changes: Partial<TomodomoStats> = {
      hunger: clamp(s.hunger + MEAL_HUNGER_BOOST) - s.hunger,
      weight: clamp(s.weight + weightGain, WEIGHT_MIN, WEIGHT_MAX) - s.weight,
    };

    s.hunger  = clamp(s.hunger + MEAL_HUNGER_BOOST);
    s.weight  = clamp(s.weight + weightGain, WEIGHT_MIN, WEIGHT_MAX);
    this.state.isMisbehaving = false;
    this.state.displayState = DisplayState.EATING;

    const msg = overfed
      ? `${this.state.name} was already full and gained extra weight!`
      : `${this.state.name} enjoyed the meal.`;

    return { success: true, message: msg, statChanges: changes, eventsTriggered: [] };
  }

  private actionFeedSnack(): ActionResult {
    if (!this.canInteract()) return this.failResult("Cannot interact right now.");
    if (this.state.isSleeping) return this.failResult(`${this.state.name} is sleeping.`);

    const s = this.state.stats;
    const changes: Partial<TomodomoStats> = {
      hunger:     SNACK_HUNGER_BOOST,
      happiness:  SNACK_HAPPINESS_BOOST,
      weight:     SNACK_WEIGHT_GAIN,
      discipline: -SNACK_DISCIPLINE_LOSS,
    };

    s.hunger     = clamp(s.hunger     + SNACK_HUNGER_BOOST);
    s.happiness  = clamp(s.happiness  + SNACK_HAPPINESS_BOOST);
    s.weight     = clamp(s.weight     + SNACK_WEIGHT_GAIN, WEIGHT_MIN, WEIGHT_MAX);
    s.discipline = clamp(s.discipline - SNACK_DISCIPLINE_LOSS);
    this.state.isMisbehaving = false;
    this.state.displayState = DisplayState.EATING;

    return {
      success: true,
      message: `${this.state.name} loved the snack! (discipline -${SNACK_DISCIPLINE_LOSS})`,
      statChanges: changes,
      eventsTriggered: [],
    };
  }

  private actionPlay(): ActionResult {
    if (!this.canInteract()) return this.failResult("Cannot interact right now.");
    if (this.state.isSleeping) return this.failResult(`${this.state.name} is sleeping.`);
    if (this.state.stats.energy <= ENERGY_CRITICAL_THRESHOLD) {
      return this.failResult(`${this.state.name} is too tired to play.`);
    }

    const s = this.state.stats;
    const changes: Partial<TomodomoStats> = {
      happiness: PLAY_HAPPINESS_BOOST,
      hunger:    -PLAY_HUNGER_COST,
      energy:    -PLAY_ENERGY_COST,
      weight:    -PLAY_WEIGHT_LOSS,
    };

    s.happiness = clamp(s.happiness + PLAY_HAPPINESS_BOOST);
    s.hunger    = clamp(s.hunger    - PLAY_HUNGER_COST);
    s.energy    = clamp(s.energy    - PLAY_ENERGY_COST);
    s.weight    = clamp(s.weight    - PLAY_WEIGHT_LOSS, WEIGHT_MIN, WEIGHT_MAX);
    this.state.isMisbehaving = false;
    this.state.displayState = DisplayState.PLAYING;

    return {
      success: true,
      message: `${this.state.name} had fun playing!`,
      statChanges: changes,
      eventsTriggered: [],
    };
  }

  private actionSleep(): ActionResult {
    if (!this.canInteract()) return this.failResult("Cannot interact right now.");
    if (this.state.isSleeping) return this.failResult(`${this.state.name} is already sleeping.`);

    this.state.isSleeping = true;
    this.emitEvent(GameEvent.FELL_ASLEEP);

    return {
      success: true,
      message: `${this.state.name} went to sleep. Zzz...`,
      statChanges: {},
      eventsTriggered: [GameEvent.FELL_ASLEEP],
    };
  }

  private actionWake(): ActionResult {
    if (!this.state.isSleeping) return this.failResult(`${this.state.name} is already awake.`);

    const hour = this.state.gameHour;
    const isSleepTime = hour >= SLEEP_START_HOUR || hour < SLEEP_END_HOUR;

    if (isSleepTime) {
      // Penalty for waking during sleep hours
      this.state.stats.happiness = clamp(
        this.state.stats.happiness - DISTURB_SLEEP_HAPPINESS_LOSS
      );
    }

    this.state.isSleeping = false;
    this.emitEvent(GameEvent.WOKE_UP);

    const msg = isSleepTime
      ? `${this.state.name} was woken up and is unhappy about it!`
      : `${this.state.name} woke up feeling refreshed.`;

    return {
      success: true,
      message: msg,
      statChanges: isSleepTime ? { happiness: -DISTURB_SLEEP_HAPPINESS_LOSS } : {},
      eventsTriggered: [GameEvent.WOKE_UP],
    };
  }

  private actionGiveMedicine(): ActionResult {
    if (!this.canInteract()) return this.failResult("Cannot interact right now.");

    if (!this.state.isSick) {
      return this.failResult(`${this.state.name} isn't sick right now.`);
    }

    const s = this.state.stats;
    s.health    = clamp(s.health + MEDICINE_HEALTH_BOOST);
    s.happiness = clamp(s.happiness - MEDICINE_HAPPINESS_LOSS);

    const cured = Math.random() < MEDICINE_CURE_CHANCE;
    const events: GameEvent[] = [];
    if (cured) {
      this.state.isSick = false;
      events.push(GameEvent.CURED);
    }

    return {
      success: true,
      message: cured
        ? `${this.state.name} took medicine and feels better!`
        : `${this.state.name} took medicine but needs more rest...`,
      statChanges: { health: MEDICINE_HEALTH_BOOST, happiness: -MEDICINE_HAPPINESS_LOSS },
      eventsTriggered: events,
    };
  }

  private actionFlushToilet(): ActionResult {
    if (!this.state.hasWaste) {
      return this.failResult("Nothing to clean up right now.");
    }

    this.state.hasWaste = false;
    this.state.wasteAge = 0;
    this.emitEvent(GameEvent.BATHROOM_CLEANED);

    return {
      success: true,
      message: "Cleaned up! Good hygiene keeps Tomodomo healthy.",
      statChanges: {},
      eventsTriggered: [GameEvent.BATHROOM_CLEANED],
    };
  }

  private actionDiscipline(): ActionResult {
    if (!this.canInteract()) return this.failResult("Cannot interact right now.");

    if (!this.state.isMisbehaving) {
      // Disciplining for no reason hurts happiness
      this.state.stats.happiness = clamp(this.state.stats.happiness - 10);
      return {
        success: true,
        message: `${this.state.name} wasn't misbehaving! Unnecessary scolding.`,
        statChanges: { happiness: -10 },
        eventsTriggered: [],
      };
    }

    this.state.stats.discipline = clamp(this.state.stats.discipline + DISCIPLINE_BOOST);
    this.state.isMisbehaving = false;

    return {
      success: true,
      message: `${this.state.name} has been disciplined.`,
      statChanges: { discipline: DISCIPLINE_BOOST },
      eventsTriggered: [],
    };
  }

  // ---- Utilities ----

  private canInteract(): boolean {
    return this.state.stage !== LifeStage.EGG && this.state.stage !== LifeStage.DEAD;
  }

  private failResult(message: string): ActionResult {
    return { success: false, message, statChanges: {}, eventsTriggered: [] };
  }

  private nextBathroomInterval(): number {
    return (
      BATHROOM_INTERVAL_TICKS +
      randomInt(-BATHROOM_INTERVAL_JITTER, BATHROOM_INTERVAL_JITTER)
    );
  }

  private buildTickResult(events: GameEvent[]): TickResult {
    return {
      stateSnapshot: this.getState() as TomodomoState,
      eventsTriggered: events,
      displayState: this.state.displayState,
      needsAttention: this.state.needsAttention,
    };
  }

  private emitEvent(event: GameEvent): void {
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.forEach(h => h(this.state));
    }
  }
}
