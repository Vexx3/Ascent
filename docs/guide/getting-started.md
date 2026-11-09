# Getting Started

Ascent is a ready-made Roblox game for Eternal Towers of Hell-style fangames. You
open it in Studio, add your towers, and change settings in one folder. You don't
need to write any code to get a working game.

This page takes you from the download to a published game.

## Getting the kit

Ascent is a paid kit, sold in the Ascent hub on Vendr. Join the
[Ascent Discord](https://discord.gg/TbqyC2hJRH), where the hub is linked and new
versions are announced.

1. In the Discord, run `/link` and link your Roblox account.
2. Join the hub and buy Ascent. You get the Buyer role in the Discord.
3. Run `/retrieve` and pick a file:

   | Pick | File | What it's for |
   | :-- | :-- | :-- |
   | **Ascent** | `Ascent Area.rbxlx` | A tower place. Every Ring, Zone or other Area in your game is a copy of this file. |
   | **Ascent Hub** | `Ascent Hub.rbxlx` | The hub, the place players join first and pick an Area from. See [Ring Select](./ring-select.md). |

4. Install the [Ascent Setup plugin](./tower-setup-plugin.md#installing-it). It
   helps you build towers and checks your place.
5. Open the file in Studio and [install the code](#install-the-code).

### Install the code

The file you download has your map, menus and settings, but not the kit's code.
The code comes as Roblox packages that only Ascent buyers can use.

1. In Studio, open the Toolbox and go to **Inventory > My Packages**. If the
   packages aren't there, try **Creations > Group Packages**.
2. Insert each Ascent package: `Server`, `ServerPackages`, `Client`, `Shared`
   and `Packages`. The hub has `Server`, `Client`, `Shared` and `Packages`.
3. Open the plugin's **Check** window and press **Move into place**. Each package
   goes where it belongs.
4. Select each package's `PackageLink` and turn on **AutoUpdate**, so updates
   reach you by themselves.

Can't find the packages? Your Roblox account must be in the Ascent buyers group.
Ask in the Ascent Discord.

New versions are listed in the [changelog](../changelog.md). To move your game
onto one, follow [Updating Ascent](./updating.md).

## Words used in this guide

| Word | Meaning |
| :-- | :-- |
| **Area** | One place in your game, such as Ring 1. Each Area has its own towers. |
| **World** | A group of Areas, shown as one tab in the Teleport menu, such as "Rings" or "Zones". |
| **Hub** | The place players join first. They pick an Area there. |
| **Acronym** | A tower's short ID, such as `ToH`. It's the tower's name in Studio and it's saved with every player who beats it. |
| **Winpad** | The part at the top of a tower that wins it. |
| **Normal, Practice, All Jumps** | The three ways to play a tower. See [Practice & All Jumps](./practice-all-jumps.md). |
| **Rush** | Several towers played back to back as one run. See [Tower Rushes](./tower-rushes.md). |

## Before you start

| You need | Why |
| :-- | :-- |
| Roblox Studio | Ascent is a place file you edit in Studio. |
| A Roblox experience | Saving and teleporting only work in a published game. |
| Studio access to API services | Turn on **Game Settings > Security > Enable Studio Access to API Services**, so saving works while you test. |

::: tip Work on a copy
Set Ascent up on a copy of your game, not the live one. The first thing you'll
change is where player progress is saved, and a mistake there is hard to undo on
a live game.
:::

## Set up your game

Everything in this section happens in `ReplicatedStorage > Config`. Open
that folder in the Explorer. Each file in it is a ModuleScript full of settings,
and every setting has a comment explaining it.

![ReplicatedStorage in the Explorer: Config holds your settings, and Shared holds the kit's code](/images/explorer-config.png){width=380}

### 1. Pick your save keys

Open `Project` and change both save keys to something only your game uses:

```luau
dataStoreKey = "MyGame_Live_v1",
dataStoreKeyStudio = "MyGame_Studio_v1",
```

`dataStoreKey` is where real players' progress is saved. `dataStoreKeyStudio` is
only used while you test in Studio, so your tests never touch real saves.

::: danger Choose them once
Changing a save key after release starts every player on an empty save.
:::

### 2. List your Worlds and Areas

Open `Worlds`. Add one World, and one Area for each place your game will have:

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

`placeId` is the Roblox Place ID of that Area's place. If you haven't published
it yet, leave it at `0` for now. An Area with `placeId = 0` is hidden from players.

Set `hubPlaceId`, at the top of the same file, to your hub's Place ID. That's
where **Return to Hub** sends players.

[Worlds & Personal Servers](./worlds-personal-servers.md) covers every Area
setting, including how to lock one until a player has beaten enough towers.

### 3. Add your towers to Config

Open `Towers` and add an entry for each tower. The key is the tower's acronym,
and `area` is the `id` of the Area it's in:

```luau
towers = {
	ToH = { name = "Tower of Hell", difficulty = 5.33, area = "Ring1" },
},
```

The whole number in `difficulty` is the difficulty and the decimal is how far into
it the tower sits, so `5.33` is a Low Challenging. See
[Difficulties](./difficulties.md).

Every place reads this list, so a tower that isn't in it only exists in the place
you built it in. The [Ascent Setup plugin](./tower-setup-plugin.md) can write the
entry for you.

::: danger Acronyms are permanent
`ToH` is saved with every player who beats the tower. Pick your acronyms before
release and never rename them.
:::

### 4. Build the tower

Put your tower in `Workspace > Towers` and name it after its acronym. It needs a
spawn, a winpad and checkpoints.

The quickest way is the [Ascent Setup plugin](./tower-setup-plugin.md#making-a-tower):
press **Towers**, then **New tower**. Its **To do** list then shows what's left,
with a button for each. To do it by hand, follow [Building a Tower](./tower-setup.md).

::: warning Read this before you place checkpoints
Checkpoints are how the server knows a player really climbed the tower. They must
go across the whole path, in order. See
[Checkpoints are the anti-cheat](./tower-setup.md#checkpoints-are-the-anti-cheat).
:::

### 5. Playtest

Press **Play** and try each of these:

| Try | What should happen |
| :-- | :-- |
| Walk into the tower | It loads, and the timer starts. |
| Climb and touch the winpad | You win, and get tickets. |
| Touch the winpad without passing every checkpoint | You're kicked for cheating. |
| Die in Normal mode | The run ends. |
| Switch to Practice or All Jumps and place a checkpoint, then die | You go back to your checkpoint. |
| Stop, then play again | Your win is still there. |

If something doesn't work, the Output window names the tower and what it's
missing. See [Troubleshooting](./troubleshooting.md) for the common ones.

### 6. Set up the hub

The hub is the place players join first. Make it from `Ascent Hub.rbxlx` and
follow [Setting Up the Hub](./ring-select.md#setting-up-the-hub).

### 7. Publish

Every Area is a copy of `Ascent Area.rbxlx`, published as its own place in the
same experience as the hub. Roblox's
[publishing guide](https://create.roblox.com/docs/production/publishing/publish-experiences-and-places)
shows how to add places to an experience.

Publish the hub and every place you listed in `Config > Worlds`, then put each
Place ID into `Config > Worlds`. Teleports and personal servers need every place
published first.

## Before you publish

Go through this list before real players join. When a server starts, the Output
lists most of these problems under **Ascent Config** or **Ascent setup**. You're
done when that block is empty.

- The save keys in `Config > Project` are your own, and different from each other.
- `hubPlaceId` and every Area's `placeId` in `Config > Worlds` are your published places.
- The staff in `Config > Admin` are the people you mean. The experience's owner always has the top role.
- Every game pass in `Config > GamePasses` has your pass ID, or `disabled = true` if you don't sell it.
- Every badge ID, in `Config > Towers` and on your winpads, is one of your badges.
- The avatar type is R6, under **Game Settings > Avatar**.
- The two teams named in `teamNames` in `Config > Project` exist in `Teams`.
- Every tower has checkpoints and a minimum time. The plugin's Towers window shows which don't.
- Optional: the `LB_Towers`, `LB_AllJumps` and `LB_Elo` leaderboards are set up in the Creator Dashboard. See [Player Data](./player-data.md#leaderboards).
- Optional: Discord webhooks are set up. See [Announcements & Webhooks](./announcements-webhooks.md).
- Once nothing is left to fix, set the [build warnings](./configuration.md#build-warnings) in `Config > Project` to `false`, so live servers don't fill the Output.

## Place settings

This setting isn't in Config. Set it once, for the whole experience:

| Setting | Where | Set it to | Why |
| :-- | :-- | :-- | :-- |
| Access Control for Places | Creator Dashboard, **Audience > Access Settings** | **Secure within universe only** | Players can only reach a tower place through the kit's teleports, so a locked Area stays locked. |

## Where to go next

| If you want to | Read |
| :-- | :-- |
| See every setting the kit has | [Configuration Reference](./configuration.md) |
| Find something in the Explorer | [Studio Structure](./studio-structure.md) |
| Chain towers into one run | [Tower Rushes](./tower-rushes.md) |
| Give out tickets and sell things for them | [Tickets & Shop](./ticket-shop.md) |
| Sell game passes | [Game Passes](./game-passes.md) |
| Add a setting of your own | [Adding a Saved Setting](./custom-settings.md) |
| React to wins, save your own values, add commands | [Hooking Into the Kit](./hooks.md) |
| Update to a new version of Ascent | [Updating Ascent](./updating.md) |
| Fix something that isn't working | [Troubleshooting](./troubleshooting.md) |
