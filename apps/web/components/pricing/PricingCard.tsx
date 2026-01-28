"use client";

import Link from "next/link";

const PRICING_TIERS = [
  {
    id: "premium",
    name: "Premium",
    price: { monthly: 7, yearly: 70 },
    features: [
      "Unlimited public and private blocks",
      "Advanced search filters",
      "Pin blocks to top of channels",
      "Full text for links and articles",
      "Presentation mode",
      "Table view",
      "Hide from search engines",
      "Priority support",
    ],
    excluded: [
      "Early access to new features",
      "Complimentary Annual",
      "Bi-annual company reports",
      "The fuzzy feeling of giving a little extra",
    ],
  },
  {
    id: "supporter",
    name: "Supporter",
    price: { monthly: null, yearly: 120 },
    features: [
      ...PRICING_TIERS[0].features,
      "Early access to new features",
      "Complimentary Annual",
      "Bi-annual company reports",
      "The fuzzy feeling of giving a little extra",
    ],
    excluded: PRICING_TIERS[0].excluded,
  },
  {
    id: "guest",
    name: "Guest",
    price: { monthly: 0, yearly: 0 },
    features: ["Good option to test Boerd", "Up to 200 total blocks"],
    excluded: [
      ...PRICING_TIERS[0].excluded,
      "Most features",
      "Group usage",
      "Export channels",
    ],
  },
];

const FAQS = [
  {
    q: "What happens if I hit the block limit?",
    a: "If you reach the 200 block limit, you can still view your existing content, but won't be able to add new blocks. Consider upgrading to Premium or Supporter for unlimited blocks.",
  },
  {
    q: "Can I pay month-to-month?",
    a: "Yes! Premium is available at $7/month. There's no annual commitment.",
  },
  {
    q: "Do you have discounts for students or educators?",
    a: "Yes, we offer 50% off for verified students and educators. Contact us at support@boerd.xyz with proof of enrollment.",
  },
];

interface PricingCardProps {
  tier: (typeof PRICING_TIERS)[number];
}

export function PricingCard({ tier }: PricingCardProps) {
  return (
    <div className="flex flex-col p-6 border border-zinc-800 bg-black rounded-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">{tier.name}</h3>
          {tier.price.yearly && (
            <p className="text-zinc-600 text-sm">{tier.price.yearly} / year</p>
          )}
          {tier.price.monthly && (
            <p className="text-zinc-600 text-sm">
              {tier.price.monthly} / month
            </p>
          )}
        </div>
        <Link
          href="/signup"
          className="bg-[#6B8E6B] text-white px-4 py-2 rounded-md hover:bg-[#7BA27] transition-colors font-medium"
        >
          Get {tier.name}
        </Link>
      </div>

      {/* Features */}
      <div className="space-y-2 mb-6">
        {tier.features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-zinc-300 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* Excluded features */}
      {tier.excluded.length > 0 && (
        <div className="space-y-2 mb-6">
          {tier.excluded.map((feature) => (
            <div key={feature} className="flex items-start gap-2">
              <span className="text-red-600 text-lg">✗</span>
              <span className="text-zinc-400 text-sm">{feature}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
