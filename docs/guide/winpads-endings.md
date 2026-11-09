# Winpads & Endings

A winpad is the part a player touches to beat a tower. It must be a part named
exactly `WinPad`, with a capital P.

## What happens when a player touches it

The touch is ignored in Practice mode, and after a boost item was used in a tower
or rush that bans them. Otherwise the server checks three things, in order:

1. The winpad belongs to the tower the player is in.
2. The run took at least the tower's minimum time.
3. The player passed every checkpoint, in order.

If all three pass, the win is announced, the player gets their rewards, and
they're sent to the winroom. In a rush, they're sent on to the next tower instead.
See [Tower Rushes](./tower-rushes.md).

::: warning Failing a check counts as cheating
The player is **kicked**, gets nothing, and a line from `antiCheatKickMessages`
in `Config > Chat` is announced. If `webhooks.antiCheat` is on, it's also posted
to your `ANTICHEAT_WEBHOOK` Discord channel.
:::

A run that used a test tool, such as the ones Studio hands out, skips the checks
but earns nothing, and the player is told it didn't count.

## The main ending

Put a part named `WinPad` at the top of the tower. A Normal win on it saves the
win and the best time, and gives the tower's badge, points, completion tools and
tickets.

An All Jumps win saves an All Jumps win and can give the `AJBadgeID` badge, but no
tickets, completion tools or normal badge.

## Side endings

For secret endings or other ways out, add more winpads with attributes.

- The **main ending** is the winpad whose `EndingID` is empty or the tower's
  acronym. **Only the main ending counts as beating the tower.**
- A side ending is announced under its own name, gives its own badge (and the
  tower's badge too, unless `PreventTowerBadge` is set), and sends the player to
  its own winroom.

To make a secret ending:

1. Add another part named `WinPad`.
2. Give it the attributes `EndingID = "SecretVault"` and
   `EndingName = "The Secret Vault"`.
3. Optional: give it `BadgeID` for its own badge, and `PreventTowerBadge = true` if
   it shouldn't also give the tower's badge.

The [Ascent Setup plugin](./tower-setup-plugin.md)'s **Add another ending**
button does this for you.

## Winpad attributes

| Attribute | Type | Default | What it does |
| :-- | :-- | :-- | :-- |
| `EndingID` | string | the acronym | Which ending this is. Anything other than the acronym makes it a side ending. |
| `EndingName` | string | the tower's name | The name announced for a side ending. |
| `Difficulty` | string | the tower's | A difficulty **name**, such as `"Extreme"`, announced for a side ending. |
| `BadgeID` | number | `0` | A badge for reaching this ending. |
| `PreventTowerBadge` | boolean | `false` | Stops this ending from also giving the tower's badge. |
| `WinroomMarker` | string | `WinroomSpawn` | The [marker](./markers-portals.md) the player is sent to. |

Value objects with these names, from older kits, work too.

## Winpad colours

Winpads flash between colours and materials while someone is in the tower. Turn
this off, or change its speed, with `winpadsChangeColor`, `winpadsChangeMaterial`
and `winpadInterval` in `Config > Project`.
