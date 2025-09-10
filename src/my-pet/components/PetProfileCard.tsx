import React, {useMemo} from "react";
import type {Pet} from "../types/types.ts";

interface PetProfileCardProps {
    pet: Pet;
    onEdit: (pet: Pet) => void;
    onOpenConfirm: (petId: number) => void;
    onShowAlert: (message: string) => void;
}

const PetProfileCard: React.FC<PetProfileCardProps> = ({ pet, onEdit, onOpenConfirm, onShowAlert }) => {
    // 데일리 미션 진행도 계산 영역
    const missionProgress = useMemo(() => {
        if (!pet.dailyMission || pet.dailyMission.length === 0) {
            return 0;
        }
        const completed = pet.dailyMission.filter(m => m.done).length;
        return Math.round((completed / pet.dailyMission.length) * 100);
    }, [pet.dailyMission]);

    // 아이콘 정렬
    const actions = [
        { name: '건강 기록', icon: 'fa-book-medical', color: 'blue' },
        { name: '진료/접종', icon: 'fa-stethoscope', color: 'green' },
        { name: '건강/리포트', icon: 'fa-heartbeat', color: 'pink' },
        { name: '데일리 미션', icon: 'fa-bone', color: 'yellow' },
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="md:flex">
                {/* 펫 이미지 영역(현수나 정범이 사진 넣으시면 됩니다) */}
                <div className="md:w-1/3 p-4 flex flex-col items-center justify-center bg-indigo-50">
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                        <img className="rounded-full w-full h-full object-cover border-4 border-white shadow-md" src={pet.imageUrl} alt={pet.name} />
                        {/* 마이크로칩, 중성화 아이콘 (조건부 랜더링) */}
                        {pet.hasMicrochip && (
                            <span className="absolute top-1 left-1 bg-blue-500 text-white rounded-full p-2 text-xs shadow-lg" title="마이크로칩 등록됨">
                                <i className="fas fa-microchip"></i>
                            </span>
                        )}
                        {pet.isNeutered && (
                            <span className="absolute top-1 right-1 bg-pink-500 text-white rounded-full p-2 text-xs shadow-lg" title="중성화 완료">
                                <i className="fas fa-cut"></i>
                            </span>
                        )}
                    </div>
                </div>

                {/* 펫 정보 영역 */}
                <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{pet.breed}</p>
                            <h2 className="block mt-1 text-2xl leading-tight font-bold text-black">{pet.name} <span className="text-lg font-medium text-gray-500">({pet.gender})</span></h2>
                            <p className="mt-2 text-gray-600"><i className="fas fa-birthday-cake mr-2 text-gray-400"></i> {pet.dob}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => onEdit(pet)} className="text-gray-400 hover:text-indigo-600 p-2"><i className="fas fa-pencil-alt"></i></button>
                            <button onClick={() => onOpenConfirm(pet.id)} className="text-gray-400 hover:text-red-600 p-2"><i className="fas fa-trash-alt"></i></button>
                        </div>
                    </div>

                    {/* 데일리 미션 바 */}
                    <div className="mt-4">
                        <p className="text-sm font-semibold text-gray-700">오늘의 미션 달성도</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-2.5 rounded-full transition-all duration-500" style={{ width: '$(missionProgress}%' }}></div>
                        </div>
                        <p className="text-right text-xs text-gray-500 mt-1">{missionProgress}% 완료</p>
                    </div>

                    {/* 하단 액션 아이콘 목록 */}
                    <div className="mt-5 pt-4 border-t border-gray-200 flex justify-around text-center">
                        {actions.map(action => (
                            <div key={action.name} onClick={() => onShowAlert(`${pet.name}의 '${action.name}'(을)를 확인합니다.`)} className="cursor-pointer text-gray-600 hover:text-indigo-600 transition">
                                <div className={`p-3 bg-${action.color}-100 rounded-full text-${action.color}-600 inline-block`}>
                                    <i className={`fas ${action.icon} text-xl`}></i>
                                </div>
                                <span className="block mt-2 text-xs font-medium">{action.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetProfileCard;