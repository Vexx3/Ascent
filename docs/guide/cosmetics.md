# Cosmetics

Cosmetics are trails and auras that players unlock and wear. A player can wear one
of each at a time, picked from the Cosmetics menu.

- A **trail** is a Roblox `Trail` that follows the player.
- An **aura** is anything else the player wears: particles, `Fire`, `Smoke`,
  `Sparkles`, lights, beams, or parts such as wings or a halo. See
  [Auras: particles and more](#auras-particles-and-more).

Each cosmetic is a model in `ServerStorage > Cosmetics`:

```text
ServerStorage
└─ Cosmetics
   ├─ Trails
   │  └─ BlueTrail   -- the model's name is the cosmetic's ID
   └─ Auras
```

The model's name is saved with everyone who owns it, so don't rename it after
release.

You can describe a cosmetic with attributes on its model, in `Config > Economy`, or
both.

## With attributes, no code

Select the model and add these in the Properties window, under **Attributes**:

| Attribute | Type | What it does |
| :-- | :-- | :-- |
| `Rarity` | string | **Required.** `Uncommon`, `Rare`, `Epic`, `Legendary` or `Mythic`. This is what makes the model a cosmetic. |
| `CosmeticName` | string | The name players see. Defaults to the model's name. |
| `Hint` | string | Shown while the cosmetic is locked, to say how to get it. |
| `UnlockTower` | string | Unlocks it for beating this tower. |
| `UnlockDifficulty` | string | Unlocks it for beating a tower of exactly this difficulty. |
| `UnlockTowerCount` | number | Unlocks it for beating this many towers. |
| `UnlockGroupId`, `UnlockGroupRank` | number | Unlocks it for being in this group, at this rank or higher. |
| `UnlockPremium` | boolean | Unlocks it for having Roblox Premium. |
| `BodyPart` | string | The body part it attaches to. Defaults to `HumanoidRootPart`. |
| `AttachmentName` | string | The attachment an aura goes on. |
| `Attachment0Name`, `Attachment1Name` | string | The two attachments a trail goes between. |

A cosmetic with no unlock attributes can only be bought in the shop or given by a
game pass.

## In Config > Economy

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

| Setting | What it does |
| :-- | :-- |
| `name` | The name players see. |
| `rarity` | Its rarity, which also sets its colour from `rarityColors`. |
| `hint` | Shown while it's locked. |
| `unlocks` | The ways to unlock it. Leave it empty for shop or game pass only. |
| `template` | The model's name, if it's different from the key. |

If you use both, the model's attributes win. Any unlock attribute replaces the
whole `unlocks` list.

## Unlock rules

A player unlocks the cosmetic by meeting **any one** of its rules.

| Rule | In Config | As an attribute |
| :-- | :-- | :-- |
| Beat a tower | `{ type = "Tower", tower = "ETV5" }` | `UnlockTower` |
| Beat a tower of a difficulty | `{ type = "Difficulty", difficulty = "Hard" }` | `UnlockDifficulty` |
| Beat a number of towers | `{ type = "TowerCount", count = 10 }` | `UnlockTowerCount` |
| Be in a group | `{ type = "Group", groupId = 123, minRank = 1 }` | `UnlockGroupId`, `UnlockGroupRank` |
| Have Premium | `{ type = "Premium" }` | `UnlockPremium` |

For two rules of the same kind, such as two different towers, use the Config list.

::: warning A cosmetic's difficulty must match exactly
A `Remorseless` rule needs a Remorseless tower. Beating an Insane tower does
**not** count. This is different from Area requirements, where harder towers do
count.
:::

## From the shop or a game pass

- A trail or aura sold in the shop unlocks the cosmetic **with the same ID**.
- The VIP game pass can unlock a trail with its `trail` setting.

Unlocking a cosmetic doesn't put it on. The player equips it from the Cosmetics
menu.

To turn cosmetics off, set `enabled.cosmetics = false` in `Config > Economy`. To
turn off just trails or just auras, use `enabled.cosmeticCategories`.

## Building cosmetics

A trail can be a `Trail`, or a `Folder` or `Model` holding one. It attaches to
`HumanoidRootPart` unless you set `BodyPart`.

### Auras: particles and more

Auras go in `ServerStorage > Cosmetics > Auras`. Build each one in one of three
ways:

| You put in | How it attaches |
| :-- | :-- |
| **One effect:** a `ParticleEmitter`, `Fire`, `Smoke`, `Sparkles`, a light, a `Beam` or a `BillboardGui` | It's put on an attachment in the middle of `BodyPart`. To move it, set `AttachmentName`. For example, `BodyPart = "Head"` and `AttachmentName = "HatAttachment"` puts it on top of the head. |
| **An `Attachment`** holding effects | The attachment goes into `BodyPart` as it is, so its `Position` decides where the effects sit. |
| **A `Folder`, `Model` or part** | Its parts are welded to the player, with no collision and no weight. To put parts on different limbs, name a part or folder after a body part (`Head`, `Torso`, `Left Arm` and so on) and it goes on that limb. |

The kit comes with three auras to copy: `Fallen`, `Moonflower` and `Shinning`. Set
the same attributes on an aura as on a trail, on its top object.

## Previewing a cosmetic

The shop's **Preview** button shows a trail or aura on a mannequin before the
player buys it. They can drag to turn it around, and **Stop Previewing** ends the
preview.

The preview needs a character `Model` named **`Rig`** in the Workspace, with a
`HumanoidRootPart`. The mannequin wears the player's own avatar, and only they can
see it. Both buttons are optional.
