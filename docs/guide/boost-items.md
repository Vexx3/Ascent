# Boost & Practice Tools

Boost items are tools that assist a run, such as coils or debug tools. The kit tracks them so wins, tickets, and announcements stay fair.

Practice tools are separate tools used only in Practice mode.

## Built-In Practice Tools

Practice tools live in `ServerStorage > PracticeTools`, and the kit looks for
exactly three by name:

| Tool | What it does |
| :-- | :-- |
| `PracticeNoclip` | Walk through the tower. |
| `PracticeHeal` | Heal back to full. |
| `PracticeGodmode` | [Switch damage off](./practice-all-jumps.md#godmode). |

When Practice mode is enabled inside a tower, the kit clones these into the
player's inventory, and takes them back when Practice mode ends or they leave
the tower. Scripts inside the tools do the work, so there is nothing to wire up.

**The names are exact.** A tool under any other name is not picked up. If any of
the three is missing, the Output names all three it needs, once. Practice mode
still works without them — players just get whichever of the tools it found.

## Marking A Tool As A Boost

Two ways, and the tag is the one to reach for:

```text
Tool  ->  CollectionService tag: Boost
```

Tagging is what the Tag Editor is for, so you can mark a dozen tools at once and
see every boost in the place from one panel. A tagged tool announces under its
own name.

The other way is an attribute, which does one thing a tag cannot — it carries
the name announcements should print, when that is not the name the Tool goes by:

```text
Tool named SpeedCoil
  Attribute: BoostName = "Speed Coil"
```

| Marker | Type | Purpose |
| :-- | :-- | :-- |
| Tag `Boost` | tag | Marks the tool as a boost. It announces under its own name. |
| `BoostName` | `string` | Marks it too, and sets the name announcements print. |
| `DebugItem` | `boolean` | Marks the tool as a debug item. A win with one equipped skips the winpad's minimum-time and checkpoint checks and earns no Elo. |

Tools brought over from an older kit carry `BoostName`, including as the
`StringValue` those kits used, so both keep working and neither is going away.

When a player equips a boost tool inside a tower:

- `boostItemUsed` is set on their session.
- The boost name can appear in announcements.
- Tickets will not be awarded for that run.
- The run earns no [Elo](./elo.md).
- `NoBoosts` tower rules can reject the win.

## Switching Items Off

Open the backpack and three small buttons sit in a row just above it.

| Button | Switches off |
| :-- | :-- |
| **All** | Every item. Pressing it again puts everything back, including anything you set by hand. |
| **Heals** | Every heal. |
| **Boosts** | Every boost. |

The buttons do not change as you press them. The slots below are where you read
the state, and a header that also answered that question would be a second
answer competing with the first.

A switched-off item turns red, dims, and cannot be equipped by any route:
clicking it, its hotbar number, or a gamepad. That is the point. Someone doing a
legit run switches boosts off and then cannot use one by accident.

**Right-click one item** to override it, or **double-tap it on a touchscreen**.
That works in both directions: it switches a single item off while everything
else stays on, and it brings one item back out of a group you switched off. So
"no boosts except my coil" is two clicks.

What you switch off is saved. Rejoin and the same items are still off, in the
same groups, with the same individual overrides.

### Hiding them instead

Settings > Visual has **Hide Disabled Items**. Turn it on and a switched-off item
leaves the backpack entirely rather than sitting there in red, in the hotbar as
well as the inventory. Turn it off and everything comes back where it was.

This is saved with your other settings.

## Where Items Sit

Where you put an item is saved. Drag something to a different slot and it will
be in that slot when you rejoin, in the hotbar or in the inventory.

Items are remembered by name, because the Tool itself is destroyed and remade
every time a tower loads. A remembered slot is a preference rather than a claim:
if something else is already in it when you rejoin, the item takes the next free
slot instead of pushing anything out of the way.

### What counts as what

| Kind | How the kit knows |
| :-- | :-- |
| Boost | The tag `Boost`, or a `BoostName` attribute — [either way of marking one](#marking-a-tool-as-a-boost). |
| Heal | The tag `Heal`. |
| Anything else | Neither of those. Covered by **All**. |

Heals are the tag and nothing else. There was a `HealName` attribute and it is
gone: nothing ever read the string it carried, so it said what the tag says and
added a value that went nowhere. Tag a healing tool `Heal` and the Heals button
covers it.

## Disabling Boosts In A Tower

To block boosted wins in one tower:

1. Select the tower folder/model in `Workspace > Towers`.
2. Add the CollectionService tag `NoBoosts`.

If the player has used a boost item, the winpad will not accept the run.

A tower type with `noBoosts = true` in `Config > Towers` bans boosts in every
tower of that type — Citadel and Obelisk as the kit ships — with no tag. A
tower's own `noBoosts` there wins over both the tag and its type.

## Disabling Boosts In A Tower Rush

Set `noBoosts = true` in the `rushes` section of `ReplicatedStorage > Shared > Config > Towers`.

```luau
MyRush = {
	winroomMarker = "WinroomSpawn",
	towers = { "ToH", "ToS" },
	noBoosts = true,
}
```

In a no-boost tower rush, equipping a boost item kills the player.

## See Also

- [Practice & All Jumps](./practice-all-jumps.md)
- [Tickets](./tickets.md)
