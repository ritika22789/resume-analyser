const RAPIDAPI_KEY = "d92896575fmsh35568bc801e3bfdp1bb316jsn768154026948";
const RAPIDAPI_HOST = "jsearch.p.rapidapi.com";

export interface JSearchJob {
    job_id: string;
    job_title: string;
    employer_name: string;
    employer_logo: string | null;
    employer_website: string | null;
    job_city: string | null;
    job_state: string | null;
    job_country: string;
    job_employment_type: string;
    job_apply_link: string;
    job_posted_at_datetime_utc: string;
    job_min_salary: number | null;
    job_max_salary: number | null;
    job_salary_currency: string | null;
    job_salary_period: string | null;
    job_description: string;
    job_is_remote: boolean;
    job_required_experience: {
        required_experience_in_months: number | null;
    } | null;
}

export async function searchJobs(roleTitle: string, page = 1): Promise<JSearchJob[]> {
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(roleTitle)}&page=${page}&num_pages=1&date_posted=all&remote_jobs_only=false`;

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": RAPIDAPI_KEY,
            "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Job search failed (${response.status}): ${text}`);
    }

    const data = await response.json();
    return (data.data as JSearchJob[]) || [];
}

export function formatSalary(job: JSearchJob): string {
    if (!job.job_min_salary && !job.job_max_salary) return "";
    const currency = job.job_salary_currency || "USD";
    const period = job.job_salary_period === "YEAR" ? "/yr"
        : job.job_salary_period === "MONTH" ? "/mo"
        : job.job_salary_period === "HOUR" ? "/hr" : "";
    const fmt = (n: number) =>
        n >= 1000 ? `$${Math.round(n / 1000)}k` : `$${n}`;
    if (job.job_min_salary && job.job_max_salary) {
        return `${fmt(job.job_min_salary)} – ${fmt(job.job_max_salary)}${period}`;
    }
    return `${fmt(job.job_min_salary || job.job_max_salary!)}${period}`;
}

export function timeAgo(dateStr: string): string {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return `${Math.floor(days / 30)}mo ago`;
}
