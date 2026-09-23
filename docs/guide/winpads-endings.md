# Winpads & Endings

A `WinPad` is the part players touch to complete a tower. The server validates
the run, awards badges and stats, sends announcements, and teleports the player
to the winroom.

## What happens on a touch

Every step below runs on the server. Nothing is awarded until all three checks
pass, and a run that fails any of them is refused rather than partly credited.

Touching a winpad is checked on the server, in order:

1. **This winpad belongs to the tower you are in.**
2. **Every checkpoint was reached, in order.**
3. **The run lasted at least the tower's minimum time.**

Pass all three and the completion is granted — badge, stats, tickets and
tools — then the win is announced and you are sent to the winroom.

::: warning A failed check is treated as cheating
Fail any one of them and the player is **kicked** with nothing awarded, and
the attempt is reported to `ANTICHEAT_WEBHOOK`. These are not soft refusals.
:::

## Standard Ending

For a normal tower ending:

1. Add a `BasePart` at the end of the tower.
2. Name it `WinPad`, exactly. The name is case sensitive, so `Winpad` never registers.
3. Make sure the tower is registered in `ReplicatedStorage > Shared > Config > Towers`.

When the player touches the `WinPad` in Normal mode, the kit can:

- Award the tower badge from the tower entry in `ReplicatedStorage > Shared > Config > Towers`.
- Record the tower win and best time.
- Award tower points.
- Give completion tools.
- Award tickets if the run was not boosted and the tower is off cooldown.
- Teleport the player to the winroom.

Practice mode cannot complete a tower. All Jumps mode records an All Jumps win and can award `AJBadgeID`, but it does not give tickets or completion tools.

## Custom Ending

Use custom winpad attributes for secret endings, alternate exits, or special badges.

Example:

1. Create another `BasePart` named `WinPad`.
2. Add `EndingID = "SecretVault"`.
3. Add `EndingName = "The Secret Vault"`.
4. Add `BadgeID = 1234567890`.
5. Add `PreventTowerBadge = true` if this ending should not award the main tower badge.

The Tower Setup window edits every one of these on its Selected tab, one card per
winpad, and its **Add another ending** button makes the second winpad for you
with a free ending ID already set.

## Winpad Attributes

| Attribute | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `EndingID` | `string` | Tower acronym | Unique internal ID for this ending. |
| `EndingName` | `string` | Tower display name | Name used in announcements and webhooks. |
| `Difficulty` | `string` | Tower difficulty | Overrides announcement difficulty for this ending. |
| `BadgeID` | `number` | `0` | Badge awarded for this ending. |
| `PreventTowerBadge` | `boolean` | `false` | Prevents the normal tower badge from being awarded. |
| `WinroomMarker` | `string` | Empty | Teleports to a named marker after winning. |
| `Winroom` | `string` | Empty | Legacy alias for `WinroomMarker`. |

::: warning `Difficulty` means two different things
On the **tower folder** it is a number — `9.26`. On a **winpad** it is a
difficulty *name* — `"Extreme"` — because all it does is change the word in the
announcement for this one ending. A number here is ignored.
:::

Every attribute on this page can also be a **Value object child** of the matching
class, which is how towers from the legacy framework carry them, and the child
wins where a winpad has both.

## Winpad Visuals

Every winpad gets the kit's particles when its tower loads, and flashes through
random colours and materials while somebody is inside that tower. Three settings
in `Config > Project` control it:

| Setting | Default | Purpose |
| :-- | :-- | :-- |
| `winpadInterval` | `0.25` | Seconds between changes. |
| `winpadsChangeColor` | `true` | Flash the colour. |
| `winpadsChangeMaterial` | `true` | Flash the material. |

The flashing only runs for towers that have somebody in them — an empty tower's
winpad is a property change nobody can see. Turning both off stops the loop
doing any work at all.

## See Also

- [Configuration Reference: Towers](./configuration.md#towers)
- [Tower Setup](./tower-setup.md)
- [Markers & Portals](./markers-portals.md)
