# 🧠 Resumind — AI Resume Analyzer & Job Matcher

> Upload your resume. Get AI-powered feedback. Discover the jobs you're made for.

**Resumind** is a smart web application that analyzes your resume using Artificial Intelligence and helps you understand how strong it is, what to improve, and which job roles you are best suited for — complete with **live job listings** from LinkedIn, Indeed, and Glassdoor.

---

## 🌟 What Does This App Do?

Think of Resumind as your personal career coach. Here's what it does in simple terms:

1. **You upload your resume** (as a PDF file)
2. **The AI reads it** and scores it across 5 key areas
3. **You get detailed feedback** on what's good and what needs improvement
4. **The Job Matcher finds your best-fit roles** — no job description needed
5. **Live job listings appear** from real companies hiring for those roles right now

---

## ✨ Key Features

### 📊 Resume Score & Feedback
- Your resume gets an **overall score out of 100**
- Broken down into 5 categories:
  - **ATS Compatibility** — will a company's hiring software even see your resume?
  - **Tone & Style** — does it sound professional?
  - **Content Quality** — is the information strong and relevant?
  - **Resume Structure** — is it organized clearly?
  - **Skills Alignment** — do your skills match what employers want?
- Each category comes with specific tips to improve

### 🎯 Job Role Matcher
- Upload your resume and the AI suggests the **top 5 job roles** you're best suited for
- See your **match percentage** for each role (e.g. "87% match for Software Engineer")
- Find out which skills you already have ✅ and which ones you're missing ❌
- Get the **expected salary range** and **job demand level** for each role
- No job description needed — it works purely from your resume

### 💼 Live Job Listings
- Each matched role shows **real job openings** from:
  - **LinkedIn**
  - **Indeed**
  - **Glassdoor**
  - **ZipRecruiter**
- See company logos, locations, salary ranges, and remote options
- Click **"Apply →"** to go directly to the job posting
- Load more results with pagination

### 📁 Resume Dashboard
- All your analyzed resumes are saved in one place
- View past analyses anytime
- See scores at a glance on resume cards

### 🔐 Secure Authentication
- Sign in with your Puter account — no password setup needed
- Your resumes and data are stored privately and securely

---

## 🖥️ Screenshots

> **Home Dashboard** — All your resumes in one place

> **Resume Analysis** — Detailed AI feedback with scores

> **Job Role Matcher** — Your top 5 matched roles with live job listings

---

## 🛠️ Tech Stack

| Technology | What It Does |
|-----------|-------------|
| **React** | Builds the user interface |
| **React Router v7** | Handles navigation between pages |
| **TypeScript** | Makes the code more reliable and error-free |
| **Tailwind CSS** | Makes the app look beautiful |
| **Puter.js** | Handles login, file storage, and AI — no backend server needed |
| **Claude AI (Sonnet)** | The AI model that reads and analyzes resumes |
| **JSearch API** | Fetches live job listings from LinkedIn, Indeed & Glassdoor |
| **Vite** | Fast development and build tool |
| **Zustand** | Manages app state efficiently |

---

## 🚀 Getting Started

### What You Need First

Before running this project, make sure you have these installed on your computer:

- [Node.js](https://nodejs.org/en) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Step 1 — Clone the Project

Open your terminal and run:

```bash
git clone https://github.com/ritika22789/resume-analyser.git
cd resume-analyser
```

### Step 2 — Install Dependencies

```bash
npm install
```

### Step 3 — Run the App

```bash
npm run dev
```

Then open your browser and go to: **http://localhost:5173**

That's it! The app will be running on your computer. 🎉

---

## 📖 How to Use the App

### Analyzing a Resume

1. Go to the app and **sign in** with your Puter account (free)
2. Click **"Upload Resume"** in the top navigation
3. Fill in the job title and company name (optional but helpful)
4. Upload your PDF resume
5. Click **"Analyze Resume"**
6. Wait a few seconds while the AI reads your resume
7. View your detailed score and improvement tips

### Using the Job Matcher

1. Click **"🎯 Job Matcher"** in the navigation bar
2. Upload your resume PDF
3. Click **"Find My Best Roles"**
4. The AI will analyze your resume and show your **top 5 best-fit job roles**
5. For each role, click **"💼 View live job openings"** to see real job listings
6. Click **"Apply →"** on any job to go to the actual application page

---

## 📁 Project Structure

```
ai-resume-analyzer/
├── app/
│   ├── components/       # Reusable UI components
│   │   ├── Navbar.tsx        # Navigation bar
│   │   ├── JobListings.tsx   # Live job listings component
│   │   ├── Summary.tsx       # Resume score summary
│   │   └── ...
│   ├── routes/           # Pages of the app
│   │   ├── home.tsx          # Dashboard page
│   │   ├── upload.tsx        # Resume upload page
│   │   ├── resume.tsx        # Resume detail & feedback page
│   │   └── match.tsx         # Job Role Matcher page
│   └── lib/
│       ├── puter.ts          # Puter.js integration (auth, storage, AI)
│       └── jsearch.ts        # JSearch API for live job listings
├── constants/
│   └── index.ts          # AI prompt instructions
└── types/
    └── index.d.ts        # TypeScript type definitions
```

---

## 🔑 APIs & Services Used

| Service | Purpose | Cost |
|---------|---------|------|
| [Puter.js](https://puter.com) | Authentication, file storage, AI analysis | Free (user-pays model) |
| [JSearch via RapidAPI](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch) | Live job listings from LinkedIn/Indeed | Free tier: 200 req/month |
| Claude AI (via Puter) | Resume analysis & job matching | Included with Puter |

---

## 🎓 About This Project

This project was built as a **major college project** to demonstrate:

- Full-stack web application development
- AI/ML integration in real-world applications
- Third-party API integration (JSearch for live job data)
- Modern UI/UX design principles
- State management in React applications
- TypeScript for type-safe development

---

## 👩‍💻 Author

**Ritika Mehta**
- GitHub: [@ritika22789](https://github.com/ritika22789)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <p>Made with ❤️ for learning and career growth</p>
  <p>⭐ Star this repo if you found it helpful!</p>
</div>