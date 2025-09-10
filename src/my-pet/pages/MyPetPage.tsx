import { useState } from 'react';
import type {Pet} from '../types/types.ts';
import PetProfileCard from '../components/PetProfileCard.tsx';
import PetModal from '../components/PetModal.tsx';
import AlertNotification from '../../shared/components/AlertNotification.tsx';
import ConfirmModal from '../components/ConfirmModel.tsx';

// 샘플데이터
const samplePets: Pet[] = [
    {
        id: 1,
        name: '왕만두',
        type: 'dog',
        gender: '남아',
        breed: '비숑 프리제',
        dob: '2022.04.13',
        hasMicrochip: true,
        isNeutered: true,
        imageUrl: 'https://images.unsplash.com/photo-1596492784533-7647fb21b038?q=80&w=800',
        dailyMission: [
            { task: '산책 30분 하기', done: true },
            { task: '양치질하기', done: true },
            { task: '신원이랑 술배틀하기', done: false },
            { task: '빗질하기', done: true },
        ]
    },
    {
        id: 2,
        name: '정범이',
        type: 'other',
        gender: '여아',
        breed: '에겐에겐',
        dob: '1999.09.28',
        hasMicrochip: true,
        isNeutered: true,
        imageUrl: 'https://images.unsplash.com/photo-1601911737335-9b98a59a7242?q=80&w=800',
        dailyMission: [
            { task: '공주 놀이하기', done: true },
            { task: '파자마 파티하기', done: true },
            { task: '콩순이 컴퓨터하기', done: false },
        ]
    }
];

const MyPetPage: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>(samplePets);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentPet, setCurrentPet] = useState<Pet | null>(null);
    const [alert, setAlert] = useState<{ message: string; show: boolean }>({ message: '', show: false });
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [petToDeleteId, setPetToDeleteId] = useState<number | null>(null);

    // 알림 메시지 표시
    const showAlert = (message: string) => {
        setAlert({ message, show: true });
        setTimeout(() => setAlert({ message: '', show: false }), 3000);
    };

    const handleOpenConfirm = (id: number) => {
        setPetToDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (petToDeleteId !== null) {
            setPets(prevPets => prevPets.filter(p => p.id !== petToDeleteId));
            showAlert(`펫 정보가 삭제되었습니다.`);
        }
        setIsConfirmOpen(false);
        setPetToDeleteId(null);
    };

    const handleSavePet = (petData: Omit<Pet, 'id'> & { id?: number; imageFile?: File | null }) => {
        const imageUrl = petData.imageFile
            ? URL.createObjectURL(petData.imageFile)
            : petData.id ? pets.find(p => p.id === petData.id)?.imageUrl : `https://placehold.co/150x150/E0E7FF/4F46E5?text=🐾`;

        if (modalMode === 'add') {
            const newPet: Pet = { ...petData, id: Date.now(), imageUrl: imageUrl as string, breed: petData.breed || '품종 정보 없음', dob: petData.dob || '생일 정보 없음' };
            setPets(prev => [...prev, newPet]);
            showAlert('새로운 펫이 등록되었습니다!');
        } else {
            setPets(prev => prev.map(p => (p.id === petData.id ? { ...p, ...petData, imageUrl: imageUrl as string } : p)));
            showAlert(`${petData.name}의 정보가 수정되었습니다.`);
        }
        setIsModalOpen(false);
    };

    const handleAddPet = () => {
        setModalMode('add');
        setCurrentPet(null);
        setIsModalOpen(true);
    };

    const handleEditPet = (pet: Pet) => {
        setModalMode('edit');
        setCurrentPet(pet);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentPet(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8 md:p-24">
            <header className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800">나의 펫</h1>
                <button
                    onClick={handleAddPet}
                    className="bg-indigo-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-600 transition-colors duration-300 shadow-md hover:shadow-lg"
                >
                    <i className="fas fa-plus mr-2"></i>새 펫 등록
                </button>
            </header>
            <main>
                {pets.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {pets.map(pet => (
                            <PetProfileCard
                                key={pet.id}
                                pet={pet}
                                onEdit={handleEditPet}
                                onOpenConfirm={handleOpenConfirm}
                                onShowAlert={showAlert}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold text-gray-700">등록된 펫이 없어요.</h2>
                        <p className="text-gray-500 mt-2">오른쪽 위 버튼을 눌러 첫 번째 펫을 등록해보세요!</p>
                    </div>
                )}
            </main>

            <PetModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePet}
                mode={modalMode}
                pet={currentPet}
            />

            <AlertNotification
                message={alert.message}
                show={alert.show}
                onClose={() => setAlert({ ...alert, show: false })}
            />

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="삭제 확인"
                message="나의 펫을 정말 삭제하시겠어요?"
            />
        </div>
    );
};

export default MyPetPage;

