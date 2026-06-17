// Local database of popular Indian movies, TV shows, and web series
// Used for auto-suggestions WITHOUT any API calls
export const POPULAR_CONTENT: string[] = [
  // Bollywood Movies - Recent
  "Kalki 2898 AD", "Jawan", "Pathaan", "Animal", "Dunki", "Tiger 3", "Rocky Aur Rani Kii Prem Kahaani",
  "Sam Bahadur", "12th Fail", "Gadar 2", "OMG 2", "Dream Girl 2", "Fukrey 3",
  "Stree 2", "Munjya", "Crew", "Fighter", "Shaitaan", "Teri Baaton Mein Aisa Uljha Jiya",
  "Bade Miyan Chote Miyan", "Chandu Champion", "Khel Khel Mein", "Auron Mein Kahan Dum Tha",
  "Singham Again", "Bhool Bhulaiyaa 3", "Pushpa 2", "Baby John", "Vedaa",

  // Bollywood Movies - Classics & Hits
  "3 Idiots", "Dangal", "PK", "Bajrangi Bhaijaan", "Sultan", "Kabir Singh", "Drishyam",
  "Drishyam 2", "Andhadhun", "Tumbbad", "Gangs of Wasseypur", "Lagaan", "Dilwale Dulhania Le Jayenge",
  "Sholay", "Mughal-e-Azam", "Mother India", "Rang De Basanti", "Swades", "Taare Zameen Par",
  "Zindagi Na Milegi Dobara", "Dil Chahta Hai", "Barfi", "Queen", "Piku", "Raees",
  "Don", "Dhoom", "Dhoom 2", "Dhoom 3", "War", "Hrithik Roshan", "Koi Mil Gaya",
  "Krrish", "Ra.One", "Chennai Express", "Happy New Year", "Dilwale", "Zero",
  "Fan", "Raanjhanaa", "Tanu Weds Manu", "Tanu Weds Manu Returns", "Badhaai Ho",
  "Stree", "Bala", "Dream Girl", "Luka Chuppi", "Sonu Ke Titu Ki Sweety",
  "Uri The Surgical Strike", "Kesari", "Mission Mangal", "Good Newwz", "Tanhaji",
  "Shershaah", "Sooryavanshi", "Bell Bottom", "Rocketry", "Vikram Vedha",
  "Brahmastra", "Bhool Bhulaiyaa 2", "Jugjugg Jeeyo", "Laal Singh Chaddha",

  // South Indian Movies
  "RRR", "Baahubali", "Baahubali 2", "KGF", "KGF Chapter 2", "Kantara",
  "Pushpa", "Pushpa The Rise", "Jai Bhim", "Vikram", "Beast", "Ponniyin Selvan",
  "Ponniyin Selvan 2", "Leo", "Salaar", "Devara", "Hi Nanna", "Tillu Square",
  "Guntur Kaaram", "Indian 2", "Amaran", "Lucky Baskhar", "Game Changer",
  "Master", "Bigil", "Mersal", "Theri", "Kaththi", "Kabali", "Petta",
  "Super Deluxe", "Asuran", "Karnan", "Soorarai Pottru", "Jailer",

  // Web Series
  "Mirzapur", "Mirzapur 2", "Mirzapur 3", "Sacred Games", "Sacred Games 2",
  "Family Man", "Family Man 2", "Family Man 3", "Panchayat", "Panchayat 2", "Panchayat 3",
  "Scam 1992", "Kota Factory", "Kota Factory 2", "Aspirants", "TVF Pitchers",
  "Made in Heaven", "Made in Heaven 2", "Delhi Crime", "Delhi Crime 2",
  "Paatal Lok", "Breathe", "Breathe Into the Shadows", "Rocket Boys",
  "Farzi", "Dahaad", "Jubilee", "Guns & Gulaabs", "Kohrra",
  "Aarya", "Aarya 2", "Special Ops", "Asur", "Asur 2", "Hostages",
  "Criminal Justice", "Tandav", "Inside Edge", "Four More Shots Please",
  "She", "Bombay Begums", "The Gone Game", "Abhay", "Rangbaaz",
  "Gullak", "Gullak 2", "Gullak 3", "Heeramandi", "Aashram",
  "Maharaj", "Bambai Meri Jaan", "Khakee", "IC 814", "Black Warrant",

  // TV Shows
  "Taarak Mehta Ka Ooltah Chashmah", "CID", "Crime Patrol",
  "Kapil Sharma Show", "Bigg Boss", "Kaun Banega Crorepati",
  "Indian Idol", "Dance India Dance", "Khatron Ke Khiladi",
  "Naagin", "Anupamaa", "Yeh Rishta Kya Kehlata Hai",

  // International Popular in India
  "Money Heist", "Squid Game", "Stranger Things", "Breaking Bad",
  "Game of Thrones", "The Witcher", "Wednesday", "You",
  "Narcos", "Dark", "Peaky Blinders", "The Crown",
  "Loki", "WandaVision", "Falcon and Winter Soldier",
  "Avengers Endgame", "Avengers Infinity War", "Spider-Man No Way Home",
  "The Batman", "Oppenheimer", "Interstellar", "Inception",
  "The Dark Knight", "Fight Club", "Parasite", "Joker",
];

// Fast local search function
export function searchLocalContent(query: string): string[] {
  if (!query || query.length < 2) return [];
  
  const q = query.toLowerCase().trim();
  
  // Exact prefix matches first, then includes matches
  const prefixMatches: string[] = [];
  const includesMatches: string[] = [];
  
  for (const title of POPULAR_CONTENT) {
    const lower = title.toLowerCase();
    if (lower.startsWith(q)) {
      prefixMatches.push(title);
    } else if (lower.includes(q)) {
      includesMatches.push(title);
    }
  }
  
  return [...prefixMatches, ...includesMatches].slice(0, 5);
}
