import {useState} from "react";
import type {Pet, AIReport} from "../types/types.ts";

interface AIReportTabProps {
    pet: Pet;
    onUpdatePet: (updatedPet: Pet) => void;
}

const AIReportTab: React.FC<AIReportTabProps> = ({ pet, onUpdatePet }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    // 리포트 생성하기 버튼을 눌렀을 때 실행되는 함수
    const handleGenerateReport = () => {
        if (isGenerating) return;

        // 무료 체험 횟수 없으면 실행 X
        if (pet.freeReportCount <= 0) {
            alert("무료 체험 횟수를 모두 사용하셨습니다. 유료 플랜으로 전환해주세요.");
            return;
        }

        setIsGenerating(true); // 로딩

        // 우선 AI가 아닌 목업리포트 대신
        setTimeout(() => {
            // 새로운 AI 리포트 객체 생성 (실제로는 AI 응답을 바탕으로 만들어야 함)
            const newReport: AIReport = {
                id: `report-${Date.now()}`,
                date: new Date().toISOString().slice(0, 10),
                overallScore: Math.floor(Math.random() * 15) + 85, // 85~99점 사이의 랜덤 점수
                summary: `${pet.name}의 전반적인 건강 상태는 매우 양호합니다. 최근 기록된 활동량과 체중 변화를 바탕으로 볼 때, 이상 징후는 발견되지 않았습니다.`,
                warnings: [
                    '음수량이 평균보다 약간 적습니다. 신선한 물을 자주 갈아주세요.',
                    '최근 활동량 기록이 없습니다. 꾸준한 기록은 건강 분석에 큰 도움이 됩니다.'
                ],
                recommendations: [
                    '주 1회 이상 새로운 산책 코스를 탐방하여 스트레스를 해소해주세요.',
                    '관절 건강을 위해 오메가-3 영양제를 급여하는 것을 고려해보세요.'
                ]
            };

            // 기존 펫 정보에 새로운 리포트를 추가하고 무료 체험 횟숫를 1 차감
            const updatedPet: Pet = {
                ...pet,
                aiReports: [newReport, ...(pet.aiReports || [])],
                freeReportCount: pet.freeReportCount - 1,
            };

            onUpdatePet(updatedPet);

            setIsGenerating(false); // 로딩 종료
        }, 2500);
    };

    return (
        <div className="animate-fade-in space-y-8">
            {/* 리포트 생성 카드 */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">AI 건강 리포트 생성</h3>
                        <p className="text-gray-500 mt-1">
                            {pet.name}의 최근 건강 기록을 바탕으로 AI가 종합 리포트를 생성합니다.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-center">
                        <p className="text-sm font-medium text-gray-600">남은 무료 체험 횟수</p>
                        <p className="text-3xl font-bold text-indigo-600">{pet.freeReportCount} <span
                            className="text-lg font-normal text-gray-500">/ 3</span></p>
                    </div>
                </div>

                {/* 리포트 생성 버튼 - 유료 전환 안 */}
                <div className="mt-6">
                    {pet.freeReportCount > 0 ? (
                        <button
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor"
                                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    리포트 생성 중...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-microchip mr-2"></i>
                                    {'리포트 생성하기'}
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-bold text-yellow-800">무료 체험이 종료되었습니다.</h4>
                            <p className="text-sm text-yellow-700 mt-1">더 많은 리포트를 생성하려면 유료 플랜으로 업그레이드해주세요.</p>
                            <button
                                className="mt-3 bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition">
                                유료 플랜 보러가기
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 이전 리포트 목록 */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-700">최신 리포트 목록</h3>
                {pet.aiReports && pet.aiReports.length > 0 ? (
                    pet.aiReports.map(report => (
                        <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-gray-800">종합 건강 점수: <span className="text-blue-600">{report.overallScore}점</span></p>
                                <p className="text-sm text-gray-500">{report.date}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">{report.summary}</p>
                            {/* (추가) 리포트 상세보기 버튼 */}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">아직 생성된 리포트가 없습니다.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIReportTab;