# Tickets

Tickets are awarded for clean Normal-mode tower completions. All ticket setup is in `ReplicatedStorage > Shared > Config > Economy`, under `tickets`.

```luau
tickets = {
	cooldownDays = 7,
	rewards = {
		Easy = 5,
		Hard = 10,
		Insane = 250,
	},

	-- Optional settings for individual towers.
	perTower = {
		ToH = { multiplier = 2 },
		ToE = { multiplier = 1.5, allowRebeats = true },
	},
}
```

`rewards` is keyed by **difficulty name**, not by rating, so a difficulty you
rename needs renaming here too. The ladder the kit ships roughly doubles each
step and then stops:

| Easy | Medium | Hard | Difficult | Challenging | Intense | Remorseless |
| --: | --: | --: | --: | --: | --: | --: |
| 5 | 5 | 10 | 10 | 20 | 50 | 150 |

| Insane | Extreme | Terrifying | Catastrophic | Horrific | Unreal | Nil |
| --: | --: | --: | --: | --: | --: | --: |
| 250 | 550 | 1125 | 2250 | 0 | 0 | 0 |

The top three pay nothing on purpose: at that point a fangame usually has no
towers there yet, and a `0` is how you say "no reward" rather than leaving the
name out.

## When Tickets Are Awarded

A player receives tickets when:

- the run is in Normal mode;
- the winpad is the tower's own ending, not one with an `EndingID` of its own;
- no boost item was used;
- the difficulty has a reward greater than `0`; and
- the tower is not on cooldown, unless `allowRebeats` is enabled for it.

Practice, All Jumps, and tower-rush wins do not award tower tickets.

Tickets as a whole are switched by `enabled.tickets` in `Config > Economy`.
Off means no tickets for a win, no ticket counter, and no shop, since the shop
has nothing to charge. What players already earned stays in their save.

## Settings

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `cooldownDays` | `number` | `7` | Days before the same player can earn tickets from the same tower again. Use `0` for no cooldown. |
| `rewards` | `{ [string]: number }` | — | Base ticket amount for each difficulty name. Use `0` for no reward. |
| `perTower` | `{ [string]: table }` | `{}` | Optional per-tower settings keyed by acronym. Leave it empty when no tower needs special behavior. |

Each `perTower` entry takes two fields:

| Field | Type | Default | Purpose |
| :-- | :-- | :-- | :-- |
| `multiplier` | `number` | `1` | Multiplies that tower's base reward. |
| `allowRebeats` | `boolean` | `false` | Pays out on every valid completion, ignoring the cooldown. |

::: tip A tower can carry these itself
Set `TicketMultiplier` or `AllowRebeats` on the tower folder and it needs no
entry here. The attribute wins over `perTower`. See [What goes in code and what
goes on the tower](./tower-setup.md#what-goes-in-code-and-what-goes-on-the-tower).
:::

A difficulty name missing from `rewards` pays nothing, the same as a `0`.

## How A Payout Is Built

Three multipliers stack, in this order:

```text
rewards[difficulty]          the base for the difficulty
  x  the tower type's ticketMultiplier    Citadel x2, Steeple x0.5
  x  TicketMultiplier / perTower          this one tower
  = rounded down
  x  the player's game-pass multiplier
  = rounded down again
```

**The tower type is the one people forget.** A Citadel pays double and a Steeple
half before any of your own numbers apply, so a Citadel at Insane is 500 rather
than 250. Game-pass multipliers are set separately in `Config > GamePasses`.

Ticket cooldowns use Scribe's built-in cooldown API and do not add another field to player data.

Players spend tickets in the [Ticket Shop](./ticket-shop.md).

## Where the numbers go

Every ticket earned and spent is reported to Roblox's economy analytics, so
your Creator Dashboard shows the currency flowing in against the currency
flowing out without you wiring anything up. Tower and game-pass rewards are
sources; a shop purchase is a sink.

Each event is tagged with the **Area** it happened in, which is the one
dimension the kit cannot answer any other way: a server sees only the towers in
front of it, so "which Ring pays for itself" needs the tag. The Area comes from
matching the place's own Place ID against `Config > Worlds`, and a place listed
nowhere reports as `Unlisted`.

Administrator grants through `tickets-add` are deliberately **not** reported.
A support correction is not economy activity, and counting it would put it in
the same figures you read to balance the game.

## See Also

- [Configuration Reference: Economy](./configuration.md#economy)
- [Ticket Shop](./ticket-shop.md)
- [Game Passes](./game-passes.md)
