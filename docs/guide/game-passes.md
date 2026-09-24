# Game Passes

Configure passes in `ReplicatedStorage > Shared > Config > GamePasses`.

The kit supports any number of tool passes, one built-in VIP pass, and the built-in Personal Servers pass. Tool passes use a copyable template rather than shipping as active passes. It is intentionally not a generic reward engine: each pass uses one clear `kind` so its behavior is easy to understand.

## Included Passes

```luau
return {
	VIP = {
		id = 0,
		kind = "VIP",
		ticketMultiplier = 1.25,
		trail = "VIPTrail",
		chatTag = "VIP",
		tickets = 200,
		-- giftProductId = 1234567890,
	},

	PersonalServers = {
		id = 0,
		kind = "PersonalServers",
		-- giftProductId = 1234567890,
	},
}
```

Both ship with `id = 0`, which is off: nothing is sold and nothing is granted until you create the pass in your experience's **Monetization > Passes** and put its ID in. One you do not sell is better set to `disabled = true`, which also stops the Output reminding you about it at startup. To let a pass be gifted, uncomment `giftProductId` and put a developer product of yours there.

These are the only built-in entries. The table key is the stable name Scribe uses for ownership and one-time rewards. Do not rename a live pass key.

`disabled = true` removes an entry from Scribe, the Shop, ownership checks, and rewards. Personal Servers is active by default and controls who can create a server; joining another owner's code does not require the pass.

## Add A Tool Pass

Copy the commented `Tool` template and change three values:

```luau
MyToolPass = {
	id = 1234567890,
	kind = "Tool",
	tool = "My Tool",
},
```

Then put the matching Tool here:

```text
ServerStorage
└─ TicketShopItems
   └─ Tools
      └─ My Tool  -- named exactly as tool says
```

The `tool` value must match the Tool name exactly. The kit gives one permanent copy, restores it after respawn, and avoids duplicate copies in the Backpack, character, and StarterGear.

Add as many separate `Tool` entries as needed. A player who owns several of them receives each matching Tool.

## VIP Benefits

Only the `VIP` kind uses these fields:

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `ticketMultiplier` | `number` | required | Multiplies tower-completion ticket rewards. `1` leaves them as they are. |
| `trail` | `string` | required | Unlocks this Trail from `Config > Economy > cosmetics > Trails`. |
| `chatTag` | `string` | required | Uses this tag from `Config > Chat > tags > styles`. |
| `tickets` | `number` | required | Gives this many tickets once per account. `0` gives none. |

All four are required, so a VIP entry missing one is a type error in Studio. A
`trail` or `chatTag` that names nothing is reported in the Output window when
the server starts, and owners get nothing for it.

The included VIP config grants a `1.25x` ticket multiplier, `VIPTrail`, the `VIP` chat tag, and exactly `200` tickets once.

## Live Shop Details

For every active pass, Roblox supplies the live:

- name;
- description;
- image;
- Robux price; and
- sale state.

You do not copy those values into the config. The Shop hides a pass when Roblox reports that it cannot be sold in the current experience. Existing owners still receive benefits from an active config entry even when the pass is no longer for sale.

The rows are drawn from the templates already in your menu:

```text
ShopMenu
├─ FeaturedList
│  └─ GamepassList
│     └─ Template      -- an ImageLabel, copied per pass
│        ├─ NameLabel
│        └─ BuyButton  -- opens InfoModal
└─ InfoModal
   ├─ InfoName
   ├─ InfoPrice
   ├─ DescriptionFrame
   │  ├─ Description
   │  ├─ Rarity        -- hidden for a pass
   │  └─ Type
   ├─ Options
   │  ├─ Purchase
   │  ├─ Gift          -- optional; shown on game passes only
   │  └─ Cancel
   └─ GiftingFrame     -- optional; replaces DescriptionFrame while open
      ├─ RecipientBox  -- TextBox: the username
      └─ MessageBox    -- TextBox: an optional note
```

