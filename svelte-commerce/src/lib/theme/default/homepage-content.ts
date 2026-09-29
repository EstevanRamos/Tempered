import type { ThemeHomepageContent } from '../types.js'
import { taxonomy } from '$lib/core/connectors/taxonomy'

export const defaultContent: ThemeHomepageContent = {
  description: "Poker-born apparel for people who treat the table as a discipline. Master yourself before you master the table.",
  hero: {
    badge: "Featured Store",
    titleLead: "Shop",
    titleAccent: "Fresh Finds",
    titleRest: "Every Day",
    text: "Discover featured products, curated collections, and a smooth shopping experience.",
    primaryCta: "Shop Products",
    secondaryCta: `Browse ${taxonomy.many}`,
    bgText: "SHOP",
    image: "",
    imageAlt: "Store featured visual",
    stats: [],
    floatingCards: []
  },
  ticker: [],
  category: {
    label: taxonomy.many,
    titleLead: "Browse by",
    titleAccent: taxonomy.one,
    text: `Explore product ${taxonomy.manyLower} from the store catalogue.`,
    emptyTitle: `No ${taxonomy.manyLower} available`,
    emptyText: `${taxonomy.many} will appear here when they are returned by the API.`
  },
  about: {
    label: "About",
    titleLead: "About",
    titleAccent: "Our Store",
    text: "A modern ecommerce storefront for curated products, smooth browsing, and secure checkout.",
    primaryImage: "",
    secondaryImage: "",
    primaryImageAlt: "Store image",
    secondaryImageAlt: "Store detail",
    experienceValue: "",
    experienceText: "",
    cta: "Shop Now",
    features: []
  },
  menu: { label: "Featured", titleLead: "Popular", titleAccent: "Products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API.", cta: "Shop products" },
  special: { label: "Offer", titleLead: "Featured", titleAccent: "Deal", text: "", cta: "Shop offer", image: "", imageAlt: "Featured offer", oldPrice: "", price: "" },
  gallery: { label: "Gallery", titleLead: "Featured", titleAccent: "Looks", items: [] },
  history: { label: "Story", titleLead: "Our", titleAccent: "Journey", items: [] },
  chefs: { label: "Team", titleLead: "Meet Our", titleAccent: "Team", items: [] },
  hours: { label: "Hours", titleLead: "We Are", titleAccent: "Open", rows: [], orderTitle: "Order Online", orderText: "", orderCta: "Shop Now", locationTitle: "Find Us", address: "", phone: "", email: "" },
  testimonials: { label: "Testimonials", titleLead: "What People", titleAccent: "Say", items: [] },
  reservation: { label: "Contact", titleLead: "Get in", titleAccent: "Touch", text: "", panelTitle: "Contact Info", panelText: "", hoursLabel: "Opening Hours", phoneLabel: "Phone", groupLabel: "Group", locationLabel: "Location", hours: "", phone: "", group: "", location: "", cta: "Submit" },
  blog: { label: "Updates", titleLead: "Latest", titleAccent: "News", items: [] },
  newsletter: { label: "Stay Connected", titleLead: "Subscribe for", titleAccent: "Updates", text: "Subscribe for new arrivals, offers, and store updates.", cta: "Subscribe", privacy: "No spam, unsubscribe anytime." },
  // Announcement bar above the nav; admin overrides merge over this (blank = keep default,
  // hideAnnouncement: true = bar off).
  header: {
    announcement: "Take 10% off your order with code TEMPERED10",
    announcementHref: "/products"
  },
  footer: {
    columns: [
      {
        title: "Shop",
        links: [
          { label: "Products", href: "/products" },
          { label: "Collections", href: "/collections" },
          { label: "Categories", href: "/categories" }
        ]
      },
      {
        // Dedicated routes, not the /p/<slug> CMS variant: /p/return-policy never existed
        // and the other two duplicated a self-canonical page.
        title: "Support",
        links: [
          { label: "Contact Us", href: "/contact-us" },
          { label: "Shipping Policy", href: "/shipping-policy" },
          { label: "Refund Policy", href: "/refund-policy" },
          { label: "FAQs", href: "/faqs" }
        ]
      },
      {
        title: "Company",
        links: [
          { label: "About Us", href: "/about-us" },
          { label: "Blog", href: "/blog" },
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Terms & Conditions", href: "/terms-and-conditions" }
        ]
      }
    ]
  },
  contact: { label: "Contact", titleLead: "Contact", titleAccent: "Us", text: "", panelTitle: "Let us talk", panelText: "", addressLabel: "Address", phoneLabel: "Phone", emailLabel: "Email", hoursLabel: "Working Hours", address: "", phone: "", email: "", hours: "", cta: "Send Message" },
  defaultHome: { eyebrow: "New season picks", primaryCta: "Shop Products", secondaryCta: `Browse ${taxonomy.many}`, featuredLabel: "Featured", featuredTitle: "Popular products", emptyTitle: "No products available", emptyText: "Products will appear here when they are returned by the API." },
  // Tempered (the 2026-09 homepage redesign): hero, the collection spotlight, Choose your seat, The
  // Code, the manifesto and the quote. The assurances live on the product page, beside Add to bag.
  tempered: {
    hero: {
      eyebrow: "Discipline builds freedom",
      title: "Tempered",
      tagline: "Master yourself before you master the table.",
      text: "Heavyweight luxury streetwear for poker players, high-stakes strategists and minds forged in self-control.",
      cta: "Shop now",
      href: "/products",
      secondaryCta: "Featured collections",
      secondaryHref: "#collections",
      image: "/tempered/hero.webp",
      imageSmall: "/tempered/hero-1000.webp",
      imageAlt: "",
      values: ["Poker", "Discipline", "Character", "Purpose", "A higher standard"]
    },
    collection: {
      eyebrow: "The collection",
      title: "Built to be worn hard",
      text: "Heavyweight essentials, cut boxy and made to outlast the session.",
      viewPiece: "View piece",
      cta: "Shop this collection",
      href: "/products",
      notes: {
        "classic-logo-tee": "Washed black · Heavyweight",
        "elephant-arch-tee": "Washed black · Oversized print",
        "war-edition-tee": "Black · Limited run",
        "classic-joggers": "Heather grey · Fleece"
      }
    },
    seats: {
      eyebrow: "Collections",
      title: "Choose your seat",
      tiles: {
        war: { subtitle: "Limited edition", image: "/tempered/seat-war.webp" },
        tees: { subtitle: "Heavyweight cotton", image: "/tempered/seat-tees.webp" },
        joggers: { subtitle: "Fleece essentials", image: "/tempered/seat-joggers.webp" }
      }
    },
    code: {
      eyebrow: "The code",
      link: "Our philosophy",
      href: "/our-story",
      items: [
        { numeral: "I", title: "Patience", text: "Wait for the right hand. Most of the game is folding." },
        { numeral: "II", title: "Discipline", text: "The rules you keep when nobody is watching." },
        { numeral: "III", title: "Character", text: "Revealed under pressure, never announced." },
        { numeral: "IV", title: "Purpose", text: "Every chip placed for a reason." },
        { numeral: "V", title: "Control", text: "Master yourself before you master the table." }
      ]
    },
    manifesto: {
      eyebrow: "A different breed",
      title: "More than a game.",
      text: "Poker is a mirror. It reveals character, tests discipline and demands control. We make apparel for those committed to a higher standard.",
      cta: "Our story",
      href: "/our-story",
      image: "/tempered/breed-hand.webp",
      imageAlt: "A hand resting on a stack of poker chips"
    },
    quote: { text: "The table doesn’t build character. It reveals it.", signoff: "Play with purpose" },
    story: {
      seoTitle: "Our story",
      seoDescription: "Tempered is poker-born apparel for people who treat the table as a discipline. More than a game: patience, control and a higher standard.",
      hero: {
        eyebrow: "Our story",
        title: "More than a game.",
        text: "Poker isn't just cards. It's a mirror. It reveals character, tests discipline and demands control.",
        image: "/tempered/hero-elephant.webp",
        imageAlt: "An elephant wearing a gold crown"
      },
      chapters: [
        {
          eyebrow: "The table",
          title: "Discipline builds freedom.",
          text: [
            "The table rewards the player who waits. Who folds without regret, holds without fear and acts only when it counts.",
            "That is the whole idea. Master yourself, and the rest follows."
          ],
          image: "/tempered/story-hand.webp",
          imageAlt: "A hand resting on a stack of poker chips"
        },
        {
          eyebrow: "The fight",
          title: "Poker is war.",
          text: [
            "Every hand is a battle, and the first opponent is the one in your own seat. Win that one and the table follows.",
            "We make apparel for those committed to a higher standard: heavyweight, cut to be worn hard, marked with the crowned elephant."
          ],
          image: "/tempered/tile-war.webp",
          imageAlt: "A spartan warrior in shadow"
        }
      ],
      values: ["Patience", "Discipline", "Self-mastery", "Control", "Freedom"],
      quote: { text: "Master yourself before you master the table.", signoff: "Play with purpose" },
      close: {
        eyebrow: "The collection",
        title: "Wear the standard.",
        text: "Tees, joggers and limited drops, made for the long session.",
        cta: "Shop all",
        href: "/products"
      }
    },
    // Beside Add to bag on the product page, where the shopper decides. Keep them true to what
    // checkout does: shipping is Standard or Express, priced at checkout.
    assurances: [
      { icon: "truck", title: "Shipping", text: "Standard or express, priced at checkout." },
      { icon: "returns", title: "Returns", text: "Seven days to send it back." },
      { icon: "shield", title: "Secure payment", text: "Encrypted from bag to receipt." }
    ]
  }
}
