export type FaqCategory =
  | '지원금·신청'
  | '세금·환급'
  | '집·계약'
  | '금융·보험'
  | '일·사업'
  | '생활·교통';

export type SeedFaqArticle = {
  id: string;
  question: string;
  title: string;
  summary: string;
  category: FaqCategory;
  body: string;
  sourceHint: string;
  createdAt: string;
  helpful: number;
  isSeed: true;
};

export const faqCategories = [
  '지원금·신청',
  '세금·환급',
  '집·계약',
  '금융·보험',
  '일·사업',
  '생활·교통'
] as const;

type Guide = {
  portal: string;
  docs: string;
  firstStep: string;
  caution: string;
  sourceHint: string;
  example: string;
  finalCheck: string;
};

const categoryGuide: Record<FaqCategory, Guide> = {
  '지원금·신청': {
    portal: '정부24, 복지로, 주소지 행정복지센터, 보건복지상담센터 129',
    docs: '신분증, 주민등록등본, 가족관계 자료, 통장 사본, 소득·재산 확인 자료, 임대차계약서',
    firstStep: '신청 전에는 가구원 수, 주소지, 소득·재산 기준, 신청 기간을 먼저 확인합니다.',
    caution: '지원금은 이름이 비슷해도 대상과 기준이 다릅니다. 중앙정부 사업인지 지자체 사업인지 먼저 구분해야 합니다.',
    sourceHint: '최종 기준은 정부24, 복지로, 주소지 행정복지센터 공고에서 확인합니다.',
    example: '예를 들어 전입 직후라면 주소지 기준이 달라질 수 있으므로 이전 주소지와 현재 주소지의 담당 기관을 모두 확인해야 합니다.',
    finalCheck: '접수 후에는 접수번호, 보완 요청 여부, 지급 예정일, 사용 제한 조건을 기록해 두세요.'
  },
  '세금·환급': {
    portal: '홈택스, 손택스, 위택스, 회사 인사·급여 담당자, 세무서 민원실',
    docs: '원천징수영수증, 간소화 자료, 계약서, 납부 영수증, 이체내역, 사업 관련 지출 증빙',
    firstStep: '세금은 금액보다 요건이 먼저입니다. 명의, 납부일, 과세기간, 중복 공제 가능성을 먼저 확인합니다.',
    caution: '연말정산, 종합소득세, 지방세는 신고 주체와 기간이 다릅니다. 하나만 처리했다고 전부 끝난 것이 아닐 수 있습니다.',
    sourceHint: '최종 기준은 홈택스, 위택스, 국세청 안내, 회사 급여 담당자에게 확인합니다.',
    example: '예를 들어 월세 관련 공제는 계약자, 납부자, 주소 이전 여부가 맞지 않으면 자료가 있어도 적용이 어려울 수 있습니다.',
    finalCheck: '신고 후에는 접수증, 납부서, 환급계좌, 지방세 신고 여부, 수정신고 필요성을 확인하세요.'
  },
  '집·계약': {
    portal: '인터넷등기소, 정부24, 국토교통부 실거래가, 주민센터, 보증기관, 소비자24',
    docs: '계약서, 등기부등본, 전입신고 내역, 확정일자, 보증금 이체내역, 사진·문자·통화 기록',
    firstStep: '계약 전에는 사람보다 서류를 먼저 봅니다. 주소, 소유자, 근저당, 특약, 보증금 지급 방식을 대조합니다.',
    caution: '구두 약속은 분쟁 때 입증이 어렵습니다. 중요한 약속은 계약서 특약, 문자, 이메일로 남겨야 합니다.',
    sourceHint: '최종 확인은 인터넷등기소, 주민센터, 보증기관, 계약 상대방의 공식 서류를 기준으로 합니다.',
    example: '예를 들어 입주 당일에는 전입신고와 확정일자를 늦추지 말고, 하자 사진을 날짜가 보이게 남겨두는 것이 좋습니다.',
    finalCheck: '계약 후에는 확정일자, 전입신고, 보증금 송금 기록, 관리비 항목, 하자 사진을 함께 보관하세요.'
  },
  '금융·보험': {
    portal: '은행 앱, 카드사 앱, 보험사 고객센터, 금융감독원 파인, 신용정보원, 한국소비자원',
    docs: '신분증, 약관, 거래내역, 보험증권, 청구서, 사고 증빙, 소득자료, 상담 기록',
    firstStep: '금융 상품은 월 납입액보다 총비용을 먼저 봐야 합니다. 금리, 수수료, 해지 조건, 자동이체를 함께 확인합니다.',
    caution: '대출, 카드, 보험은 조건을 잘못 이해하면 장기간 손해가 생깁니다. 상담 내용은 문자나 문서로 받아두는 편이 안전합니다.',
    sourceHint: '최종 조건은 해당 금융회사 약관, 계약서, 금융감독원 파인에서 확인합니다.',
    example: '예를 들어 보험을 해지하기 전에는 해지환급금뿐 아니라 재가입 가능성, 보장 공백, 자동이체 해지 여부를 같이 봐야 합니다.',
    finalCheck: '신청·해지·청구 후에는 접수번호, 처리 예정일, 수수료, 환급액, 자동이체 상태를 확인하세요.'
  },
  '일·사업': {
    portal: '고용24, 고용노동부, 근로복지공단, 홈택스, 소상공인24, 지자체 인허가 부서',
    docs: '근로계약서, 급여명세서, 출퇴근 기록, 사업자등록 자료, 임대차계약서, 매출·매입 증빙',
    firstStep: '일과 사업 문제는 계약 형태를 먼저 구분합니다. 근로자인지, 프리랜서인지, 사업자인지에 따라 절차가 달라집니다.',
    caution: '구두 합의만 믿으면 임금, 세금, 4대보험, 계약 해지에서 문제가 생길 수 있습니다. 조건 변경은 기록으로 남겨야 합니다.',
    sourceHint: '최종 기준은 고용노동부, 고용24, 홈택스, 소상공인24, 담당 지자체 안내를 확인합니다.',
    example: '예를 들어 프리랜서 계약이라도 실제로 출퇴근 통제와 업무지시를 받았다면 근로자성 판단이 쟁점이 될 수 있습니다.',
    finalCheck: '처리 전후로 계약서, 급여명세서, 접수번호, 신고기한, 세금 납부 일정을 따로 정리하세요.'
  },
  '생활·교통': {
    portal: '경찰청 교통민원24, 자동차민원 대국민포털, 통신사 앱, 소비자24, 안전신문고, 지자체 민원창구',
    docs: '운전면허증, 자동차등록증, 보험증권, 요금명세서, 주문내역, 사진·영상, 고지서, 상담 기록',
    firstStep: '생활 문제는 발생 시점과 증거 확보가 중요합니다. 언제, 어디서, 누구에게, 어떤 손해가 생겼는지 먼저 정리합니다.',
    caution: '납부, 해지, 환불, 신고는 처리 방식에 따라 결과가 달라집니다. 감정적으로 대응하기보다 증거와 요구사항을 분리하세요.',
    sourceHint: '최종 확인은 담당 기관, 통신사, 카드사, 판매처, 지자체 민원창구의 안내를 기준으로 합니다.',
    example: '예를 들어 과태료나 통신요금 문제는 고지서를 버리지 말고 납부 전 이의신청 가능 여부와 자동결제 상태를 확인해야 합니다.',
    finalCheck: '처리 후에는 납부 영수증, 접수번호, 환불 예정일, 해지 완료 문자, 추가 청구 가능성을 확인하세요.'
  }
};

