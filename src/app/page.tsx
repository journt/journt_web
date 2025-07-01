"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function Home() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "summary" | "lead" | "detailed" | "payment">("input");
  const [rawText, setRawText] = useState<string | null>(null);
  // Lead form state
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [leadError, setLeadError] = useState<string | null>(null);
  const [leadLoading, setLeadLoading] = useState(false);
  const [detailedText, setDetailedText] = useState<string | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  // Step 1: Get summary
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setRawText(null);
    setStep("input");
    const res = await fetch("/api/plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city, days, promptType: "summary" }),
    });
    const data = await res.json();
    setRawText(data.rawText);
    setLoading(false);
    setStep("summary");
  };

  // Step 2: Save lead and get detailed plan
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError(null);
    setLeadLoading(true);
    // Validate
    if (!lead.name || !lead.email || !lead.phone) {
      setLeadError("All fields are required.");
      setLeadLoading(false);
      return;
    }
    // Save lead
    let leadRes, leadData;
    try {
      leadRes = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...lead, city, days }),
      });
      if (!leadRes.ok) throw new Error("Failed to save info (server error)");
      leadData = await leadRes.json();
    } catch (err) {
      setLeadError("Could not save your info. Please try again later.");
      setLeadLoading(false);
      return;
    }
    if (!leadData.success) {
      setLeadError(leadData.message || "Failed to save info.");
      setLeadLoading(false);
      return;
    }
    // Get detailed plan
    let planRes, planData;
    try {
      planRes = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, days, promptType: "detailed" }),
      });
      if (!planRes.ok) throw new Error("Failed to generate plan (server error)");
      planData = await planRes.json();
    } catch (err) {
      setLeadError("Could not generate your plan. Please try again later.");
      setLeadLoading(false);
      return;
    }
    if (!planData.rawText) {
      setLeadError("No plan generated. Please try again later.");
      setLeadLoading(false);
      return;
    }
    setDetailedText(planData.rawText);
    setLeadLoading(false);
    setStep("detailed");
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-[80vh] w-full px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-2xl text-center mb-12"
      >
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight font-poppins">
          Plan Your Perfect Trip in Seconds
        </h1>
        <p className="text-lg text-gray-600 mb-8 font-inter">
          Journt helps you create beautiful, minimalist travel itineraries
          instantly. Just enter your city and days!
        </p>
      </motion.div>
      {step === "input" && (
        <motion.form
          onSubmit={handleSubmit}
          className="bg-white/90 shadow-xl rounded-xl p-6 flex flex-col sm:flex-row gap-4 w-full max-w-2xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <input
            type="text"
            required
            placeholder="Enter city name..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <input
            type="number"
            min={1}
            max={30}
            required
            placeholder="Days"
            className="w-24 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
          />
          <button
            type="submit"
            className="bg-primary text-black font-bold px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition min-w-[120px] border-2 border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            disabled={loading}
            aria-label="Plan It"
          >
            {loading ? "Generating..." : <span className="font-bold">Plan It</span>}
          </button>
        </motion.form>
      )}
      <AnimatePresence>
        {step === "summary" && rawText && (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mb-6 text-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-primary font-poppins">Your Trip Summary</h2>
            <div className="prose prose-neutral max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{rawText}</ReactMarkdown>
            </div>
            <button
              className="mt-6 bg-secondary text-black font-bold px-6 py-3 rounded-lg shadow hover:bg-secondary/90 transition"
              onClick={() => setStep("lead")}
            >
              Get Detailed Plan
            </button>
          </div>
        )}
        {step === "lead" && (
          <form
            onSubmit={handleLeadSubmit}
            className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold mb-2 text-primary font-poppins">Get Your Detailed Plan</h2>
            <input
              type="text"
              placeholder="Name"
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={lead.name}
              onChange={e => setLead({ ...lead, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={lead.email}
              onChange={e => setLead({ ...lead, email: e.target.value })}
              required
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary text-base"
              value={lead.phone}
              onChange={e => setLead({ ...lead, phone: e.target.value })}
              required
            />
            {leadError && <div className="text-red-600 text-sm mb-2">{leadError}</div>}
            <button
              type="submit"
              className="bg-primary text-black font-bold px-6 py-3 rounded-lg shadow hover:bg-primary/90 transition"
              disabled={leadLoading}
            >
              {leadLoading ? "Crafting your trip..." : "Get Detailed Plan"}
            </button>
          </form>
        )}
        {step === "detailed" && detailedText && (
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 mb-6 text-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-primary font-poppins">Your Detailed Plan</h2>
            <div className="prose prose-neutral max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{detailedText}</ReactMarkdown>
            </div>
            <button
              className="mt-6 bg-accent text-black font-bold px-6 py-3 rounded-lg shadow hover:bg-accent/90 transition"
              onClick={() => setShowPayment(true)}
            >
              Get Customised Itinerary
            </button>
          </div>
        )}
        {showPayment && (
          <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-4 text-primary font-poppins">Payment (Coming Soon)</h2>
            <p className="mb-4 text-gray-700">Payment integration will go here. After payment, admin will be notified to create a PDF itinerary for your email.</p>
            <button className="bg-gray-300 px-6 py-2 rounded" onClick={() => setShowPayment(false)}>Close</button>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
