// ============================================================
// TOMODOMO TAMAGOTCHI SIMULATION
// Demo / Reference Runner
//
// Run with:  npx ts-node src/tomodomo/demo.ts
//
// This demo fast-forwards the simulation in a terminal,
// printing state snapshots and events so you can verify
// game logic without a display unit.
// ============================================================

import { TomodomoSimulation } from "./simulation";
import { Action, GameEvent, LifeStage, EvolutionPath, DisplayState } from "./types";

// ----------------------------------------------------------------
// HELPERS
// ----------------------------------------------------------------

function bar(value: number, max = 100, width = 20): string {
  const filled = Math.round((value / max) * width);
  return "[" + "█".repeat(filled) + "░".repeat(width - filled) + "]";
}

function pad(str: string, len: number): string {
  return str.padEnd(len, " ").slice(0, len);
}

function printState(sim: TomodomoSimulation): void {
  const s = sim.getState();
  const { stats: st } = s;

  console.log("─".repeat(60));
  console.log(
    `  ${s.name}  |  Stage: ${pad(s.stage, 6)}  |  Age: ${s.ageInHours}h  |  Hour: ${s.gameHour}:00`
  );
  console.log(
    `  Evolution: ${s.evolutionPath}  |  Care Quality: ${s.careQuality}/1000`
  );
  console.log(
    `  Display: ${pad(s.displayState, 10)}  |  Sleeping: ${s.isSleeping ? "💤" : "🌞"}  |  Sick: ${s.isSick ? "🤢" : "✅"}`
  );
  console.log("");
  console.log(`  Hunger    ${bar(st.hunger)}  ${st.hunger.toFixed(0)}`);
  console.log(`  Happiness ${bar(st.happiness)}  ${st.happiness.toFixed(0)}`);
  console.log(`  Health    ${bar(st.health)}  ${st.health.toFixed(0)}`);
  console.log(`  Energy    ${bar(st.energy)}  ${st.energy.toFixed(0)}`);
  console.log(`  Discipline${bar(st.discipline)}  ${st.discipline.toFixed(0)}`);
  console.log(`  Weight    ${bar(st.weight, 99)}  ${st.weight.toFixed(1)}`);

  if (s.needsAttention) {
    console.log(`\n  ⚠️  NEEDS ATTENTION: ${s.attentionReasons.join(", ")}`);
  }
  if (s.hasWaste) {
    console.log(`  🚽 Waste present (age: ${s.wasteAge} ticks)`);
  }
  if (s.isMisbehaving) {
    console.log("  😤 Misbehaving!");
  }
}

function doAction(
  sim: TomodomoSimulation,
  action: Action,
  label: string
): void {
  const result = sim.performAction(action);
  const icon = result.success ? "✅" : "❌";
  console.log(`\n  >> ACTION: ${label}`);
  console.log(`     ${icon} ${result.message}`);
  if (Object.keys(result.statChanges).length > 0) {
    const changes = Object.entries(result.statChanges)
      .map(([k, v]) => `${k}: ${(v as number) >= 0 ? "+" : ""}${(v as number).toFixed(0)}`)
      .join("  |  ");
    console.log(`     Stats: ${changes}`);
  }
}

function fastForwardTicks(
  sim: TomodomoSimulation,
  ticks: number,
  label: string
): void {
  console.log(`\n⏩  Fast-forwarding ${ticks} ticks (${label})…`);
  let eventsLog: string[] = [];
  for (let i = 0; i < ticks; i++) {
    const result = sim.tick();
    if (result.eventsTriggered.length > 0) {
      eventsLog.push(`  tick ${i + 1}: ${result.eventsTriggered.join(", ")}`);
    }
    if (sim.getState().stage === LifeStage.DEAD) {
      console.log("  💀 Tomodomo died during fast-forward!");
      break;
    }
  }
  if (eventsLog.length > 0) {
    console.log("  Events triggered:");
    eventsLog.forEach(e => console.log("   " + e));
  }
}

// ----------------------------------------------------------------
// DEMO SCENARIOS
// ----------------------------------------------------------------

