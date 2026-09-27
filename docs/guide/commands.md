# Administrator Commands

The admin console is [Cmdr](https://eryn.io/Cmdr/docs/intro/), open only to your staff. Press `F4`, start typing, and follow the suggestions. `help <command>` shows a command's arguments. On a phone or controller, staff get a **Console** button in the topbar instead.

## Roles and permissions

Every staff member has a **role**, and each role can use its own commands plus everything the roles below it can. Set them up in `Config > Admin`:

```luau
groupId = 0, -- 0 is the group that owns the experience
roles = {
	{ name = "Moderator", userIds = { 123456789 }, groupRank = 100 },
	{ name = "Admin", userIds = {}, groupRank = 200 },
	{ name = "Owner", userIds = {} },
},
```

- Roles are listed **lowest first**. Rename them, or add your own, like a "Staff" below Moderator.
- A player gets a role by being in its `userIds`, or by holding at least `groupRank` in the group. They get the highest role they qualify for.
- The experience's owner (you, or the owning group's owner rank) always has the top role, and so does everyone testing in Studio while `allowStudio` is on.
- For ranks in a game you own yourself, put your group's ID in `groupId`.

Which role a command needs comes from its **group**, in `permissions`, or from its own entry in `commands`:

| Group | Commands | Needs (as shipped) |
| :-- | :-- | :-- |
| `Info` | `kit-info`, `staff`, `data-summary`, `leaderboard` | Moderator |
| `Moderation` | `kick`, `mute`, `unmute`, `freeze`, `unfreeze`, `notify` | Moderator |
| `Towers` | `tower-load`, `tower-exit`, `tower-restart`, `tower-mode`, `tower-status`, `tower-marker`, `tower-rush`, `checkpoint-clear`, `fake-win`, `heal` | Moderator |
| `Rewards` | `tickets-add`, `tickets-set`, `cosmetic-grant`, `cosmetic-revoke`, `shop-item-grant`, `shop-item-revoke`, `gamepass-grant`, `gamepass-revoke`, `give-badge`, `tower-grant`, `tower-revoke` | Admin |
| `Data` | `data-save`, `data-health`, `recount-badges`, `gamepass-refresh` | Admin |
| `Server` | `shutdown` | Admin |
| `DefaultAdmin` | Cmdr's `ban`, `unban`, `teleport`, `kill`, `respawn`, `goto-place` | Admin |
| `DefaultDebug` | Cmdr's `blink`, `thru`, `position`, `get-player-place-instance` | Admin |
| `DefaultUtil`, `Help`, `UserAlias` | `help`, `clear`, `history`, `alias`, and `bring`, `to`, `refresh` | Moderator |

As shipped, `commands` lets moderators `teleport`, `respawn` and use `position` (so `bring`, `to` and `refresh` work for them), and saves `data-export` and `data-erase` for the Owner:

```luau
commands = {
	teleport = "Moderator",
	["data-erase"] = "Owner",
},
```

**A group not listed in `permissions` needs the top role**, so a command you add is closed until you place it.

Someone running a command above their role is told which role it needs. `kick`, `mute` and `freeze` refuse anyone of the same role or above. `staff` lists who's online with which role.

### Other settings

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `enabled` | `true` | Turns the console on or off. |
| `allowStudio` | `true` | Studio testers get the top role. |
| `activationKeys` | `{ F4 }` | The keys that open it. |
| `consoleIcon` | a terminal icon | The console button's image in the topbar. |
| `maxTicketChange` | `1000000` | The most `tickets-add` changes at once. |
| `maxTicketBalance` | `1000000000` | The highest balance `tickets-set` allows. |
| `saveTimeout` | `15` | Seconds a command waits for a save to confirm. |

## Kit commands

`<angle brackets>` are required, `[square brackets]` optional. Commands that change a player's save only reach players in the current server.

### Moderation

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `kick` | `<players> [reason]` | Kicks them. |
| `mute` | `<players> [minutes]` | Stops them chatting, for that long or until they leave. |
| `unmute` | `<players>` | Lets them chat again. |
| `freeze` | `<players>` | Holds them in place, through respawns. |
| `unfreeze` | `<players>` | Lets them move. |
| `notify` | `<players> <message> [duration] [global]` | Sends a notification, here or to every server. |

