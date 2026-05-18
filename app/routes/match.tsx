import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Navbar from "~/components/Navbar";
import { usePuterStore } from "~/lib/puter";
import { prepareJobMatchInstructions } from "../../constants";
import { formatSize } from "~/lib/utils";
import { useNavigate } from "react-router";
import JobListings from "~/components/JobListings";

export const meta = () => ([
    { title: "Resumind | Job Role Matcher" },
    { name: "description", content: "Discover the top job roles you are best suited for based on your resume" },
]);

// ── Demand badge ──────────────────────────────────────────────────────────────
const DemandBadge = ({ level }: { level: "High" | "Medium" | "Low" }) => {
    const styles: Record<string, string> = {
        High: "bg-green-100 text-green-700 border border-green-200",
        Medium: "bg-yellow-100 text-yellow-700 border border-yellow-200",
        Low: "bg-red-100 text-red-700 border border-red-200",
    };
    const icons: Record<string, string> = { High: "🔥", Medium: "📊", Low: "📉" };
    return (
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${styles[level]}`}>
            {icons[level]} {level} Demand
        </span>
    );
};

// ── Circular match percentage ring ────────────────────────────────────────────
const MatchRing = ({ percentage }: { percentage: number }) => {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const filled = (percentage / 100) * circumference;
    const color = percentage >= 75 ? "#22c55e" : percentage >= 55 ? "#eab308" : "#f97316";

    return (
        <div className="relative w-24 h-24 shrink-0">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
                <circle
                    cx="44" cy="44" r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth="8"
                    strokeDasharray={`${filled} ${circumference}`}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dasharray 1.2s ease" }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-gray-800">{percentage}%</span>
                <span className="text-[10px] text-gray-400 font-medium">match</span>
            </div>
        </div>
    );
};

// ── Skill chip ────────────────────────────────────────────────────────────────
const SkillChip = ({ skill, found }: { skill: string; found: boolean }) => (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${
        found
            ? "bg-green-50 text-green-700 border-green-200"
            : "bg-red-50 text-red-600 border-red-200"
    }`}>
        {found ? "✓" : "✗"} {skill}
    </span>
);

// ── Single role card ──────────────────────────────────────────────────────────
const RoleCard = ({ role, rank }: { role: JobRoleMatch; rank: number }) => {
    const [expanded, setExpanded] = useState(false);
    const [showJobs, setShowJobs] = useState(false);
    const isTop = rank === 1;

    return (
        <div className={`relative bg-white rounded-2xl border-2 shadow-sm transition-all duration-300 hover:shadow-lg overflow-hidden ${
            isTop ? "border-indigo-400 shadow-indigo-100" : "border-gray-100"
        }`}>
            {/* Top badge */}
            {isTop && (
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: "linear-gradient(to right, #8e98ff, #606beb)" }} />
            )}
            {isTop && (
                <div className="absolute top-3 right-3">
                    <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full" style={{ background: "linear-gradient(to right, #8e98ff, #606beb)" }}>
                        🏆 Best Match
                    </span>
                </div>
            )}

            <div className="p-5">
                {/* Header row */}
                <div className="flex items-start gap-4">
                    <MatchRing percentage={role.matchPercentage} />
                    <div className="flex-1 min-w-0 mt-1">
                        <div className="flex items-start gap-2 flex-wrap">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">#{rank}</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mt-0.5">{role.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <DemandBadge level={role.demandLevel} />
                            <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200">
                                🏢 {role.industry}
                            </span>
                            <span className="text-xs text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-semibold">
                                💰 {role.salaryRange}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <p className="text-sm text-gray-600 mt-4 leading-relaxed">{role.summary}</p>

                {/* Skills (always visible) */}
                <div className="mt-4">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills you have</p>
                    <div className="flex flex-wrap gap-1.5">
                        {role.keySkillsFound.map((s) => <SkillChip key={s} skill={s} found={true} />)}
                    </div>
                </div>

                {/* Expand/collapse missing skills */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                    id={`expand-role-${rank}`}
                >
                    {expanded ? "▲ Hide missing skills" : "▼ See missing skills & more"}
                </button>

                {expanded && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills to develop</p>
                        <div className="flex flex-wrap gap-1.5">
                            {role.missingSkills.map((s) => <SkillChip key={s} skill={s} found={false} />)}
                        </div>
                    </div>
                )}

                {/* ── Live job openings toggle ── */}
                <div className="mt-5">
                    <button
                        onClick={() => setShowJobs(!showJobs)}
                        id={`toggle-jobs-${rank}`}
                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                    >
                        <span className="flex items-center gap-2 text-sm font-bold text-indigo-600">
                            <span className="text-base">💼</span>
                            {showJobs ? "Hide job openings" : `View live job openings for ${role.title}`}
                        </span>
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2.5 py-1 rounded-full font-semibold group-hover:bg-indigo-200 transition-colors">
                            LinkedIn · Indeed · Glassdoor
                        </span>
                    </button>

                    {showJobs && (
                        <JobListings roleTitle={role.title} industry={role.industry} />
                    )}
                </div>
            </div>
        </div>
    );
};


