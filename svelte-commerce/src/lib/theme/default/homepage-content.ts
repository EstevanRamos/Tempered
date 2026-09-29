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
  // Tempered (design/homepage): hero, tiles, featured products, manifesto, quote. The marquee and
  // lookbook are gone; the assurances live on the product page, beside Add to bag.
  tempered: {
    hero: {
      eyebrow: "Discipline builds freedom",
      title: "Tempered",
      text: "Master yourself before you master the table.",
      cta: "Shop now",
      href: "/products",
      image: "/tempered/hero-elephant.webp",
      imageAlt: "An elephant wearing a gold crown",
      values: ["Poker", "Discipline", "Character", "Purpose", "A higher standard"]
    },
    tiles: {
      shopAll: { title: "Shop all", cta: "Shop", image: "/tempered/tile-apparel.webp" },
      collection: { cta: "Explore" },
      story: { title: "Our story", subtitle: "More than a game", cta: "Learn more", href: "/our-story", image: "/tempered/tile-story.webp" }
    },
    featured: { title: "Featured collection", viewAll: "View all", viewAllHref: "/products" },
    manifesto: {
      eyebrow: "A different breed",
      title: "More than a game.",
      text: "Tempered is for those who understand that poker isn't just cards. It's a mirror. It reveals character, tests discipline and demands control. We make apparel for those committed to a higher standard.",
      cta: "Our philosophy",
      href: "/our-story",
      image: "/tempered/story-hand.webp",
      imageAlt: "A hand resting on a stack of poker chips",
      values: ["Patience", "Discipline", "Self-mastery", "Control", "Freedom"]
    },
    quote: { text: "Master yourself before you master the table.", signoff: "Play with purpose" },
    // Beside Add to bag on the product page, where the shopper decides. Keep them true to what
    // checkout does: shipping is Standard or Express, priced at checkout.
    assurances: [
      { icon: "truck", title: "Shipping", text: "Standard or express, priced at checkout." },
      { icon: "returns", title: "Returns", text: "Seven days to send it back." },
      { icon: "shield", title: "Secure payment", text: "Encrypted from bag to receipt." }
    ]
  }
}
