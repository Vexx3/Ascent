# Moving an Old Kit Across

If your game runs on an older Towers of Hell kit, such as fanofpixels' Multi-Tower
Kit, most of it carries over as it is, and so do your players' completions.

## What works as it is

Ascent reads the old kits' Value objects as well as its own attributes, so old
towers keep working.

| In your old tower | Ascent reads it as |
| :-- | :-- |
| A `SpawnLocation` part | The tower's spawn |
| A `WinPad` part, anywhere inside | The winpad |
| A `MinimumTime` NumberValue | The minimum time |
| A `BadgeID` IntValue | The tower's badge |
| A `ProperName` StringValue | The tower's name |
| A `Difficulty` StringValue, such as `Easy` | That difficulty |
| A `ClientSidedObjects` folder | The tower's client objects |
| Winpad attributes (`EndingID`, `EndingName`, `Difficulty`, `BadgeID`, `WinroomMarker`, `PreventTowerBadge`) | The same |
| `ServerStorage > TowerCheckpoints > <acronym>` | The same |
| `ServerStorage > WinpadParticles`, `Workspace > Portals` and `Workspace > Markers` | The same |

Copy `Workspace > Towers > YourTower` and its checkpoint folder into Ascent, and
the tower loads, times runs and gives rewards.

::: warning An old `Difficulty` value hides the decimal
`Difficulty = "Extreme"` reads as exactly `9.00`, and it overrides `Config > Towers`.
Once the tower has its difficulty in Config, delete the old value.
:::

## What you need to add

Each tower needs **an entry in `Config > Towers` with its Area**. Old kits don't
have Areas, and without the entry a tower never shows in the Completions menu.
To add it, select the tower and open the
[Ascent Setup plugin](./tower-setup-plugin.md)'s Towers window. Pick its Area
under **No Area**, then press **Add to Config** under **Not in Config > Towers**.

Then look through the plugin's Towers and Check windows. After a move, watch for
**Checkpoint folders with no tower**. It usually means a tower was renamed on the
way across.

## Where the old data folders went

| Old kit | Ascent |
| :-- | :-- |
| `GameData > Difficulties` | `difficulties` in `Config > Towers` |
| `RealmData > RealmInfo` | `Config > Worlds` |
| `RealmData > TowerRushes` | `rushes` in `Config > Towers` |
| `GameData > TowerBadges` | `BadgeID` on the tower, or `badgeId` in `Config > Towers` |
| `PlayerData` (ProfileService) | Scribe, in `Shared > Accounts` |
| `GameData > KickMessages` | `antiCheatKickMessages` in `Config > Chat` |

## Your players keep their progress

Ascent reads old saves where they already are, and updates each one the first
time that player joins. Nothing has to be copied.

Set `dataStoreKey` in `Config > Project` to the store your live game uses, which is
the old kit's `PROFILE_STORE_KEY`. For the v4.22 kit, that's:

```luau
dataStoreKey = "[MTKv4.22 Mod]",
```

### Do a test run first

Before you publish, load your real save in Studio without writing to it:

```luau
dataStoreKeyStudio = "[MTKv4.22 Mod]",
dataStoreStudioMode = "NoSave",
```

Press Play and check your towers and completions look right. Then put both
settings back before you publish.

::: danger
Never test with `dataStoreStudioMode = "Live"` while it points at your live
store. That writes to your players' real saves.
:::

### What comes across

| Old field | Becomes |
| :-- | :-- |
| `Towers` | `towers`, the completion count |
| `CompletedTowers` | `completedTowers` |

Old kits saved completions by tower **name**. Ascent matches each one to a `name`
in `Config > Towers`, ignoring capitals.

::: warning Match your tower names before release
If a tower's `name` in Config is different from what the old kit called it, its
completions won't be matched. Do the test run and check a few players first.
:::

Everything else starts fresh: settings, inventory, All Jumps, tickets, cosmetics,
stats and rushes.

## Moving your old settings

| Old setting | Ascent setting |
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

You don't need `QUIET` or `CHECKPOINTS_WORKSPACE_WARNING` any more.