// ── Uploader ──────────────────────────────────────────────────────────────────
const ResumeDropzone = ({ onFileSelect, file }: { onFileSelect: (f: File | null) => void; file: File | null }) => {
    const onDrop = useCallback((accepted: File[]) => {
        onFileSelect(accepted[0] || null);
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: { "application/pdf": [".pdf"] },
        maxSize: 20 * 1024 * 1024,
    });

    return (
        <div className={`gradient-border w-full cursor-pointer transition-all duration-200 ${isDragActive ? "scale-[1.02]" : ""}`} {...getRootProps()}>
            <input {...getInputProps()} />
            {file ? (
                <div className="flex items-center justify-between p-3 bg-white rounded-xl">
                    <div className="flex items-center gap-3">
                        <img src="/images/pdf.png" alt="pdf" className="w-10 h-10" />
                        <div>
                            <p className="text-sm font-semibold text-gray-800 truncate max-w-xs">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatSize(file.size)}</p>
                        </div>
                    </div>
                    <button
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
                    >
                        <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2 py-6">
                    <img src="/icons/info.svg" alt="upload" className="w-12 h-12 opacity-70" />
                    <p className="text-base text-gray-600">
                        <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-sm text-gray-400">PDF only · Max 20MB</p>
                </div>
            )}
        </div>
    );
};

