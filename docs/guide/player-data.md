# Player Data

Saves use [Scribe](https://scribe.ericplane.dev/) 2.5, set up in `ReplicatedStorage > Shared > Accounts`:

| Module | What it is |
| :-- | :-- |
| `Template` | The saved shape and its defaults. |
| `AccountTypes` | The matching Luau types. |
| `AccountData` | The Scribe bundle, and the leaderboards. |
| `Migrations` | Steps that update old saves. |

The save keys are in [`Config > Project`](./configuration.md#saved-data).

## Stored Fields

| Field | Holds |
| :-- | :-- |
| `towers`, `allJumps` | Completion points, Normal and All Jumps. |
| `elo` | The player's [Elo](./elo.md). |
| `completedTowers`, `completedAjTowers` | Towers beaten, by acronym. |
| `completedTowerRushes` | Rushes beaten. |
| `towerStats`, `towerRushStats` | Attempts, wins, time spent and best times. |
| `tickets` | Ticket balance. |
| `ownedShopItems`, `ownedCosmetics`, `equippedCosmetics` | Shop items and cosmetics. |
| `backpackSlots`, `backpackFilters` | Backpack order and hidden items. |
| `uiLayout` | Where the player moved each control with Edit UI Layout. |
| `settings` | Settings and keybinds, including `settings.custom` for [your own settings](./custom-settings.md). |
| `custom` | Your own values, through `Server > CustomData`. See [Hooking Into the Kit](./hooks.md#saving-values-of-your-own). |
| `eloTowers`, `eloAjTowers`, `eloHistoryImported`, `claimedGamePassRewards` | Bookkeeping, never sent to clients. |

Lists of IDs are `Scribe.SetOf`: use `Has`, `Add` and `Remove` on them.

## Leaderboards

Three leaderboards rank every player who has ever played:

| Board | Ranks | Data store |
| :-- | :-- | :-- |
| `Towers` | `towers` | `LB_Towers` |
| `AllJumps` | `allJumps` | `LB_AllJumps` |
| `Elo` | `elo` | `LB_Elo` |

To show one with Roblox's own leaderboard:

1. In the [Creator Hub](https://create.roblox.com/dashboard/creations), open your experience.
2. Register the data store from the table. The key is the player's `UserId`.
3. Turn on **Active leaderboard**.

Roblox shows one active leaderboard per experience. **Never rename these stores** after release; a new name is a new, empty board.

The `leaderboard` [admin command](./commands.md) prints the top of any board. In code:

```luau
for _, entry in ipairs(Data.GetLeaderboard("Elo", 10)) do
	print(entry.Rank, entry.Name, entry.Score)
end
```

In Studio, `Mock` and `NoSave` modes use a temporary board that's gone when the test stops.

## Add A Saved Field

::: tip You probably don't need to
- Your own numbers, text and flags: `Server > CustomData`. See [Hooking Into the Kit](./hooks.md#saving-values-of-your-own).
- A player setting: one entry in `Config > CustomSettings`. See [Adding A Saved Setting](./custom-settings.md).
:::

To change the kit's own shape:

1. Add the field and its default to `Template`.
2. Add it to `PlayerData` in `AccountTypes`.
3. Read and write it through Scribe from the feature that owns it.
4. Test with `dataStoreStudioMode = "Mock"`.

In a released game, rename or reshape a field with a numbered step in `Migrations`: add the next number, never reuse one. See Scribe's [templates](https://scribe.ericplane.dev/templates/) and [configuration](https://scribe.ericplane.dev/configuration/) guides.

## Reading Saved Data On The Client

Watch the part of the save you read, never the root:

```luau
Data.settings.Observe(function(settings)
	-- runs only when a setting changes
end)
```

A root observer re-runs on every write, so earning one ticket would rebuild everything that watches it.

## When Data Fails

Scribe removes a player whose save can't load, or whose session moved to another server. What they're told is under `dataKicks` in `Config > Messages`.

Admins can use `data-summary`, `data-save` and, for a deletion request, `data-erase`. See [Admin Commands](./commands.md).

## Recovering Lost Completions

`recount-badges <player>` rebuilds a player's completions from the badges they own, for when a save is lost. It reads the `badgeId`s in `Config > Towers`, not tower attributes, so every tower needs its badge there. Best times and attempts are kept. If reading badges fails, nothing is changed.

## Moving Players From An Older Kit

See [Moving An Old Kit Across](./migrating.md#your-players-keep-their-progress).
