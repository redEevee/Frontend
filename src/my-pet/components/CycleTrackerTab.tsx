import { useState, useMemo } from "react";
import type { Pet, HeatCycle } from "../types/types.ts";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

interface CycleTrackerTab {
    petData: Pet;
    onUpdate: (updatedPet: Pet) => void;
}

const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatDate = (date: Date): string => {
    return date.toISOString().slice(0, 10);
};

const CycleTrackerTab: React.FC<CycleTrackerTab> = ({ petData, onUpdate }) => {
    // 사용자가 날짜 입력창에 입력한 값을 저장
    const [startDate, setStartDate] = useState<string>(formatDate(new Date()));

    // 기록된 생리주기 데이터를 바탕으로 다음 예정일, 임신 기간 등을 계산하는 로직
    const cycleInfo = useMemo(() => {
        if (!petData.heatCycles || petData.heatCycles.length === 0) {
            return null;
        }

        const sortedCycles = [...petData.heatCycles].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        const lastCycle = sortedCycles[0];
        const lastStartDate = new Date(lastCycle.startDate);

        const avgCycleDays = petData.type === 'dog' ? 180 : 21; // 강아지 약 6개월, 고양이 약 3주
        const heatDuration = petData.type === 'dog' ? 10 : 7; // 평균 발정 기간
        const pregnancyDuration = 63; // 평균 임신 기간

        const nextHeatDate = addDays(lastStartDate, avgCycleDays);
        const estimatedDueDate = addDays(lastStartDate, pregnancyDuration);

        return {
            lastStartDate,
            nextHeatDate,
            estimatedDueDate,
            heatDuration,
            // 다음 예정일까지 남은 날짜를 계산
            daysUntilNextCycle: Math.round((nextHeatDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        };
    }, [petData.heatCycles, petData.type]);

    // '기록 추가' 버튼을 눌렀을 때 실행되는 함수
    const handleAddCycle = () => {
        if (!startDate) return;

        const newCycle: HeatCycle = {
            id: Date.now(),
            startDate: startDate,
        };

        const updatedCycles = [...(petData.heatCycles || []), newCycle];
        onUpdate({ ...petData, heatCycles: updatedCycles });
    };

    // 기록된 주기를 삭제하는 함수
    const handleDeleteCycle = (cycleId: number) => {
        const updatedCycles = petData.heatCycles.filter(c => c.id !== cycleId);
        onUpdate({ ...petData, heatCycles: updatedCycles });
    };

    const tileContent = ({ date, view }: { date: Date, view: string }) => {
        if (view === 'month' && cycleInfo) {
            const day = formatDate(date);

            // 기록된 모든 생리 기간을 달력에 분홍색 점으로 표시
            for (const cycle of petData.heatCycles) {
                const start = new Date(cycle.startDate);
                const end = addDays(start, cycleInfo.heatDuration);
                if (date >= start && date <= end) {
                    return <div className="h-2 w-2 bg-pink-400 rounded-full mx-auto mt-1" title="생리 기간"></div>;
                }
            }

            // 다음 예정일을 파란색 점으로 표시
            if (day === formatDate(cycleInfo.nextHeatDate)) {
                return <div className="h-2 w-2 bg-blue-400 rounded-full mx-auto mt-1" title="다음 예정일"></div>;
            }
        }
        return null;
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 왼쪽: 정보 및 기록 입력 영역 */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4">주기 정보 및 기록</h3>

                    {/* 다음 예정일 정보 */}
                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                        {cycleInfo && cycleInfo.daysUntilNextCycle > 0 ? (
                            <>
                                <p className="font-semibold text-indigo-800">다음 예정일</p>
                                <p className="text-3xl font-bold text-indigo-600">{formatDate(cycleInfo.nextHeatDate)}</p>
                                <p className="text-sm text-indigo-500">{cycleInfo.daysUntilNextCycle}일 남음 (3일 전 알림 예정)</p>
                            </>
                        ) : (
                            <p className="text-gray-500">기록을 추가하면 다음 예정일을 예측해 드려요.</p>
                        )}
                    </div>

                    {/* 기록 추가 영역 */}
                    <div className="space-y-2 mb-6">
                        <label htmlFor="heat-start" className="font-semibold text-gray-700">최근 생리 시작일</label>
                        <div className="flex gap-2">
                            <input
                                type="date"
                                id="heat-start"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                            <button onClick={handleAddCycle} className="py-2 px-4 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition">
                                기록
                            </button>
                        </div>
                    </div>

                    {/* 기록 목록 */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700">기록 목록</h4>
                        <div className="max-h-40 overflow-y-auto pr-2">
                            {petData.heatCycles && petData.heatCycles.length > 0 ? (
                                petData.heatCycles.map(cycle => (
                                    <div key={cycle.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                                        <span>{cycle.startDate}</span>
                                        <button onClick={() => handleDeleteCycle(cycle.id)} className="text-red-400 hover:text-red-600">
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">기록이 없어요.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 달력 영역 */}
                <div className="flex flex-col items-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">주기 달력</h3>
                    <Calendar
                        tileContent={tileContent}
                        className="border-none shadow-md rounded-lg p-2"
                    />
                    <div className="flex gap-4 mt-4 text-sm">
                        <div className="flex items-center gap-2"><div className="h-3 w-3 bg-pink-400 rounded-full"></div> 생리 기간</div>
                        <div className="flex items-center gap-2"><div className="h-3 w-3 bg-blue-400 rounded-full"></div> 다음 예정일</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CycleTrackerTab;

