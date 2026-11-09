# Player Data

Player saves use [Scribe](https://scribe.ericplane.dev/) 2.6. Everything about
saving is in `ReplicatedStorage > Shared > Accounts`:

| Module | What it is |
| :-- | :-- |
| `Template` | What a save looks like, with every field's starting value. |
| `AccountTypes` | The Luau types for a save. |
| `AccountData` | Loads and saves player data, and runs the leaderboards. |
| `Migrations` | Steps that update old saves to the current shape. |

The save keys are in [`Config > Project`](./configuration.md#saved-data).

## What's saved

| Field | What it holds |
| :-- | :-- |
| `towers`, `allJumps` | Tower points, for Normal and All Jumps. |
| `elo` | The player's [Elo](./elo.md). |
| `completedTowers`, `completedAjTowers` | The towers they've beaten, by acronym. |
| `completedTowerRushes` | The rushes they've beaten. |
| `towerStats`, `towerRushStats` | Attempts, wins, time spent and best times. |
| `tickets` | Their ticket balance. |
| `ownedShopItems`, `ownedCosmetics`, `equippedCosmetics` | Shop items and cosmetics. |
| `backpackSlots`, `backpackFilters` | The backpack's order, and which items are switched off. |
| `uiLayout` | Where they put each button with Edit UI Layout. |
| `dismissedWarnings` | The towers whose [warning](./tower-setup.md#a-warning-before-climbing) they chose not to see again. |
| `settings` | Their settings and keys, including `settings.custom` for [your own settings](./custom-settings.md). |
| `custom` | Your own values, saved through `Server > CustomData`. See [Hooking Into the Kit](./hooks.md#saving-values-of-your-own). |
| `savedRuns` | Their [saved runs](./saved-runs.md), by slot number, as the menu shows them. |
| `savedRunStates` | What each saved run needs to carry on. Never sent to the client. |
| `eloModifierRuns` | The best set of [modifiers](./modifiers.md) each tower has been beaten with. Never sent to the client. |
| `eloTowers`, `eloAjTowers`, `eloHistoryImported`, `claimedGamePassRewards`, `boardTimes` | The kit's own bookkeeping. Never sent to the client. |

Lists of IDs are Scribe sets: use `Has`, `Add` and `Remove` on them.

## Leaderboards

Three leaderboards rank every player who has ever played. The
[Leaderboards menu](./ui-and-hud.md#leaderboards-menu) shows them in game.

| Board | Ranks by | DataStore |
| :-- | :-- | :-- |
| `Towers` | `towers` | `LB_Towers` |
| `AllJumps` | `allJumps` | `LB_AllJumps` |
| `Elo` | `elo` | `LB_Elo` |

You can also show one as Roblox's own leaderboard, on your experience's page:

1. In the [Creator Dashboard](https://create.roblox.com/dashboard/creations), open
   your experience.
2. Add a leaderboard using the DataStore name from the table. The key is the
   player's `UserId`.
3. Turn on **Active leaderboard**.

Roblox shows one active leaderboard per experience. **Never rename these
DataStores** after release: a new name means a new, empty leaderboard.

The `leaderboard` [admin command](./commands.md) prints the top of any board. From a
script:

```luau
for _, entry in Data.GetLeaderboard("Elo", 10) do
	print(entry.Rank, entry.Name, entry.Score)
end
```

In Studio, the `"Mock"` and `"NoSave"` modes use a temporary leaderboard that's
gone when you stop testing.

### Fastest times

Every tower and rush also has a leaderboard of its fastest times, for Normal and for
All Jumps. Each one is its own OrderedDataStore:

| Leaderboard | DataStore name |
| :-- | :-- |
| A tower, Normal | `LB_Time_` followed by the acronym, such as `LB_Time_ToH` |
| A tower, All Jumps | `LB_TimeAJ_` followed by the acronym |
| A rush, Normal | `LB_RushTime_` followed by the rush's key |
| A rush, All Jumps | `LB_RushTimeAJ_` followed by the rush's key |

Times are stored in hundredths of a second, keyed by `UserId`, fastest first.

Renaming a tower empties its fastest times. The name can be at most 50 characters
including the prefix, and the Output names any acronym that's too long.
`data-erase` removes a player from every leaderboard.

## Adding a saved field

::: tip You probably don't need to
- For your own numbers, text and true/false values, use `Server > CustomData`. See
  [Hooking Into the Kit](./hooks.md#saving-values-of-your-own).
- For a player setting, add it to `Config > CustomSettings`. See
  [Adding a Saved Setting](./custom-settings.md).
:::

To add a field to the kit's own save:

1. Add the field and its starting value to `Template`.
2. Add it to `PlayerData` in `AccountTypes`.
3. Read and change it through Scribe, from the feature it belongs to.
4. Test it with `dataStoreStudioMode = "Mock"`.

Once your game is released, rename or reshape a field by adding a numbered step to
`Migrations`. Always use the next number, and never reuse one. Scribe's guides to
[templates](https://scribe.ericplane.dev/templates/) and
[configuration](https://scribe.ericplane.dev/configuration/) explain more.

## Reading saved data on the client

Watch only the part of the save you need, never the whole thing:

```luau
Data.settings.Observe(function(settings)
	-- runs only when a setting changes
end)
```

## When saving fails

Scribe removes a player from the game if their save can't load, or if their session
moved to another server. What they're told is in the `dataKicks` group of
`Config > Messages`.

Admins can check on a player's data with `data-summary`, force a save with
`data-save`, and delete it on request with `data-erase`. See
[Admin Commands](./commands.md).

## Recovering lost wins

`recount-badges <player>` rebuilds a player's tower wins from the badges they own,
for when a save is lost. It uses the `badgeId`s in `Config > Towers`, not the
attributes on towers, so every tower needs its badge there for this to work. Best
times and attempts are kept. If the badges can't be read, nothing changes.

## Players from an older kit

See [Moving an Old Kit Across](./migrating.md#your-players-keep-their-progress).
