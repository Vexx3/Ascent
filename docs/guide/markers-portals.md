# Markers & Portals

- A **marker** is a spot players can be sent to, such as the lobby spawn or a
  winroom.
- A **portal** is a part that sends players somewhere when they touch it, such as
  into a tower.

```text
Workspace
├─ Markers
│  ├─ SpawnLocation       -- where players go when they leave a tower
│  ├─ WinroomSpawn        -- where a win sends players, unless the winpad says otherwise
│  └─ LobbyTP             -- touching it sends players to SpawnLocation
└─ Portals
   ├─ ToH Portal
   │  └─ TowerPortal      -- a StringValue whose Value is "ToH"
   ├─ Rush Portal
   │  └─ TowerRush        -- a StringValue whose Value is "TSR"
   └─ Back To Lobby
      └─ LobbyTeleporter  -- a StringValue whose Value is "SpawnLocation"
```

A portal's own name doesn't matter. The StringValue inside it decides what it does.

## Portals

To make a portal:

1. Put a part in `Workspace > Portals`.
2. Insert a StringValue into the part, named one of the names below.
3. Set the StringValue's `Value`.

| StringValue name | Its `Value` | Touching the portal |
| :-- | :-- | :-- |
| `TowerPortal` | A tower's acronym, such as `ToH` | Loads that tower. |
| `TowerRush` | A rush's acronym from `rushes` in `Config > Towers` | Starts that rush. |
| `LobbyTeleporter` | A marker's name | Teleports the player to that marker. |

Give each portal exactly one of these.

- A part with none of them is skipped, and the Output names it.
- A tower portal does nothing while the player is in a different tower or a rush.
- Touching the portal of the tower the player is already in restarts it.

## Markers

A marker is a part in `Workspace > Markers`. Three names do something special:

| Marker | What it's for |
| :-- | :-- |
| `SpawnLocation` | Where players are put when they leave a tower or go back to the lobby. **Required:** the server won't start without it. |
| `WinroomSpawn` | Where a win sends the player, unless the winpad has its own `WinroomMarker`. Rushes end here too, unless they set their own `winroomMarker`. Without it, the win still counts and the player stays on the winpad. |
| `LobbyTP` | Touching this marker sends the player to `SpawnLocation` and puts them on the Start team. |

Any other marker is a spot you can send players to by name, from:

- a `LobbyTeleporter` portal's `Value`,
- a winpad's `WinroomMarker` attribute,
- a rush's `winroomMarker`,
- or the [`tower-marker`](./commands.md) admin command.

Markers can be inside folders in `Markers`, except `LobbyTP`, which must be
directly inside it.

::: warning Build portals and markers in Studio
The server reads both folders once, when it starts. Portals or markers that a
script adds later are ignored.
:::
