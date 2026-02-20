const mongoose = require("mongoose");

const MONGODB_URI = "mongodb+srv://dev_plain_test:MongoDbPassword%40123@cluster0.uqjbplz.mongodb.net/devtrack?appName=Cluster0";

const entrySchema = new mongoose.Schema({
    title: String,
    category: String,
    timeSpent: Number,
    problemsSolved: Number,
    notes: String,
    date: Date,
    createdAt: { type: Date, default: Date.now },
});

const Entry = mongoose.model("Entry", entrySchema);

const titles = {
    DSA: [
        "Two Sum", "Binary Search", "Merge Sort", "Linked List Reversal", "Tree Traversal",
        "Graph BFS/DFS", "Dynamic Programming", "Sliding Window", "Stack Problems", "Heap Practice",
        "Trie Implementation", "Backtracking", "Greedy Algorithms", "Bit Manipulation", "Recursion Practice",
        "Topological Sort", "Dijkstra's Algorithm", "Union Find", "Segment Tree", "KMP Algorithm",
    ],
    Development: [
        "React Dashboard", "REST API", "Auth System", "Database Schema", "CSS Animations",
        "Next.js App", "Node.js Server", "MongoDB CRUD", "TypeScript Refactor", "Responsive Design",
    ],
    "System Design": [
        "URL Shortener", "Chat System", "Load Balancer", "CDN Design", "Rate Limiter",
        "Notification System", "Search Engine", "Video Streaming", "Cache Design", "DB Sharding",
    ],
    "Interview Prep": [
        "Mock Interview", "Behavioral Questions", "System Design Round", "Coding Round Practice",
        "HR Round Prep", "Resume Review", "Company Research", "Salary Negotiation Prep",
    ],
    Learning: [
        "Docker Basics", "Kubernetes Intro", "AWS Services", "CI/CD Pipelines", "Redis Caching",
        "GraphQL Intro", "WebSocket Basics", "OAuth2 Flow", "Microservices", "Testing Strategies",
    ],
};

const categories = Object.keys(titles);

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateEntries() {
    const entries = [];
    const startDate = new Date("2025-03-01");
    const endDate = new Date("2026-02-20");
    const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

    // Pick ~120 random days out of the range
    const selectedDays = new Set();
    while (selectedDays.size < 120) {
        selectedDays.add(randomInt(0, totalDays));
    }

    for (const dayOffset of selectedDays) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + dayOffset);

        // 1-3 entries per day
        const entriesPerDay = randomInt(1, 3);
        for (let j = 0; j < entriesPerDay; j++) {
            const cat = categories[randomInt(0, categories.length - 1)];
            const titleList = titles[cat];
            const title = titleList[randomInt(0, titleList.length - 1)];
            const timeSpent = randomInt(15, 120);
            const problemsSolved = cat === "DSA" ? randomInt(1, 5) : (cat === "Interview Prep" ? randomInt(0, 2) : 0);

            entries.push({
                title: `${title}`,
                category: cat,
                timeSpent,
                problemsSolved,
                notes: `Practiced ${title.toLowerCase()} for ${timeSpent} minutes.`,
                date,
            });
        }
    }

    return entries;
}

async function seedDatabase() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB");

        await Entry.deleteMany({});
        console.log("Cleared old data");

        const entries = generateEntries();
        await Entry.insertMany(entries);
        console.log(`Inserted ${entries.length} entries across ~120 unique days`);
        console.log("Database seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error);
        process.exit(1);
    }
}

seedDatabase();
