interface Resume {
    id: string;
    companyName?: string;
    jobTitle?: string;
    imagePath: string;
    resumePath: string;
    feedback: Feedback;
}

interface Feedback {
    overallScore: number;
    ATS: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
        }[];
    };
    toneAndStyle: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    content: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    structure: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
    skills: {
        score: number;
        tips: {
            type: "good" | "improve";
            tip: string;
            explanation: string;
        }[];
    };
}

interface JobRoleMatch {
    title: string;
    matchPercentage: number;
    summary: string;
    keySkillsFound: string[];
    missingSkills: string[];
    salaryRange: string;
    demandLevel: "High" | "Medium" | "Low";
    industry: string;
}

interface JobMatchResult {
    roles: JobRoleMatch[];
    topRole: string;
    overallProfileStrength: number;
    profileSummary: string;
}
