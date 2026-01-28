import type { Metadata } from "next";
import "./globals.css";

export const metadata = {
  title: "Company",
  description: "Boerd company vision, team, and community initiatives",
};

export default function CompanyPage() {
  return (
    <div className="min-h-screen flex bg-black text-white">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <h1 className="text-4xl font-bold mb-6">Company Vision</h1>

        {/* Four Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Revenue & Strategy */}
          <div className="border-l border-zinc-800 bg-black p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Revenue & Strategy</h2>
            <ul className="space-y-3">
              <li>Reach $150K in monthly revenue by end of 2026</li>
              <li>
                Continue improving conversion portion of Premium members vs
                Active members (currently ~47%)
              </li>
              <li>
                Continue reducing infrastructure costs portion of monthly
                expenses (currently ~30%)
              </li>
            </ul>
          </div>

          {/* Ethics */}
          <div className="border-l border-zinc-800 bg-black p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Ethics</h2>
            <ul className="space-y-3">
              <li>
                Become a public benefit corporation or an alternative
                community-benefiting entity in order to legally protect our
                mission.
              </li>
              <li>
                Work to promote ad-free businesses and ethical design principles
                in tech industry.
              </li>
              <li>
                Explore possible avenues for a more cooperative membership
                structure.
              </li>
            </ul>
          </div>

          {/* Community */}
          <div className="border-l border-zinc-800 bg-black p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Community</h2>
            <ul className="space-y-3">
              <li>Create stronger community benefits for Premium members</li>
              <li>Make grants to foster creative research by Boerd members</li>
              <li>Create a structure for compensating our member-investors</li>
            </ul>
          </div>

          {/* Team */}
          <div className="border-l border-zinc-800 bg-black p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Team</h2>
            <ul className="space-y-3">
              <li>
                Our team is currently composed by four full-time people. Our
                near-term team goals are:
              </li>
              <li>Hire 2 more developers to work on product infrastructure</li>
              <li>Prioritize diversity for additional hires</li>
            </ul>
          </div>
        </div>

        {/* API and Community Projects */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">
            API and Community Projects
          </h2>
          <p className="text-lg text-zinc-300 mb-6">
            Boerd is Open Source by default and we're always excited to see
            people using the platform in new ways. You can find a list of
            projects built with Boerd and find more resources in the Boerd
            Community Dev Lounge, and browse through our API documentation.
          </p>

          {/* Flipbook Preview - Static Image */}
          <div className="border-l border-zinc-800 bg-black p-6 rounded-lg">
            <div className="aspect-[3/2] bg-zinc-900 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block px-4 py-2 border border-zinc-700 bg-black text-zinc-600 rounded text-sm">
                  Flipbook
                </div>
                <div className="mt-4">
                  <div className="text-zinc-600">154</div>
                  <div className="text-zinc-600">155</div>
                </div>
              </div>
              <p className="mt-4 text-sm text-zinc-500">
                Deep Interconnection, Intercomparison and Re-use
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-[#6B8E6B] text-white px-6 py-2 rounded-md hover:bg-[#7BA27] transition-colors font-medium">
              Print
            </button>
            <button className="bg-black text-white border border-zinc-700 px-6 py-2 rounded-md hover:border-zinc-600 transition-colors font-medium">
              Cover
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
