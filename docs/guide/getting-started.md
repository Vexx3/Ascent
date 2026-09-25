# Getting Started

Ascent is a Roblox Studio place you open and edit. Settings sit together in one
folder, your models go in the usual services, and the kit's code is split into
`Shared`, `Server` and `Client`.

**No scripting needed.** Every setting is a value with a comment above it.

## Getting the kit

Ascent is a paid kit. Get it from the Ascent hub on Vendr, or as a member of the
[Ascent Discord](https://discord.gg/TbqyC2hJRH), where the hub is linked and
updates are announced. You receive:

| File | What it is |
| :-- | :-- |
| `Ascent Area.rbxlx` | A tower place. Every Ring, Zone or other Area of your game starts from this. |
| `Ascent Hub.rbxlx` | The hub players join first, with the ring select screen. See [Ring Select](./ring-select.md). |
| `Tower Setup.rbxm` | The Studio plugin that checks your place while you build. See [Tower Setup Window](./tower-setup-plugin.md). |

Each new version is listed in the [changelog](../changelog.md), with anything
you have to change by hand under **Updating**. [Updating Ascent](./updating.md)
covers moving a game onto a new release.

## Before You Start

| You need | Why |
| :-- | :-- |
| Roblox Studio | The kit is a place file you edit in Studio. |
| A published place | Saving player progress needs a real place, and teleports need at least one. |
| Studio API access | Turn on **Game Settings → Security → Enable Studio Access to API Services** so saved data works while you test. |

::: tip
Do this on a copy of your place, not the live one. The first thing you will
change is where player progress is stored, and getting that wrong on a live
game is hard to undo.
:::

## Set Up Your Game

Open `ReplicatedStorage > Shared > Config` in the Explorer. Everything below
happens in that folder.

### 1. Pick your save keys

Open `Project` and change both keys to something nobody else would use:

```luau
dataStoreKey = "MyGame_Live_v1",
dataStoreKeyStudio = "MyGame_Studio_v1",
```

The first is where real players' progress goes. The second is used only while
you test in Studio, so testing never touches real saves. Changing either one
later gives everyone a fresh, empty save.

### 2. List your Worlds and Areas

Open `Worlds`. A **World** is a group of destinations, and an **Area** is one
published Roblox place inside it — a Ring, a Zone, or whatever you call yours.

```luau
worlds = {
	{
		id = "World1",
		name = "World 1 (Rings)",
		areas = {
			{ id = "Ring1", name = "Ring 1: Limbo", placeId = 123456789 },
		},
	},
},
```

Set `hubPlaceId` at the top of the same file to the Place ID players return to
with **Return to Hub**.

### 3. Register your towers

Open `Towers` and add each tower, naming an Area `id` you just used:

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

Every place carries this list, so a tower must be here to exist outside the
place you built it in. The [Tower Setup window](./tower-setup-plugin.md) writes
the line for you from the tower's Studio attributes.

::: danger The acronym is permanent
`ToH` is saved with every player who beats it. Choose it before release and
never rename it.
:::

`difficulty` reads as `rating.sub` — `5.33` is a Challenging tower (rating 5) at
Low within it. See [Difficulties](./difficulties.md).

### 4. Build the tower

Put your tower model in `Workspace > Towers`, named with its acronym. Then give
it a spawn, a winpad, and checkpoints.

Fastest route is the [Tower Setup window](./tower-setup-plugin.md) — its
Towers tab lists what each tower is missing and adds most of it in one click.
It is a Studio plugin shipped beside the place file, so
[install it](./tower-setup-plugin.md#installing-it) first. To do it by hand,
follow [Building A Tower](./tower-setup.md).

::: warning Read this before placing checkpoints
Checkpoints are what stop a player skipping the climb, so they must sit across
the path in order. See
[Checkpoints Are The Anti-Cheat](./tower-setup.md#checkpoints-are-the-anti-cheat).
:::

### 5. Playtest

Press **Play** and check the whole loop:

- you spawn, enter the tower, and the timer starts;
- touching the winpad after passing every checkpoint wins the tower and awards tickets;
- skipping a checkpoint, or reaching the top faster than the tower's minimum time, does not — the server kicks you for it;
- dying in Normal mode ends the run, and in Practice or All Jumps puts you back at the position you last saved, or at the tower's spawn; with **Restart on Death** on, any death starts the tower again instead;
- Practice and All Jumps modes work; and
- rejoining keeps your completion.

If something is missing, the Output window tells you which tower and what it
needs. Those warnings come from `Config > Project` and can be turned off once
your game is finished.

### 6. Publish

Publish every place you listed in `Config > Worlds`. Teleports and Personal
Servers only work in a published game, never in a Studio playtest.

## Before You Publish

Go through this once before real players arrive. Most of it is reported in the
Output when a server starts, in a block headed **Ascent Config** or **Ascent
setup** — an empty Output is the goal.

- **Save keys** in `Config > Project` are your own, and different from each
  other. They cannot change after release.
- **Place IDs** in `Config > Worlds` — `hubPlaceId` and every Area — are
  your published places. The server says so if one is not in your experience.
- **Admins** in `Config > Admin.userIds` are the people you mean. The
  experience's owner is always one.
- **Game passes** in `Config > GamePasses` have your pass IDs, or
  `disabled = true` for the ones you do not sell. A pass left at `id = 0` is
  off.
- **Badges** in `Config > Towers` and on your winpads are your own.
- **Leaderboards** `LB_Towers`, `LB_AllJumps` and `LB_Elo` are registered
  in the Creator Dashboard if you want Roblox to draw them. See
  [Player Data](./player-data.md).
- **Webhooks**, if you want them: the secrets are set, and
  `webhooks.enabled = true` in `Config > Chat`. See
  [Announcements & Webhooks](./announcements-webhooks.md).
- **Avatar** is R6 under **Game Settings → Avatar**, and the two teams in
  `Config > Project.teamNames` exist.
- **Every tower** has checkpoints and a minimum time. The Tower Setup
  window's Towers tab shows which do not.
- **Build warnings** in `Config > Project` are turned off once nothing is
  left to fix, so the Output stays quiet in live servers.

## Where To Go Next

| If you want to | Read |
| :-- | :-- |
| See every setting the kit has | [Configuration Reference](./configuration.md) |
| Know where things live in Studio | [Studio Structure](./studio-structure.md) |
| Chain towers into one run | [Tower Rushes](./tower-rushes.md) |
| Sell things for tickets | [Tickets](./tickets.md) and [Ticket Shop](./ticket-shop.md) |
| Sell game passes | [Game Passes](./game-passes.md) |
| Add a setting of your own | [Adding A Saved Setting](./custom-settings.md) |
| React to wins, save values of your own, add commands | [Hooking Into the Kit](./hooks.md) |
| Move to a new release of Ascent | [Updating Ascent](./updating.md) |
| Write your own systems on top | [Extending the Kit](./extending-gameplay.md) |
| Fix something that is not working | [Troubleshooting](./troubleshooting.md) |
