# Day/Night Time Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a persistent in-game clock and day/night cycle that affects temperature while preserving existing survival systems.

**Architecture:** Extend the current `game.js` loop with a numeric `gameTime` representing minutes in a repeating 24-hour day. Derive the displayed clock and phase from that value, and use phase/time to adjust the existing weather temperature target. Persist `gameTime` through the existing localStorage save format.

**Tech Stack:** Existing browser JavaScript, Canvas 2D, localStorage.

## Global Constraints

- Preserve the existing 20-health Hardcore survival system.
- Keep the existing weather, clothing, hunger, thirst, crafting, trees, and house systems working.
- Do not add external dependencies.
- The clock must wrap cleanly after 24:00.

---

### Task 1: Add game clock state and display

**Files:**
- Modify: `game.js`

- [ ] Add `gameTime` state with a sensible starting time.
- [ ] Advance game time from the existing animation/survival loop.
- [ ] Add helpers for hour/minute and phase (`morning`, `day`, `evening`, `night`).
- [ ] Draw the clock and phase in the HUD.
- [ ] Commit: `feat: add in-game clock`

### Task 2: Connect time to temperature

**Files:**
- Modify: `game.js`

- [ ] Adjust the existing weather temperature target based on time of day.
- [ ] Keep hot/cold clothing protection working.
- [ ] Ensure night is cooler than daytime without making temperature changes extreme.
- [ ] Commit: `feat: connect time to temperature`

### Task 3: Persist time with Save/Load

**Files:**
- Modify: `game.js`

- [ ] Add `gameTime` to the save object.
- [ ] Restore it on load, with a safe fallback for older saves.
- [ ] Confirm the clock resumes from the saved time.
- [ ] Commit: `feat: save in-game time`

### Task 4: Final verification

**Files:**
- Modify: `game.js`

- [ ] Check that 23:59 wraps to 00:00.
- [ ] Check that the HUD phase changes across the day.
- [ ] Check that weather and clothing still affect temperature.
- [ ] Check that existing save/load behavior remains intact.
- [ ] Report any browser-only behavior that could not be verified in the current environment.