The kit uses this existing UI and does not create fallback instances. `BuyButton` opens `InfoModal`; the modal shows `Type: GamePass`, hides Rarity, and displays the live product information.

A pass's `BuyButton` in the list looks and behaves the same whether or not the player owns it: it shows the price and opens the modal. Ownership shows in the modal, where `Purchase` reads `OWNED` and does nothing.

`Purchase` opens Roblox's purchase prompt. After a successful purchase, Scribe refreshes authoritative ownership on the server and applies the benefit immediately. `Cancel` only closes the modal.

## Gifting A Pass

Players can buy a pass for somebody else, with a short note.

**Roblox cannot buy a game pass for another player**, so a gift is a developer
product that grants the pass. Scribe treats the two as one ownership: a gifted
VIP is VIP to every check the kit makes -- the trail, the tickets, the chat tag,
the multiplier.

To make a pass giftable:

1. In the Creator Dashboard, open your experience's **Monetization > Developer
   Products** and create one, priced the same as the pass.
2. Put its ID on the pass in `Config > GamePasses`:

```luau
VIP = {
	id = 1234567890,
	kind = "VIP",
	-- ...
	giftProductId = 1234567890,
},
```

A pass without `giftProductId` shows no Gift button, and that is the only switch.

**In the shop**, a giftable pass's modal shows **Gift**. The first click opens
`GiftingFrame` in place of `DescriptionFrame` -- `InfoName` and `InfoPrice` stay
-- and the second click sends. Owning the pass yourself does not stop you gifting
it.

**What Scribe handles**, so the kit does not:

- It records who the gift is for **before any money moves**, and delivers it
  whenever the recipient next plays, on any server.
- Gifting a pass to somebody who already bought it is refused before the prompt.
- If they got it some other way before the gift landed, the buyer keeps the gift
  as a **credit**: their next gift of that pass is free and opens no prompt.
- One sender waits a few seconds between gifts, and after backing out of a
  purchase waits about two minutes before gifting that pass again, because a
  late receipt could otherwise go to the wrong person.

**The note** travels separately, because Scribe gifts carry no message. It is
checked against Roblox's text filter, only sent from an account allowed to chat,
and only sent once the purchase actually went through. It is capped at 100
characters, and the username at 20.

Every line the buyer and the recipient read is in `Config > Messages` under
`gifts`.

::: warning Test with a real product
A Studio test purchase needs a developer product that belongs to the experience.
A made-up ID makes Roblox refuse the prompt, which the kit reports as a
cancelled gift.
:::

## Troubleshooting

| Issue | Check |
| :-- | :-- |
| Pass is missing from the Shop | Confirm the entry is not disabled and Roblox reports it for sale in this experience. |
| Tool is not granted | Match `tool` to a Tool in `ServerStorage > TicketShopItems > Tools`; check the server Output warning. |
| VIP Trail is missing | Match `trail` to both the Economy cosmetic ID and the asset under `ServerStorage > Cosmetics > Trails`. |
| VIP tag is missing | Match `chatTag` to an entry in `Config > Chat > tags > styles`. |
| One-time tickets grant again | Keep the pass table key unchanged after release. |
| Personal Server cannot be created | Confirm the pass is active, then configure the destination in `Config > Worlds`. Teleports require a published Roblox app test. |
| No Gift button | The pass needs a `giftProductId`, and `InfoModal` needs a `Gift` TextButton and a `GiftingFrame` holding `RecipientBox` and `MessageBox`. |
| Every gift says it was cancelled | `giftProductId` is not a developer product of this experience, so Roblox refuses the prompt. |

See [Worlds, Areas & Personal Servers](/guide/worlds-personal-servers) and Roblox's official [Passes guide](https://create.roblox.com/docs/production/monetization/passes).

## See Also

- [Configuration Reference: GamePasses](./configuration.md#gamepasses)
- [Worlds, Areas & Personal Servers](./worlds-personal-servers.md)
- [Tickets](./tickets.md)
- [Tower Setup plugin: Rewards](./tower-setup-plugin.md#rewards)
