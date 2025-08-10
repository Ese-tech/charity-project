// client/src/components/mock.ts
export const mockData = {
  navigation: {
    logo: "World Vision",
    menuItems: [
      { name: "Donate", href: "/donate", highlighted: true },
      { name: "Sponsor a Child", href: "/sponsor", highlighted: true },
      { name: "Gift Catalog", href: "/gifts" },
      { name: "About Us", href: "/about" },
      { name: "Our Work", href: "/work" },
      { name: "Ways to Help", href: "/help" },
      { name: "News & Stories", href: "/news" },
      { name: "Partnerships", href: "/partnerships" }
    ]
  },
  
  hero: {
    title: "Together we're making lifesaving impact in the places it's hardest to be a child.",
    subtitle: "For 75 years, we've helped the world see vulnerable children through the eyes of Jesus.",
    ctaText: "DONATE NOW",
    backgroundImage: "https://images.unsplash.com/photo-1542315099045-93937d70c67a",
    partnershipText: "Partners in global ministry",
    partnershipCta: "Learn more"
  },

  childSponsorship: {
    title: "Child sponsorship",
    description: "Last year, World Vision sponsors worldwide supported 2.9 million sponsored children, including 859,000 supported by U.S. sponsors.",
    ctaText: "Sponsor a child",
    image: "https://images.unsplash.com/photo-1540479859555-17af45c78602?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxjaGlsZHJlbnxlbnwwfHx8fDE3NTQ0MDM5MTR8MA&ixlib=rb-4.1.0&q=85",
    stats: {
      totalSponsored: "2.9 million",
      usSponsored: "859,000"
    }
  },

  disasterRelief: {
    title: "Disaster relief",
    description: "In 2024, we responded to 14 emergencies here in the U.S. and 84 more worldwide.",
    ctaText: "Donate now",
    image: "https://images.unsplash.com/photo-1728320771441-17a19df0fe4c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxkaXNhc3RlciUyMHJlbGllZnxlbnwwfHx8fDE3NTQ0MDM5MjB8MA&ixlib=rb-4.1.0&q=85",
    stats: {
      usEmergencies: "14",
      worldwideEmergencies: "84"
    }
  },

  partners: [
    { name: "Global Leadership Network", logo: "/api/placeholder/120/60" },
    { name: "Thrive", logo: "/api/placeholder/120/60" },
    { name: "Partnership Logo", logo: "/api/placeholder/120/60" }
  ],

  footer: {
    sections: [
      {
        title: "Ways to Give",
        links: ["One-time donation", "Monthly giving", "Legacy gifts", "Gift catalog", "Donate stock"]
      },
      {
        title: "Get Involved", 
        links: ["Sponsor a child", "Volunteer", "Advocate", "Partner with us", "Corporate partnerships"]
      },
      {
        title: "About Us",
        links: ["Our mission", "Leadership", "Financials", "Careers", "Contact us"]
      },
      {
        title: "Resources",
        links: ["News & stories", "Research", "Publications", "Media center", "Faith & development"]
      }
    ],
    socialMedia: [
      { name: "Facebook", icon: "facebook" },
      { name: "Twitter", icon: "twitter" },
      { name: "Instagram", icon: "instagram" },
      { name: "YouTube", icon: "youtube" }
    ],
    copyright: "© 2025 World Vision, Inc. All rights reserved.",
    mission: "World Vision is a Christian humanitarian organization dedicated to working with children, families, and their communities worldwide to reach their full potential by tackling the causes of poverty and injustice."
  },

  // Form mock data for interactions
  forms: {
    donationAmounts: [25, 50, 100, 250, 500, 1000],
    sponsorshipInfo: {
      monthlyAmount: 39,
      description: "Your monthly gift provides a sponsored child with access to clean water, healthcare, education, and economic opportunities."
    }
  }
};