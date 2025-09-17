import React, { useState, useMemo } from 'react';
import type { Pet, SurveyAnswers, PremiumQuestion } from '../types/types';
import { ALL_QUESTIONS } from '../constants/healthQuestions';

interface HealthSurveyProps {
    pet: Pet;
    onComplete: (answers: SurveyAnswers, questions: PremiumQuestion[]) => void;
    onBack: () => void;
}

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const HealthSurvey: React.FC<HealthSurveyProps> = ({ pet, onComplete, onBack }) => {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Partial<SurveyAnswers>>({ plan: pet.plan });

    const surveyQuestions = useMemo(() => {
        if (pet.plan === 'premium') {
            const coreCategories: PremiumQuestion['category'][] = ['diet', 'energy', 'stool', 'behavior', 'joints', 'skin'];
            const guaranteedQuestions: PremiumQuestion[] = [];
            let remainingQuestions = [...ALL_QUESTIONS];

            // 1. Pick one random question from each core category
            coreCategories.forEach(category => {
                const questionsInCategory = remainingQuestions.filter(q => q.category === category);
                if (questionsInCategory.length > 0) {
                    const randomIndex = Math.floor(Math.random() * questionsInCategory.length);
                    const selectedQuestion = questionsInCategory[randomIndex];
                    guaranteedQuestions.push(selectedQuestion);
                    // Remove the selected question from the pool
                    remainingQuestions = remainingQuestions.filter(q => q.text !== selectedQuestion.text);
                }
            });

            // 2. Shuffle the remaining questions and pick the rest
            const shuffledRemaining = shuffleArray(remainingQuestions);
            const additionalQuestions = shuffledRemaining.slice(0, 20 - guaranteedQuestions.length);

            // 3. Combine and shuffle the final list
            const finalQuestions = shuffleArray([...guaranteedQuestions, ...additionalQuestions]);
            return finalQuestions;
        }

        // For free plan, select one question from each of the first 4 categories
        const freeCategories: PremiumQuestion['category'][] = ['diet', 'energy', 'stool', 'behavior'];
        return freeCategories.map(category => {
            const questionsInCategory = ALL_QUESTIONS.filter(q => q.category === category);
            return questionsInCategory[Math.floor(Math.random() * questionsInCategory.length)];
        });
    }, [pet.plan]);

    const currentQuestion = surveyQuestions[step];

    if (!currentQuestion) {
        return (
            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                <h3 className="text-xl font-bold text-red-500">오류</h3>
                <p className="text-gray-600 mt-2">설문 질문을 불러오는 데 실패했습니다. 다시 시도해주세요.</p>
                <button onClick={onBack} className="mt-6 py-2 px-6 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition">돌아가기</button>
            </div>
        );
    }

    const handleSelect = (optionValue: string) => {
        const { category, subKey } = currentQuestion;
        setAnswers(prev => ({
            ...prev,
            [category]: {
                ...(prev as SurveyAnswers)[category],
                [subKey]: optionValue,
            },
        }));
    };

    const handleNext = () => (step < surveyQuestions.length - 1) && setStep(step + 1);
    const handleBack = () => (step > 0) && setStep(step - 1);

    const handleSubmit = () => {
        // The submit button is only enabled on the last step, so we can directly call onComplete.
        onComplete(answers as SurveyAnswers, surveyQuestions);
    };

    const progress = ((step + 1) / surveyQuestions.length) * 100;
    
    const getCurrentAnswer = () => {
        const { category, subKey } = currentQuestion;
        return (answers as SurveyAnswers)[category]?.[subKey];
    }
    const currentAnswer = getCurrentAnswer();

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 animate-fade-in">
            <button onClick={onBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"><i className="fas fa-times text-2xl"></i></button>
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-indigo-600">{pet.plan === 'premium' ? '프리미엄' : ''} 건강 설문</p>
                    <p className="text-sm font-medium text-gray-500">{step + 1} / {surveyQuestions.length}</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div></div>
            </div>
            <div className="text-center my-8 min-h-[60px] px-4"><h3 className="text-xl sm:text-2xl font-bold text-gray-800">{currentQuestion.text}</h3></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map(option => (
                    <button
                        key={option.value}
                        onClick={() => handleSelect(option.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-transform duration-200 hover:scale-105 ${
                            currentAnswer === option.value ? 'bg-indigo-100 border-indigo-500 shadow-md' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}>
                        <span className="text-base sm:text-lg font-semibold text-gray-700">{option.text}</span>
                    </button>
                ))}
            </div>
            <div className="flex justify-between items-center mt-10">
                <button onClick={handleBack} disabled={step === 0} className="py-2 px-6 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transition disabled:opacity-50">이전</button>
                {step < surveyQuestions.length - 1 ? (
                    <button onClick={handleNext} disabled={!currentAnswer} className="py-2 px-6 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-lg disabled:bg-gray-400">다음</button>
                ) : (
                    <button onClick={handleSubmit} disabled={!currentAnswer} className="py-2 px-6 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition shadow-lg disabled:bg-gray-400">결과 보기</button>
                )}
            </div>
        </div>
    );
};

export default HealthSurvey;