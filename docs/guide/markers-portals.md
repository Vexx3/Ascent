# Markers & Portals

Two folders in the Workspace. **Markers** are places a player can be sent to;
**portals** are parts that send them.

```text
Workspace
├─ Markers
│  ├─ SpawnLocation       -- where the lobby puts people
│  ├─ WinroomSpawn
│  └─ LobbyTP             -- touching it sends you to SpawnLocation
└─ Portals
   ├─ ToH Portal
   │  └─ TowerPortal      -- StringValue, Value = "ToH"
   ├─ Rush Portal
   │  └─ TowerRush        -- StringValue, Value = "TSR"
   └─ Back To Lobby
      └─ LobbyTeleporter  -- StringValue, Value = "SpawnLocation"
```

**The part's own name means nothing.** What it does is decided entirely by the
`StringValue` inside it, so name your portals whatever reads best in the
Explorer.

## The Three Portals

Put a `BasePart` under `Workspace > Portals` and give it exactly one of these as
a `StringValue` child:

| `StringValue` name | Its `Value` | What touching it does |
| :-- | :-- | :-- |
| `TowerPortal` | A tower acronym, `ToH` | Loads that tower |
| `TowerRush` | A rush acronym from `rushes` | Starts that rush |
| `LobbyTeleporter` | A marker name | Teleports to that marker |

A part with none of them is skipped and says so in the Output, naming the part.
A part with more than one uses the first in that order and ignores the rest.

A tower portal does nothing while the player is already inside a *different*
tower — they have to leave first. Touching the portal for the tower they are
already in reloads it.

## Markers

A marker is a `BasePart` under `Workspace > Markers`. Two names are special:

| Marker | Purpose |
| :-- | :-- |
| `SpawnLocation` | Where lobby and exit logic puts a player. |
| `LobbyTP` | Touching **the marker itself** sends the player to `SpawnLocation` and puts them on the Start team. |

Everything else there is a destination you name from somewhere else: a
`LobbyTeleporter`'s value, a rush's `winroomMarker`, or the
[`tower-marker`](./commands.md) command (`tpmarker` for short).

A `LobbyTeleporter` finds its target **anywhere under `Markers`**, nested
folders included, so you can group them however you like.

::: warning Both folders are read once, at server start
A portal or marker added while the game is running is never registered.
Build them in Studio, not from a script.
:::

`LobbyTP` is the one thing here that errors rather than warns: if `Markers` has
no `SpawnLocation` BasePart, startup stops, because a lobby teleporter with
nowhere to go would silently strand players.

## See Also

- [Tower Setup](./tower-setup.md)
- [Tower Rushes](./tower-rushes.md)
- [Winpads & Endings](./winpads-endings.md)
