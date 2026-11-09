# Modifiers

Modifiers change how a tower plays, such as a camera that never stops spinning,
or copies of the player that chase them. Players pick them before they climb.
A harder set of modifiers pays more tickets and makes the tower worth more Elo,
and an easier set pays less.

## How players use them

1. Open the **Modifiers** menu.
2. Pick a tower or rush. The list only shows ones that a portal in this place
   leads to.
3. Pick **Normal** or **All Jumps**.
4. Turn on at least one modifier.
5. Press **Play**. This ends any run the player is already on.

The line above Play shows what a win would pay, such as
`31 tickets (×1.25), 857 Elo (×1.1)`.

Modifiers stay on through restarts, and through deaths in All Jumps. They end when
the player leaves the tower, wins it or switches mode. Their effects pause while
the player spectates someone.

## What a win pays

| | How modifiers change it |
| :-- | :-- |
| **Tickets** | The normal payout, multiplied by each modifier's `tickets`, and kept between `tickets.min` and `tickets.max`. The usual ticket cooldown still applies. |
| **Elo** | The tower's worth, multiplied by 1 plus each modifier's `elo`, and kept between `elo.min` and `elo.max`. Only the player's best set for each tower counts, so Elo never goes down. See [Player Elo](./elo.md#modifiers). |
| **Badges** | None, if any modifier has `badges = false`. |
| **The win** | Doesn't count at all if any modifier has `counts = false`. The player still reaches the winroom, and is told why. |
| **Best times** | Never saved with modifiers on. |
| **Saved runs** | A run with a `savedRuns = false` modifier can't be saved. |

Win announcements list the modifiers used. See
[Announcements & Webhooks](./announcements-webhooks.md).

## Config

The modifiers are in `Config > Modifiers`:

```luau
enabled = false,

tickets = { min = 0, max = 3 },
elo = { min = 0.25, max = 2 },

-- Towers and rushes a portal leads to that the menu still leaves out.
excludedTowers = {},

list = {
	{
		key = "SpinnyCamera",
		name = "Spinny Camera",
		description = "The camera never stops spinning.",
		effect = "Spin",
		settings = { degreesPerSecond = 40 },
		tickets = 1.25,
		elo = 0.1,
	},
	{
		key = "LowGravity",
		name = "Low Gravity",
		description = "Jumps go higher and fall slower. Pays less, and gives no badge.",
		effect = "LowGravity",
		settings = { scale = 0.5 },
		tickets = 0.5,
		elo = -0.3,
		badges = false,
		savedRuns = false,
	},
},
```

| Setting | What it does |
| :-- | :-- |
| `key` | The modifier's ID. It's saved with players, so **don't rename it**. Up to 32 characters, with no commas. |
| `name`, `description` | What players read in the menu. |
| `effect` | One of the [built-in effects](#the-built-in-effects). Leave it out to [make your own](#a-modifier-of-your-own). |
| `settings` | How strong the effect is. Anything you leave out uses the effect's default. |
| `tickets` | Multiplies the tickets a win pays. Defaults to `1`. |
| `elo` | Adds to the tower's Elo: `0.1` is 10% more. Defaults to `0`. |
| `allJumps` | `false` makes it Normal mode only. |
| `badges` | `false` means a win gives no badges. |
| `savedRuns` | `false` means the run can't be saved. |
| `counts` | `false` means a win doesn't count at all. |

Modifiers ship off. Set `enabled = true` to turn them on and add the menu. To
leave a tower out of the menu, add its acronym to `excludedTowers`.

Two modifiers can use the same effect at different strengths. If anything in
`Config > Modifiers` is wrong, the Output says so when the server starts.

## The built-in effects

| `effect` | `settings` (default) | What it does |
| :-- | :-- | :-- |
| `Spin` | `degreesPerSecond` (40) | Keeps turning the camera. |
| `LowFieldOfView` | `fieldOfView` (40) | Narrows the camera's view. |
| `Blur` | `size` (10, up to 56) | Blurs the screen. |
| `Earthquake` | `everyMin`, `everyMax` (6, 12), `lasts` (2.5), `strength` (1.2) | Every so often, the camera freezes in place and shakes. |
| `TunnelVision` | `size` (0.5) | Blacks out everything but a circle in the middle. |
| `NoStopping` | `minSpeed` (4), `grace` (3), `stillFor` (0.75), `damage` (15), `every` (0.5) | Standing still hurts. Climbing counts as moving. |
| `NoColors` | none | Turns everything grey. |
| `FirstPerson` | none | Locks the camera in first person. |
| `Darkness` | `brightness` (-0.35), `contrast` (0.1) | Darkens the screen. |
| `CosmicClone` | `count` (3), `delay` (2), `reach` (3), `damage` (50), `hitCooldown` (1), `color` | Copies of the player follow their exact path, a little behind, and touching one hurts. |
| `LowGravity` | `scale` (0.5) | Jumps go higher and falls are slower. |
| `InvertedMovement` | none | Forward is backward and left is right. |

Damage from a modifier works like a kill brick. A death ends a Normal run, and in
All Jumps sends the player back to their checkpoint.

## A modifier of your own

Leave out `effect`, and write a LocalScript that does the work. First, the Config
entry:

```luau
{
	key = "TinyPlayer",
	name = "Tiny Player",
	description = "You're a quarter of your size.",
	settings = {},
	tickets = 1.2,
	elo = 0.1,
},
```

Then a LocalScript in `StarterPlayer > StarterPlayerScripts`, next to the kit's
`Client` folder:

```luau
local Players = game:GetService("Players")

local Client = script.Parent:WaitForChild("Client")
local Events = require(Client:WaitForChild("Events"))

local function scale(size: number)
	local character = Players.LocalPlayer.Character
	if character ~= nil then
		character:ScaleTo(size)
	end
end

Events.modifierStarted:Connect(function(key)
	if key == "TinyPlayer" then
		scale(0.25)
	end
end)

Events.modifierEnded:Connect(function(key)
	if key == "TinyPlayer" then
		scale(1)
	end
end)
```

- `modifierStarted` fires with the modifier's key and its Config entry, each time
  an attempt starts.
- `modifierEnded` fires when the attempt ends. Undo your changes here.
- A change made in a LocalScript only happens for that player. If the server needs
  to enforce something, see [Hooking Into the Kit](./hooks.md).

## The menu's words

All of the menu's text is the `modifiers` group in `Config > Messages`. Each
tower's best set is saved under `eloModifierRuns`. See [Player Data](./player-data.md).
