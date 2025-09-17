import { useState, useMemo } from 'react';
import type { Pet, WeightRecord, HealthNote } from '../types/types.ts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightLogTabProps {
    petData: Pet;
    onUpdate: (updatedPet: Pet) => void;
}

const getToday = (): string => new Date().toISOString().slice(0, 10);

const WeightLogTab: React.FC<WeightLogTabProps> = ({ petData, onUpdate }) => {
    // 2. ⭐️ 상태 변수들을 새로운 설계도에 맞게 전부 바꿨어.
    //    (note, condition -> mood, poop, pee, symptoms)
    const [date, setDate] = useState<string>(getToday());
    const [weigh, setWeigh] = useState<string>('');
    const [symptoms, setSymptoms] = useState<string>('');
    const [mood, setMood] = useState<'good' | 'normal' | 'bad'>('normal');
    const [poop, setPoop] = useState<'good' | 'normal' | 'bad'>('normal');
    const [pee, setPee] = useState<'good' | 'normal' | 'bad'>('normal');

    // 그래프용 데이터 정렬
    const sortedWeightData = useMemo(() => {
        return [...(petData.weightRecords || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [petData.weightRecords]);

    const handleAddWeightRecord = () => {
        const weighValue = parseFloat(weigh);
        if (!weighValue || weighValue <= 0) {
            alert('올바른 체중을 입력해주세요.');
            return;
        }
        const newRecord: WeightRecord = { id: Date.now(), date: date, weigh: weighValue };
        const updatedRecords = [...(petData.weightRecords || []), newRecord];
        onUpdate({ ...petData, weightRecords: updatedRecords });
        setWeigh('');
    };

    // 3. ⭐️ 건강 메모 저장 로직도 새로운 데이터 구조에 맞게 완벽하게 수정했어.
    const handleAddHealthNote = () => {
        if (!symptoms.trim()) {
            alert('특이사항을 입력해주세요. (없으면 "없음"이라고 적어주세요)');
            return;
        }
        const newNote: HealthNote = {
            id: Date.now(),
            date: date,
            mood,
            poop,
            pee,
            symptoms: symptoms.trim(),
        };
        const updatedNotes = [...(petData.healthNotes || []), newNote];
        onUpdate({ ...petData, healthNotes: updatedNotes });
        setSymptoms('');
        setMood('normal');
        setPoop('normal');
        setPee('normal');
    };

    // 아이콘과 스타일을 관리하는 객체
    const conditionStyles = {
        good: { icon: 'fa-smile-beam', color: 'text-green-500', label: '좋음' },
        normal: { icon: 'fa-meh', color: 'text-blue-500', label: '보통' },
        bad: { icon: 'fa-frown-open', color: 'text-red-500', label: '나쁨' },
    };
    const poopStyles = { ...conditionStyles, good: {...conditionStyles.good, icon: 'fa-poop'} };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 왼쪽: 기록 입력 영역 */}
                <div className="space-y-6">
                    {/* 체중 기록 섹션 */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">체중 기록하기</h3>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                            <label htmlFor="record-date" className="font-semibold text-gray-700">날짜</label>
                            <input type="date" id="record-date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded-lg" />
                            <label htmlFor="weigh" className="font-semibold text-gray-700">체중 (kg)</label>
                            <div className="flex gap-2">
                                <input type="number" id="weigh" value={weigh} onChange={(e) => setWeigh(e.target.value)} placeholder="예) 5.2" className="w-full p-2 border rounded-lg" />
                                <button onClick={handleAddWeightRecord} className="py-2 px-6 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition">기록</button>
                            </div>
                        </div>
                    </div>

                    {/* 건강 메모 섹션 */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">건강 상태 기록</h3>
                        <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                            <div>
                                <label className="font-semibold text-gray-700 mb-2 block">오늘의 기분</label>
                                <div className="flex gap-2">
                                    {(['good', 'normal', 'bad'] as const).map(c => (
                                        <button key={c} onClick={() => setMood(c)} className={`flex-1 p-2 rounded-lg border-2 transition ${mood === c ? 'bg-indigo-100 border-indigo-400' : 'hover:bg-gray-200'}`}>
                                            <i className={`fas ${conditionStyles[c].icon} ${conditionStyles[c].color} mr-2`}></i>{conditionStyles[c].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="font-semibold text-gray-700 mb-2 block">대변 상태</label>
                                    <div className="flex gap-1">
                                        {(['good', 'normal', 'bad'] as const).map(c => ( <button key={c} onClick={() => setPoop(c)} className={`flex-1 py-2 rounded-lg border-2 text-xs transition ${poop === c ? 'bg-yellow-100 border-yellow-400' : 'hover:bg-gray-200'}`}><i className={`fas ${poopStyles[c].icon} ${poopStyles[c].color}`}></i></button>))}
                                    </div>
                                </div>
                                <div>
                                    <label className="font-semibold text-gray-700 mb-2 block">소변 상태</label>
                                    <div className="flex gap-1">
                                        {(['good', 'normal', 'bad'] as const).map(c => ( <button key={c} onClick={() => setPee(c)} className={`flex-1 py-2 rounded-lg border-2 text-xs transition ${pee === c ? 'bg-blue-100 border-blue-400' : 'hover:bg-gray-200'}`}><i className={`fas fa-tint ${conditionStyles[c].color}`}></i></button>))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label htmlFor="symptoms" className="font-semibold text-gray-700 mb-2 block">특이사항 (증상, 구토, 재채기 등)</label>
                                <textarea id="symptoms" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} rows={2} placeholder="없으면 '없음'이라고 적어주세요." className="w-full p-2 border rounded-lg"></textarea>
                            </div>
                            <button onClick={handleAddHealthNote} className="w-full py-2 px-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition">오늘의 건강 기록 추가</button>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 그래프 및 기록 목록 */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">체중 변화 그래프</h3>
                        <div className="w-full h-64 bg-gray-50 p-2 rounded-lg">
                            <ResponsiveContainer width="100%" height="100%">
                                {sortedWeightData.length > 0 ? (
                                    <LineChart data={sortedWeightData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" fontSize={12} />
                                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} fontSize={12} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="weigh" stroke="#4f46e5" strokeWidth={2} name="체중(kg)" />
                                    </LineChart>
                                ) : ( <div className="flex items-center justify-center h-full text-gray-400">체중 기록이 없어요.</div> )}
                            </ResponsiveContainer>
                        </div>
                    </div>
                    {/* 건강 메모 목록 */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">건강 메모 목록</h3>
                        <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                            {petData.healthNotes && petData.healthNotes.length > 0 ? (
                                [...petData.healthNotes].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(n => (
                                    <div key={n.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-center text-sm mb-2">
                                            <span className="font-semibold">{n.date}</span>
                                            <div className="flex gap-3">
                                                <i className={`fas ${conditionStyles[n.mood].icon} ${conditionStyles[n.mood].color} text-lg`} title={`기분: ${conditionStyles[n.mood].label}`}></i>
                                                <i className={`fas ${poopStyles[n.poop].icon} ${poopStyles[n.poop].color} text-lg`} title={`대변: ${poopStyles[n.poop].label}`}></i>
                                                <i className={`fas fa-tint ${conditionStyles[n.pee].color} text-lg`} title={`소변: ${conditionStyles[n.pee].label}`}></i>
                                            </div>
                                        </div>
                                        <p className="text-gray-700 text-sm">{n.symptoms}</p>
                                    </div>
                                ))
                            ) : ( <div className="text-center text-gray-400 p-4">메모 기록이 없어요.</div> )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeightLogTab;
