import { NextResponse } from 'next/server';

// Format LLM text to HTML with custom rules
function formatLLMTextToHtml(text: string): string {
  if (!text) return '';
  const lines = text.split(/\r?\n/);
  let html = '';
  let inList = false;
  let inSubList = false;
  for (const line of lines) {
    const trimmed = line.trim();
    // Horizontal rule
    if (trimmed === '---') {
      if (inSubList) { html += '</ul>\n'; inSubList = false; }
      if (inList) { html += '</ul>\n'; inList = false; }
      // Add two blank lines for visual separation
      html += '<div class="my-8"></div><div class="my-8"></div>\n';
      continue;
    }
    // H2 for main section headers
    if (/^[A-Za-z\s]+:$/g.test(trimmed) || /^[A-Z][A-Z\s]+$/.test(trimmed)) {
      if (inSubList) { html += '</ul>\n'; inSubList = false; }
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h2 class="text-2xl font-bold mt-10 mb-4 font-poppins text-primary border-l-4 border-accent pl-3 bg-accent/10">${trimmed.replace(/:$/, '')}</h2>\n`;
      continue;
    }
    // H3 for markdown ### headers
    if (/^###\s?/.test(trimmed)) {
      if (inSubList) { html += '</ul>\n'; inSubList = false; }
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h3 class="text-xl font-bold mt-6 mb-2 font-poppins text-accent">${trimmed.replace(/^###\s?/, '')}</h3>\n`;
      continue;
    }
    // H3 for subheaders
    if (/^(Morning|Afternoon|Evening|Bonus Experiences|Food Guide|Budget Breakdown|Travel Tips|Packing & Essentials Checklist)/i.test(trimmed)) {
      if (inSubList) { html += '</ul>\n'; inSubList = false; }
      if (inList) { html += '</ul>\n'; inList = false; }
      html += `<h3 class="text-lg font-semibold mt-5 mb-2 font-poppins text-secondary">${trimmed.replace(/:$/, '')}</h3>\n`;
      continue;
    }
    // Bulleted list for lines starting with - or *
    if (/^[-*]\s/.test(trimmed)) {
      if (!inList) { html += '<ul class="list-disc ml-8 mb-3 text-blue-700 space-y-2">\n'; inList = true; }
      html += `<li class="text-blue-900 text-base leading-relaxed">${trimmed.replace(/^[-*]\s/, '')}</li>\n`;
      continue;
    }
    // Sub-bullets for lines starting with two spaces and - or *
    if (/^\s{2,}[-*]\s/.test(line)) {
      if (!inSubList) { html += '<ul class="list-circle ml-14 mb-1 text-blue-500 space-y-1">\n'; inSubList = true; }
      html += `<li class="text-blue-600 text-base">${trimmed.replace(/^[-*]\s/, '')}</li>\n`;
      continue;
    } else if (inSubList) {
      html += '</ul>\n';
      inSubList = false;
    }
    // Italics for lines starting with ####
    if (/^####\s?/.test(trimmed)) {
      html += `<i class="text-gray-500">${trimmed.replace(/^####\s?/, '')}</i><br />\n`;
      continue;
    }
    // Paragraph for normal text
    if (trimmed.length > 0) {
      // If inside a table row, avoid <br> tags
      if (/^\|.*\|$/.test(line)) {
        html += `<span class="text-gray-800">${trimmed}</span>\n`;
      } else {
        html += `<p class="mb-4 text-gray-800 text-base leading-relaxed">${trimmed}</p>\n`;
      }
    }
  }
  if (inSubList) html += '</ul>\n';
  if (inList) html += '</ul>\n';
  return html;
}

export async function POST(request: Request) {
  const body = await request.json();
  const { city, days, promptType = "summary" } = body;

  // Prompt 1: summary, Prompt 2: detailed
  const promptSummary = `You are a travel expert. Give a concise, inspiring summary itinerary for a ${days}-day trip to ${city}. Highlight the top experiences, must-see places, and a local food or two. Keep it under 120 words, friendly and motivating, as if for a quick WhatsApp message.`;

  const promptDetailed = `You are an expert travel planner with deep knowledge of local cultures, cuisines, attractions, and budgeting. I want you to create a highly detailed travel itinerary based on the following:\nDestination: ${city} Duration: ${days} Your output must include the following sections in detail:\nDay-by-Day Itinerary\nBreak down each day clearly, with:\nMorning, afternoon, evening activities\nSpecific tourist spots (including entry times and local tips if any)\nMust-try local foods (mention specific dishes and places if possible)\nHidden gems and cultural experiences\nOptional short excursions (if possible)\nFood Guide\nSuggest top local restaurants, food markets, or cafes\nMention unique dishes, street food, or fine dining options (for different budgets)\nBudget Breakdown (per person) also include value of local currency in other famous currencies\nProvide a complete range:\nBackpacker Budget\nMid-range Budget\nLuxury Budget\nInclude estimates for:\nAccommodation (hotel/hostel)\nMeals\nTransport (local + airport/train)\nEntry fees\nShopping/Souvenirs\nMiscellaneous\nTravel Tips for First-Time Visitors\nCover local customs, weather, safety, how to get around, tipping etiquette, SIM cards/internet, best time to visit, local festivals, and emergency numbers\nBonus Experiences\nSuggest extra activities like:\nSunrise/sunset points\nLocal workshops/classes (cooking, art, etc.)\nNightlife spots or rooftop cafes\nWeekend or day trips nearby\nPacking & Essentials Checklist\nMention items to pack considering weather, terrain, and local culture.\n(e.g., jackets, sunscreen, power adapters, etc.)\nPresent the final answer as if you’re writing a professional travel blog or PDF for a traveler who is visiting for the first time and wants the best experience possible within their budget.`;

  const prompt = promptType === "detailed" ? promptDetailed : promptSummary;

  // Call OpenRouter API with DeepSeek R1 model
  let data;
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: prompt }],
        max_tokens: promptType === "detailed" ? 10000 : 2000,
      }),
    });
    data = await response.json();
  } catch {
      return NextResponse.json({
        error: true,
        message: "Failed to generate plan. Please try again later.",
      }, { status: 500 });
    }

  // Handle LLM error response
  if (data?.error) {
    return NextResponse.json({
      error: true,
      message: data.error.message || "AI service error. Please try again later.",
      llmRaw: data,
      rawText: null,
      formattedHtml: null,
    }, { status: 500 });
  }

  // Extract LLM response from content or reasoning
  let text = data.choices?.[0]?.message?.content?.trim();
  if (!text || text.length < 2) {
    text = data.choices?.[0]?.message?.reasoning?.trim() || "";
  }

  // Log the raw LLM response for debugging
  console.log('LLM raw response:', JSON.stringify(data, null, 2));
  console.log('LLM extracted text:', text);

  // Format the raw text to HTML for frontend rendering
  const formattedHtml = formatLLMTextToHtml(text);

  return NextResponse.json({ rawText: text, llmRaw: data, formattedHtml });
}
