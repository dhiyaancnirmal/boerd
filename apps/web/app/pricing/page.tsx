import type { Metadata } from "next";
import "./globals.css";
import { PricingCard } from "@/components/pricing/PricingCard";
import { FaqItem } from "@/components/pricing/FaqItem";

export const metadata = {
  title: "Pricing",
  description: "Compare pricing plans for Boerd",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Pricing</h1>
        <p className="text-lg text-zinc-300 mb-12">
          Choose the plan that fits your needs. All plans include core Boerd
          features. Upgrade or downgrade anytime.
        </p>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <PricingCard tier={0} />
          <PricingCard tier={1} />
          <PricingCard tier={2} />
        </div>

        {/* Group Usage */}
        <div className="mb-8 mt-8 pt-8 border-t border-zinc-800">
          <p className="text-center text-zinc-600">
            Do you use Boerd with a group?{" "}
            <Link
              href="/pricing/groups"
              className="text-[#6B8E6B] hover:underline"
            >
              Learn how upgrading group members works
            </Link>
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-4">Pricing FAQs</h2>
          <FaqItem
            question="What happens if I hit the block limit?"
            answer="If you reach the 200 block limit, you can still view your existing content, but won't be able to add new blocks. Consider upgrading to Premium or Supporter for unlimited blocks."
          />
          <FaqItem
            question="Can I pay month-to-month?"
            answer="Yes! Premium is available at $7/month. There's no annual commitment."
          />
          <FaqItem
            question="Do you have discounts for students or educators?"
            answer="Yes, we offer 50% off for verified students and educators. Contact us at support@boerd.xyz with proof of enrollment."
          />
        </div>
      </main>
    </div>
  );
}
