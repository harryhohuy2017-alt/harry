# House Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add free block-based house building plus a fast wooden house template without breaking existing survival gameplay.

**Architecture:** Extend the existing world block model with a house-template action and shelter metadata. Reuse the existing placement/inventory system rather than introducing a separate building engine. Keep shelter effects simple and testable: a completed template marks a small rectangular area as shelter, while free-built structures remain valid world blocks.

**Tech Stack:** Existing browser JavaScript, Canvas 2D, localStorage, GitHub repository tests.

## Global Constraints

- Preserve the existing 20-health Hardcore survival system.
- Reuse existing inventory, block placement, crafting, weather, temperature, and Save/Load systems.
- Do not add external dependencies.
- House template uses wood/planks and must fail safely when materials are insufficient.

---

### Task 1: Add house state and template recipe

**Files:**
- Modify: `game.js`
- Test: `game-core.test.js`

**Interfaces:**
- Consumes: existing `inventory`, `world`, and crafting state.
- Produces: `houseBuilt`, a boolean shelter state, and a house-template crafting action.

- [ ] **Step 1: Write the failing test**

Add assertions that a template requires planks, consumes them, and marks the house as built.

- [ ] **Step 2: Run the focused test**

Run the repository's existing JavaScript test command and confirm the new house assertions fail before implementation.

- [ ] **Step 3: Implement the minimal state**

Add `houseBuilt=false` and a recipe requiring 12 planks. Add a template function that checks the material count before changing the world.

- [ ] **Step 4: Run the focused test again**

Confirm the house assertions pass.

- [ ] **Step 5: Commit**

Commit message: `feat: add house template state`

### Task 2: Implement wooden house template placement

**Files:**
- Modify: `game.js`
- Test: `game-core.test.js`

**Interfaces:**
- Consumes: `houseBuilt`, player grid position, and plank inventory.
- Produces: a small wooden rectangular shelter made from existing world blocks.

- [ ] **Step 1: Write the failing test**

Test that creating a template adds wall/roof blocks around the player and does not overwrite the boundary blocks.

- [ ] **Step 2: Run the test and verify failure**

Run the focused JavaScript test and verify the template structure is not yet present.

- [ ] **Step 3: Implement template generation**

Generate a compact 5x5 wooden shelter centered near the player, skip existing boundary cells, and consume the required planks once.

- [ ] **Step 4: Run tests**

Verify both template tests pass and existing food/water tests remain passing.

- [ ] **Step 5: Commit**

Commit message: `feat: build wooden house template`

### Task 3: Add shelter detection and UI

**Files:**
- Modify: `game.js`
- Test: `game-core.test.js`

**Interfaces:**
- Consumes: player position and world blocks.
- Produces: `isSheltered()` and an Inventory/status indicator.

- [ ] **Step 1: Write the failing test**

Test that a player inside a completed roofed template is sheltered and a player outside is not.

- [ ] **Step 2: Run the test and verify failure**

Confirm `isSheltered()` does not exist or returns the wrong result.

- [ ] **Step 3: Implement shelter detection**

Check the small area above/around the player for the template's roof and walls. Keep the calculation deterministic and inexpensive.

- [ ] **Step 4: Update the UI**

Show `🏠 SHELTERED` when the player is inside a valid shelter.

- [ ] **Step 5: Run tests**

Verify shelter detection plus all existing survival tests.

- [ ] **Step 6: Commit**

Commit message: `feat: detect player shelter`

### Task 4: Connect shelter to weather and Save/Load

**Files:**
- Modify: `game.js`
- Test: `game-core.test.js`

**Interfaces:**
- Consumes: `isSheltered()`, weather, temperature, and existing Save/Load data.
- Produces: reduced weather exposure while sheltered and persistent house state.

- [ ] **Step 1: Write the failing test**

Test that shelter reduces weather exposure and that Save/Load preserves the house state.

- [ ] **Step 2: Run the test and verify failure**

Confirm shelter currently has no survival or persistence effect.

- [ ] **Step 3: Implement the minimal survival integration**

While sheltered, reduce weather-driven temperature movement and prevent weather exposure damage; hunger and thirst continue normally.

- [ ] **Step 4: Implement persistence**

Include `houseBuilt` and the world structure in the existing save object and restore them on load.

- [ ] **Step 5: Run the full test suite**

Run the repository test command and verify all existing and new tests pass.

- [ ] **Step 6: Commit**

Commit message: `feat: connect houses to survival shelter`
