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
A hand-picked group of products released together, such as the War collection. Shoppers see it called a "Drop". A product belongs to at most one Collection, and past Collections stay browsable. Collections drive the homepage tiles.
_Avoid_: line, category (and "drop" anywhere but shopper-facing copy)

**Category**:
A broad kind of clothing, such as Tops, Bottoms, Outerwear or Accessories. Every product has exactly one, given by a Tag, never by hand-placing it. Categories drive the Shop filters and the homepage tiles, not the header.
_Avoid_: collection, department, type

**Type**:
The specific garment within a Category, such as Tees or Hoodies (both Tops) or Joggers (Bottoms). Every product has exactly one, given by a Tag. Types narrow a Category page; they are never pages of their own.
_Avoid_: category, kind, style

**Tag**:
A label on a product that gives its Category or its Type, such as Category: Tops or Type: Tees.
_Avoid_: facet (the Engine's word), attribute

**Badge**:
A product's one highlight on its card, New or Limited, set in the Engine as a Badge facet value. "Sold out" is never set by hand; it comes from stock.
_Avoid_: tag, label, ribbon

**Story page**:
A brand page, such as Our Story, that is not a product group. It may share a Collection's tile look.
_Avoid_: collection, about page
