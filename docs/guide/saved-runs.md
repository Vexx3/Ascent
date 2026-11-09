# Saved Runs

Players can save an All Jumps run to a slot and finish it later: after a break,
after rejoining, or from another place.

## Set it up

Saved runs ship off. To turn them on, set `enabled = true` in `savedRuns` in
`Config > Project`:

```luau
savedRuns = {
	enabled = true,
	slots = {
		{},
		{},
		{},
		{ allJumps = 10 },
		{ allJumps = 25 },
		{ gamePass = "SaveSlots" },
		{ gamePass = "SaveSlots" },
	},
	autoSaveInterval = 15,
	maxCheckpoints = 50,
	cooldown = 3,
	clearOnWin = true,
},
```

| Setting | What it does |
| :-- | :-- |
| `enabled` | `true` turns saved runs on. |
| `slots` | One entry per slot, up to 30. `{}` is open to everyone, `{ allJumps = 10 }` needs ten All Jumps wins, and `{ gamePass = "SaveSlots" }` needs that game pass. |
| `autoSaveInterval` | Seconds between autosaves. At least 5. |
| `maxCheckpoints` | The most checkpoints a slot keeps, up to 200. When there are more, the oldest are dropped. |
| `cooldown` | Seconds a player must wait between saving, loading and deleting. |
| `clearOnWin` | Winning a saved run empties its slot, even a locked one. |

The `SaveSlots` pass goes in `Config > GamePasses` with `kind = "SaveSlots"`. Its
slots stay hidden until the pass has an `id`. See [Game Passes](./game-passes.md).

Saved runs are off if `savedRuns` isn't in Config, or All Jumps is turned off.
Then the Saved Runs menu is removed too.

## The Saved Runs menu

Each slot has four buttons:

| Button | What it does |
| :-- | :-- |
| **Save** | Saves the current run into this slot. The player must be in an All Jumps run with at least one checkpoint. |
| **Load** | Ends the current run and carries on the saved one. |
| **Edit** | Renames the slot (up to 24 characters, filtered by Roblox) and locks or unlocks it. |
| **Delete** | Empties the slot. |

- Loading, deleting and saving over a run all ask first.
- A **locked** slot can't be saved over or deleted, but it can still be loaded.
- If the run is in another place, loading teleports the player there, as long as
  they've unlocked that [Area](./worlds-personal-servers.md).
- A [lag free server](./worlds-personal-servers.md#lag-free-servers) won't load a
  run of a tower it removed.

## Auto save

**Auto Save**, at the top of the menu, is either Off or the slot to save into
(`autoSaveRuns` and `autoSaveSlot` in `Config > Settings`). While it's on, the run
is saved every few seconds, and again when the player leaves.

It saves into the slot already holding this run if there is one. If not, it uses
the slot it names if that slot is empty, and otherwise the first empty slot. It
never saves over a locked slot. If every slot is full, it asks once per run
whether to save over the slot it names.

## What a save keeps

- The tower or rush, and how far through the rush the player is
- The time so far, and which of the tower's checkpoints they've passed
- Boost items they've used, and the run's modifiers
- Their newest checkpoints, up to `maxCheckpoints`
- The tower's [buttons, lighting and other objects](./practice-all-jumps.md#what-a-checkpoint-puts-back)
  at their last checkpoint

## Changing a tower after players have saved runs

| If you | A saved run |
| :-- | :-- |
| **Move or turn the whole tower**, spawn and all | Carries on from the same checkpoint, in the tower's new spot. |
| **Rebuild part of it** without moving it | Carries on. A checkpoint that's now inside a wall, or more than 50 studs outside the tower, is dropped. If none are left, the run can't load. |
| **Change the tower's own checkpoints** | Carries on, and counts every checkpoint below the player as passed. |
| **Reorder a rush, or add towers to it** | Finds its tower wherever the rush has it now. |
| **Delete the tower or rush, or rename its acronym** | Shows that the tower is gone, with no Load button. |
| **Move the tower to another Area** | Loading takes the player to that Area's place. |

## The menu's words

All of the menu's text is the `savedRuns` group in `Config > Messages`. Runs are
saved under `savedRuns` and `savedRunStates`. See [Player Data](./player-data.md).
