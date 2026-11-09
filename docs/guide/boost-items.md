# Tools

The kit knows about four kinds of Tool:

- **Boosts**, which make a climb easier, such as a speed or gravity coil.
- **Heals**, which restore health.
- **Practice tools**, which players get in Practice mode.
- **Completion tools**, which players get for beating a tower.

## Boosts

To mark a Tool as a boost, give it the **`Boost`** tag (Properties > Tags). If you
want a different name shown in win announcements, give it a `BoostName` attribute
instead:

| Add to the Tool | Type | What it does |
| :-- | :-- | :-- |
| `Boost` | Tag | Marks it as a boost. |
| `BoostName` | String attribute | Marks it as a boost, and announces it under this name. |
| `DebugItem` | Boolean attribute | Marks it as a test tool. A run that used one earns nothing at all. |

If a player equips a boost while in a tower, that run gets no tickets and no
[Elo](./elo.md), and its win announcement lists the boost. Old tools with a
`BoostName` StringValue still work.

### Banning boosts

- A tower with the `NoBoosts` tag doesn't count a win that used a boost.
- Citadels and Obelisks ban boosts because of their
  [tower type](./difficulties.md#tower-types). A tower's own `noBoosts` in
  `Config > Towers` overrides its type, so `noBoosts = false` allows boosts in one
  Citadel.
- In a rush with `noBoosts = true`, equipping a boost **kills the player**.

### Studio test tools

When you test in Studio, you're given every Tool in `ServerStorage > StarterPackStudio`,
marked as `DebugItem`. Use them to reach endings quickly while testing. Runs that
use them never count.

## Heals

Give a healing Tool the `Heal` tag, and the backpack's **Heals** button will
include it.

## Switching items off

The backpack has three buttons above it: **All**, **Heals** and **Boosts**. They
switch those items off. A switched-off item is marked in red and can't be equipped,
so a player going for a clean run can't use a boost by mistake.

- **Right-click** an item to switch just that one off. On phones, only the three
  group buttons work.
- The **Hide Disabled Items** setting (Settings > Visual) hides switched-off items
  instead of marking them red.
- These choices, and the backpack's order, are saved.

## Practice tools

In Practice mode, players get three tools from `ServerStorage > PracticeTools`. They
must have exactly these names:

| Tool | What it does |
| :-- | :-- |
| `Noclip` | Lets the player walk through the tower. |
| `Heal` | Heals the player to full health. |
| `Godmode` | [Turns damage off](./practice-all-jumps.md#godmode). |

They're taken away when the player leaves Practice. If one is missing, the Output
names it. Practice tools are coloured with the `Practice` colour in the backpack,
and the backpack's filters treat them separately from a boost with the same name.

## Completion tools

These are Tools a player gets for beating a tower in Normal mode, on its main
ending. Put them in a folder named after the tower's acronym:

```text
ServerStorage
└─ CompletionTools
   └─ ToH
      ├─ Speed Coil
      └─ Gravity Coil
```

The player gets them in their backpack straight away, and every time they join
after that. Practice, All Jumps and side endings don't give them. If a folder
doesn't match any tower, the Output says so.