async function runDemo(): Promise<void> {
  console.log("╔══════════════════════════════════════════════════╗");
  console.log("║      TOMODOMO SIMULATION DEMO                    ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  const sim = new TomodomoSimulation("Tomo");

  // Register event hooks (these mirror what the hardware will fire)
  sim.on(GameEvent.HATCHED,         () => console.log("\n  🥚 EVENT: Tomodomo hatched!"));
  sim.on(GameEvent.HUNGRY,          () => console.log("  🍖 EVENT: Tomodomo is hungry!"));
  sim.on(GameEvent.SICK,            () => console.log("  🤢 EVENT: Tomodomo got sick!"));
  sim.on(GameEvent.CURED,           () => console.log("  💊 EVENT: Tomodomo was cured!"));
  sim.on(GameEvent.STAGE_CHANGED,   () => console.log("  ⭐ EVENT: Stage changed!"));
  sim.on(GameEvent.EVOLVED,         () => {
    const s = sim.getState();
    console.log(`  🦋 EVENT: Evolved! Path = ${s.evolutionPath} (care: ${s.careQuality})`);
  });
  sim.on(GameEvent.BATHROOM_NEEDED, () => console.log("  🚽 EVENT: Bathroom needed!"));
  sim.on(GameEvent.MISBEHAVING,     () => console.log("  😤 EVENT: Tomodomo is misbehaving!"));
  sim.on(GameEvent.DIED,            () => console.log("  💀 EVENT: Tomodomo has passed away."));
  sim.on(GameEvent.FELL_ASLEEP,     () => console.log("  💤 EVENT: Tomodomo fell asleep."));
  sim.on(GameEvent.WOKE_UP,         () => console.log("  ☀️  EVENT: Tomodomo woke up."));

  // ── SCENE 1: Hatch the egg ──────────────────────────────────
  console.log("\n━━━━  SCENE 1: Hatching  ━━━━");
  printState(sim);
  doAction(sim, Action.TAP_EGG, "Tap Egg (1/3)");
  doAction(sim, Action.TAP_EGG, "Tap Egg (2/3)");
  doAction(sim, Action.TAP_EGG, "Tap Egg (3/3 - hatch!)");
  printState(sim);

  // ── SCENE 2: Feed and play ──────────────────────────────────
  console.log("\n━━━━  SCENE 2: Feeding & Playing  ━━━━");
  doAction(sim, Action.FEED_MEAL,  "Feed Meal");
  doAction(sim, Action.FEED_SNACK, "Feed Snack");
  doAction(sim, Action.PLAY,       "Play");
  printState(sim);

  // ── SCENE 3: Simulate neglect over time ─────────────────────
  console.log("\n━━━━  SCENE 3: Time passing (neglect)  ━━━━");
  fastForwardTicks(sim, 30, "30 minutes of neglect");
  printState(sim);

  // ── SCENE 4: Rescue with good care ─────────────────────────
  console.log("\n━━━━  SCENE 4: Good care sequence  ━━━━");
  doAction(sim, Action.FEED_MEAL, "Feed Meal");
  doAction(sim, Action.PLAY,      "Play");
  if (sim.getState().hasWaste) {
    doAction(sim, Action.FLUSH_TOILET, "Clean up waste");
  }
  printState(sim);

  // ── SCENE 5: Sickness cycle ─────────────────────────────────
  console.log("\n━━━━  SCENE 5: Sickness & Medicine  ━━━━");
  // Force sick state for demo
  fastForwardTicks(sim, 60, "1 hour of high neglect (may trigger sickness)");
  if (sim.getState().isSick) {
    console.log("  Tomodomo is sick — giving medicine...");
    doAction(sim, Action.GIVE_MEDICINE, "Give Medicine (attempt 1)");
    if (sim.getState().isSick) {
      doAction(sim, Action.GIVE_MEDICINE, "Give Medicine (attempt 2)");
    }
  } else {
    console.log("  (Tomodomo stayed healthy this run)");
  }
  printState(sim);

  // ── SCENE 6: Sleep cycle ────────────────────────────────────
  console.log("\n━━━━  SCENE 6: Manual Sleep  ━━━━");
  doAction(sim, Action.SLEEP, "Put to sleep");
  fastForwardTicks(sim, 10, "10 ticks sleeping");
  doAction(sim, Action.WAKE, "Wake up");
  printState(sim);

  // ── SCENE 7: Discipline demo ────────────────────────────────
  console.log("\n━━━━  SCENE 7: Discipline  ━━━━");
  // Feed many snacks to lower discipline
  for (let i = 0; i < 5; i++) {
    sim.performAction(Action.FEED_SNACK);
  }
  fastForwardTicks(sim, 5, "5 ticks (may trigger misbehavior)");
  if (sim.getState().isMisbehaving) {
    doAction(sim, Action.DISCIPLINE, "Discipline misbehaving Tomo");
  } else {
    console.log("  (No misbehavior this run — discipline still high)");
    doAction(sim, Action.DISCIPLINE, "Unnecessary discipline (demo penalty)");
  }
  printState(sim);

  // ── SCENE 8: Fast-forward to show aging ─────────────────────
  console.log("\n━━━━  SCENE 8: Aging (24 ticks = 1 game day)  ━━━━");
  // Keep stats topped up while aging
  for (let day = 0; day < 3; day++) {
    fastForwardTicks(sim, 8, `day ${day + 1} morning`);
    sim.performAction(Action.FEED_MEAL);
    sim.performAction(Action.PLAY);
    if (sim.getState().hasWaste) sim.performAction(Action.FLUSH_TOILET);
    if (sim.getState().isSick)   sim.performAction(Action.GIVE_MEDICINE);
    fastForwardTicks(sim, 8, `day ${day + 1} afternoon`);
    sim.performAction(Action.FEED_MEAL);
    fastForwardTicks(sim, 8, `day ${day + 1} night`);
  }
  printState(sim);

  // ── FINAL SUMMARY ───────────────────────────────────────────
  console.log("\n━━━━  FINAL STATE SUMMARY  ━━━━");
  printState(sim);

  const finalState = sim.getState();
  console.log("\n  Life Stage  :", finalState.stage);
  console.log("  Evolution   :", finalState.evolutionPath);
  console.log("  Care Quality:", finalState.careQuality, "/ 1000");
  console.log("  Age         :", finalState.ageInHours, "game-hours");
  console.log("  Is Alive    :", finalState.stage !== LifeStage.DEAD ? "Yes" : "No");

  console.log("\n  Evolution paths at next stage transition:");
  if (finalState.careQuality >= 700) {
    console.log("   → GREAT evolution (care quality ≥ 700)");
  } else if (finalState.careQuality >= 400) {
    console.log("   → OKAY evolution (care quality ≥ 400)");
  } else {
    console.log("   → POOR evolution (care quality < 400)");
  }

  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║  Demo complete. All systems nominal.             ║");
  console.log("╚══════════════════════════════════════════════════╝\n");
}

// Run
runDemo().catch(console.error);
