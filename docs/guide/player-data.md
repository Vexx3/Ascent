# Player Data

The kit uses [Scribe](https://scribe.ericplane.dev/) 2.4 directly for saved data and client replication. It does not include a second datastore wrapper or legacy datastore compatibility layer.

In Studio Explorer:

- `ReplicatedStorage > Shared > Accounts > Template` defines the saved shape and defaults.
- `ReplicatedStorage > Shared > Accounts > AccountTypes` describes the matching Luau type.
- `ReplicatedStorage > Shared > Accounts > AccountData` creates the one Scribe bundle.
- `ReplicatedStorage > Shared > Config > Project` contains the save keys and Studio mode.

## Stored Fields

| Field | Purpose |
| :-- | :-- |
| `towers` | Normal completion points. |
| `allJumps` | All Jumps completion points. |
| `elo` | What the player has beaten, scored by difficulty, both modes in one number. See [Player Elo](./elo). |
| `eloTowers`, `eloAjTowers` | Tower IDs credited toward the Elo, kept apart because each mode is worth a different amount. Independent of ordinary completion points. Server-only. |
| `eloHistoryImported` | True once a profile from the old kit has had its completions credited toward Elo, so they cannot be credited twice. False on a profile that never came from it. Server-only. |
| `completedTowers` | Completed normal tower acronyms. |
| `completedAjTowers` | Completed All Jumps tower acronyms. |
| `towerStats` | Attempts, wins, time spent, and best times by tower. |
| `completedTowerRushes` | Completed rush acronyms. |
| `towerRushStats` | Attempts, wins, time spent, and best times by rush. |
| `backpackSlots` | Which slot each backpack item sits in, keyed by tool name. |
| `backpackFilters` | Which backpack items the player has switched off: whole groups (`Boost`, `Heal`, `Other`), single items, and the items pulled back out of a switched-off group. |
| `uiLayout` | Where the player moved each on-screen control with Edit UI Layout, and its size — `x`, `y` and `scale`, keyed by control name. |
| `custom` | Your own values, set through `Server > CustomData`: `numbers`, `strings` and `flags`, each keyed by the name you chose. Empty until you use it. See [Hooking Into the Kit](./hooks.md#saving-values-of-your-own). |
| `tickets` | Current ticket balance. |
| `claimedGamePassRewards` | One-time pass rewards already claimed. Server-only. |
| `ownedShopItems` | Permanent shop item IDs. |
| `ownedCosmetics` | Permanent Trail and Aura IDs. |
| `equippedCosmetics` | Equipped Trail and Aura IDs. |
| `settings` | Saved player settings and keybinds, including `settings.custom` — whatever they chose for the settings you declared in [`Config > CustomSettings`](./custom-settings.md). |

**Server-only** fields are wrapped in `Scribe.ServerOnly` in the template: saved exactly like the rest, but never sent to the player's client. Use it for bookkeeping the client does not read -- it keeps the join snapshot small and keeps internals off the client. A client script that reads one is a type error, not a silent `nil`.

Ticket cooldowns are handled by Scribe's cooldown API, so no custom cooldown table is stored in the template.

Completion, reward, shop-item, and cosmetic IDs use `Scribe.SetOf`. They still read as ordinary arrays, but Scribe keeps each ID unique and sorted. Use `Has`, `Add`, and `Remove` on those fields instead of manually searching or inserting array positions.

## Save Settings

These settings are in `Config > Project`:

| Setting | Purpose |
| :-- | :-- |
| `dataStoreKey` | Live-server store name. |
| `dataStoreKeyStudio` | Separate store name for Studio testing. |
| `dataStoreStudioMode` | `Mock` for memory-only tests, `Live` for Studio persistence, or `NoSave` for read-only testing. |

Keep Studio on `Mock` until you intentionally need persistent test data. Changing a key selects a different save bucket.

Scribe can report `still-loading` when its normal wait ends while the profile is still within the load window. The kit retries only that reason; other lifecycle reasons are terminal. The client allows the full load window before leaving the loading screen in its failure state.

Administrators can use `data-summary` for a safe summary and `data-save` to request an immediate Scribe flush. The older `playerdata` and `savedata` names remain convenient aliases. The kit does not expose raw profile editing. The one command that deletes a save is `data-erase`, which exists to answer a deletion request and refuses while that player is in the server — see [Commands](./commands.md).

## Leaderboards

Three Scribe leaderboards rank every player who has ever played, not just the
ones in your server. They are declared in `Shared > Accounts > AccountData`;
Scribe keeps the ordered store behind each one and you never write to it.

| Board | Ranks | Data store |
| :-- | :-- | :-- |
| `Towers` | `towers` | `LB_Towers` |
| `AllJumps` | `allJumps` | `LB_AllJumps` |
| `Elo` | `elo` | `LB_Elo` |

The first two are the counts on the in-experience player list. Whatever you
renamed that column to with `towerWordPlural`, the store is still `LB_Towers`.

### Showing one with Roblox's leaderboard

Roblox draws a global leaderboard itself, from an OrderedDataStore, so the kit
ships no leaderboard UI of its own. The whole job is registering a store:

1. Open the [Creator Hub](https://create.roblox.com/dashboard/creations) and
   pick the experience.
2. Register the data store from the table above. The key is the player's
   `UserId`.
3. Toggle **Active leaderboard** on.

::: warning One board at a time
Roblox shows **one active leaderboard per experience**. Register as many as you
like and activate whichever your game is about; the rest are still readable
from the console and from code.
:::

Everybody who joins is written to every store at whatever their numbers are,
zero included -- Scribe writes the current value when a profile loads and again
whenever it changes, so a board is never missing the people playing.

The store names are written out in `AccountData` rather than left to Scribe's
`LB_<name>` default. **Do not rename them after release**: the store *is* the
board, and a new name is a new, empty one. Treat them like the save keys above.

### Reading one yourself

`leaderboard` in the [admin console](./commands.md) prints the top of any of the
three and where everyone currently in the server sits -- including the two no
client can read. In code:

```luau
for _, entry in ipairs(Data.GetLeaderboard("Elo", 10)) do
	print(entry.Rank, entry.Name, entry.Score)
end
```

An entry is `{ Rank, UserId, Name, Score }`, and `Data.OnLeaderboard` fires when
a board refreshes. Only the Elo board carries `Replicate = true`, because the
Completions chart reads it while it draws; add it to a board you want to draw
on the client yourself.

Scribe allows **twelve ordered reads a minute** across every board. Three are
spent here, and a bundle asking for more than twelve does not start.

In Studio nothing reaches these stores while `dataStoreStudioMode` in
`Config > Project` is `Mock`, as shipped, or `NoSave`: Scribe swaps in an
in-memory ordered store to match, so a board holds only the players in that test
and is gone when it stops. `Live` writes to the real stores.

## Bringing An Older Kit's Players Across

If your game already runs fanofpixels' Multi-Tower Kit, its players keep
everything they earned. Nothing is copied and no second store is involved: the
kit reads your existing profiles where they already are, and rewrites each one
into the current shape the first time that player joins.

This works because the profile key has not changed. Older kits saved under
`Player_<userId>` using ProfileService, and ProfileStore, which Scribe is built
on, reads those profiles unchanged.

### Point the kit at your store

In `Config > Project`, set `dataStoreKey` to the store name your live game uses.
For the v4.22 kit that is:

```luau
dataStoreKey = "[MTKv4.22 Mod]",
```

That is the whole setup. The migration runs itself.

### Do a dry run first

Before you publish, read your real profiles without writing to them. In
`Config > Project`:

```luau
dataStoreKeyStudio = "[MTKv4.22 Mod]",
dataStoreStudioMode = "NoSave",
```

Now play in Studio on your own account. `NoSave` loads the real profile and
saves nothing, so you can confirm your towers, completions and settings arrive
looking right. Put both values back before you publish.

::: danger
Do not test with `dataStoreStudioMode = "Live"` pointed at your production
store. That writes.
:::

### What comes across

Only the tower record, which is the part a player spent their time on and cannot
get back.

| Old field | Becomes | Note |
| :-- | :-- | :-- |
| `Towers` | `towers` | Total completions. |
| `CompletedTowers` | `completedTowers` | The old kit keyed these by the full tower name; this one keys by acronym, so each name is looked up in `Config > Towers` and translated. Only the keys carry over. |

**Names are matched against `name` in `Config > Towers`**, trimmed and
ignoring case. A key that is already an acronym is taken as one, so a save in
either shape reads correctly. A name this game does not have is kept exactly
as it was: a completion for a tower you have since removed is still a
completion, and dropping it is the one thing the migration could do that
nothing afterwards can undo.

A tower whose `name` does not match what the old kit called it imports as an
unrecognised completion -- counted, but matching no tower on the chart and
earning no Elo. **Correct the name in `Config > Towers` and the next load
repairs those profiles**: the same lookup runs on every load, not only in the
migration, so a name fixed later is still translated.

That repair also exists because an unrecognised completion is worse than
cosmetic. The next time the player beats that tower, the kit records its
acronym, sees a string the set has not got, and counts the completion a
second time -- raising the tower score for a tower they were already paid
for. The repair collapses the pair back to one.

::: warning Fix names before people play, not after
The repair puts the sets right, but it cannot take back a tower score that
already went up. Do the dry run above, read a few migrated profiles rather
than trusting the count, and fix any mismatched names before the migration
runs for real.
:::

### What does not

Everything else starts fresh.

Old settings are deliberately not carried. They do not mean quite the same thing
here, one of them means the opposite, and a player can set the two they care
about again in a few seconds. Getting one wrong would leave every player with a
setting they did not choose and would not think to look for.

The old `Inventory` is not carried either, and this one is not a judgement call:
its names come from a shop this kit does not have, so bringing them across would
mark players as owning items that do not exist.

Nothing the old kit never stored can carry, so All Jumps completions, tickets,
the ticket shop, cosmetics, per-tower stats and tower rushes all begin at zero.

### Adding your own step

`Shared > Accounts > Migrations` holds the steps, keyed by the version a profile
reaches once the step has run. Add the next number up; never renumber or reuse
one, because each profile records the last step applied to it.

Three rules for anything you add. Read the old field and write the new one
before clearing the old. Never grant currency or a reward a migration cannot
prove was unearned, or a returning player claims it twice. And a field you are
unsure about is better left at its default than guessed, because a reset setting
annoys a player once while a wrong one confuses them forever.

## Add A Saved Field

::: tip Values of your own need no template change
`Server > CustomData` saves numbers, text and true/false values under names
you choose, with no edit to the kit — so an update never overwrites it. See
[Hooking Into the Kit](./hooks.md#saving-values-of-your-own). The steps below
are for changing the kit's own shape.
:::

::: tip If it is a player setting, do not do this
A switch, a slider, a cycle button or a rebindable key is one line in
`Config > CustomSettings` and needs no template change, no migration and no
network message. See [Adding A Saved Setting](./custom-settings.md). The steps
below are for anything that is not a setting.
:::

1. Add the Scribe declarator and default to `Shared > Accounts > Template`.
2. Add the same field to `PlayerData` in `Shared > Accounts > AccountTypes`.
3. Use Scribe's generated accessor directly from the feature that owns the behavior.
4. Test it with the Studio mode set to `Mock`.

For a released game, use a numbered Scribe migration for renames or shape changes. Do not silently repurpose a saved field.

See the official Scribe guides for [templates](https://scribe.ericplane.dev/templates/), [lifecycle](https://scribe.ericplane.dev/lifecycle/) and [testing](https://scribe.ericplane.dev/testing/), and the [configuration reference](https://scribe.ericplane.dev/configuration/) for the `Migrations` option itself.

## Reading Saved Data On The Client

The kit's `Client` LocalScript, in `StarterPlayer > StarterPlayerScripts`, watches each part of the profile separately, and hands each piece to whatever needs it. Follow that when you add a reader.

Scribe can observe any field or container, and it also lets you observe the root. **Do not observe the root.** A root observer re-reads all of the saved data and re-runs every listener on it whenever *anything* is written, so a player earning a ticket would rebuild the backpack, the on-screen layout and the settings menu along with it. Watch the container you actually read:

```lua
Data.settings.Observe(function(settings)
    -- runs only when a setting changes
end)
```

A reader that spans several top-level fields is the one case that needs more than one observer. `Client` names those fields in a list and hands them to `Shared > Accounts > ProfileWatch`, a small helper that wakes once a frame, so the fields a tower win writes in one transaction redraw the board once rather than once each.

## What A Player Is Told When Data Fails

Scribe removes a player from the server when their data cannot be loaded or their session is taken over by another server. Every one of those messages is in `Config > Messages` under `dataKicks`, one per cause, so you can reword them without touching any code. The defaults are Scribe's own wording.

They are listed separately because the right advice differs: rejoining fixes a busy data service, and does nothing at all for a save this server is too old to read.

## Recovering Lost Completions

`recount-badges <player>` resets a player's tower completions and refills them
from the badges they own. It is for the case where a save was lost or corrupted
and the badges are the only surviving record.

It rebuilds three lists — towers, All Jumps and rushes — and leaves best times
and attempt counts exactly as they were. A badge says a tower was finished and
nothing else, so there is nothing to rebuild a time from, and clearing them
alongside would throw away data the badges cannot replace.

::: warning It needs badge IDs in `Config > Towers`
A tower's `BadgeID` attribute is only readable in the place that tower is in,
and a fangame is several places. Recounting in one place while the catalogue
only knew that place's badges would clear everything a player earned elsewhere
and refill a fraction of it — the command would cause the loss it exists to
repair.

So it counts badges named in `Config > Towers`, not attributes. If no tower
there has a badge, the command says so and changes nothing rather than wiping
the save.
:::

If reading the badges fails part way through, nothing is written at all. A web
hiccup must not turn into a shorter list of completions, which is the one way
this command could make things worse than it found them.

## See Also

- [Configuration Reference: Project](./configuration.md#project)
- [API Reference](./api.md)
- [Troubleshooting](./troubleshooting.md)
