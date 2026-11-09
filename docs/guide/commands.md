# Admin Commands

The admin console is [Cmdr](https://eryn.io/Cmdr/docs/intro/). Only your staff can
open it. Press `F4`, start typing a command, and pick from the suggestions. Type
`help <command>` to see what a command needs. On a phone or controller, staff get a
**Console** button in the top bar instead.

## Roles and permissions

Every staff member has a **role**. A role can use its own commands, plus every
command the roles below it can use. Set them up in `Config > Admin`:

```luau
groupId = 0, -- 0 means the group that owns the experience
roles = {
	{ name = "Moderator", userIds = { 123456789 }, groupRank = 100 },
	{ name = "Admin", userIds = {}, groupRank = 200 },
	{ name = "Owner", userIds = {} },
},
```

- List roles from **lowest to highest**. You can rename them or add your own, such
  as a "Helper" role below Moderator.
- A player gets a role if their user ID is in its `userIds`, or if their rank in the
  group is at least `groupRank`. They get the highest role they qualify for.
- The experience's owner always has the top role. So does everyone testing in
  Studio, while `allowStudio` is on.
- If you own the game yourself rather than through a group, put your group's ID in
  `groupId` to use group ranks.

Which role a command needs comes from its **group**, in `permissions`:

| Group | Commands | Lowest role, as shipped |
| :-- | :-- | :-- |
| `Info` | `kit-info`, `staff`, `data-summary`, `leaderboard` | Moderator |
| `Moderation` | `kick`, `mute`, `unmute`, `freeze`, `unfreeze` | Moderator |
| `Towers` | `tower-load`, `tower-exit`, `tower-restart`, `tower-mode`, `tower-status`, `tower-marker`, `tower-rush`, `checkpoint-clear`, `fake-win`, `heal` | Moderator |
| `Rewards` | `tickets-add`, `tickets-set`, `cosmetic-grant`, `cosmetic-revoke`, `shop-item-grant`, `shop-item-revoke`, `gamepass-grant`, `gamepass-revoke`, `give-badge`, `tower-grant`, `tower-revoke` | Admin |
| `Data` | `data-save`, `data-health`, `recount-badges`, `gamepass-refresh` | Admin |
| `Server` | `shutdown` | Admin |
| `DefaultAdmin` | Cmdr's `ban`, `unban`, `teleport`, `kill`, `respawn`, `goto-place` | Admin |
| `DefaultDebug` | Cmdr's `blink`, `thru`, `position`, `get-player-place-instance` | Admin |
| `DefaultUtil`, `Help`, `UserAlias` | `help`, `clear`, `history`, `alias`, and `bring`, `to`, `refresh` | Moderator |

To give one command a different role from its group, add it to `commands`. As
shipped, moderators can use `teleport`, `respawn` and `position` (which `bring`,
`to` and `refresh` need), and only the Owner can use `data-export` and `data-erase`:

```luau
commands = {
	teleport = "Moderator",
	["data-erase"] = "Owner",
},
```

**A group that isn't in `permissions` needs the top role.** So a command you add
can only be used by the top role until you add its group.

If someone tries a command above their role, they're told which role it needs.
`kick`, `mute` and `freeze` can't be used on someone with the same role or higher.
`staff` lists who's online, with their roles.

### Other settings

| Setting | Default | What it does |
| :-- | :-- | :-- |
| `enabled` | `true` | Turns the console on or off. |
| `allowStudio` | `true` | Gives everyone testing in Studio the top role. |
| `activationKeys` | `{ F4 }` | The keys that open the console. |
| `consoleIcon` | a terminal icon | The image on the Console button. |
| `maxTicketChange` | `1000000` | The most tickets `tickets-add` can add or remove at once. |
| `maxTicketBalance` | `1000000000` | The highest balance `tickets-set` can set. |
| `saveTimeout` | `15` | Seconds a command waits for a save to be confirmed. |

## The kit's commands

`<angle brackets>` mean required, `[square brackets]` mean optional. Commands that
change a player's save only work on players in your server.

### Moderation

| Command | Arguments | What it does |
| :-- | :-- | :-- |
| `kick` | `<players> [reason]` | Kicks them. |
| `mute` | `<players> [minutes]` | Stops them chatting, for that many minutes or until they leave. |
| `unmute` | `<players>` | Lets them chat again. |
| `freeze` | `<players>` | Stops them moving, even after respawning. |
| `unfreeze` | `<players>` | Lets them move again. |

Mutes and freezes end when the player leaves the server. For anything longer, use
`ban`.

### Towers

| Command | Arguments | What it does |
| :-- | :-- | :-- |
| `tower-load` | `<players> <tower>` | Loads a tower for them, with a fresh timer. |
| `tower-exit` | `<players>` | Ends their run and sends them to `SpawnLocation`. |
| `tower-restart` | `<players>` | Restarts their run. |
| `tower-mode` | `<players> <Normal\|Practice\|AllJumps>` | Changes their mode. |
| `tower-status` | `<players>` | Shows their tower, mode, timer, checkpoint and rush. |
| `tower-marker` | `<players> <marker>` | Teleports them to a [marker](./markers-portals.md). |
| `tower-rush` | `<players> <rush>` | Starts a tower rush for them. |
| `checkpoint-clear` | `<players>` | Clears their Practice and All Jumps checkpoints. |
| `heal` | `<players>` | Heals them to full health. |
| `fake-win` | `<player> <tower> [time] [globalStyle]` | Shows what a win announcement for that tower looks like, without giving anything. |

### Rewards

| Command | Arguments | What it does |
| :-- | :-- | :-- |
| `tickets-add` | `<player> <amount>` | Adds tickets. A negative amount takes them away. |
| `tickets-set` | `<player> <balance>` | Sets their ticket balance. |
| `gamepass-grant` | `<player> <gamePass>` | Gives a game pass as if they'd bought it. Its tool, trail, tag and tickets arrive straight away. |
| `gamepass-revoke` | `<player> <gamePass>` | Takes back a pass you gave. A pass they bought can't be taken back, and a one-time trail or tickets stay. |
| `tower-grant` | `<player> <tower> [Normal\|AllJumps]` | Gives them a tower win, with its points and Elo. No badge. |
| `tower-revoke` | `<player> <tower> [Normal\|AllJumps]` | Takes a tower win away, with its points and Elo. Badges stay. |
| `shop-item-grant` | `<player> <item>` | Gives a shop item for free. |
| `shop-item-revoke` | `<player> <item>` | Takes a shop item back, with its tool or cosmetic. No refund. |
| `cosmetic-grant` | `<player> <category> <cosmetic>` | Unlocks a cosmetic for them. |
| `cosmetic-revoke` | `<player> <category> <cosmetic>` | Takes a cosmetic away. |
| `give-badge` | `<players> <badgeId>` | Gives them one of your badges. |

`tower-grant` and `tower-revoke` work with any tower in `Config > Towers`, whichever
Area it's in.

### Info and data

| Command | Arguments | What it does |
| :-- | :-- | :-- |
| `staff` | none | Lists who's online, with their roles. |
| `kit-info` | none | Shows the kit's version, the place, the players, and how long the server has been running. |
| `data-summary` | `<player>` | Shows their wins, items, tickets and save status. |
| `leaderboard` | `[board] [count]` | Shows the top of the `Towers`, `AllJumps` or `Elo` leaderboard. |
| `data-save` | `<players>` | Saves their data now. Use `*` for everyone. |
| `data-health` | `[problems]` | Shows how saving is going, and any recent errors. |
| `recount-badges` | `<player>` | Rebuilds their tower wins from their badges, if their save was lost. |
| `gamepass-refresh` | `<player> <gamePass>` | Checks again whether they own a pass. |
| `data-export` | `<userId>` | Prints everything saved for a user, for a data request. |
| `data-erase` | `<userId> <confirm>` | Deletes a user's save for good, and removes them from every leaderboard. `confirm` must be `true`, and the user can't be in the server. |

### Server

| Command | Arguments | What it does |
| :-- | :-- | :-- |
| `shutdown` | `<true> [seconds] [reason]` | Shuts the server down after a countdown. 60 seconds by default, or `0` for straight away. |

## Cmdr's own commands

Cmdr comes with its own commands too: `ban` and `unban` (Roblox bans, which work
across every server), `teleport` and its shortcuts `bring` and `to`, `kill`,
`respawn` and `refresh`, `goto-place` and `follow-player`, `blink` and `thru` to
move yourself, `position`, and the console basics `help`, `clear`, `history`,
`alias` and `var`. See Cmdr's
[command list](https://eryn.io/Cmdr/docs/reference/commands/).

## Adding your own commands

Put your own commands in a `ServerScriptService > CustomCommands` folder. It's
outside the kit, so updates leave it alone. See
[Hooking Into the Kit](./hooks.md#admin-commands-of-your-own) for how. Give each
command a `Group`, and add that group to `permissions`, or only the top role can use
it.

::: danger Don't put "Server" in a command's file name
Each command is two ModuleScripts: the command itself (`Hello`), and the one that
runs it, ending in `Server` (`HelloServer`). Cmdr treats any module with `Server`
**anywhere** in its name as the one that runs a command, so a command file called
`ServerTime` never loads. Call the file something else, and set
`Name = "server-time"` inside it.
:::
