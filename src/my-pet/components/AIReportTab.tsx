import { useState } from "react";
import type { Pet, AIReport, SurveyAnswers, InBodyReport, PremiumQuestion } from "../types/types.ts";
import HealthSurvey from "./HealthSurvey.tsx";
import InBodyResult from "./InBodyResult.tsx";

interface AIReportTabProps {
    pet: Pet;
    onUpdatePet: (updatedPet: Pet) => void;
}

const AIReportTab: React.FC<AIReportTabProps> = ({ pet: originalPet, onUpdatePet }) => {
    const pet = {
        ...originalPet,
        plan: originalPet.id === 1 ? 'premium' : originalPet.plan,
    };
    const [view, setView] = useState<'idle' | 'survey' | 'result'>('idle');
    const [activeResult, setActiveResult] = useState<InBodyReport | null>(null);

    const handleStartSurvey = () => {
        if (pet.plan === 'free' && (pet.freeReportCount ?? 3) <= 0) {
            alert("무료 체험 횟수를 모두 사용하셨습니다. 유료 플랜으로 전환해주세요.");
            return;
        }
        setView('survey');
    };

    const handleSurveyComplete = (answers: SurveyAnswers, questions: PremiumQuestion[]) => {
        const categoryScores: { [key: string]: number[] } = {};
        const warnings: string[] = [];
        const recommendations: string[] = [];
        let summary = '';

        questions.forEach(q => {
            const answer = (answers as SurveyAnswers)[q.category]?.[q.subKey];
            if (answer) {
                const score = q.scores[answer] || 0;
                if (!categoryScores[q.category]) {
                    categoryScores[q.category] = [];
                }
                categoryScores[q.category].push(score);

                const recommendation = q.recommendations?.[answer];
                if (recommendation) {
                    if (score < 50) warnings.push(recommendation); // 점수가 낮으면 경고로 분류
                    else recommendations.push(recommendation);
                }
            }
        });

        const finalScores: InBodyReport['scores'] = { diet: 0, energy: 0, stool: 0, behavior: 0, joints: 0, skin: 0 };
        let totalScore = 0;
        let categoryCount = 0;

        for (const category in categoryScores) {
            if (Object.prototype.hasOwnProperty.call(categoryScores, category)) {
                const scores = categoryScores[category];
                const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
                (finalScores as any)[category] = Math.round(averageScore);
                totalScore += averageScore;
                categoryCount++;
            }
        }

        const overallScore = categoryCount > 0 ? Math.round(totalScore / categoryCount) : 0;

        if (overallScore >= 95) {
            summary = `최상의 컨디션! ${pet.name}의 건강 상태는 거의 완벽해요. 지금처럼만 꾸준히 관리해주세요.`;
        } else if (overallScore >= 85) {
            summary = `${pet.name}의 건강 상태는 매우 양호합니다. 몇 가지 사소한 부분만 신경 쓴다면 더욱 건강하게 지낼 수 있을 거예요.`;
        } else if (overallScore >= 70) {
            summary = `전반적으로 건강하지만, 몇 가지 개선이 필요한 부분이 보여요. ${pet.name}의 작은 변화에 주의를 기울여주세요.`;
        } else if (overallScore >= 50) {
            summary = `${pet.name}의 건강에 주의가 필요해 보입니다. 리포트의 주의사항과 추천사항을 꼼꼼히 확인하고 생활 습관을 개선해주세요.`;
        } else {
            summary = `${pet.name}의 건강 상태에 적신호가 켜졌습니다. 하나 이상의 영역에서 우려되는 점이 발견되었습니다. 빠른 시일 내에 수의사와 상담하여 정확한 진단을 받아보시는 것을 강력히 권장합니다.`;
        }
        if (warnings.length === 0 && recommendations.length === 0) {
            if (overallScore >= 90) {
                recommendations.push('특별한 이상 징후 없이 아주 건강합니다! 지금처럼 꾸준히 관리해주세요.');
            } else if (overallScore >= 75) {
                recommendations.push('전반적으로 양호한 상태입니다. 부족한 영역의 점수를 높일 수 있도록 조금만 더 신경 써주세요!');
            }
        }

        const newReport: InBodyReport = {
            id: `inbody-${Date.now()}`,
            type: 'inbody',
            date: new Date().toISOString().slice(0, 10),
            overallScore,
            summary,
            warnings,
            recommendations,
            answers,
            scores: finalScores,
        };

        const updatedPet: Pet = {
            ...pet,
            aiReports: [newReport, ...(pet.aiReports || [])],
            freeReportCount: pet.plan === 'premium' ? pet.freeReportCount : (pet.freeReportCount ?? 3) - 1,
        };
        onUpdatePet(updatedPet);

        setActiveResult(newReport);
        setView('result');
    };

    const handleViewResult = (report: AIReport) => {
        if (report.type === 'inbody') {
            setActiveResult(report as InBodyReport);
            setView('result');
        } else {
            alert(`(구 버전 리포트) ${report.date} / ${report.overallScore}점\n${report.summary}`);
        }
    }

    const handleReturnToIdle = () => {
        setView('idle');
        setActiveResult(null);
    }

    if (view === 'survey') {
        return <HealthSurvey pet={pet} onComplete={handleSurveyComplete} onBack={handleReturnToIdle} />;
    }

    if (view === 'result' && activeResult) {
        return <InBodyResult pet={pet} result={activeResult} onBack={handleReturnToIdle} />;
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800">펫바디 건강 설문</h3>
                        <p className="text-gray-500 mt-1">{pet.name}의 상태에 대한 몇 가지 질문에 답하고 상세 리포트를 받아보세요.</p>
                    </div>
                    {pet.plan === 'free' && (
                         <div className="mt-4 sm:mt-0 text-center">
                            <p className="text-sm font-medium text-gray-600">남은 무료 횟수</p>
                            <p className="text-3xl font-bold text-indigo-600">{pet.freeReportCount ?? 3} <span className="text-lg font-normal text-gray-500">/ 3</span></p>
                        </div>
                    )}
                     {pet.plan === 'premium' && (
                         <div className="mt-4 sm:mt-0 text-center">
                            <p className="text-sm font-medium text-yellow-500">프리미엄 플랜</p>
                            <p className="text-3xl font-bold text-yellow-500"><i className="fas fa-crown"></i> 무제한</p>
                        </div>
                    )}
                </div>
                <div className="mt-6">
                    {(pet.plan === 'premium' || (pet.freeReportCount ?? 3) > 0) ? (
                        <button onClick={handleStartSurvey} className="w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-lg">
                            <i className="fas fa-poll-h mr-2"></i>
                            {pet.plan === 'premium' ? '프리미엄 정밀 설문 시작' : '건강 설문 시작하기'}
                        </button>
                    ) : (
                        <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <h4 className="font-bold text-yellow-800">무료 체험이 종료되었습니다.</h4>
                            <p className="text-sm text-yellow-700 mt-1">더 많은 리포트를 생성하려면 유료 플랜으로 업그레이드해주세요.</p>
                            <button className="mt-3 bg-yellow-400 text-yellow-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition">유료 플랜 보러가기</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-700">최신 리포트 목록</h3>
                {pet.aiReports && pet.aiReports.length > 0 ? (
                    pet.aiReports.map(report => (
                        <div key={report.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer" onClick={() => handleViewResult(report)}>
                            <div className="flex justify-between items-center">
                                <p className="font-bold text-gray-800">
                                    <i className={`fas ${report.type === 'inbody' ? 'fa-poll-h' : 'fa-microchip'} mr-2 text-indigo-500`}></i>
                                    종합 건강 점수: <span className="text-blue-600">{report.overallScore}점</span>
                                </p>
                                <p className="text-sm text-gray-500">{report.date}</p>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 ml-1">{report.summary}</p>
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