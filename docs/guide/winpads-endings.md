# Winpads & Endings

A `WinPad` is the part players touch to finish a tower.

## What happens on a touch

The touch is ignored in Practice mode, and after a boost in a tower or rush that bans boosts. Otherwise the server checks, in order:

1. The winpad belongs to the tower the player is in.
2. The run took at least the tower's minimum time.
3. Every checkpoint was passed, in order.

If all three pass, the win is announced, rewards are given, and the player goes to the winroom. In a rush, the winpad moves them on to the next tower instead; see [Tower Rushes](./tower-rushes.md).

::: warning Failing a check is treated as cheating
The player is **kicked** with nothing awarded, and a line from `antiCheatKickMessages` in `Config > Chat` is announced. With `webhooks.antiCheat` on, it's also posted to `ANTICHEAT_WEBHOOK`.
:::

A run that used a debug tool (like the Studio test tools) skips the checks, earns nothing, and the player is told it didn't count.

## Standard Ending

Add a `BasePart` named exactly `WinPad` (not `Winpad`) at the end of the tower. A Normal win on it records the win and best time, and gives the badge, points, completion tools and tickets.

An All Jumps win records an All Jumps win and can give `AJBadgeID`, but no tickets, tools or normal badges.

## Custom Ending

For secret endings and alternate exits, add more winpads with attributes. A tower's **main ending** is the winpad whose `EndingID` is its acronym, or empty. **Only the main ending counts as beating the tower.** A side ending announces the win under its own name, gives its own badge (and the tower's, unless `PreventTowerBadge` is set) and sends the player to its winroom, but doesn't record the tower as beaten.

A secret ending:

1. Add another `BasePart` named `WinPad`.
2. Set `EndingID = "SecretVault"` and `EndingName = "The Secret Vault"`.
3. Set `BadgeID` for its own badge, and `PreventTowerBadge = true` if it shouldn't also give the tower's.

The [Tower Setup window](./tower-setup-plugin.md#endings)'s **Add another ending** does this for you.

## Winpad Attributes

| Attribute | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `EndingID` | `string` | the acronym | Which ending this is. Anything but the acronym makes it a side ending. |
| `EndingName` | `string` | the tower's name | The name announced. Side endings only. |
| `Difficulty` | `string` | the tower's | A difficulty **name**, like `"Extreme"`, for the announcement. Side endings only. |
| `BadgeID` | `number` | `0` | A badge for this ending. |
| `PreventTowerBadge` | `boolean` | `false` | Don't also give the tower's badge. |
| `WinroomMarker` | `string` | `WinroomSpawn` | The marker to send the player to. |

Old towers' Value objects with these names work too.

## Winpad Visuals

Winpads get the kit's particles and flash colours and materials while someone is in the tower. `winpadInterval`, `winpadsChangeColor` and `winpadsChangeMaterial` in `Config > Project` control it.
