# Ticket Shop

The ticket shop sells permanent Tools, Trails, and Auras. Configure it in `ReplicatedStorage > Shared > Config > Economy`, under `shop`.

## Add An Item

Every item is one table keyed by a stable item ID:

```luau
GravityCoil = {
	name = "Gravity Coil",
	description = "A permanent movement tool.",
	price = 75,
	category = "Items",
	rarity = "Rare",
	icon = "rbxassetid://16619617",
	template = "Gravity Coil",
}
```

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `name` | `string` | — | Name shown to players. |
| `description` | `string` | — | Text shown in `InfoModal`. |
| `price` | `number` | — | Positive whole-number ticket cost. |
| `category` | `string` | — | `Items`, `Trails`, or `Auras`. |
| `rarity` | `string` | — | `Uncommon`, `Rare`, `Epic`, `Legendary`, or `Mythic`. |
| `icon` | `string` | — | Roblox image string. Use `rbxassetid://0` when the template supplies its own art. |
| `template` | `string` | none | Optional Tool name. If omitted, the item's display `name` is used. |
| `featuredOnly` | `boolean` | `false` | Optional. Keeps the item out of All and shows it only in the featured Items list. |

There are no separate grant tables or enable switches:

- `Items` grants the matching Tool from `ServerStorage > TicketShopItems > Tools`.
- `Trails` unlocks the cosmetic with the same item ID under `Economy > cosmetics > Trails`.
- `Auras` unlocks the cosmetic with the same item ID under `Economy > cosmetics > Auras`.
- Removing an item from `shop > items` removes it from sale.

Keep item IDs stable after release because ownership saves those IDs.

## Featured Rotation

```luau
featured = {
	refreshMinutes = 60,
	itemCount = 4,
	categories = { "Trails", "Auras", "Items" },
}
```

The rotation uses the same time window for every server. It selects from the
listed categories and refreshes on the configured minute boundary.

Because the window is a division of the clock rather than a timer, every server
works out the same boundary on its own — they rotate together without anything
having to coordinate them. Players are told 30 seconds before, and again when it
happens; both lines are in `Config > Messages.shopRotation`.

## Existing UI

The kit uses the UI already present in Studio and does not create fallback menus.

```text
ShopMenu
  InfoModal
    InfoName
    InfoPrice
    DescriptionFrame
      Description
      Rarity
      Type
    Options
      Purchase
      Preview
      Cancel
  AllList
    TrailsList
      Template
    AurasList
      Template
    ItemsList
      Template
  FeaturedList
    CountdownFrame
      Fill
      CountdownLabel
    FeatureList
      Template
    ItemsList
      Template
    GamepassList
      Template
        NameLabel
        BuyButton
```

Ticket-item buttons open `InfoModal`. `Purchase` performs one atomic, idempotent Scribe purchase and `Cancel` closes the modal. Repeated requests for the same permanent item do not spend tickets twice, and owned items cannot be purchased again.

`Preview` is optional. Add a `GuiButton` of that name to `Options` and the kit shows it for a trail or an aura and hides it for anything else — an Item is a Tool and a game pass is a perk, and there is nothing to stand a mannequin in front of. See [Previewing a cosmetic](./cosmetics.md#previewing-a-cosmetic).

`FeaturedList > GamepassList` is reserved for passes. Its `Template` must be an `ImageLabel`; Roblox supplies each pass image, name, description, price, and sale state. See [Game Passes](./game-passes.md).

## Asset Locations

```text
ServerStorage
├─ TicketShopItems
│  └─ Tools
│     └─ Gravity Coil  -- an Items entry's template
└─ Cosmetics
   ├─ Trails
   └─ Auras
```

Purchased Trails and Auras are unlocked permanently but are equipped from the Cosmetics menu.

## Troubleshooting

| Issue | Fix |
| :-- | :-- |
| Item is missing | Check that its entry is under `Economy > shop > items` and its category is spelled exactly. |
| Tool purchase fails | Match `template` to a Tool in `ServerStorage > TicketShopItems > Tools`. |
| Cosmetic purchase fails | Give the shop item and cosmetic the same ID under the matching category. |
| Last list item is clipped | Keep a `UIListLayout` in the list; the kit updates `CanvasSize` from `AbsoluteContentSize`. |

## See Also

- [Configuration Reference: Economy](./configuration.md#economy)
- [Tickets](./tickets.md)
- [Cosmetics](./cosmetics.md)
- [Tower Setup plugin: Shop](./tower-setup-plugin.md#shop)
