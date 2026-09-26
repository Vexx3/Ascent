# Moving An Old Kit Across

If your game runs on an older Towers of Hell kit, most of it carries over as it is, and so do your players' completions.

## What carries over untouched

The kit reads the old Value objects as well as attributes, so an old tower keeps working.

| In your old tower | Read here as |
| :-- | :-- |
| `SpawnLocation` part | The tower's spawn |
| `WinPad` part, anywhere inside | The winpad |
| `MinimumTime` NumberValue | `MinimumTime` |
| `BadgeID` IntValue | `BadgeID` |
| `ProperName` StringValue | The tower's name |
| `Difficulty` StringValue, like `Easy` | That difficulty's rating |
| `ClientSidedObjects` folder | The same |
| Winpad attributes (`EndingID`, `EndingName`, `Difficulty`, `BadgeID`, `WinroomMarker`, `PreventTowerBadge`) | The same |
| `ServerStorage > TowerCheckpoints > <acronym>` | The same |
| `ServerStorage > WinpadParticles`, `Workspace > Portals`, `Workspace > Markers` | The same |

Copy `Workspace > Towers > YourTower` and its checkpoint folder into the new kit and it loads, times and awards.

::: warning A named `Difficulty` loses the decimal
`Difficulty = "Extreme"` reads as `9.00` and overrides `Config > Towers`. Once the tower has a number in Config, delete the old value.
:::

## What you have to set

**An entry in `Config > Towers`, naming its Area.** Old kits have no Areas, and without the entry a tower never appears on the Completions chart. Select the tower, pick its Area on the Selected tab of [Tower Setup](./tower-setup-plugin.md), and press **Add to catalogue**.

Then read Tower Setup's Towers and Setup tabs. After a move, look for **Not in the catalogue**, **Nothing describes this tower**, and **Checkpoints with no tower** (usually a tower renamed on the way).

## What has no equivalent

| Old | Here |
| :-- | :-- |
| `GameData > Difficulties` | `Config > Towers`, `difficulties` |
| `RealmData > RealmInfo` | `Config > Worlds` |
| `RealmData > TowerRushes` | `Config > Towers`, `rushes` |
| `GameData > TowerBadges` | `BadgeID` on the tower, or `badgeId` in Config |
| `PlayerData` (ProfileService) | Scribe, in `Shared > Accounts` |
| `GameData > KickMessages` | `Config > Chat`, `antiCheatKickMessages` |

## Your players keep their progress

The kit reads old saves where they are, and updates each one the first time that player joins. Nothing is copied.

Set `dataStoreKey` in `Config > Project` to your live game's store, the old kit's `PROFILE_STORE_KEY`. For the v4.22 kit:

```luau
dataStoreKey = "[MTKv4.22 Mod]",
```

### Do a dry run first

Before publishing, load your real save without writing to it:

```luau
dataStoreKeyStudio = "[MTKv4.22 Mod]",
dataStoreStudioMode = "NoSave",
```

Play in Studio and check your towers and completions look right. Put both back before you publish.

::: danger
Never test with `dataStoreStudioMode = "Live"` pointed at your live store. That writes to it.
:::

### What comes across

| Old field | Becomes |
| :-- | :-- |
| `Towers` | `towers`, the completion count |
| `CompletedTowers` | `completedTowers` |

Old completions are saved by tower **name**; the kit matches each one against `name` in `Config > Towers` (ignoring case) and turns it into the acronym. A name it can't match is kept, but counts for no tower on the chart.

::: warning Match your names before release
If a tower's `name` in Config differs from what the old kit called it, its completions won't match. Fixing the name later repairs them on the next load, but a player who beats that tower in between gets its points twice. Do the dry run and check a few players first.
:::

Everything else starts fresh: settings, inventory, All Jumps, tickets, cosmetics, stats and rushes. Tell returning players in your update notes that their towers survived and the rest is new.

## Moving your configuration

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

`QUIET` and `CHECKPOINTS_WORKSPACE_WARNING` aren't needed.
