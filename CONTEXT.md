# Tempered

Tempered is a poker-inspired apparel brand. This repo holds its online shop and the brand's design system.

## Language

**Storefront**:
The customer-facing shop that shoppers browse and buy from.
_Avoid_: site, website, frontend

**Engine**:
The commerce backend that owns products, collections, carts, checkout and orders.
_Avoid_: backend, API, server

**Design system**:
Tempered's brand rules, tokens and component specs. It is the authority on how the Storefront looks.
_Avoid_: the design, style guide, theme

**Theme**:
One of the Storefront's selectable visual skins. Tempered is delivered as the default Theme.
_Avoid_: skin, template

**Night**:
Tempered's dark colour scheme and the only one the Storefront uses at launch.
_Avoid_: dark mode

**Bone**:
Tempered's light colour scheme, reserved for editorial pages. It is not used at launch.
_Avoid_: light mode

**Collection**:
A hand-picked group of products released together, such as War. Shoppers see it called a **Drop** (the Drops page, "War drop"); in code and in the Engine it is a Collection, under the Drops parent.
_Avoid_: line, category; "collection" in shopper-facing copy

**Category**:
A broad kind of clothing: Tops, Bottoms, Outerwear, Accessories. Exactly one per product, from a Category Tag, never by hand-placing it. Each Category has its own page; Categories fill the footer's Shop column and the homepage tiles, and are a listing filter.
_Avoid_: collection, department, type

**Type**:
The specific garment within a Category: Tees and Hoodies (Tops), Joggers (Bottoms), Hats (Accessories). Exactly one per product, from a Type Tag. A listing filter, never a page of its own.
_Avoid_: category, subcategory, kind

**Tag**:
A label on a product that places it, such as Category: Tops or Type: Tees.
_Avoid_: facet (the Engine's word), attribute

**Badge**:
A product's one highlight on its card, New or Limited, set in the Engine as a Badge facet value. "Sold out" is never set by hand; it comes from stock.
_Avoid_: tag, label, ribbon

**Story page**:
A brand page, such as Our Story, that is not a product group. It may share a Collection's tile look.
_Avoid_: collection, about page
