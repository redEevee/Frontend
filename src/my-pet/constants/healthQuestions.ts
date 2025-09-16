
import type { PremiumQuestion } from '../types/types';

export const ALL_QUESTIONS: PremiumQuestion[] = [
  // --- 영양 (Diet) ---
  {
    category: 'diet',
    subKey: 'foodType',
    text: '[영양] 주식으로 무엇을 급여하고 계신가요?',
    options: [
      { value: 'dry', text: '건식 사료' },
      { value: 'wet', text: '습식/소프트 사료' },
      { value: 'raw', text: '자연식/화식/생식' },
    ],
    scores: { dry: 80, wet: 90, raw: 100 },
    recommendations: {
      dry: '건식 사료는 치아 건강에 도움이 되지만, 수분 섭취가 부족할 수 있으니 신선한 물을 항상 준비해주세요.',
      wet: '습식 사료는 수분 섭취에 유리하지만, 치석이 생기기 쉬우니 양치질에 신경 써주세요.',
      raw: '자연식은 영양소 흡수율이 높지만, 균형 잡힌 식단 구성이 매우 중요합니다. 전문가와 상담을 권장합니다.',
    },
  },
  {
    category: 'diet',
    subKey: 'eatingHabits',
    text: '[영양] 식사량은 어느 정도인가요?',
    options: [
      { value: 'good', text: '주는 만큼 다 먹어요' },
      { value: 'average', text: '가끔 남길 때가 있어요' },
      { value: 'poor', text: '입이 짧고 잘 먹지 않아요' },
    ],
    scores: { good: 100, average: 70, poor: 30 },
    recommendations: {
      poor: '기호성이 낮은 것일 수 있습니다. 다른 사료를 테스트해보거나, 활동량을 늘려 식욕을 돋워주세요.',
    },
  },
  {
    category: 'diet',
    subKey: 'snackFrequency',
    text: '[영양] 간식을 얼마나 자주 주시나요?',
    options: [
      { value: 'rarely', text: '거의 주지 않아요' },
      { value: 'sometimes', text: '교육/칭찬용으로 가끔 줘요' },
      { value: 'often', text: '매일 1~2회 이상 줘요' },
    ],
    scores: { rarely: 80, sometimes: 100, often: 50 },
    recommendations: {
      often: '과도한 간식은 비만과 영양 불균형의 원인이 될 수 있습니다. 하루 총 섭취 칼로리의 10%를 넘지 않도록 조절해주세요.',
    },
  },
  {
    category: 'diet',
    subKey: 'waterIntake',
    text: '[영양] 하루에 물을 얼마나 마시나요?',
    options: [
      { value: 'high', text: '충분히, 자주 마셔요' },
      { value: 'normal', text: '보통 수준으로 마셔요' },
      { value: 'low', text: '거의 마시지 않아요' },
    ],
    scores: { high: 100, normal: 80, low: 30 },
    recommendations: {
      low: '음수량이 부족하면 신장 질환의 위험이 높아집니다. 물그릇을 여러 곳에 두거나, 습식 사료를 활용해보세요.',
    },
  },

  // --- 활동 (Energy) ---
  {
    category: 'energy',
    subKey: 'level',
    text: '[활동] 평소 에너지 수준은 어떤가요?',
    options: [
      { value: 'high', text: '항상 넘쳐요' },
      { value: 'normal', text: '편안하고 안정적이에요' },
      { value: 'low', text: '대부분의 시간을 잠을 자거나 누워있어요' },
    ],
    scores: { high: 100, normal: 90, low: 40 },
    recommendations: {
      low: '나이가 들거나 건강 문제로 활동량이 줄 수 있습니다. 이전과 다른 모습이라면 수의사 상담을 받아보세요.',
    },
  },
  {
    category: 'energy',
    subKey: 'playTime',
    text: '[활동] 하루 평균 놀이/산책 시간은 얼마나 되나요?',
    options: [
      { value: 'long', text: '1시간 이상' },
      { value: 'medium', text: '30분 ~ 1시간' },
      { value: 'short', text: '30분 미만' },
    ],
    scores: { long: 100, medium: 80, short: 40 },
    recommendations: {
      long: '충분한 활동량은 정신적, 육체적 건강에 매우 긍정적입니다. 아주 잘하고 계십니다!',
      short: '활동 시간은 스트레스 해소와 건강 유지에 필수적입니다. 매일 최소 30분 이상 꾸준히 산책하는 것을 목표로 해보세요.',
    },
  },
  {
    category: 'energy',
    subKey: 'reactionToWalk',
    text: '[활동] 산책하러 가자고 할 때 반응이 어떤가요?',
    options: [
      { value: 'excited', text: '매우 흥분하고 좋아해요' },
      { value: 'calm', text: '차분하지만 따라나서요' },
      { value: 'reluctant', text: '가기 싫어하거나 숨어요' },
    ],
    scores: { excited: 100, calm: 80, reluctant: 30 },
    recommendations: {
      reluctant: '산책을 꺼리는 데에는 여러 이유(두려움, 통증 등)가 있을 수 있습니다. 원인을 파악하고 해결하려는 노력이 필요합니다.',
    },
  },

  // --- 배변 (Stool) ---
  {
    category: 'stool',
    subKey: 'form',
    text: '[배변] 변은 보통 어떤 형태인가요?',
    options: [
      { value: 'firm', text: '단단하고 형태가 명확함 (줍기 쉬움)' },
      { value: 'soft', text: '형태는 있지만 무른 편' },
      { value: 'diarrhea', text: '완전한 설사 또는 물똥' },
    ],
    scores: { firm: 100, soft: 60, diarrhea: 20 },
    recommendations: {
      firm: '건강한 배변은 소화기 건강의 중요한 지표입니다. 좋은 식단을 유지하고 계시는군요.',
      soft: '일시적인 무른 변은 괜찮지만, 지속된다면 사료나 장 건강을 점검해볼 필요가 있습니다.',
      diarrhea: '설사가 2회 이상 지속되면 탈수 위험이 있습니다. 병원에 방문하여 원인을 확인하세요.',
    },
  },
  {
    category: 'stool',
    subKey: 'frequency',
    text: '[배변] 하루 배변 횟수는 평균 몇 번인가요?',
    options: [
      { value: 'normal', text: '1~3회' },
      { value: 'increased', text: '4회 이상' },
      { value: 'decreased', text: '1회 미만 (변비)' },
    ],
    scores: { normal: 100, increased: 50, decreased: 40 },
    recommendations: {
      increased: '배변 횟수가 갑자기 늘었다면 과식이나 스트레스, 장염 등을 의심해볼 수 있습니다.',
      decreased: '변비는 음수량 부족이나 운동 부족이 원인일 수 있습니다. 유산균 급여를 고려해보세요.',
    },
  },
  {
    category: 'stool',
    subKey: 'color',
    text: '[배변] 변의 색깔은 어떤가요?',
    options: [
      { value: 'brown', text: '건강한 갈색' },
      { value: 'black', text: '검은색 또는 흑색' },
      { value: 'red', text: '붉은색(혈변) 또는 점액질이 섞여 있음' },
    ],
    scores: { brown: 100, black: 20, red: 10 },
    recommendations: {
      black: '흑색 변은 위장관 출혈을 의미할 수 있으니 즉시 병원 진료가 필요합니다.',
      red: '혈변이나 점액질 변은 대장 쪽 문제일 가능성이 높습니다. 사진을 찍어 수의사와 상담하세요.',
    },
  },

  // --- 행동 (Behavior) ---
  {
    category: 'behavior',
    subKey: 'aggression',
    text: '[행동] 다른 동물이나 사람에게 공격성을 보인 적이 있나요?',
    options: [
      { value: 'no', text: '전혀 없어요' },
      { value: 'sometimes', text: '가끔 으르렁거리거나 경계해요' },
      { value: 'yes', text: '입질을 하거나 공격한 적이 있어요' },
    ],
    scores: { no: 100, sometimes: 60, yes: 20 },
    recommendations: {
      no: '사회성이 좋고 안정적인 성격이네요. 다른 동물이나 사람과 긍정적인 교류를 계속 장려해주세요.',
      yes: '공격성은 두려움의 표현일 수 있습니다. 원인을 파악하고 전문가의 도움을 받아 사회화 훈련을 진행하는 것이 좋습니다.',
    },
  },
  {
    category: 'behavior',
    subKey: 'anxiety',
    text: '[행동] 혼자 있을 때 분리불안 증세(하울링, 파괴 행동 등)를 보이나요?',
    options: [
      { value: 'no', text: '편안하게 잘 있어요' },
      { value: 'mild', text: '조금 낑낑대지만 곧 진정해요' },
      { value: 'severe', text: '심하게 짖거나 물건을 망가뜨려요' },
    ],
    scores: { no: 100, mild: 70, severe: 30 },
    recommendations: {
      severe: '분리불안은 꾸준한 훈련이 필요합니다. 혼자 있는 시간을 점진적으로 늘리고, 긍정적인 인식을 심어주는 노즈워크 등을 활용해보세요.',
    },
  },
  {
    category: 'behavior',
    subKey: 'hiding',
    text: '[행동] 집에 낯선 사람이 방문하면 어떻게 반응하나요?',
    options: [
      { value: 'curious', text: '호기심을 보이며 다가와요' },
      { value: 'indifferent', text: '크게 신경 쓰지 않아요' },
      { value: 'hides', text: '숨거나 도망가요' },
    ],
    scores: { curious: 100, indifferent: 80, hides: 40 },
    recommendations: {
      hides: '사회성이 부족하거나 두려움이 많은 성격일 수 있습니다. 억지로 접촉하게 하기보다 스스로 다가올 때까지 기다려주세요.',
    },
  },

  // --- 관절 (Joints) ---
  {
    category: 'joints',
    subKey: 'discomfort',
    text: '[관절] 절뚝거리거나 특정 다리를 들고 있는 모습을 보이나요?',
    options: [
      { value: 'no', text: '아니요, 괜찮아요' },
      { value: 'sometimes', text: '가끔 그런 모습을 보여요' },
      { value: 'often', text: '자주 그래요' },
    ],
    scores: { no: 100, sometimes: 50, often: 20 },
    recommendations: {
      often: '지속적인 파행은 통증의 신호입니다. 슬개골 탈구나 관절염 등을 의심할 수 있으니 병원 검진을 받아보세요.',
    },
  },
  {
    category: 'joints',
    subKey: 'sound',
    text: '[관절] 앉거나 일어설 때 관절에서 \'뚝\' 소리가 나나요?',
    options: [
      { value: 'no', text: '아니요, 안 나요' },
      { value: 'yes', text: '네, 가끔 나요' },
    ],
    scores: { no: 100, yes: 50 },
    recommendations: {
      yes: '관절 소리는 관절 불안정성의 신호일 수 있습니다. 관절 영양제를 급여하고, 미끄러운 바닥에 매트를 깔아주는 것이 좋습니다.',
    },
  },
  {
    category: 'joints',
    subKey: 'hesitation',
    text: '[관절] 소파나 계단을 오르내리는 것을 망설이나요?',
    options: [
      { value: 'no', text: '전혀 망설임이 없어요' },
      { value: 'yes', text: '예전보다 망설이거나 힘들어해요' },
    ],
    scores: { no: 100, yes: 40 },
    recommendations: {
      yes: '높은 곳을 오르내리는 것을 힘들어한다면 관절 통증 때문일 수 있습니다. 스텝을 설치하여 관절 부담을 줄여주세요.',
    },
  },

  // --- 피부/모질 (Skin) ---
  {
    category: 'skin',
    subKey: 'scratching',
    text: '[피부] 몸을 긁거나 핥는 빈도는 어떤가요?',
    options: [
      { value: 'low', text: '거의 긁지 않아요' },
      { value: 'medium', text: '가끔 긁거나 핥아요' },
      { value: 'high', text: '자주, 심하게 긁거나 핥아요' },
    ],
    scores: { low: 100, medium: 60, high: 20 },
    recommendations: {
      high: '과도한 긁음/핥음은 알러지, 아토피, 기생충 감염 등 피부 질환의 신호입니다. 원인 파악을 위해 병원 방문이 필요합니다.',
    },
  },
  {
    category: 'skin',
    subKey: 'hairLoss',
    text: '[피부] 평소보다 털빠짐이 심해졌거나, 특정 부위 털이 동그랗게 빠졌나요?',
    options: [
      { value: 'no', text: '아니요, 변화 없어요' },
      { value: 'moderate', text: '전체적으로 조금 늘어난 것 같아요' },
      { value: 'severe', text: '특정 부위가 비어 보일 정도로 심해요' },
    ],
    scores: { no: 100, moderate: 60, severe: 20 },
    recommendations: {
      severe: '원형 탈모는 곰팡이성 피부염(링웜)의 특징적인 증상일 수 있습니다. 전염성이 있으니 빠른 진단과 치료가 중요합니다.',
    },
  },
  {
    category: 'skin',
    subKey: 'dandruff',
    text: '[피부] 털 안쪽 피부에 비듬이나 각질이 있나요?',
    options: [
      { value: 'no', text: '깨끗해요' },
      { value: 'yes', text: '네, 조금 있어요' },
    ],
    scores: { no: 100, yes: 60 },
    recommendations: {
      yes: '각질은 피부 건조나 영양 부족, 피부 질환의 신호일 수 있습니다. 보습에 좋은 샴푸를 사용하거나 오메가3 영양제를 급여해보세요.',
    },
  },
  {
    category: 'skin',
    subKey: 'earCondition',
    text: '[피부] 귀에서 냄새가 나거나, 귀지가 많이 끼나요?',
    options: [
      { value: 'clean', text: '깨끗하고 냄새가 나지 않아요' },
      { value: 'dirty', text: '검은 귀지가 많고 냄새가 나요' },
    ],
    scores: { clean: 100, dirty: 30 },
    recommendations: {
      dirty: '귀 진드기나 외이도염이 의심되는 증상입니다. 방치하면 만성이 될 수 있으니 병원에서 귀 세정을 받고 치료를 시작하세요.',
    },
  },
  {
    category: 'diet',
    subKey: 'appetiteChange',
    text: '[영양] 최근 식욕에 눈에 띄는 변화가 있었나요?',
    options: [
      { value: 'increased', text: '식욕이 늘었어요' },
      { value: 'normal', text: '변화 없어요' },
      { value: 'decreased', text: '식욕이 줄었어요' },
    ],
    scores: { increased: 70, normal: 100, decreased: 30 },
    recommendations: {
      increased: '갑작스러운 식욕 증가는 호르몬 문제나 당뇨의 신호일 수 있습니다. 다른 증상이 없는지 관찰해주세요.',
      decreased: '식욕 부진은 다양한 질병의 초기 신호일 수 있습니다. 하루 이상 지속되면 병원 상담을 받아보세요.',
    },
  },
  {
    category: 'energy',
    subKey: 'sleepPattern',
    text: '[활동] 잠자는 모습은 주로 어떤가요?',
    options: [
      { value: 'relaxed', text: '몸을 쭉 펴고 편안하게 자요' },
      { value: 'curled', text: '몸을 웅크리고 자요' },
      { value: 'twitching', text: '자면서 잠꼬대나 경련을 보여요' },
    ],
    scores: { relaxed: 100, curled: 80, twitching: 50 },
    recommendations: {
      curled: '몸을 웅크리고 자는 것은 정상적이지만, 추위를 느끼거나 불안감을 느낄 때도 나타나는 자세입니다. 주변 환경을 점검해주세요.',
      twitching: '가벼운 잠꼬대는 정상이지만, 심한 경련이나 발작이 의심되면 즉시 수의사와 상담해야 합니다.',
    },
  },
  {
    category: 'stool',
    subKey: 'foreignMatter',
    text: '[배변] 변에서 소화되지 않은 음식물이나 이물질이 보이나요?',
    options: [
      { value: 'no', text: '아니요, 깨끗해요' },
      { value: 'yes', text: '네, 가끔 보여요' },
    ],
    scores: { no: 100, yes: 40 },
    recommendations: {
      yes: '소화 불량의 신호일 수 있습니다. 사료를 잘게 부수어 주거나, 소화가 잘 되는 사료로 변경을 고려해보세요. 이물질이 보이면 병원 상담이 필요합니다.',
    },
  },
  {
    category: 'behavior',
    subKey: 'vocalization',
    text: '[행동] 의미 없이 짖거나 우는 빈도가 늘었나요?',
    options: [
      { value: 'no', text: '아니요, 평소와 같아요' },
      { value: 'yes', text: '네, 전보다 자주 짖거나 울어요' },
    ],
    scores: { no: 100, yes: 50 },
    recommendations: {
      yes: '요구사항이 있거나, 불안 또는 통증의 표현일 수 있습니다. 어떤 상황에서 짖는지 파악하여 원인을 해결해주세요.',
    },
  },
  {
    category: 'joints',
    subKey: 'afterExercise',
    text: '[관절] 산책이나 운동 후에 특정 다리를 저는 모습을 보이나요?',
    options: [
      { value: 'no', text: '아니요, 괜찮아요' },
      { value: 'yes', text: '네, 피곤해지면 저는 것 같아요' },
    ],
    scores: { no: 100, yes: 40 },
    recommendations: {
      yes: '운동 후 통증은 관절염의 초기 증상일 수 있습니다. 무리한 운동을 피하고, 운동 시간을 조절해주세요.',
    },
  },
  {
    category: 'skin',
    subKey: 'coatCondition',
    text: '[피부] 털에 윤기가 없고 푸석푸석한가요?',
    options: [
      { value: 'glossy', text: '아니요, 윤기가 흘러요' },
      { value: 'dry', text: '네, 푸석하고 윤기가 없어요' },
    ],
    scores: { glossy: 100, dry: 50 },
    recommendations: {
      dry: '피모의 건강은 영양 상태와 직결됩니다. 오메가-3 지방산이나 피모 영양제를 급여해보세요.',
    },
  },
];
