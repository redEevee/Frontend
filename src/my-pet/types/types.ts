export interface DailyMission {
    task: string;
    done: boolean;
}

export interface Pet {
    id: number;
    name: string;
    gender: '남아' | '여아';
    breed: string;
    dob: string; // 생년월일
    hasMicrochip: boolean;
    isNeutered: boolean; // 중성화여부
    imageUrl: string;
    dailyMission: DailyMission[];
}