export interface Bull {
  id: string;
  name: string;
  breed: string;
  weight: number;
  age: number;
  aggression: number; // 1-10
  speed: number; // 1-10
  pastWins: number;
  owner: string;
  village: string;
}

export interface Tamer {
  id: string;
  name: string;
  age: number;
  village: string;
  experience: number; // years
  successRate: number; // percentage
  totalAttempts: number;
  wins: number;
}

export interface Round {
  id: number;
  bull: Bull;
  tamer: Tamer;
  status: 'upcoming' | 'active' | 'completed';
  result?: 'tamer_wins' | 'bull_wins' | 'draw';
  holdDuration?: number; // seconds
  distance?: number; // meters
  crowdEnergy?: number; // 1-100
}

export const bulls: Bull[] = [
  { id: 'b1', name: 'Veerabhadra', breed: 'Kangayam', weight: 450, age: 5, aggression: 9, speed: 8, pastWins: 12, owner: 'Murugan', village: 'Alanganallur' },
  { id: 'b2', name: 'Karuppu Raja', breed: 'Pulikulam', weight: 380, age: 4, aggression: 7, speed: 9, pastWins: 8, owner: 'Selvam', village: 'Palamedu' },
  { id: 'b3', name: 'Nandi', breed: 'Umbalachery', weight: 420, age: 6, aggression: 10, speed: 7, pastWins: 15, owner: 'Kannan', village: 'Avaniapuram' },
  { id: 'b4', name: 'Komban', breed: 'Kangayam', weight: 480, age: 5, aggression: 8, speed: 6, pastWins: 10, owner: 'Rajan', village: 'Alanganallur' },
  { id: 'b5', name: 'Seval', breed: 'Pulikulam', weight: 360, age: 3, aggression: 6, speed: 10, pastWins: 5, owner: 'Durai', village: 'Palamedu' },
  { id: 'b6', name: 'Vellai Madu', breed: 'Kangayam', weight: 500, age: 7, aggression: 9, speed: 5, pastWins: 18, owner: 'Arumugam', village: 'Suriyur' },
]

export const tamers: Tamer[] = [
  { id: 't1', name: 'Karthik', age: 24, village: 'Madurai', experience: 6, successRate: 45, totalAttempts: 40, wins: 18 },
  { id: 't2', name: 'Senthil', age: 28, village: 'Sivagangai', experience: 10, successRate: 55, totalAttempts: 60, wins: 33 },
  { id: 't3', name: 'Manikandan', age: 22, village: 'Dindigul', experience: 4, successRate: 35, totalAttempts: 20, wins: 7 },
  { id: 't4', name: 'Velu', age: 30, village: 'Theni', experience: 12, successRate: 60, totalAttempts: 80, wins: 48 },
  { id: 't5', name: 'Arun', age: 26, village: 'Virudhunagar', experience: 8, successRate: 50, totalAttempts: 50, wins: 25 },
  { id: 't6', name: 'Dinesh', age: 21, village: 'Pudukkottai', experience: 3, successRate: 30, totalAttempts: 15, wins: 5 },
]

export const triviaQuestions = [
  { q: 'Which Tamil festival is Jallikattu traditionally associated with?', options: ['Pongal', 'Diwali', 'Navratri', 'Onam'], answer: 0 },
  { q: 'What does "Jallikattu" literally mean?', options: ['Bull run', 'Coins tied to horns', 'Bull fight', 'Village sport'], answer: 1 },
  { q: 'Which district is most famous for Jallikattu?', options: ['Chennai', 'Madurai', 'Coimbatore', 'Salem'], answer: 1 },
  { q: 'Which bull breed is native to Tamil Nadu?', options: ['Gir', 'Kangayam', 'Sahiwal', 'Red Sindhi'], answer: 1 },
  { q: 'How old must a bull be to participate in Jallikattu?', options: ['1 year', '2 years', '3 years', '5 years'], answer: 2 },
  { q: 'What is the vaadi vaasal?', options: ['The audience area', 'The bull entry gate', 'The prize', 'The referee zone'], answer: 1 },
  { q: 'In which century does evidence of Jallikattu first appear?', options: ['3rd century BCE', '10th century CE', '15th century CE', '18th century CE'], answer: 0 },
  { q: 'What must a tamer do to win?', options: ['Ride the bull', 'Hold the hump for set distance', 'Catch the bull\'s tail', 'Wrestle it down'], answer: 1 },
]

export function generateRounds(): Round[] {
  const shuffledBulls = [...bulls].sort(() => Math.random() - 0.5)
  const shuffledTamers = [...tamers].sort(() => Math.random() - 0.5)

  return shuffledBulls.map((bull, i) => ({
    id: i + 1,
    bull,
    tamer: shuffledTamers[i % shuffledTamers.length],
    status: i === 0 ? 'active' : 'upcoming' as const,
    crowdEnergy: 50 + Math.floor(Math.random() * 30),
  }))
}
