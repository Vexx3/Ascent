# Administrator Commands

The admin console is [Cmdr](https://eryn.io/Cmdr/docs/intro/), open only to authorized players. Press `F4`, start typing, and follow the suggestions. `help <command>` shows a command's arguments.

On a phone or controller, admins get a **Console** button in the topbar instead.

## Access

`ReplicatedStorage > Shared > Config > Admin`:

| Field | Default | Purpose |
| :-- | :-- | :-- |
| `enabled` | `true` | Turns the console on or off. |
| `allowStudio` | `true` | Every Studio tester can use it. |
| `activationKeys` | `{ F4 }` | The keys that open it. |
| `userIds` | `{}` | Your admins' user IDs, such as `{ 123456789 }`. |
| `maxTicketChange` | `1000000` | The most `tickets-add` changes at once. |
| `maxTicketBalance` | `1000000000` | The highest balance `tickets-set` allows. |
| `saveTimeout` | `15` | Seconds a command waits for a save to confirm. |

The experience's owner, or the owning group's owner, is always an admin. Every command is checked on the server.

## Built-in Cmdr commands

| Group | Commands |
| :-- | :-- |
| Administration | `announce`, `ban`, `goto-place`, `kill`, `respawn`, `teleport`, `unban` |
| Debugging | `blink`, `get-player-place-instance`, `position`, `thru`, `uptime`, `version` |
| Console utilities | `alias`, `bind`, `clear`, `echo`, `help`, `history`, `math`, `rand`, `run`, `var`, and more |

Plus aliases like `bring`, `to` and `rejoin`; see Cmdr's [command reference](https://eryn.io/Cmdr/docs/reference/commands/). `fetch` is left out, and `kick` is the kit's own, which won't kick another admin.

## Kit commands

`<angle brackets>` are required, `[square brackets]` optional.

### Towers and checkpoints

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
| `checkpoint-return` | `<players>` | Sends them to their checkpoint. |
| `fake-win` | `<player> <ending> [difficulty] [time] [globalStyle]` | Previews the win screen, granting nothing. |

### Tickets, cosmetics and items

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `tickets` | `<player>` | Shows their balance. |
| `tickets-add` | `<player> <amount>` | Adds tickets, or removes them with a negative amount. |
| `tickets-set` | `<player> <balance>` | Sets their balance. |
| `cosmetic-grant` | `<player> <category> <cosmetic>` | Unlocks a cosmetic. |
| `cosmetic-revoke` | `<player> <category> <cosmetic>` | Takes one away. |
| `cosmetic-equip` | `<player> <category> [cosmetic]` | Equips one they own, or unequips. |
| `shop-item-grant` | `<player> <item>` | Gives a shop item for free. |

These only affect players in this server.

### Data, players and servers

| Command | Arguments | Does |
| :-- | :-- | :-- |
| `data-summary` | `<player>` | Their completions, items, tickets and save state. |
| `data-save` | `<players>` | Saves now. `*` for everyone. |
| `recount-badges` | `<player>` | Rebuilds completions from their badges. For lost saves. |
| `leaderboard` | `[board] [count]` | The top of `Towers`, `AllJumps` or `Elo`. |
| `data-health` | `[problems]` | The data service's status and recent errors. |
| `data-export` | `<userId>` | Prints everything saved for a user, for a data request. |
| `data-erase` | `<userId> <confirm>` | Deletes a user's save permanently. Needs `confirm` as `true`, and refuses while they're in the server. |
| `gamepass-refresh` | `<player> <gamePass>` | Re-checks a pass. |
| `heal` | `<players>` | Full health. |
| `give-badge` | `<players> <badgeId>` | Awards one of your badges. |
| `notify` | `<players> <message> [duration] [global]` | Sends a notification, here or to every server. |
| `kick` | `<players> [reason]` | Kicks them. Won't kick another admin. |
| `server-time` | `<players>` | How long they've been in the server. |
| `kit-info` | none | Kit version, place and player count. |
| `shutdown` | `<true> [seconds] [reason]` | Closes the server after a countdown (60 seconds by default, `0` for now). |

## Adding a command

Put your own commands in a `ServerScriptService > CustomCommands` folder, outside the kit, so updates leave them alone. See [Hooking Into the Kit](./hooks.md#admin-commands-of-your-own).

::: danger Keep "Server" out of the definition's file name
A command is two modules: the definition (`Hello`) and the one that runs it, which ends in `Server` (`HelloServer`). Any module with `Server` **anywhere** in its name is taken for the running half, so a definition called `ServerTime` never registers. Name the definition something else and set `Name = "server-time"` inside it.
:::
