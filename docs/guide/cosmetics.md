# Cosmetics

Players unlock Trails and Auras and equip one of each from the Cosmetics menu. A Trail is a `Trail`. An Aura is everything else a player wears: particles, `Fire`, `Smoke`, `Sparkles`, lights, beams, or parts such as wings or a halo. See [Auras: Particles And More](#auras-particles-and-more).

Each one is a model in `ServerStorage > Cosmetics`:

```text
ServerStorage
└─ Cosmetics
   ├─ Trails
   │  └─ BlueTrail  -- the model name is the cosmetic's ID
   └─ Auras
```

The model's name is saved with everyone who owns it, so don't rename it after release.

You can describe a cosmetic on its model, in `Config > Economy`, or both.

## On the model, with no code

Select the model and set its attributes:

| Attribute | Kind | Purpose |
| :-- | :-- | :-- |
| `Rarity` | String | Required: `Uncommon`, `Rare`, `Epic`, `Legendary` or `Mythic`. This is what makes a model a cosmetic. |
| `CosmeticName` | String | The name players see. Defaults to the model's name. |
| `Hint` | String | Shown while it's locked. |
| `UnlockTower` | String | Beat this tower. |
| `UnlockDifficulty` | String | Beat a tower of exactly this difficulty. |
| `UnlockTowerCount` | Number | Beat this many towers. |
| `UnlockGroupId`, `UnlockGroupRank` | Number | Be in this group, at this rank or higher. |
| `UnlockPremium` | Boolean | Have Roblox Premium. |
| `BodyPart` | String | Where it attaches. Defaults to `HumanoidRootPart`. |
| `AttachmentName` | String | An aura's attachment. |
| `Attachment0Name`, `Attachment1Name` | String | A trail's attachments. |

With no unlock attributes it only comes from the shop or a game pass. Set them in the Properties window, under **Attributes**.

## In `Config > Economy`

```luau
cosmetics = {
	Trails = {
		BlueTrail = {
			name = "Blue Trail",
			rarity = "Rare",
			hint = "Beat ETV5 to unlock this trail.",
			unlocks = {
				{ type = "Tower", tower = "ETV5" },
			},
		},
	},
	Auras = {},
},
```

| Field | Purpose |
| :-- | :-- |
| `name` | The name players see. |
| `rarity` | Its rarity, which picks its colour from `rarityColors`. |
| `hint` | Shown while it's locked. |
| `unlocks` | Unlock rules. Empty means shop or game pass only. |
| `template` | The model's name, when it differs from the key. |

If both exist, the model's attributes win. Any unlock attribute replaces the whole `unlocks` list.

## Unlock Rules

**Any one** rule unlocks it.

| Rule | In code | Attribute |
| :-- | :-- | :-- |
| Beat a tower | `{ type = "Tower", tower = "ETV5" }` | `UnlockTower` |
| Beat a difficulty | `{ type = "Difficulty", difficulty = "Hard" }` | `UnlockDifficulty` |
| Beat a number of towers | `{ type = "TowerCount", count = 10 }` | `UnlockTowerCount` |
| Be in a group | `{ type = "Group", groupId = 123, minRank = 1 }` | `UnlockGroupId`, `UnlockGroupRank` |
| Have Premium | `{ type = "Premium" }` | `UnlockPremium` |

Two rules of the same kind, like two different towers, need the Config list.

::: warning A cosmetic's difficulty is exact
`Difficulty = "Remorseless"` needs a Remorseless tower. An Insane tower does **not** count. That's unlike Area requirements, where harder towers count.
:::

## Shop And Pass Unlocks

- A shop Trail or Aura unlocks the cosmetic **with the same ID**.
- The VIP game pass can unlock a Trail with its `trail` field.

Unlocking doesn't equip it. `enabled.cosmetics` in `Config > Economy` turns the whole feature off, `enabled.cosmeticCategories` one kind at a time.

## Assets

A Trail can be a `Trail`, `Folder` or `Model`, attached to `HumanoidRootPart` unless it says otherwise.

### Auras: Particles And More

Anything that isn't a trail is an Aura, in `ServerStorage > Cosmetics > Auras`. Build it in one of three shapes:

- **One effect**: a `ParticleEmitter`, `Fire`, `Smoke`, `Sparkles`, light, `Beam` or `BillboardGui` on its own. It goes on an attachment at the centre of `BodyPart` (`HumanoidRootPart` unless you set it). Set `AttachmentName` to one the body part already has to move it: `BodyPart = "Head"` and `AttachmentName = "HatAttachment"` puts it on top of the head.
- **An `Attachment` holding effects**: it goes into `BodyPart` as it is, so its `Position` places the effects.
- **A `Folder`, `Model` or part**: parts are welded on, and can't collide or weigh the player down. Effects inside come along. To cover the whole body, name a part or folder inside it after a body part (`Head`, `Torso`, `Left Arm`, `Right Leg` and so on), and what's in it goes on that limb. Inside a part named after a limb, things keep where they sit against it. Without any such names, the whole thing goes on `BodyPart`.

The shipped place has three to copy: `Fallen`, `Moonflower` and `Shinning`. Set the same attributes on an aura as on a trail, on its top instance, whatever that is.

## Previewing a cosmetic

The shop's **Preview** button shows a trail or aura on a mannequin before buying. **StopPreview**, a button directly under `MainMenu`, goes back. Players drag to rotate the view.

It needs a character `Model` named **`Rig`** in `Workspace`, with a `HumanoidRootPart`. The preview copy wears the viewer's own avatar, and only they see it. Both buttons are optional.

## The Cosmetics Menu

```text
CosmeticsMenu
  SearchBox
  ButtonTabHolder
    TrailsButton
    AurasButton
  TrailsList
    CosmeticButton
      CosmeticName
  AurasList
    CosmeticButton
      CosmeticName
  HintHover
```

Give each list a `UIListLayout` or `UIGridLayout` and set its `AutomaticCanvasSize`, so the last item can be reached.
