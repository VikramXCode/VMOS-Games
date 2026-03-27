import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product.js";
import { Tournament } from "./models/Tournament.js";
import { LeaderboardEntry } from "./models/LeaderboardEntry.js";
import { Admin } from "./models/Admin.js";
import { ConsoleModel } from "./models/Console.js";
import { SiteContent } from "./models/SiteContent.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vmos";

const products = [
  { name: "GTA V", price: 2499, image: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=400&fit=crop", category: "Games" },
  { name: "Red Dead Redemption 2", price: 2999, image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop", category: "Games" },
  { name: "PS5 DualSense Controller", price: 5999, image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=400&fit=crop", category: "Accessories" },
  { name: "Xbox Wireless Controller", price: 4999, image: "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&h=400&fit=crop", category: "Accessories" },
  { name: "Gaming Headset Pro", price: 3499, image: "https://images.unsplash.com/photo-1599669454699-248893623440?w=400&h=400&fit=crop", category: "Accessories" },
  { name: "RGB Gaming Mouse", price: 1999, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop", category: "Accessories" },
  { name: "Mechanical Keyboard", price: 4499, image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=400&h=400&fit=crop", category: "Accessories" },
  { name: "Gaming Chair", price: 15999, image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400&h=400&fit=crop", category: "Furniture" },
];

const tournaments = [
  { name: "FIFA Championship", game: "FIFA 24", date: "Every Saturday", time: "4:00 PM", entryFee: 200, prizePool: 10000, maxSlots: 32, filledSlots: 24, status: "upcoming", icon: "⚽", gradient: "from-green-500 to-emerald-700" },
  { name: "Tekken Showdown", game: "Tekken 8", date: "Every Sunday", time: "3:00 PM", entryFee: 150, prizePool: 5000, maxSlots: 16, filledSlots: 12, status: "upcoming", icon: "🥊", gradient: "from-red-500 to-orange-700" },
  { name: "COD Battle Royale", game: "COD Warzone", date: "Mar 20, 2026", time: "6:00 PM", entryFee: 300, prizePool: 15000, maxSlots: 64, filledSlots: 38, status: "upcoming", icon: "🔫", gradient: "from-gray-600 to-gray-900" },
  { name: "GTA Online Heist", game: "GTA V Online", date: "Mar 15, 2026", time: "5:00 PM", entryFee: 100, prizePool: 3000, maxSlots: 20, filledSlots: 20, status: "completed", icon: "🏎️", gradient: "from-purple-500 to-indigo-700" },
];

const leaderboard = [
  { name: "Rohan K.", hours: 62, game: "Valorant", score: 1980, wins: 24, streak: 5, avatar: "🎮" },
  { name: "Ishita P.", hours: 55, game: "FIFA 24", score: 1840, wins: 21, streak: 3, avatar: "⚽" },
  { name: "Vikram S.", hours: 48, game: "Tekken 8", score: 1720, wins: 18, streak: 4, avatar: "🥊" },
  { name: "Aisha M.", hours: 42, game: "Fortnite", score: 1610, wins: 15, streak: 2, avatar: "🎯" },
  { name: "Karan D.", hours: 37, game: "Rocket League", score: 1505, wins: 12, streak: 1, avatar: "🚀" },
  { name: "Priya R.", hours: 35, game: "COD Warzone", score: 1420, wins: 10, streak: 0, avatar: "🔫" },
  { name: "Arjun M.", hours: 32, game: "GTA Online", score: 1350, wins: 8, streak: 2, avatar: "🏎️" },
  { name: "Sneha T.", hours: 28, game: "Apex Legends", score: 1280, wins: 7, streak: 0, avatar: "🏹" },
];

const consoles = [
  { key: "ps5", name: "PlayStation 5", price: 100, icon: "🎮", order: 1 },
  { key: "ps4", name: "PlayStation 4", price: 80, icon: "🎮", order: 2 },
  { key: "xbox", name: "Xbox Series X", price: 100, icon: "🎮", order: 3 },
  { key: "pc-high", name: "Gaming PC (High-end)", price: 80, icon: "💻", order: 4 },
  { key: "pc-mid", name: "Gaming PC (Mid-range)", price: 60, icon: "💻", order: 5 },
  { key: "switch", name: "Nintendo Switch", price: 60, icon: "🕹️", order: 6 },
  { key: "vr", name: "VR Gaming", price: 150, icon: "🥽", order: 7 },
];

const siteContent = {
  heroImages: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800&h=600&fit=crop",
  ],
  services: [
    { icon: "Gamepad2", title: "Gaming Sessions", description: "PC, PS5, PS4, PS3, PS2 & Xbox", price: "Rates Vary", color: "from-cyan-500 to-blue-600", glow: "group-hover:shadow-cyan-500/20" },
    { icon: "ShoppingCart", title: "Game Shop", description: "Games, consoles & accessories", price: "Best Prices", color: "from-purple-500 to-pink-600", glow: "group-hover:shadow-purple-500/20" },
    { icon: "Trophy", title: "Tournaments", description: "Weekly competitions & prizes", price: "₹200 Entry", color: "from-yellow-500 to-orange-600", glow: "group-hover:shadow-yellow-500/20" },
    { icon: "Wrench", title: "Repairs", description: "Console & controller service", price: "Quick Fix", color: "from-green-500 to-emerald-600", glow: "group-hover:shadow-green-500/20" },
  ],
  location: {
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d978.8326111981042!2d77.3264557353086!3d11.088731308428162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba9077441abbf25%3A0x1e421b4305ebe100!2sVMOS%20Game%20Station!5e0!3m2!1sen!2sin!4v1769011146519!5m2!1sen!2sin",
    address: "5/1, 1st St, Sellam Nagar, Parapalayam, Pirivu, Tiruppur, Tamil Nadu 641604",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=VMOS+Game+Station",
  },
  contact: {
    phone: "+917010905241",
    email: "vmtech.cool@gmail.com",
    whatsapp: "+917010905241",
    hours: "Daily: 10 AM - 11 PM",
    instagram: "",
    facebook: "",
  },
  gallery: [
    { url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=900&h=600&fit=crop", category: "arena", title: "Main Arena", tall: true },
    { url: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900&h=600&fit=crop", category: "setup", title: "Console Zone", tall: false },
    { url: "https://images.unsplash.com/photo-1523968044756-39c9c6ef1aab?w=900&h=600&fit=crop", category: "tournament", title: "Tournament Night", tall: true },
    { url: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&h=600&fit=crop", category: "setup", title: "PC Bay", tall: false },
    { url: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=900&h=600&fit=crop", category: "arena", title: "Neon Lounge", tall: false },
    { url: "https://images.unsplash.com/photo-1546443046-ed1ce6ffd1ab?w=900&h=600&fit=crop", category: "tournament", title: "Winners", tall: false },
  ],
};

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Product.deleteMany({});
    await Tournament.deleteMany({});
    await LeaderboardEntry.deleteMany({});
    await ConsoleModel.deleteMany({});
    await SiteContent.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Seed data
    await Product.insertMany(products);
    console.log(`📦 Seeded ${products.length} products`);

    await Tournament.insertMany(tournaments);
    console.log(`🏆 Seeded ${tournaments.length} tournaments`);

    await LeaderboardEntry.insertMany(leaderboard);
    console.log(`🎮 Seeded ${leaderboard.length} leaderboard entries`);

    await ConsoleModel.insertMany(consoles);
    console.log(`🕹️ Seeded ${consoles.length} consoles`);

    await SiteContent.create(siteContent);
    console.log("🧩 Seeded site content");

    // Create default admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      await Admin.create({ username: "admin", password: "vmos2026", role: "superadmin" });
      console.log("👤 Created default admin (username: admin, password: vmos2026)");
    }

    console.log("\n✅ Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
