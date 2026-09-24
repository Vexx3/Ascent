# Administrator Commands

The kit uses [Cmdr](https://eryn.io/Cmdr/docs/intro/) for its administrator console. It is separate from Roblox chat and is available only to authorized players.

Press `F4` by default, start typing, and use Cmdr's suggestions for players,
towers, rushes, modes, markers, cosmetics and shop items. Run `help` or
`help <command>` inside the console whenever you need the exact arguments.

::: tip On a phone or a controller
There are no keys to press, so authorized players get a **Console** button on
the topbar instead. It appears only for players without a keyboard, and it
disappears again if they plug one in.
:::

## Access

Open `ReplicatedStorage > Shared > Config > Admin` in Studio:

```luau
local Admin: ConfigTypes.Admin = {
	enabled = true,
	allowStudio = true,
	activationKeys = { Enum.KeyCode.F4 },
	userIds = {},

	maxTicketChange = 1_000_000,
	maxTicketBalance = 1_000_000_000,
	saveTimeout = 15,
}
```

- `enabled` turns the console on or off.
- `allowStudio` lets every Studio test player use it.
- `activationKeys` changes the key that opens Cmdr.
- `userIds` lists administrators by Roblox user ID, such as your moderators:
  `userIds = { 123456789, 987654321 }`. It ships empty.
- `maxTicketChange` and `maxTicketBalance` are the guard rails on `tickets-add`
  and `tickets-set`, so one mistyped number cannot ruin a player's balance.
- `saveTimeout` is how many seconds a command waits for a save to be confirmed
  before it reports the save as pending.

Whoever owns the experience is always authorized and needs no listing: you, for
an experience you own, or the owner rank of the group it belongs to. Every server command is checked again on the server; hiding the console on an unauthorized client is not treated as security.

Commands of your own go in a `ServerScriptService > CustomCommands` folder,
outside the kit, so an update leaves them alone. See
[Hooking Into the Kit](./hooks.md#admin-commands-of-your-own).

## Built-in Cmdr commands

The kit registers Cmdr's maintained default command set, so it does not reimplement common moderation and utility commands.

| Group | Included commands |
| :-- | :-- |
| Administration | `announce`, `ban`, `goto-place`, `kill`, `respawn`, `teleport`, `unban` |
| Debugging | `blink`, `get-player-place-instance`, `position`, `thru`, `uptime`, `version` |
| Console utilities | `alias`, `bind`, `clear`, `convertTimestamp`, `echo`, `edit`, `exit`, `help`, `history`, `hover`, `json-array-decode`, `json-array-encode`, `len`, `math`, `pick`, `rand`, `replace`, `resolve`, `run`, `run-lines`, `runif`, `unbind`, `var`, `var=` |

Cmdr also supplies useful aliases and generated commands such as `bring`, `to`, `rejoin`, `follow-player`, and `refresh`. See the official [default command reference](https://eryn.io/Cmdr/docs/reference/commands/) for their complete syntax.

Two defaults are left out. `fetch` reads arbitrary URLs from the console, which
does not belong in a beginner template; `kick` is replaced by the kit's own,
below, which refuses to kick another administrator.

## Kit commands

Angle brackets are required arguments. Square brackets are optional arguments with defaults.

### Towers and checkpoints

| Command | Arguments | Purpose |
| :-- | :-- | :-- |
| `tower-load` | `<players> <tower>` | Loads a configured tower and starts a fresh timer. Alias: `loadtower`. |
| `tower-exit` | `<players>` | Safely clears run state and returns players to the `SpawnLocation` in `Workspace > Markers`. Aliases: `exittower`, `unloadtower`. |
| `tower-restart` | `<players>` | Immediately restarts active tower runs. Alias: `restarttower`. |
| `tower-mode` | `<players> <Normal\|Practice\|AllJumps>` | Changes mode and reloads the active run when needed. Alias: `setmode`. |
| `tower-status` | `<players>` | Shows tower, mode, timer, checkpoint, rush, and loading state. Alias: `towerstate`. |
| `tower-marker` | `<players> <marker>` | Teleports players to a part under `Workspace > Markers`. Alias: `tpmarker`. |
| `tower-rush` | `<players> <rush>` | Starts a configured tower rush. Aliases: `loadrush`, `startrush`. |
| `checkpoint-clear` | `<players>` | Clears temporary Practice and All-jumping checkpoints. Alias: `clearcheckpoint`. |
| `checkpoint-return` | `<players>` | Returns players to their checkpoint or tower spawn. Alias: `returncheckpoint`. |
| `fake-win` | `<player> <ending> [difficulty] [time] [globalStyle]` | Previews the win UI without granting anything. Alias: `fakewin`. |

### Tickets, cosmetics, and items

| Command | Arguments | Purpose |
| :-- | :-- | :-- |
| `tickets` | `<player>` | Shows a player's ticket balance. Alias: `tickets-get`. |
| `tickets-add` | `<player> <amount>` | Adds tickets, or removes them with a negative amount, up to `maxTicketChange` either way. Refuses to take more than the player has. Alias: `addtickets`. |
| `tickets-set` | `<player> <balance>` | Sets a balance from 0 to `maxTicketBalance`. Alias: `settickets`. |
| `cosmetic-grant` | `<player> <category> <cosmetic>` | Permanently unlocks a configured cosmetic. Alias: `grantcosmetic`. |
| `cosmetic-revoke` | `<player> <category> <cosmetic>` | Removes a permanent cosmetic grant. Alias: `revokecosmetic`. |
| `cosmetic-equip` | `<player> <category> [cosmetic]` | Equips a cosmetic the player has unlocked. Omit the cosmetic to unequip that category. Alias: `equipcosmetic`. |
| `shop-item-grant` | `<player> <item>` | Grants a configured ticket-shop item without charging tickets. Alias: `grantshopitem`. |

Balance and ownership changes use Scribe transactions and request an immediate save. They only target profiles loaded in the current server. A save that has not confirmed within `saveTimeout` is reported as pending, not failed: it may still land.

### Data, players, and servers

| Command | Arguments | Purpose |
| :-- | :-- | :-- |
| `data-summary` | `<player>` | Shows safe completion, inventory, ticket, and save-state totals. Alias: `playerdata`. |
| `data-save` | `<players>` | Requests an immediate Scribe flush. Use `*` for everyone. Alias: `savedata`. |
| `recount-badges` | `<player>` | Resets tower completions and refills them from the badges the player owns. For recovering lost data. Alias: `recount`. |
| `leaderboard` | `[board] [count]` | Prints the top of `Towers`, `AllJumps` or `Elo`, and where everyone in this server sits. Aliases: `board`, `top`, `elo-board`. |
| `data-health` | `[problems]` | Scribe's own view of the data service: status, save timings, DataStore budget, recent errors. Aliases: `datahealth`, `datastats`. |
| `data-export` | `<userId>` | Prints everything saved for a user ID as JSON, for answering a data request. Works offline. Alias: `dataexport`. |
| `data-erase` | `<userId> <confirm>` | Permanently deletes a user's saved data and leaderboard entries. Cannot be undone, and does nothing unless `confirm` is `true`. Refused while that player is in this server, whose session would save over the erasure. Alias: `dataerase`. |
| `gamepass-refresh` | `<player> <gamePass>` | Re-checks an enabled configured pass through Scribe's ownership API. Alias: `checkgamepass`. |
| `heal` | `<players>` | Restores living characters to full health. |
| `give-badge` | `<players> <badgeId>` | Awards an enabled badge belonging to the experience. Alias: `givebadge`. |
| `notify` | `<players> <message> [duration] [global]` | Sends a filtered kit notification locally or across servers. Alias: `notice`. |
| `kick` | `<players> [reason]` | Removes players from this server. Refuses to kick another administrator, so whoever holds the console cannot clear the room. |
| `server-time` | `<players>` | How long each player has been in this server. Alias: `playtime`. |
| `kit-info` | none | Shows the kit version, place, job, and player count. Alias: `ascent-info`. |
| `shutdown` | `<true> [seconds] [reason]` | Closes this server after a countdown everyone can see. Defaults to 60 seconds, at most 30 minutes; pass `0` to close at once. |

Apart from `data-erase`, which exists to answer a deletion request, the kit does not include profile wipes, arbitrary raw-profile editing, offline data mutation, arbitrary code execution, or unrestricted HTTP fetching. Those commands are too easy to misuse and are not needed to operate a fangame.

## Adding a command

In Studio, open `ServerScriptService > Server > Commands > Catalog`. Commands are
grouped into `Cosmetics`, `Data`, `Economy`, `Kit`, `Players`, and `Towers`
folders. A command is two ModuleScripts with the same base name, side by side in
one of those folders:

- `UserId` describes the command and its arguments. Cmdr safely copies this definition to clients for autocomplete.
- `UserIdServer` performs the server-only work. Cmdr keeps any module with `Server` in its name off the client.

::: danger Never put "Server" in the definition's name
Cmdr decides which of the pair is the implementation by looking for `Server`
**anywhere** in the file name, not at the end of it. A definition called
`ServerTime` is read as an implementation, its own `ServerTimeServer` as another
one, and **neither registers** — both are skipped with a warning and the command
silently does not exist.

Name the files something else and let the definition's `Name` field say what you
meant. The kit's `server-time` command lives in `Playtime` and `PlaytimeServer`
for exactly this reason.
:::

`UserId`:

```luau
return {
	Name = "user-id",
	Aliases = { "userid" },
	Description = "Shows a player's Roblox user ID.",
	Group = "Ascent Admin",
	Args = {
		{
			Type = "player",
			Name = "Player",
			Description = "Player to inspect.",
		},
	},
}
```

`UserIdServer`:

```luau
return function(_context, player: Player): string
	return `{player.Name}'s user ID is {player.UserId}.`
end
```

Cmdr's `RegisterCommandsIn` walks every folder under `Catalog` and pairs the
two modules by name, so a new folder needs no code change. Put secret logic and
state changes only in the `Server` module. For custom arguments, see
`ServerScriptService > Server > Commands > ArgumentTypes` and Cmdr's
[custom type guide](https://eryn.io/Cmdr/docs/reference/types/).

## See Also

- [Configuration Reference: Admin](./configuration.md#admin)
- [Extending the Kit](./extending-gameplay.md)
