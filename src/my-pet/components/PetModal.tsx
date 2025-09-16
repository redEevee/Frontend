import {useState, useEffect, type ChangeEvent, useRef} from "react";
import type {Pet} from "../types/types.ts";

interface PetFormData {
    id?: number;
    type: 'dog' | 'cat' | 'other';
    name: string;
    gender: '남아' | '여아' | '정보없음';
    breed: string;
    dob: string;
    imageDataUrl?: string | null;
}

interface PetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (petData: PetFormData) => void;
    mode: 'add' | 'edit';
    pet: Pet | null;
}

const PetModal: React.FC<PetModalProps> = ({isOpen, onClose, onSave, mode, pet}) => {
    const [type, setType] = useState<'dog' | 'cat' | 'other'>('dog');
    const [gender, setGender] = useState<'남아' | '여아' | '정보없음'>('정보없음');

    const [name, setName] = useState('');
    const [breed, setBreed] = useState('');
    const [dob, setDob] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && pet) {
                setType(pet.type);
                setGender(pet.gender);
                setName(pet.name);
                setBreed(pet.breed);
                setDob(pet.dob);
                setImagePreview(pet.imageUrl);
            } else {
                setType('dog');
                setGender('정보없음');
                setName('');
                setBreed('');
                setDob('');
                setImagePreview(null);
            }
            setImageFile(null);
        }
    }, [isOpen, mode, pet]);

    if (!isOpen) return null;

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        onSave({
            id: pet?.id,
            type,
            gender,
            name,
            breed,
            dob,
            imageDataUrl: imagePreview,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl animate-fade-in-scale">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">{mode === 'add' ? '새 펫 등록' : '펫 정보 수정'}</h2>

                {/* 이미지 업로드 UI */}
                <div className="flex flex-col items-center mb-6">
                    <div
                        className="w-40 h-40 rounded-full bg-gray-100 mb-4 overflow-hidden flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-indigo-400 transition"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        {imagePreview ? (
                            <img src={imagePreview} alt="펫 미리보기" className="w-full h-full object-cover"/>
                        ) : (
                            <div className="text-center text-gray-500">
                                <i className="fas fa-camera text-4xl"></i>
                                <p className="mt-2 text-sm">사진 추가하기</p>
                            </div>
                        )}
                    </div>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                </div>

                {/* 강아지/고양이 선택 UI */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">종류</label>
                    <div className="flex gap-2 sm:gap-4">
                        {/* 강아지 버튼 */}
                        <button
                            onClick={() => setType('dog')}
                            className={`flex-1 py-3 px-2 sm:px-4 rounded-lg border-2 transition text-center ${
                                type === 'dog'
                                    ? 'bg-indigo-500 border-indigo-500 text-white shadow-lg'
                                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className="fas fa-dog sm:mr-2"></i>
                            <span className="hidden sm:inline">강아지</span>
                        </button>
                        {/* 고양이 버튼 */}
                        <button
                            onClick={() => setType('cat')}
                            className={`flex-1 py-3 px-2 sm:px-4 rounded-lg border-2 transition text-center ${
                                type === 'cat'
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg'
                                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className="fas fa-cat sm:mr-2"></i>
                            <span className="hidden sm:inline">고양이</span>
                        </button>
                        {/* 기타 버튼 */}
                        <button
                            onClick={() => setType('other')}
                            className={`flex-1 py-3 px-2 sm:px-4 rounded-lg border-2 transition text-center ${
                                type === 'other'
                                    ? 'bg-gray-500 border-gray-500 text-white shadow-lg'
                                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className="fas fa-paw sm:mr-2"></i>
                            <span className="hidden sm:inline">기타</span>
                        </button>
                    </div>
                </div>

                {/* 성별 영역 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">성별</label>
                    <div className="flex gap-2 sm:gap-4">
                        <button
                            onClick={() => setGender('남아')}
                            className={`flex-1 py-3 px-2 sm:px-4 rounded-lg border-2 transition text-center ${
                                gender === '남아'
                                ? 'bg-blue-500 border-blue-500 text-white shadow-lg'
                                : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className="fas fa-mars sm:mr-2"></i>
                            <span className="hidden sm:inline">남아</span>
                        </button>
                        <button
                            onClick={() => setGender('여아')}
                            className={`flex-1 py-3 px-2 sm:px-4 rounded-lg border-2 transition text-center ${
                                gender === '여아'
                                    ? 'bg-pink-500 border-pink-500 text-white shadow-lg'
                                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className="fas fa-venus sm:mr-2"></i>
                            <span className="hidden sm:inline">여아</span>
                        </button>
                        <button
                            onClick={() => setGender('정보없음')}
                            className={`flex-1 py-3 px-2 sm:px-4 rounded-lg border-2 transition text-center ${
                                gender === '정보없음'
                                ? 'bg-gray-500 border-gray-500 text-white shadow-lg'
                                    : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <i className="fas fa-question sm:mr-2"></i>
                            <span className="hidden sm:inline">모름</span>
                        </button>
                    </div>
                </div>

                {/* 이름, 품종, 생일 등 입력 필드 */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="petName" className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                        <input
                            type="text"
                            id="petName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            placeholder="펫의 이름을 입력해주세요"
                        />
                    </div>
                    <div>
                        <label htmlFor="petBreed"
                               className="block text-sm font-medium text-gray-700 mb-1">품종</label>
                        <input
                            type="text"
                            id="petBreed"
                            value={breed}
                            onChange={(e) => setBreed(e.target.value)}
                            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                            placeholder="예) 푸들, 말티즈, 랙돌, 페르시안"
                        />
                    </div>
                    <div>
                        <label htmlFor="petDob"
                               className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
                        <input
                            type="date"
                            id="petDob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full px-4 py-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-4 mt-8">
                    <button onClick={onClose}
                            className="py-2 px-6 bg-gray-200 rounded-lg hover:bg-gray-300 transition">취소
                    </button>
                    <button onClick={handleSave}
                            className="py-2 px-6 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition">저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PetModal;
