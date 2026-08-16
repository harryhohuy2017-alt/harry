# Trees Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add destructible trees whose leaves disappear automatically after the tree's trunk is fully removed.

**Architecture:** Keep the existing single-file browser game architecture. Represent each tree as a small group of world blocks with explicit `treeId`, `treePart`, and `remainingTrunk` metadata so trunk removal can trigger leaf cleanup without affecting unrelated leaves. Extend inventory with a wood item and reuse the existing block-breaking path.

**Tech Stack:** Vanilla JavaScript, HTML5 Canvas, localStorage, existing GitHub repository.

## Global Constraints

- Trees must not spawn on the world's border.
- Chopping the entire trunk causes the tree's leaves to disappear automatically.
- Leaves disappearing do not drop wood.
- Wood is available for later crafting and house building.
- Keep the implementation focused on the approved tree feature; do not implement houses, creatures, or tree saplings yet.

---

### Task 1: Add tree data and generation

**Files:**
- Modify: `game.js`

**Interfaces:**
- Consumes: existing `world`, `inventory`, and block drawing structures.
- Produces: tree blocks with `treeId` and `treePart` metadata and a `wood` inventory item.

- [ ] **Step 1: Add wood inventory state**

Add `wood: 0` to the inventory object without removing existing items.

- [ ] **Step 2: Add tree block definitions**

Add tree trunk and leaf block definitions with distinct names and drawing colors, and mark them as non-border-only world objects.

- [ ] **Step 3: Add deterministic tree placement during world creation**

During initial world generation, place several small trees only inside the playable area. Each tree gets a unique numeric `treeId`; trunk blocks use `treePart: 'trunk'`, leaf blocks use `treePart: 'leaf'`.

- [ ] **Step 4: Render tree blocks**

Update the drawing loop to render trunk and leaf blocks using their block definitions while preserving existing terrain rendering.

- [ ] **Step 5: Verify generation manually**

Open the game and confirm trees appear inside the map and never overwrite the border.

### Task 2: Implement trunk chopping and automatic leaf removal

**Files:**
- Modify: `game.js`

**Interfaces:**
- Consumes: `treeId`, `treePart`, and existing `breakBlock()` behavior.
- Produces: wood drops and automatic deletion of leaves belonging to a fully chopped tree.

- [ ] **Step 1: Write the tree-removal test scenario**

Exercise the game logic with a tree containing two trunk blocks and several leaf blocks. Remove one trunk block and assert that the leaves remain. Remove the final trunk block and assert that every leaf with the same `treeId` is removed.

- [ ] **Step 2: Update `breakBlock()` for trunks**

When breaking a trunk block, remove it from `world` and increment `inventory.wood` by one.

- [ ] **Step 3: Detect the final trunk**

After removing a trunk, check whether any blocks with the same `treeId` and `treePart === 'trunk'` remain. Only when none remain should leaf cleanup run.

- [ ] **Step 4: Remove only matching leaves**

Delete blocks with the same `treeId` and `treePart === 'leaf'`. Do not add any wood to inventory for removed leaves.

- [ ] **Step 5: Verify partial chopping**

Confirm that removing part of a trunk does not remove its leaves.

- [ ] **Step 6: Verify complete chopping**

Confirm that removing the last trunk makes all matching leaves disappear and gives wood for each chopped trunk block.

### Task 3: Persist trees and wood in save/load

**Files:**
- Modify: `game.js`

**Interfaces:**
- Consumes: existing `saveGame()` and `loadGame()`.
- Produces: save files that preserve tree metadata and wood inventory.

- [ ] **Step 1: Extend save data**

Ensure the existing save object includes the current `world` array and `inventory`, which now contain tree metadata and wood.

- [ ] **Step 2: Preserve loaded tree metadata**

Ensure `loadGame()` restores each tree block's `treeId` and `treePart` unchanged.

- [ ] **Step 3: Test save/load**

Chop one trunk, save, reload, and confirm the remaining tree and wood count are unchanged.

### Task 4: Final regression check

**Files:**
- Modify: `game.js` only if a regression is found.

**Interfaces:**
- Consumes: all existing gameplay systems.
- Produces: a tree feature that does not break crafting, survival, clothing, weather, inventory, or hardcore mode.

- [ ] **Step 1: Check existing controls**

Verify `W/A/S/D`, block placement, block breaking, `I`, `C`, `E`, `R`, clothing keys, `F5`, and `F9` still work.

- [ ] **Step 2: Check survival UI**

Confirm the existing health, hunger, thirst, temperature, weather, clothing, and Hardcore indicators still render.

- [ ] **Step 3: Check crafting compatibility**

Confirm wood is available in inventory for future recipes without changing the existing approved recipes.

- [ ] **Step 4: Commit the completed feature**

Use a focused commit message such as `feat: add destructible trees with leaf decay` after the checks pass.