Mutes and freezes last until the player leaves the server. For longer, use `ban`.

### Towers

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `tower-load` | `<players> <tower>` | Loads a tower with a fresh timer. |
| `tower-exit` | `<players>` | Ends the run and returns them to `SpawnLocation`. |
| `tower-restart` | `<players>` | Restarts their run. |
| `tower-mode` | `<players> <Normal\|Practice\|AllJumps>` | Changes their mode. |
| `tower-status` | `<players>` | Shows tower, mode, timer, checkpoint and rush. |
| `tower-marker` | `<players> <marker>` | Teleports them to a marker. |
| `tower-rush` | `<players> <rush>` | Starts a tower rush. |
| `checkpoint-clear` | `<players>` | Clears Practice and All Jumps checkpoints. |
| `heal` | `<players>` | Full health. |
| `fake-win` | `<player> <ending> [difficulty] [time] [globalStyle]` | Previews the win screen, giving nothing. |

### Rewards

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `tickets-add` | `<player> <amount>` | Adds tickets, or removes them with a negative amount. |
| `tickets-set` | `<player> <balance>` | Sets their balance. |
| `gamepass-grant` | `<player> <gamePass>` | Gives a pass as if they'd bought it: its tool, trail, tag and tickets arrive at once. |
| `gamepass-revoke` | `<player> <gamePass>` | Takes back a granted pass. A bought pass can't be taken; a one-time trail or tickets stay. |
| `tower-grant` | `<player> <tower> [Normal\|AllJumps]` | Gives a tower completion with its points and Elo. No badge. |
| `tower-revoke` | `<player> <tower> [Normal\|AllJumps]` | Takes one away, with its points and Elo. Badges stay. |
| `shop-item-grant` | `<player> <item>` | Gives a shop item for free. |
| `shop-item-revoke` | `<player> <item>` | Takes a shop item back, with its tool or cosmetic. No refund. |
| `cosmetic-grant` | `<player> <category> <cosmetic>` | Unlocks a cosmetic. |
| `cosmetic-revoke` | `<player> <category> <cosmetic>` | Takes one away. |
| `give-badge` | `<players> <badgeId>` | Awards one of your badges. |

`tower-grant` and `tower-revoke` take any tower in `Config > Towers`, whichever Area it's in.

### Info and data

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `staff` | none | Who's online with which role. |
| `kit-info` | none | Kit version, place, players, and how long the server has been up. |
| `data-summary` | `<player>` | Their completions, items, tickets and save state. |
| `leaderboard` | `[board] [count]` | The top of `Towers`, `AllJumps` or `Elo`. |
| `data-save` | `<players>` | Saves now. `*` for everyone. |
| `data-health` | `[problems]` | The data service's status and recent errors. |
| `recount-badges` | `<player>` | Rebuilds completions from their badges, for a lost save. |
| `gamepass-refresh` | `<player> <gamePass>` | Re-checks a pass. |
| `data-export` | `<userId>` | Prints everything saved for a user, for a data request. |
| `data-erase` | `<userId> <confirm>` | Deletes a user's save permanently. Needs `confirm` as `true`, and refuses while they're in the server. |

### Server

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `shutdown` | `<true> [seconds] [reason]` | Closes the server after a countdown (60 seconds by default, `0` for now). |

## Cmdr's own commands

`ban` and `unban` (Roblox bans, which last across servers), `teleport` with its shortcuts `bring` and `to`, `kill`, `respawn` and `refresh`, `goto-place` and `follow-player`, `blink` and `thru` to move yourself, `position`, and the console basics `help`, `clear`, `history`, `alias` and `var`. See Cmdr's [command reference](https://eryn.io/Cmdr/docs/reference/commands/).

## Adding a command

Put your own commands in a `ServerScriptService > CustomCommands` folder, outside the kit, so updates leave them alone. See [Hooking Into the Kit](./hooks.md#admin-commands-of-your-own). Give each a `Group`, and add that group to `permissions`, or only the top role can run it.

::: danger Keep "Server" out of the definition's file name
A command is two modules: the definition (`Hello`) and the one that runs it, which ends in `Server` (`HelloServer`). Any module with `Server` **anywhere** in its name is taken for the running half, so a definition called `ServerTime` never registers. Name the definition something else and set `Name = "server-time"` inside it.
:::
