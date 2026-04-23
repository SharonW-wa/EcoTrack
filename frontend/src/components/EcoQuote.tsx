import { useState, useEffect } from "react";

interface Quote {
  text: string;
  author: string;
  role?: string;
}

const ECO_QUOTES: Quote[] = [
  { text: "The greatest threat to our planet is the belief that someone else will save it.", author: "Robert Swan", role: "Polar Explorer & Environmentalist" },
  { text: "We do not inherit the earth from our ancestors; we borrow it from our children.", author: "Antoine de Saint-Exupéry", role: "Author & Aviator" },
  { text: "In every walk with nature, one receives far more than he seeks.", author: "John Muir", role: "Naturalist & Conservationist" },
  { text: "The Earth does not belong to us. We belong to the Earth.", author: "Chief Seattle", role: "Duwamish & Suquamish Leader" },
  { text: "You cannot get through a single day without having an impact on the world around you. What you do makes a difference.", author: "Jane Goodall", role: "Primatologist & Conservationist" },
  { text: "The environment is where we all meet; where we all have a mutual interest; it is the one thing all of us share.", author: "Lady Bird Johnson", role: "Former U.S. First Lady" },
  { text: "We are the first generation to feel the effect of climate change and the last generation that can do something about it.", author: "Barack Obama", role: "44th President of the United States" },
  { text: "Our planet's alarm is going off, and it is time to wake up and take action.", author: "Leonardo DiCaprio", role: "Actor & Climate Activist" },
  { text: "There is no such thing as away. When we throw anything away it must go somewhere.", author: "Annie Leonard", role: "Author of The Story of Stuff" },
  { text: "Nature is not a place to visit. It is home.", author: "Gary Snyder", role: "Poet & Environmentalist" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James", role: "Philosopher & Psychologist" },
  { text: "The Earth is what we all have in common.", author: "Wendell Berry", role: "Poet & Environmental Activist" },
  { text: "We are living on this planet as if we had another one to go to.", author: "Terri Swearingen", role: "Environmental Health Advocate" },
  { text: "Small acts, when multiplied by millions of people, can transform the world.", author: "Howard Zinn", role: "Historian & Activist" },
  { text: "Sustainability is no longer about doing less harm. It is about doing more good.", author: "Jochen Zeitz", role: "Business Sustainability Leader" },
  { text: "What we are doing to the forests of the world is but a mirror reflection of what we are doing to ourselves.", author: "Mahatma Gandhi", role: "Peace Activist & Leader" },
  { text: "The climate crisis is both the easiest and the hardest issue we have ever faced.", author: "Greta Thunberg", role: "Climate Activist" },
  { text: "One of the first conditions of happiness is that the link between man and nature shall not be broken.", author: "Leo Tolstoy", role: "Russian Novelist" },
  { text: "To waste or destroy our natural resources will undermine the prosperity we ought to pass down to our children.", author: "Theodore Roosevelt", role: "26th President of the United States" },
  { text: "Reduce, reuse, recycle — three words that can make a world of difference.", author: "Environmental Proverb" },
];

const SESSION_KEY = "ecotrack_last_quote_index";

function getRandomQuote(excludeIndex?: number): { quote: Quote; index: number } {
  let idx: number;
  do {
    idx = Math.floor(Math.random() * ECO_QUOTES.length);
  } while (idx === excludeIndex && ECO_QUOTES.length > 1);
  return { quote: ECO_QUOTES[idx], index: idx };
}

export default function EcoQuote() {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const lastIndex = parseInt(sessionStorage.getItem(SESSION_KEY) ?? "-1", 10);
    const { quote: picked, index } = getRandomQuote(lastIndex === -1 ? undefined : lastIndex);
    sessionStorage.setItem(SESSION_KEY, String(index));
    setQuote(picked);
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  if (!quote) return null;

  return (
    <div
      className="eco-quote-banner"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <div className="eco-quote-leaf" aria-hidden="true">🌿</div>
      <div className="eco-quote-body">
        <p className="eco-quote-text">"{quote.text}"</p>
        <div className="eco-quote-attribution">
          <span className="eco-quote-dash">— </span>
          <span className="eco-quote-author">{quote.author}</span>
          {quote.role && <span className="eco-quote-role">, {quote.role}</span>}
        </div>
      </div>
    </div>
  );
}