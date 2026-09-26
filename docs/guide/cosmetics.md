# Cosmetics

Players unlock Trails and Auras and equip one of each from the Cosmetics menu. Each one is a model in `ServerStorage > Cosmetics`:

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

With no unlock attributes it only comes from the shop or a game pass. The [Tower Setup window](./tower-setup-plugin.md#cosmetics)'s Cosmetics tab edits these for you.

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

A Trail can be a `Trail`, `Folder` or `Model`, attached to `HumanoidRootPart` unless it says otherwise. An Aura can hold particles, attachments, lights, `Fire`, `Smoke`, `Sparkles` and parts. For a whole-body aura, put effects in folders named after body parts.

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