const topicMap: Record<FaqCategory, string[]> = {
  '지원금·신청': ['전입신고', '주민등록등본 발급', '가족관계증명서 발급', '여권 재발급', '인감증명서 발급', '기초연금 신청', '긴급복지 지원', '청년월세 지원', '주거급여 신청', '에너지바우처', '아이돌봄서비스', '출산지원금', '부모급여', '보육료 전환', '장애인 활동지원', '국민취업지원제도', '실업급여 신청', '근로장려금 신청', '교육급여 신청', '문화누리카드', '건강보험 피부양자 등록', '요양비 지원', '난임지원 신청', '주민센터 방문 민원', '정부24 온라인 신청'],
  '세금·환급': ['연말정산 간소화', '월세 세액공제', '의료비 공제', '교육비 공제', '신용카드 공제', '기부금 공제', '부양가족 공제', '종합소득세 신고', '프리랜서 3.3% 환급', '부가가치세 신고', '간이과세자 신고', '현금영수증 조회', '지방소득세 신고', '자동차세 납부', '재산세 납부', '양도소득세 기본', '상속세 준비', '증여세 신고', '근로장려금 정산', '사업자 비용처리', '원천징수영수증 발급', '퇴직소득세 확인', '환급계좌 등록', '수정신고', '세금 납부기한 연장'],
  '집·계약': ['전세 계약 전 등기부 확인', '월세 계약서 작성', '확정일자 받기', '전입신고와 보증금 보호', '전세보증보험 가입', '보증금 반환 지연', '계약갱신청구권', '묵시적 갱신', '중도퇴실', '관리비 확인', '하자 보수 요청', '원룸 계약 주의사항', '상가 임대차계약', '부동산 중개수수료', '부동산 실거래가 확인', '임대인 변경 통보', '전세사기 의심', '보증금 이체 증빙', '특약 문구 확인', '주택청약 신청', '청약통장 관리', '이사 전 공과금 정산', '입주청소 분쟁', '층간소음 대응', '내용증명 발송'],
  '금융·보험': ['신용점수 확인', '카드 리볼빙 해지', '카드론 상환', '마이너스통장 관리', '주택담보대출 금리', '전세대출 연장', '대출 갈아타기', '예금자보호 확인', '적금 중도해지', '보험 해지환급금', '실손보험 청구', '자동차보험 갱신', '운전자보험 비교', '암보험 보장 확인', '보험금 청구서류', '카드 분실 신고', '보이스피싱 계좌 지급정지', '자동이체 해지', '통장 압류 대응', '개인신용정보 조회', '현금서비스 상환', '대출 연체 전 상담', '보험 약관 확인', '청약철회', '금융분쟁 민원'],
  '일·사업': ['근로계약서 작성', '급여명세서 확인', '주휴수당 계산', '연차수당 확인', '퇴직금 계산', '실업급여 수급조건', '임금체불 신고', '권고사직 확인', '4대보험 가입', '고용보험 이력', '산재 신청', '프리랜서 계약서', '원천징수 확인', '사업자등록 신청', '업종코드 선택', '간이과세 판단', '통신판매업 신고', '스마트스토어 개설', '사업용 계좌', '전자세금계산서', '직원 채용 4대보험', '폐업신고', '소상공인 정책자금', '창업지원사업', '매출 장부 정리'],
  '생활·교통': ['운전면허 갱신', '자동차검사 예약', '과태료 조회', '범칙금과 벌점', '자동차보험 사고접수', '중고차 구매 확인', '차량 명의이전', '하이패스 미납', '휴대폰 요금제 변경', '알뜰폰 번호이동', '인터넷 약정 해지', '구독 서비스 해지', '중고거래 사기', '환불 거절 대응', '택배 분실', '전자제품 AS', '여권 유효기간', '항공권 이름 오류', '숙소 예약 취소', '여행자보험', '가스 냄새 신고', '누수 피해', '정전 대응', '보이스피싱 신고', '안전신문고 신고']
};

const angleTemplates = [
  {
    key: 'condition',
    title: (topic: string) => `${topic} 조건과 대상은 어떻게 확인하나요?`,
    summary: (topic: string) => `${topic}은 대상, 기간, 명의, 관할을 먼저 확인해야 시행착오를 줄일 수 있습니다.`,
    lead: (topic: string, guide: Guide) => `${topic}을 확인할 때는 내 상황이 대상에 들어가는지부터 봐야 합니다. ${guide.firstStep}`,
    checklist: (topic: string, guide: Guide) => `확인할 항목은 ① 현재 주소지 또는 관할, ② 신청자 명의, ③ 기간과 마감일, ④ 소득·계약·납부 등 증빙 여부입니다. ${guide.example}`
  },
  {
    key: 'docs',
    title: (topic: string) => `${topic} 준비서류와 증빙은 무엇인가요?`,
    summary: (topic: string) => `${topic}은 기본서류와 상황을 입증하는 자료를 함께 준비해야 처리 지연을 줄일 수 있습니다.`,
    lead: (topic: string, guide: Guide) => `${topic}은 말로 설명하기보다 자료로 증명하는 절차입니다. 기본적으로 ${guide.docs}를 먼저 확인하세요.`,
    checklist: () => '서류는 최근 발급분인지, 이름과 주소가 맞는지, 금액과 날짜가 보이는지, 원본 제출인지 사본 제출인지 구분해야 합니다.'
  },
  {
    key: 'process',
    title: (topic: string) => `${topic} 신청이나 처리는 어디서 진행하나요?`,
    summary: (topic: string) => `${topic}은 공식 창구에서 접수하고 접수번호를 남기는 방식이 가장 안전합니다.`,
    lead: (topic: string, guide: Guide) => `${topic}은 비공식 안내만 보고 진행하지 말고 ${guide.portal}에서 가능 여부를 먼저 확인하세요.`,
    checklist: () => '권장 순서는 요건 확인 → 서류 준비 → 온라인 또는 방문 접수 → 접수번호 보관 → 처리 결과 확인입니다.'
  },
  {
    key: 'trouble',
    title: (topic: string) => `${topic}이 반려되거나 문제가 생기면 어떻게 하나요?`,
    summary: (topic: string) => `${topic}이 막히면 같은 신청을 반복하기보다 반려 사유와 보완 자료를 먼저 확인해야 합니다.`,
    lead: (topic: string) => `${topic}이 반려되거나 처리가 지연되면 접수번호, 담당 부서, 반려 문구, 보완 기한을 먼저 정리하세요.`,
    checklist: (topic: string, guide: Guide) => `다음으로 빠진 증빙이 있는지 보고, 기준이 애매하면 ${guide.portal}에 구체적으로 문의하세요. 손해나 분쟁이 커질 수 있으면 문자, 사진, 이체내역, 상담 기록을 시간순으로 보관하는 것이 좋습니다.`
  }
] as const;

const normalizeId = (value: string) =>
  value
    .replace(/[·\s]+/g, '-')
    .replace(/[^가-힣a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .toLowerCase();

function makeBody(topic: string, guide: Guide, angle: (typeof angleTemplates)[number]) {
  return [
    `# ${angle.title(topic)}`,
    angle.lead(topic, guide),
    angle.checklist(topic, guide),
    `공식 확인 경로는 ${guide.sourceHint}`,
    `주의할 점은 ${guide.caution}`,
    `마지막으로 ${guide.finalCheck}`
  ].join('\n\n');
}

export const faqArticles: SeedFaqArticle[] = faqCategories.flatMap((category, categoryIndex) => {
  const guide = categoryGuide[category];
  const topics = topicMap[category];

  return topics.flatMap((topic, topicIndex) =>
    angleTemplates.map((angle, angleIndex) => {
      const question = angle.title(topic);
      const createdDay = String(((categoryIndex + topicIndex + angleIndex) % 28) + 1).padStart(2, '0');
      return {
        id: `${normalizeId(category)}-${String(topicIndex + 1).padStart(2, '0')}-${angle.key}`,
        question,
        title: question,
        summary: angle.summary(topic),
        category,
        body: makeBody(topic, guide, angle),
        sourceHint: guide.sourceHint,
        createdAt: `2026-06-${createdDay}T09:00:00+09:00`,
        helpful: 83 + ((categoryIndex * 11 + topicIndex * 5 + angleIndex) % 16),
        isSeed: true as const
      };
    })
  );
});

export const faqCountsByCategory = faqCategories.reduce<Record<FaqCategory, number>>((acc, category) => {
  acc[category] = faqArticles.filter((article) => article.category === category).length;
  return acc;
}, {} as Record<FaqCategory, number>);