// ── Profile strength bar ──────────────────────────────────────────────────────
const ProfileStrengthBar = ({ score }: { score: number }) => {
    const color = score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
    const label = score >= 75 ? "Strong Profile" : score >= 50 ? "Average Profile" : "Needs Work";
    return (
        <div className="flex items-center gap-4">
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-3 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }} />
            </div>
            <span className="text-sm font-bold text-gray-700 w-28 shrink-0">{score}/100 · {label}</span>
        </div>
    );
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function Match() {
    const { auth, isLoading, fs, ai } = usePuterStore();
    const navigate = useNavigate();
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [statusText, setStatusText] = useState("");
    const [result, setResult] = useState<JobMatchResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/match");
        }
    }, [isLoading, auth.isAuthenticated]);

    const handleAnalyze = async () => {
        if (!file) return;
        if (!auth.isAuthenticated) {
            navigate("/auth?next=/match");
            return;
        }
        setIsAnalyzing(true);
        setError(null);
        setResult(null);

        try {
            setStatusText("Uploading resume…");
            const uploadedFile = await fs.upload([file]);
            if (!uploadedFile) throw new Error("Upload failed — please make sure you are logged in and try again.");

            setStatusText("AI is reading your resume…");
            const response = await ai.feedback(uploadedFile.path, prepareJobMatchInstructions());
            if (!response) throw new Error("AI did not return a response. Please try again.");

            // Extract text from response (handles both string and array content)
            const rawText = typeof response.message.content === "string"
                ? response.message.content
                : (response.message.content as any)[0]?.text ?? "";

            // Strip markdown code fences if Claude wraps the JSON (e.g. ```json ... ```)
            const cleanText = rawText
                .replace(/^```(?:json)?\s*/i, "")
                .replace(/\s*```\s*$/i, "")
                .trim();

            let parsed: JobMatchResult;
            try {
                parsed = JSON.parse(cleanText);
            } catch {
                console.error("Raw AI response:", rawText);
                throw new Error("AI returned an unexpected format. Please try again.");
            }

            if (!parsed.roles || !Array.isArray(parsed.roles)) {
                throw new Error("AI response was missing role data. Please try again.");
            }

            setResult(parsed);
        } catch (err) {
            // Log the full error so it's visible in browser DevTools console
            console.error("Job Matcher error:", err);

            // Puter.js sometimes throws plain strings, objects, or Error instances
            let msg = "Something went wrong. Please try again.";
            if (typeof err === "string") {
                msg = err;
            } else if (err instanceof Error) {
                msg = err.message;
            } else if (err && typeof err === "object") {
                // Puter may throw { message: "...", code: ... } shaped objects
                const e = err as any;
                msg = e.message || e.error || e.msg || JSON.stringify(err);
            }
            setError(msg);
        } finally {
            setIsAnalyzing(false);
            setStatusText("");
        }
    };

    return (
        <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
            <Navbar />

            <section className="flex flex-col items-center gap-8 pt-12 mx-6 pb-16">

                {/* Page heading */}
                <div className="flex flex-col items-center gap-4 max-w-3xl text-center">
                    <h1>Job Role Matcher</h1>
                    <p className="text-xl text-gray-500">
                        Upload your resume and discover the <span className="font-semibold text-indigo-600">top 5 job roles</span> you are best suited for — no job description needed.
                    </p>
                </div>

                {/* Upload card */}
                {!result && !isAnalyzing && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 w-full max-w-xl flex flex-col gap-5">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">Upload Your Resume</h2>
                            <p className="text-sm text-gray-500">Our AI will analyze your skills, experience and education to find your best-fit roles.</p>
                        </div>

                        {/* Show loading while Puter checks auth */}
                        {isLoading && (
                            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-4 py-3 text-sm">
                                <div className="w-4 h-4 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin shrink-0" />
                                <span>Checking login status…</span>
                            </div>
                        )}

                        {/* Not signed in warning */}
                        {!isLoading && !auth.isAuthenticated && (
                            <div className="flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl px-4 py-3 text-sm">
                                <span>⚠️</span>
                                <span>You need to <button onClick={() => navigate("/auth?next=/match")} className="underline font-semibold hover:text-yellow-900">sign in</button> before analyzing your resume.</span>
                            </div>
                        )}

                        <ResumeDropzone file={file} onFileSelect={setFile} />


                        {error && (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                                <span>⚠️</span>
                                <span>{error}</span>
                                <button onClick={() => setError(null)} className="ml-auto font-bold hover:text-red-900">✕</button>
                            </div>
                        )}

                        <button
                            onClick={handleAnalyze}
                            disabled={!file}
                            id="find-roles-btn"
                            className="w-full py-3.5 rounded-full text-white font-bold text-base transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{ background: "linear-gradient(to bottom, #8e98ff, #606beb)", boxShadow: "0 4px 24px rgba(96,107,235,0.3)" }}
                        >
                            🎯 Find My Best Roles
                        </button>

                        <p className="text-xs text-gray-400 text-center">
                            Your resume is analyzed privately using Claude AI · Not stored permanently
                        </p>
                    </div>
                )}

                {/* Analyzing state */}
                {isAnalyzing && (
                    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-10 w-full max-w-xl flex flex-col items-center gap-5">
                        <img src="/images/resume-scan.gif" className="w-48 rounded-xl" alt="Analyzing..." />
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                            <p className="text-gray-700 font-medium">{statusText}</p>
                        </div>
                        <p className="text-sm text-gray-400 text-center">
                            Claude is reading your resume and matching it against thousands of job roles…
                        </p>
                    </div>
                )}

                {/* Results */}
                {result && !isAnalyzing && (
                    <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-700">

                        {/* Profile summary card */}
                        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: "linear-gradient(to bottom, #8e98ff, #606beb)" }}>
                                    🎯
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Your Profile Analysis</h2>
                                    <p className="text-sm text-gray-500 mt-0.5">Best fit: <span className="font-semibold text-indigo-600">{result.topRole}</span></p>
                                </div>
                                <div className="ml-auto text-right shrink-0">
                                    <p className="text-3xl font-black text-gray-900">{result.overallProfileStrength}<span className="text-base text-gray-400">/100</span></p>
                                    <p className="text-xs text-gray-400">Profile Strength</p>
                                </div>
                            </div>

                            <ProfileStrengthBar score={result.overallProfileStrength} />

                            <p className="text-sm text-gray-600 leading-relaxed mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 italic">
                                "{result.profileSummary}"
                            </p>
                        </div>

                        {/* Role cards */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">🏆 Your Top 5 Role Matches</h2>
                            <div className="flex flex-col gap-4">
                                {result.roles.map((role, i) => (
                                    <RoleCard key={role.title} role={role} rank={i + 1} />
                                ))}
                            </div>
                        </div>

                        {/* Try again */}
                        <div className="flex justify-center pt-2">
                            <button
                                onClick={() => { setResult(null); setFile(null); }}
                                className="px-6 py-2.5 rounded-full border-2 border-indigo-300 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-colors"
                                id="try-another-resume-btn"
                            >
                                ↩ Analyze Another Resume
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </main>
    );
}
