# Moving An Old Kit Across

If your game runs on an older Towers of Hell kit, most of a tower already means
the same thing here. This page says what carries over untouched, what needs one
change, and what has no equivalent yet.

## What carries over untouched

The kit reads Value objects as well as attributes, so an old tower keeps working
as it is.

| In your old tower | Read here as |
| :-- | :-- |
| `SpawnLocation` part | The tower's spawn |
| `WinPad` part, anywhere inside | The winpad, including one nested in `Obby` |
| `MinimumTime` NumberValue | `MinimumTime` |
| `BadgeID` IntValue | `BadgeID` |
| `ProperName` StringValue | The tower's display name |
| `Difficulty` StringValue, holding a name like `Easy` | Looked up in the difficulty chart and turned into its rating |
| `ClientSidedObjects` folder | The same |
| Winpad attributes: `EndingID`, `EndingName`, `Difficulty`, `BadgeID`, `WinroomMarker`, `PreventTowerBadge` | The same, so multi-ending towers come across whole |
| `ServerStorage > TowerCheckpoints > <acronym>` with parts named `1`, `2`, `3` | The same |
| `ServerStorage > WinpadParticles` | The same |
| `Workspace > Portals`, each with a `TowerPortal` StringValue naming its tower | The same |
| `Workspace > Markers` | The same |

So copying `Workspace > Towers > YourTower` and its checkpoint folder into a
fresh kit gets you a tower that loads, times, validates and awards.

::: warning A named `Difficulty` loses the decimal
`Difficulty = "Extreme"` resolves to rating `9` and nothing after the point, so
the tower reads as a Baseline Extreme — and because a Value object child wins
over `Config > Towers`, it **overrides** whatever you write there. Once you have
set a number there, delete the old child.
:::

## What you have to set

**An entry in `Config > Towers`, naming its Area.** Older kits have no worlds or
areas, so nothing says which part of the chart a tower belongs to. The chart,
the totals and Area unlock requirements are all read from `Config > Towers`, so
without an entry the tower loads and plays but never appears in the Completions
menu.

Select the tower, pick its Area on the Selected tab of
[Tower Setup](./tower-setup-plugin.md), and press **Add to catalogue** — the
window writes the line for you. The areas come from `Config > Worlds`.

## What to check afterwards

Open Tower Setup and read the Towers tab. It lists every tower with anything
missing, and most of what it finds it can fix in one click. Then read the Setup
tab, which checks the place as a whole. The three worth looking for after a
move are:

- **Not in the catalogue** (Towers tab) — the tower has no `Config > Towers`
  entry yet, so no other place knows it exists.
- **Nothing describes this tower** (Towers tab) — neither attributes nor a
  config entry, so it shows up unnamed at the default difficulty.
- **Checkpoints with no tower** (Setup tab) — a checkpoint folder whose acronym
  no longer matches any tower, usually from renaming one on the way across.

## What has no equivalent

These parts of an older kit are not read, and their jobs are done differently
here:

| Old | Here |
| :-- | :-- |
| `ServerScriptService > GameData > Difficulties` | `Config > Towers`, under `difficulties` |
| `ServerScriptService > RealmData > RealmInfo` | `Config > Worlds` |
| `ServerScriptService > RealmData > TowerRushes` | `Config > Towers`, under `rushes` |
| `ServerScriptService > GameData > TowerBadges` | `BadgeID` on the tower, or `badgeId` in its config entry |
| `ServerScriptService > PlayerData` (ProfileService) | Scribe, set up for you in `Shared > Accounts` |
| `ServerScriptService > GameData > KickMessages` | `Config > Chat`, under `antiCheatKickMessages` |

## Your players keep their progress

Saved data does transfer, and nothing is copied to do it. Older kits saved under
`Player_<userId>` with ProfileService, and this kit reads those profiles where
they already are, rewriting each into the current shape the first time that
player joins.

Set `dataStoreKey` in `Config > Project` to the store your live game uses. That
is `PROFILE_STORE_KEY` from the old kit's `GameData > Config`.

Tower count and completions come across. That is the part a player spent their
time on and cannot get back, and it is deliberately all that does.

[Player Data](./player-data.md#bringing-an-older-kits-players-across) has the
detail and, more importantly, the dry run to do first: point
`dataStoreKeyStudio` at the live store with `dataStoreStudioMode = "NoSave"`,
which reads real profiles and writes nothing.

Everything else starts fresh. Old settings are not carried because they do not
mean quite the same thing here and one means the opposite, and the old inventory
is not carried because its names come from a shop this kit does not have.
Neither are All Jumps completions, tickets, the ticket shop, cosmetics,
per-tower stats or tower rushes, because the old kit never stored them.

Worth putting in your update notes, so a returning player knows their towers
survived and the rest is new.

## Moving your configuration

The old kit kept one `GameData > Config` of SCREAMING_SNAKE keys. This kit
splits them by subject under `ReplicatedStorage > Shared > Config`, and the
names line up almost one to one.

| Old key | Now |
| :-- | :-- |
| `PROFILE_STORE_KEY` | `Project.dataStoreKey` |
| `TOWER_STAT_NAME` | `Project.towerWordPlural` |
| `TIMER_SYNC_INTERVAL` | `Project.timerSyncInterval` |
| `CHECKPOINT_INTERVAL` | `Project.checkpointInterval` |
| `RESTART_COOLDOWN` | `Project.restartCooldown` |
| `RESTART_RESETS_TOWER_RUSH` | `Project.restartResetsTowerRush` |
| `WINPAD_INTERVAL` | `Project.winpadInterval` |
| `WINPADS_CHANGE_COLOR` | `Project.winpadsChangeColor` |
| `WINPADS_CHANGE_MATERIAL` | `Project.winpadsChangeMaterial` |
| `USE_DISPLAY_NAME` | `Project.useDisplayName` |
| `CHECKPOINTS_MISSING_WARNING` | `Project.checkpointsMissingWarning` |
| `NO_MINIMUM_TIME_WARNING` | `Project.noMinimumTimeWarning` |
| `R15_WARNING` | `Project.r15Warning` |
| `REGULAR_WEBHOOK_URL`, `SC_WEBHOOK_URL`, `ALL_JUMP_MODE_URL`, `KICK_WEBHOOK_URL` | `Chat.webhooks` |
| `WEBHOOK_MESSAGE` | `Chat.webhooks.normalMessage` |

`QUIET` and `CHECKPOINTS_WORKSPACE_WARNING` have no equivalent. This kit warns
about the things worth warning about and stays quiet otherwise.

## See Also

- [Building A Tower](./tower-setup.md)
- [Tower Setup Window](./tower-setup-plugin.md)
- [Configuration Reference](./configuration.md)
- [Player Data](./player-data.md)
