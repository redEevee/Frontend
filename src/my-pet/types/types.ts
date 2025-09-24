export interface DailyMission {
    task: string;
    done: boolean;
}

// 체중 기록
export interface WeightRecord {
    id: number;
    date: string;
    weigh: number;
}

// 건강 메모
export interface HealthNote {
    id: number;
    date: string;
    mood: 'good' | 'normal' | 'bad'; //기분
    poop: 'good' | 'normal' | 'bad'; //대변
    pee: 'good' | 'normal' | 'bad'; //소변
    symptoms: string; // 특이 증상
}

// 생리 주기 기록
export interface HeatCycle {
    id: number;
    startDate: string;
}

// AI 리포트 데이터
export interface AIReport {
    id: string;
    type: 'legacy' | 'inbody';
    date: string;
    summary: string; // AI가 생성한 요약
    overallScore: number; // 100점 만점 건강 점수
    warnings: string[]; //주의사항
    recommendations: string[]; // 추천 사항 목록
}

// --- Survey and Report Types ---

// This will be the single source of truth for survey answers.
// It accommodates both free and premium plans by having a flexible structure.
export interface SurveyAnswers {
    plan: 'free' | 'premium';
    diet?: { [key: string]: string };
    energy?: { [key: string]: string };
    stool?: { [key: string]: string };
    behavior?: { [key: string]: string };
    joints?: { [key: string]: string };
    skin?: { [key: string]: string };
}

// 인바디 리포트 결과
export interface InBodyReport extends AIReport {
    type: 'inbody';
    answers: SurveyAnswers;
    scores: {
        diet: number;
        energy: number;
        stool: number;
        behavior: number;
        joints?: number; // Premium only
        skin?: number;   // Premium only
    };
}

// 설문 질문 타입
export interface PremiumQuestion {
    category: 'diet' | 'energy' | 'stool' | 'behavior' | 'joints' | 'skin';
    subKey: string;
    text: string;
    options: { value: string; text: string }[];
    scores: { [key: string]: number };
    recommendations?: { [key: string]: string };
}


//펫 타입 속성들
export interface Pet {
    id: number;
    type: 'dog' | 'cat' | 'other';
    name: string;
    gender: '남아' | '여아' | '정보없음';
    mainBreed: string;
    subBreed: string;
    customBreed: string;
    dob: string;
    plan: 'free' | 'premium';
    hasMicrochip: boolean;
    isNeutered: boolean;
    imageUrl: string;
    registrationNum: string;
    registrationUrl: string;

    // 데일리 미션 관련 데이터
    dailyMission: DailyMission[];
    hasRerolledToday: boolean;
    lastMissionDate: string;

    // AI 리포트 무료 유료 사용 관련
    freeReportCount: number; //AI 무료 체험 횟수
    weightRecords: WeightRecord[];
    healthNotes: HealthNote[];
    heatCycles: HeatCycle[];
    aiReports: AIReport[];
}