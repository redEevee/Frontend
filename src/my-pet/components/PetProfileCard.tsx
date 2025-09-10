import React, {useMemo} from "react";
import type {Pet} from "../types/types.ts";

interface PetProfileCardProps {
    pet: Pet;
    onEdit: (pet: Pet) => void;
    onOpenConfirm: (id: number) => void;
    onShowAlert: (message: string) => void;
}

const PetProfileCard: React.FC<PetProfileCardProps> = ({pet, onEdit, onOpenConfirm, onShowAlert}) => {
    // 데일리 미션 진행도 계산 영역
    const missionProgress = useMemo(() => {
        const totalMissions = pet.dailyMission.length;
        if (totalMissions === 0) return 0;
        const completedMissions = pet.dailyMission.filter(m => m.done).length;
        return Math.round((completedMissions / totalMissions) * 100);
    }, [pet.dailyMission]);

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = `https://placehold.co/150x150/E0E7FF/4F46E5?text=🐾`;
        e.currentTarget.classList.add('p-4');
    };

    return (
        <div
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl">
            <div className="p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* 프로필 이미지 (이전과 동일) */}
                    <div className="relative flex-shrink-0">
                        <div
                            className="w-40 h-40 rounded-full overflow-hidden border-4 border-indigo-200 bg-gray-100 flex items-center justify-center">
                            <img
                                className="h-full w-full object-cover"
                                src={pet.imageUrl}
                                alt={`${pet.name}의 프로필 사진`}
                                onError={handleImageError}
                            />
                        </div>
                        {/* 마이크로칩, 중성화 아이콘 (조건부 랜더링) */}
                        {pet.hasMicrochip && (
                            <div
                                className="absolute top-2 left-2 bg-sky-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                title="마이크로칩 등록됨">
                                <i className="fas fa-microchip"></i>
                            </div>
                        )}
                        {pet.isNeutered && (
                            <div
                                className="absolute top-2 right-2 bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                                title="중성화 완료">
                                <i className="fas fa-cut"></i>
                            </div>
                        )}
                    </div>

                    {/* 펫 타입 관련 */}
                    <div className="flex-grow w-full text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                            {pet.type === 'dog' ? (
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-200">
                                    <i className="fas fa-dog mr-1"></i>DOG
                                </span>
                            ) : pet.type === 'cat' ? (
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                                    <i className="fas fa-cat mr-1"></i>CAT
                                </span>
                            ) : (
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">
                                    <i className="fas fa-paw mr-1"></i>OTHER
                                </span>
                            )}
                            <p className="text-lg text-gray-600 font-medium">{pet.breed}</p>
                        </div>

                        {/* 이름, 성별, 수정/삭제 버튼을 한 줄에 정렬*/}
                        <div className="flex items-baseline justify-center md:justify-start gap-4">
                            <p className="text-3xl font-bold text-gray-800">{pet.name} <span className="text-xl font-medium text-gray-500">({pet.gender})</span></p>
                            <div className="space-x-1">
                                <button onClick={() => onEdit(pet)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"><i className="fas fa-pen text-sm"></i></button>
                                <button onClick={() => onOpenConfirm(pet.id)} className="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-red-500 transition"><i className="fas fa-trash text-sm"></i></button>
                            </div>
                        </div>

                        {/* 펫 생일 기능 */}
                        <div className="flex items-center justify-center md:justify-start gap-2 text-md text-gray-500 mt-1">
                            <i className="fas fa-birthday-cake"></i>
                            <span>{pet.dob}</span>
                        </div>

                        {/* 데일리 미션 */}
                        <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600">오늘의 미션 달성도</label>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                                <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${missionProgress}%` }}></div>
                            </div>
                            <p className="text-right text-sm text-gray-500 mt-1">{missionProgress}% 완료</p>
                        </div>
                    </div>
                </div>

                {/* 하단 아이콘 메뉴  */}
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-around">
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => onShowAlert('건강 기록 페이지로 이동합니다.')}>
                        <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl mb-2"><i className="fa-solid fa-book-medical"></i></div>
                        <span className="text-sm text-gray-600">건강 기록</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => onShowAlert('진료/접종 페이지로 이동합니다.')}>
                        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-2xl mb-2"><i className="fa-solid fa-stethoscope"></i></div>
                        <span className="text-sm text-gray-600">진료/접종</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => onShowAlert('건강 리포트 페이지로 이동합니다.')}>
                        <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 text-2xl mb-2"><i className="fa-solid fa-heart-pulse"></i></div>
                        <span className="text-sm text-gray-600">건강 리포트</span>
                    </div>
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => onShowAlert('데일리 미션 페이지로 이동합니다.')}>
                        <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-500 text-2xl mb-2"><i className="fa-solid fa-bone"></i></div>
                        <span className="text-sm text-gray-600">데일리 미션</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetProfileCard;