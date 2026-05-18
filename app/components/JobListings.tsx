import { useState } from "react";
import { searchJobs, formatSalary, timeAgo, type JSearchJob } from "~/lib/jsearch";

// ── Employment type badge ─────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: string }) => {
    const map: Record<string, string> = {
        FULLTIME: "bg-green-100 text-green-700 border-green-200",
        PARTTIME: "bg-blue-100 text-blue-700 border-blue-200",
        CONTRACTOR: "bg-orange-100 text-orange-700 border-orange-200",
        INTERN: "bg-purple-100 text-purple-700 border-purple-200",
    };
    const labels: Record<string, string> = {
        FULLTIME: "Full-time",
        PARTTIME: "Part-time",
        CONTRACTOR: "Contract",
        INTERN: "Internship",
    };
    const style = map[type] || "bg-gray-100 text-gray-600 border-gray-200";
    return (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${style}`}>
            {labels[type] || type}
        </span>
    );
};

// ── Single job card ───────────────────────────────────────────────────────────
const JobCard = ({ job }: { job: JSearchJob }) => {
    const salary = formatSalary(job);
    const posted = timeAgo(job.job_posted_at_datetime_utc);
    const location = [job.job_city, job.job_state, job.job_country]
        .filter(Boolean).join(", ");

    return (
        <div className="flex gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:border-indigo-200 transition-all duration-200 group">
            {/* Company logo */}
            <div className="w-12 h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
                {job.employer_logo ? (
                    <img
                        src={job.employer_logo}
                        alt={job.employer_name}
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                            (e.target as HTMLImageElement).parentElement!.innerHTML =
                                `<span class="text-xl">${job.employer_name[0]}</span>`;
                        }}
                    />
                ) : (
                    <span className="text-xl font-bold text-gray-400">
                        {job.employer_name[0]}
                    </span>
                )}
            </div>

            {/* Job info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                            {job.job_title}
                        </h4>
                        <p className="text-sm text-gray-500 mt-0.5">{job.employer_name}</p>
                    </div>
                    <a
                        href={job.job_apply_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`apply-job-${job.job_id}`}
                        className="shrink-0 text-xs font-bold text-white px-3 py-1.5 rounded-full transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(to bottom, #8e98ff, #606beb)" }}
                    >
                        Apply →
                    </a>
                </div>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                    <TypeBadge type={job.job_employment_type} />

                    {job.job_is_remote && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full border bg-teal-50 text-teal-700 border-teal-200">
                            🌐 Remote
                        </span>
                    )}

                    {location && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                            📍 {location}
                        </span>
                    )}

                    {salary && (
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            💰 {salary}
                        </span>
                    )}

                    {posted && (
                        <span className="text-xs text-gray-400 ml-auto shrink-0">
                            {posted}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

// ── Source logos strip ─────────────────────────────────────────────────────────
const SourceStrip = () => (
    <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>Results from</span>
        <span className="font-semibold text-blue-600">LinkedIn</span>
        <span>·</span>
        <span className="font-semibold text-blue-500">Indeed</span>
        <span>·</span>
        <span className="font-semibold text-green-600">Glassdoor</span>
        <span>·</span>
        <span className="font-semibold text-orange-500">ZipRecruiter</span>
    </div>
);

// ── Main JobListings component ────────────────────────────────────────────────
interface JobListingsProps {
    roleTitle: string;
    industry: string;
}

const JobListings = ({ roleTitle, industry }: JobListingsProps) => {
    const [jobs, setJobs] = useState<JSearchJob[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchJobs = async (pageNum = 1, append = false) => {
        if (pageNum === 1) setLoading(true);
        else setLoadingMore(true);
        setError(null);

        try {
            const results = await searchJobs(roleTitle, pageNum);
            setJobs(prev => append ? [...prev, ...results] : results);
            setLoaded(true);
            setPage(pageNum);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to load jobs.";
            setError(msg);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    // Initial trigger
    if (!loaded && !loading && !error) {
        // Don't auto-fetch — wait for button click
    }

    return (
        <div className="mt-4 border-t border-gray-100 pt-4">
            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
                <div>
                    <p className="text-sm font-bold text-gray-800">
                        🔍 Live Job Openings · <span className="text-indigo-600">{roleTitle}</span>
                    </p>
                    {loaded && <SourceStrip />}
                </div>
                {!loaded && !loading && (
                    <button
                        onClick={() => fetchJobs(1)}
                        id={`find-jobs-${roleTitle.replace(/\s+/g, "-").toLowerCase()}`}
                        className="text-xs font-bold text-white px-3 py-1.5 rounded-full transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(to bottom, #8e98ff, #606beb)" }}
                    >
                        Find Jobs
                    </button>
                )}
                {loaded && (
                    <button
                        onClick={() => fetchJobs(1)}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                        ↺ Refresh
                    </button>
                )}
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col items-center gap-3 py-8">
                    <div className="w-7 h-7 rounded-full border-2 border-indigo-200 border-t-indigo-600 animate-spin" />
                    <p className="text-sm text-gray-500">
                        Searching LinkedIn, Indeed, Glassdoor…
                    </p>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <span>⚠️</span>
                    <span>{error}</span>
                    <button
                        onClick={() => fetchJobs(1)}
                        className="ml-auto font-semibold hover:text-red-900 underline"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Job list */}
            {loaded && !loading && jobs.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-6">
                    No openings found for "{roleTitle}" right now. Try refreshing.
                </p>
            )}

            {loaded && jobs.length > 0 && (
                <>
                    <div className="flex flex-col gap-3">
                        {jobs.map(job => (
                            <JobCard key={job.job_id} job={job} />
                        ))}
                    </div>

                    {/* Load more */}
                    <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => fetchJobs(page + 1, true)}
                            disabled={loadingMore}
                            className="text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-full px-5 py-2 hover:bg-indigo-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {loadingMore && (
                                <span className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                            )}
                            {loadingMore ? "Loading…" : "Load More Jobs"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default JobListings;
