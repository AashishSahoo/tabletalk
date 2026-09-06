# Design notes

**Subject**: a feedback card a diner fills in right at the table, and the
admin console a restaurant owner checks between shifts. The product's whole
job is to feel like a printed receipt, not a SaaS dashboard.

## Palette
| Token | Hex | Role |
|---|---|---|
| `ivory` | `#FBF7F0` | App background, customer page |
| `espresso` | `#241C12` | Admin sidebar, primary buttons, headline text |
| `saffron.500` | `#E8A33D` | Stars, primary accent, the one "hero" color |
| `pine.600` | `#2F4538` | Positive/success states (fresh herb, not neon green) |
| `clay.500` | `#B5533C` | Errors/destructive actions only |

## Type
- **Fraunces** (serif, warm, a little editorial) for the restaurant name,
  page titles and headline numbers — it reads like menu/receipt typography,
  not a generic tech display face.
- **Inter** for all UI chrome, labels, and body copy, so nothing fights for
  attention against the serif headline.

## Layout concept: the "ticket"
Every primary card (`.ticket-card`) carries a solid saffron bar across its
top edge and a slightly heavier shadow than a typical flat SaaS card — a
nod to a printed receipt/order ticket rather than a rounded dashboard
widget. The customer flow is a single centered ticket; the admin dashboard
reuses the same card for stats and restaurant records so the two surfaces
feel like one product.

## Motion
Motion is reserved for direct responses to a tap: a star "pops" when
selected (`animate-pop-in`), suggestion panels rise in once a rating is
picked (`animate-rise-in`), and skeletons shimmer while data loads. Nothing
animates on scroll or on a timer.
