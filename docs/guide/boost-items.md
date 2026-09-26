# Tools

The kit handles four kinds of Tool: **boosts** that make a climb easier, **heals**, **practice tools** handed out in Practice mode, and **completion tools** given for beating a tower.

## Boosts

Mark a Tool as a boost with the tag **`Boost`** (the Tag Editor can tag many at once). To show a different name in announcements, give it a `BoostName` attribute instead:

| Marker | Kind | Does |
| :-- | :-- | :-- |
| `Boost` | tag | Marks it as a boost. |
| `BoostName` | string attribute | Marks it as a boost, with this name in announcements. |
| `DebugItem` | boolean attribute | Marks it as a debug tool: a run that used one earns nothing at all. |

A run where a boost was equipped in the tower gets no tickets and no [Elo](./elo.md), and its announcement lists the boost. Old tools with a `BoostName` StringValue still work.

### No-boost towers and rushes

- A tower with the `NoBoosts` tag refuses a boosted win.
- Citadels and Obelisks ban boosts by their [type](./difficulties.md#tower-types). A tower's own `noBoosts` in `Config > Towers` overrides both, so `noBoosts = false` allows boosts in one Citadel.
- In a rush with `noBoosts = true`, equipping a boost **kills the player**.

### Studio test tools

In Studio, every Tool in `ServerStorage > StarterPackStudio` is given to you and marked `DebugItem`, so you can test endings with them and the run doesn't count.

## Heals

Tag a healing Tool `Heal`, and the backpack's **Heals** button covers it.

## Switching items off

Open the backpack for three buttons above it: **All**, **Heals** and **Boosts**. A switched-off item turns red and can't be equipped at all, so a legit run can't use a boost by accident. **Right-click** (or double-tap) one item to switch just that one off, or back on from a switched-off group. The choices are saved.

With **Hide Disabled Items** (Settings > Visual) on, switched-off items leave the backpack entirely.

Where a player drags an item in the backpack is saved too.

## Practice Tools

Practice mode hands out three tools from `ServerStorage > PracticeTools`, named exactly:

| Tool | Does |
| :-- | :-- |
| `PracticeNoclip` | Walk through the tower. |
| `PracticeHeal` | Heal to full. |
| `PracticeGodmode` | [Turn damage off](./practice-all-jumps.md#godmode). |

They're taken back when Practice ends. The Output names any that are missing.

## Completion Tools

Tools given for beating a tower in Normal mode, on its main ending. Put them in a folder named after the tower's acronym:

```text
ServerStorage
└─ CompletionTools
   └─ ToH
      ├─ Speed Coil
      └─ Gravity Coil
```

They go to the player's `Backpack` and `StarterGear`, and come back every time they join. Practice, All Jumps and side endings don't give them. A folder matching no tower is reported in the Output.
