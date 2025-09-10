interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
    // isOpen이 false면 아무것도 렌더링하지 않아.
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            {/* 실제 모달 창 부분 */}
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h2>
                <p className="text-gray-600 mb-8 text-center">{message}</p>

                {/* '예', '아니요' 버튼 */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={onClose}
                        className="py-2 px-6 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition w-24"
                    >
                        아니요
                    </button>
                    <button
                        onClick={onConfirm}
                        className="py-2 px-6 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition w-24"
                    >
                        예
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;

