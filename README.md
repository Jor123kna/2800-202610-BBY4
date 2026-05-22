# RouteRelief

A community-powered disaster response web app for the Lower Mainland (Vancouver, BC), connecting people who need help with people who can offer it during emergencies.

---

## Table of Contents

1. [Project Title](#routerelief)
2. [Project Description](#project-description)
3. [Technologies Used](#technologies-used)
4. [Listing of File Contents](#listing-of-file-contents)
5. [How to Install and Run the Project](#how-to-install-and-run-the-project)
6. [How to Use the Product (Features)](#how-to-use-the-product-features)
7. [Credits, References, and Licenses](#credits-references-and-licenses)
8. [How We Used AI and APIs](#how-we-used-ai-and-apis)
9. [Contact Information](#contact-information)

---

## Project Description

**RouteRelief is a disaster response web app that connects neighbours who need help with neighbours who can offer it during emergencies in the Lower Mainland.**

When a natural disaster strikes — earthquake, flood, wildfire, or extreme weather — people often don't know where to go for shelter, food, or supplies. At the same time, neighbours who want to help don't have an easy way to find out who needs support. RouteRelief bridges this gap by offering:

- An interactive **map** of nearby shelters, food banks, and emergency support locations
- A **community feed** for posting requests for help or offers to help
- An **AI assistant** that answers questions about disaster preparedness
- **Disaster guides** explaining how to respond to different emergency types

Users sign up as either someone **in need of help** or as a **helper** offering support — and the app adapts the experience based on their role.

---

## Technologies Used

### Frontend
- **React** 19 — UI library
- **React Router** 7 — client-side routing
- **Leaflet** + **React-Leaflet** — interactive maps
- **Framer Motion** — animations
- **React Joyride** — onboarding tour
- **Lucide React** — icons
- **CSS3** — custom design system (no Tailwind / no UI kit)

### Backend
- **Node.js** + **Express** 5 — server
- **Mongoose** — MongoDB ODM
- **Express-session** — session-based authentication
- **Bcrypt** — password hashing
- **Joi** — input validation
- **CORS** + **dotenv** — middleware

### Database
- **MongoDB Atlas** — cloud-hosted NoSQL database

### Third-Party APIs
- **Anthropic Claude API** (model: claude-haiku-4-5) — powers the AI chatbot
- **OpenStreetMap** — map tile data via Leaflet

### Other Tools
- **Git** + **GitHub** — version control
- **Trello** — task tracking
- **Discord** — team communication
- **Figma** — design wireframes

---

## Listing of File Contents

```
2800-202610-BBY4/
├── README.md                    # This file
├── about.html                   # About page (static)
├── app.js                       # Express app setup
├── server.js                    # Server entry point
├── package.json                 # Backend dependencies
├── template.env                 # .env template
│
├── middleware/                  # Express middleware
│   ├── requireLogin.js          # Auth check
│   └── userValidation.js        # Joi schemas
│
├── models/                      # Mongoose schemas
│   ├── users.js
│   ├── posts.js
│   ├── replies.js
│   └── locations.js
│
├── routes/                      # Express API routes
│   ├── userRoutes.js            # Signup, signin, profile, saved posts
│   ├── postRoutes.js            # CRUD for community posts
│   ├── replyRoutes.js           # CRUD for replies + notifications
│   ├── locationRoutes.js        # CRUD for relief locations
│   ├── chatRoutes.js            # AI chatbot proxy
│   └── walkthroughRoutes.js     # First-time tour state
│
├── seeds/
│   └── seedLocation.js          # Sample location data
│
└── frontend/
    ├── package.json             # Frontend dependencies
    ├── public/                  # Static assets
    │
    └── src/
        ├── App.jsx              # Routes definition
        ├── index.js             # React entry point
        ├── config.js            # API URL config
        │
        ├── components/          # Reusable UI components
        │   ├── AppTour.jsx
        │   ├── BottomNav.jsx
        │   ├── DisasterCard.jsx
        │   ├── DisasterDetailComponents.jsx
        │   ├── InstallGuideCard.jsx
        │   ├── Layout.jsx
        │   ├── MapComponent.jsx
        │   ├── PageHint.jsx
        │   ├── PostCard.jsx
        │   └── TopHeader.jsx
        │
        ├── pages/               # Route-level pages
        │   ├── Home.jsx
        │   ├── SignIn.jsx
        │   ├── SignUp.jsx
        │   ├── Community.jsx
        │   ├── Post.jsx
        │   ├── PostDetail.jsx
        │   ├── Notifications.jsx
        │   ├── Map.jsx
        │   ├── LocationDetail.jsx
        │   ├── Info.jsx
        │   ├── DisasterDetail.jsx
        │   ├── AiChat.jsx
        │   └── Profile.jsx
        │
        ├── context/
        │   └── AuthContext.jsx  # Global auth state
        │
        ├── data/
        │   └── disasterData.jsx # Static disaster info
        │
        ├── utils/
        │   └── locationHours.js # Helper for location open/closed
        │
        └── styles/
            └── globals.css      # Design system + all styles
```

---

## How to Install and Run the Project

### 1. What you need to install

| What | Version | Why |
|------|---------|-----|
| **Node.js** | v18 or higher | Runs the backend and the frontend build tooling |
| **npm** | v9 or higher (comes with Node) | Installs all JavaScript packages |
| **Git** | any recent version | Cloning the repo |
| **A code editor** | VS Code recommended | Editing the code |
| **MongoDB Atlas account** | free tier is fine | Hosted database |
| **Anthropic API key** | paid (starts at $5) | Powers the AI chatbot |

You do **not** need to install MongoDB locally — we use MongoDB Atlas (cloud-hosted).

### 2. Third-party APIs and frameworks

The npm install commands below pull these in automatically, but for transparency:

**Backend:** express, mongoose, bcrypt, express-session, joi, cors, dotenv, @anthropic-ai/sdk
**Frontend:** react, react-router-dom, react-leaflet, leaflet, framer-motion, react-joyride, lucide-react

### 3. API keys you need

You'll need **two**:

1. **MongoDB Atlas connection string** — get one by creating a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com). Note: this is a paid API but starts at $5 minimum top-up. The AI chatbot uses Claude Haiku 4.5 (the cheapest model — about 1 cent per ~15 questions).

For grading purposes, both keys are provided in the `passwords.txt` file submitted to D2L Dropbox.

### 4. Installation order

The order matters! Do these steps in sequence.

#### Step 1 — Clone the repository

```bash
git clone https://github.com/Jor123kna/2800-202610-BBY4.git
cd 2800-202610-BBY4
```

#### Step 2 — Install backend dependencies (from project root)

```bash
npm install
```

#### Step 3 — Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

#### Step 4 — Set up environment variables

Make a copy of `template.env` and rename it `.env`:

```bash
# macOS / Linux
cp template.env .env

# Windows (PowerShell)
Copy-Item template.env .env
```

Then open `.env` in your code editor and fill in the values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/routerelief?appName=Cluster0
SESSION_SECRET=any_random_string_at_least_20_chars
ANTHROPIC_API_KEY=sk-ant-...
```

> **Important:** Never commit your `.env` file to GitHub. It's already in `.gitignore`.

#### Step 5 — (Optional) Seed the database with sample locations

```bash
node seeds/seedLocation.js
```

This populates the map with sample relief locations in Vancouver.

### 5. Configuration details

- The **backend runs on port 5000** by default. If you change this, update `frontend/src/config.js` too.
- The **frontend runs on port 3000** by default (set by react-scripts).
- **CORS** is configured in `app.js` to allow requests from `http://localhost:3000`.
- The **AI chatbot** has a per-user limit of 15 questions to keep API costs manageable.

### 6. Running the app

You need **two terminals** running at the same time.

**Terminal 1 — Backend** (from project root):
```bash
node server.js
```
You should see:
```
Connected to RouteRelief database
Server running on port 5000
```

**Terminal 2 — Frontend** (from project root):
```bash
cd frontend
npm start
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).

### 7. Testing plan

Our testing history (manual test cases, bug reports, and sprint testing logs) is documented in our team Trello board. New contributors can review past tests and contribute bug fixes from there.

### 8. Login credentials for grading

Admin and test account credentials are provided in a separate `passwords.txt` file uploaded to the **D2L Dropbox** (not committed to this repo).

---

## How to Use the Product (Features)

### For Everyone (no login required)
- **Browse the map** of nearby relief locations with filters (shelter, food, hubs, support, medical)
- **View location details** — see status (open / limited / closed), capacity, services offered, and contact info
- **Read disaster preparedness guides** for earthquakes, floods, wildfires, and more
- **Chat with the AI assistant** for emergency preparedness questions
- **Take the onboarding tour** for first-time users

### For Logged-in Users
- **Browse the community feed** with posts marked "In Need" or "To Help"
- **Create posts** (and edit or delete your own)
- **Reply to posts** with inline editing and (edited) tags, similar to Discord
- **Get notifications** with an unread badge when someone replies to your posts
- **Bookmark posts** to find them later in your profile
- **Manage your profile** — see your posts, saved posts, and toggle your role

### For Helpers (users registered as "I want to help")
- **Edit location info** — update status, capacity, services, and contact details
- **Flag locations needing supplies** to mobilize community donations
- **Respond to "In Need" posts** in the community feed

### For Those In Need (users registered as "I need help")
- **Get directions** to any location via Google Maps integration
- **One-tap calling** for locations with contact info
- **Post your needs** in the community feed for nearby helpers to see

---

## Credits, References, and Licenses

### Code & Libraries
- [React](https://react.dev/) — MIT License
- [Express](https://expressjs.com/) — MIT License
- [Mongoose](https://mongoosejs.com/) — MIT License
- [Leaflet](https://leafletjs.com/) + [React-Leaflet](https://react-leaflet.js.org/) — BSD 2-Clause / Hippocratic License
- [Framer Motion](https://www.framer.com/motion/) — MIT License
- [React Joyride](https://docs.react-joyride.com/) — MIT License
- [Lucide](https://lucide.dev/) — ISC License

### Map Data
- **OpenStreetMap contributors** — map tiles via the [Open Database License (ODbL)](https://www.openstreetmap.org/copyright)

### Design Inspirations
- General UX patterns inspired by Discord (reply threads), Pinterest (bookmarks), and Slack (edit indicators)
- Color palette inspired by Canadian emergency response branding (calm green + warm orange + urgent red)

### References for Code & Tutorials
- BCIT COMP 2800 course materials and labs
- [React documentation](https://react.dev/learn) for hooks and patterns
- [MongoDB Atlas docs](https://www.mongodb.com/docs/atlas/) for cluster setup
- [Anthropic API docs](https://docs.anthropic.com/) for AI chatbot integration
- [freeCodeCamp's README guide](https://www.freecodecamp.org/news/how-to-write-a-good-readme-file/) — used as a structure reference for this README
- [groovyPost: list directory contents](https://www.groovypost.com/howto/microsoft/list-directory-contents-to-a-printable-and-readable-txt-file/) — used for the `tree` command

### License
This is a student project for educational purposes only (BCIT COMP 2800, 2026). It is not licensed for commercial use.

---

## How We Used AI and APIs

We were transparent about our AI use throughout development. Here's exactly what we did:

### 1. Anthropic Claude API (as a product feature)
- **What:** The in-app AI chatbot on the Disaster Info page uses the Anthropic Claude API.
- **Model:** `claude-haiku-4-5` (chosen for low cost — about $1 per million input tokens).
- **How:** The frontend sends user questions to our backend route (`/chat`), which calls the Anthropic API with a system prompt focused on emergency preparedness in the Lower Mainland. The reply is then returned to the user.
- **Why this model:** It was the most cost-effective option that could still answer reasonably complex preparedness questions. We set a per-user limit of 15 questions to manage API costs.
- **Files involved:** `routes/chatRoutes.js`, `frontend/src/pages/AiChat.jsx`

### 2. AI as a development assistant (Claude / ChatGPT)
During development, our team used AI tools (Claude and ChatGPT) as a coding assistant for:
- **Debugging help** — pasting error messages and asking for guidance
- **CSS suggestions** — getting help with layout and design system decisions
- **Code review** — checking syntax and React patterns
- **Generating boilerplate** — starter code for things like form validation schemas

All AI-assisted code was reviewed, tested, and modified by our team before being committed. We did not blindly copy-paste AI-generated code into the project.

### 3. Other third-party APIs (no AI)
- **OpenStreetMap** — for map tiles (free, no API key needed)
- **Google Maps deep linking** — for "Get directions" feature (just constructs URLs, no API key needed)

---

## Contact Information

For questions, feedback, or contributions, please contact a team member:

| Name | Role | Email |
|------|------|-------|
| Jorja Knaus | Backend | (BCIT email) |
| Ahmad Khalil | Backend | (BCIT email) |
| Hailey Kim | Frontend | skim682@my.bcit.ca |
| Giant Mak | Map Features | (BCIT email) |

**Repository:** [github.com/Jor123kna/2800-202610-BBY4](https://github.com/Jor123kna/2800-202610-BBY4)
**Course:** BCIT COMP 2800 — Full Stack Web Application Development (2026)
**Team:** BBY4