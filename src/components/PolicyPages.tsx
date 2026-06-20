import React, { useState } from 'react';
import { Mail, Check, Send, AlertTriangle, Scale, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  content: string;
  agreePolicy: boolean;
}

export function PrivacyPolicyView() {
  const utcNow = '2026-06-19';
  return (
    <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl mx-auto">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-emerald-600" /> 개인정보처리방침
        </h1>
        <p className="text-xs text-gray-500 mt-2">최종 개정일자: {utcNow}</p>
      </div>

      <div className="space-y-4">
        <p>
          <strong>‘모든질문 코리아’</strong>는 (이하 "회사" 또는 "플랫폼")는 이용자들의 개인정보 보호를 매우 중요시하며, 이용자가 회사의 서비스(이하 "서비스")를 이용함과 동시에 온라인상에서 회사에 제공한 개인정보가 보호받을 수 있도록 최선을 다하고 있습니다.
        </p>
        <p>
          본 방침은 관계 법령의 변경이나 회사의 내부 방침 제반 사항에 따라 개정될 수 있으며, 개정 시 즉시 본 웹페이지를 통해 공지될 것입니다.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">1. 수집하는 개인정보의 항목 및 수집방법</h3>
        <p>
          회사는 서비스 이용자들의 명쾌 성격의 편의적 응답 산출을 돕기 위해 비가입식 익명 방식을 지향하나, 이용자가 직접 피드백 전송 및 제안 상담(문의하기)을 실행할 경우 아래 정보를 수집할 수 있습니다.
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>수집 항목</strong>: 이메일 주소, 이름(혹은 닉네임), 서비스 접속 로그 및 기기 종류 정보.</li>
          <li><strong>수집 방법</strong>: 기재 전송 양식을 통한 자발적 입력, 웹 브라우저 쿠키 연동 자동 기록.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900 mt-6">2. 쿠키(Cookie) 및 Google AdSense 연동 고지</h3>
        <p>
          본 웹사이트는 이용자의 접속 빈도나 방문 시간 등을 분석하고 이용자의 관심 분야를 파악하여 광고를 포함한 개인 맞춤형 서비스를 제공하기 위해 쿠키(Cookie) 정보를 사용합니다.
        </p>
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md text-sm text-gray-600">
          <strong>AdSense 제3자 광고 활용 동의 고지:</strong>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Google 등의 제3자 제공업체는 쿠키를 사용하여 사용자가 당사 웹사이트나 다른 웹사이트를 방문한 이력을 바탕으로 정밀 맞춤형 광고를 게재합니다.</li>
            <li>Google의 광고 쿠키 사용을 통해 Google과 파트너사는 사용자의 사이트 방문에 기반한 최적의 제휴 광고를 송출할 수 있습니다.</li>
            <li>이용자는 <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">Google 광고 설정</a> 웹을 방문하여 관심분야 맞춤설정 광고 게재를 비활성화할 수 있습니다.</li>
          </ul>
        </div>

        <h3 className="text-lg font-bold text-gray-900 mt-6">3. 개인정보의 보유 및 이용기간</h3>
        <p>
          원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다. 단, 전자상거래 등에서의 소비자보호에 관한 법률 등 관계법령의 규정에 의하여 보존할 필요가 있는 경우 지정 기간 동안 개인정보를 안전하게 별도 보관합니다.
        </p>

        <h3 className="text-lg font-bold text-gray-900 mt-6">4. 이용자 및 법정대리인의 권리와 그 행사방법</h3>
        <p>
          이용자 및 법정 대리인은 언제든지 등록되어 있는 자신의 개인정보 조회를 요구할 수 있으며 이메일을 연동하여 개인정보 수정 및 "삭제"를 서면 요청할 수 있으며 회사는 이에 긴급 대응하여 즉각 조치합니다.
        </p>
      </div>
    </div>
  );
}

export function TermsOfServiceView() {
  const utcNow = '2026-06-19';
  return (
    <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl mx-auto">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Scale className="text-indigo-600" /> 이용약관
        </h1>
        <p className="text-xs text-gray-500 mt-2">최종 개정일자: {utcNow}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">제 1 조 (목적)</h3>
        <p>
          본 약관은 ‘모든질문 코리아’(이하 "회사")가 온라인상에서 무상 제공하는 지식 정보 포털 콘텐츠 및 AI 질문 솔루션 정보망 서비스의 이용조건 및 절차, 이용자와 회사의 책임 범위 기타 필요한 규율을 정의하는 것을 목적으로 합니다.
        </p>

        <h3 className="text-lg font-bold text-gray-900">제 2 조 (용어의 정의)</h3>
        <p>
          "이용자"란 본 플랫폼 웹사이트에 접속하여 회사가 제공하는 서면 아티클 정보를 열람하거나, 검색 기능 및 AI Q&A 생성기 서비스를 이용하는 모든 고객을 지칭합니다.
        </p>

        <h3 className="text-lg font-bold text-gray-900">제 3 조 (이용 계약의 성립 및 해지)</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>본 플랫폼 서비스의 핵심 아티클 및 정보 탐색 도구들은 별도의 가입이나 결제 의무 없이 완전한 개방형 무상 서비스로 작동됩니다.</li>
          <li>이용자는 본 사이트 정보를 열람 및 활용함으로써 본 서비스 약관 및 개인정보처리방침의 내용에 적법하게 동의한 것으로 간주합니다.</li>
        </ul>

        <h3 className="text-lg font-bold text-gray-900">제 4 조 (콘텐츠 보증의 제한 및 유의점)</h3>
        <p>
          본 사이트에서 제공되는 다양한 정보(생활, 세무, 건강, 기술, 법률적 예시 등)와 AI 생성 답변은 대중적 이해를 돕기 위해 마련된 요약 칼럼입니다. 이는 실무 전문가의 대면 1:1 진단이나 행정상 유권해석을 전적으로 대신할 수 없으며 법적인 기속력을 보증하지 않습니다.
        </p>
      </div>
    </div>
  );
}

export function DisclaimerView() {
  return (
    <div className="space-y-6 text-gray-700 leading-relaxed max-w-4xl mx-auto">
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <AlertTriangle className="text-amber-600" /> 면책고지 (Disclaimer)
        </h1>
        <p className="text-xs text-gray-500 mt-2">안내 및 사용 제약 고지사항</p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-sm text-red-800 rounded-r-md">
          <strong>독자 행동 시 유의 경고:</strong>
          <p className="mt-1">
            본 사이트의 모든 아티클에 명시 및 게시된 제안이나 대안 팁들은 작성자의 일차 조사 및 거대 언어 모델 인공지능(AI) 서비스의 정제를 거친 서술문입니다. 실제 집행 전 공공기관이나 공인 자격증을 소유한 전문가를 통한 재검증을 권고합니다.
          </p>
        </div>

        <p>
          1. <strong>책임의 제한</strong>: 모든질문 코리아 플랫폼은 본 사이트에 수록된 임의 정보의 적절성, 안전성, 부합성, 무오류성 전제에 관하여 상징적 표현 외에 어떠한 계약적 배상 혹은 공식적인 보증도 주지 않습니다. 본 웹 가이드 정보의 실행이나 해석으로 인해 발생할 수 있는 일체의 물적, 인적 해 및 행정상 가산금에 대해 당사는 일절 민•형사상의 연대배상 책임을 떠안지 않습니다.
        </p>
        <p>
          2. <strong>외부 하이퍼링크의 책임 거부</strong>: 정보 제공의 편의를 위해 게재된 정부 홈페이지, 은행 서비스, 외부 포털 등의 타사 도메인 하이퍼링크는 독자 자율 참조 구역입니다. 연결된 제3자 웹사이트의 실시간 유해성, 개인정보 침해, 허위 기재 여부에 대한 감독권은 당사 관할 밖에 위치합니다.
        </p>
      </div>
    </div>
  );
}

export function ContactUsView() {
  const [form, setForm] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '애드센스 광고 제휴 및 일반 문의',
    content: '',
    agreePolicy: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subjects = [
    '애드센스 광고 제휴 및 일반 문의',
    '글 집필 제안 및 오류 정정 요청',
    'AI 지식 생성 오류 피드백',
    '기타 서비스 개선 의견',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!form.name.trim()) return setErrorMsg('이름을 입력해 주십시오.');
    if (!form.email.includes('@')) return setErrorMsg('올바른 이메일 주소를 기재해 주십시오.');
    if (!form.content.trim()) return setErrorMsg('문의 내용을 소상히 입력해 주십시오.');
    if (!form.agreePolicy) return setErrorMsg('개인정보처리방침 동의 체크가 누락되었습니다.');

    // Simulate sending form successfully
    setIsSuccess(true);
    setForm({
      name: '',
      email: '',
      subject: '애드센스 광고 제휴 및 일반 문의',
      content: '',
      agreePolicy: false,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl mx-auto">
      <div className="md:col-span-4 space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-300" /> 문의 및 제휴 제안
          </h2>
          <p className="text-xs text-indigo-100 leading-relaxed">
            모든질문 코리아는 애드센스 우량 광고 연동 및 한국 실생활 칼럼 지식 제휴 파트너십을 환영합니다.
          </p>
          <div className="mt-6 space-y-3 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <span className="font-bold shrink-0">운영지 이메일:</span>
              <span className="font-mono">apark12321@gmail.com</span>
            </div>
            <div>
              <span className="font-bold shrink-0">운영 응대시간:</span>
              <p className="mt-1">평일 오전 10:00 ~ 오후 17:00 (주말 공휴일 제외)</p>
            </div>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-5 bg-white text-xs text-gray-500 space-y-3">
          <h3 className="font-bold text-gray-700 flex items-center gap-1">
            <HeartHandshake className="w-4 h-4 text-pink-500" /> 제휴 및 자격 검증 안내
          </h3>
          <p>
            저희 사이트는 구글의 애드센스 고유 정책 및 투명 게시 윤리 요건을 철저히 기조로 삼습니다. 성인물, 도박, 불법 의약품, 근거 없는 스캠 금융 가이드 형태의 제휴 안건은 즉시 차단 및 폐기 처리됩니다.
          </p>
        </div>
      </div>

      <div className="md:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        {isSuccess ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">제외 문의 및 안건이 전송되었습니다.</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              작성해주신 구글 기입 이메일로 영업 시간 이내에 담당 관리자가 피드백 제안 검토 서면을 정성껏 보내드리겠습니다. 대단히 감사합니다.
            </p>
            <button
              onClick={() => setIsSuccess(false)}
              className="mt-6 bg-slate-900 hover:bg-black text-white font-bold text-xs py-2 px-6 rounded-lg transition-colors"
            >
              추가 문의하기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 pb-2 border-b border-gray-100">온라인 간편 제휴 서류 기입</h3>

            {errorMsg && (
              <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">성명 / 기업체명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 홍길동 대리"
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">답신 수신용 이메일 주소 *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  className="w-full text-sm border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">문의 유형 카테고리 *</label>
              <select
                className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-100"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              >
                {subjects.map((sub, i) => (
                  <option key={i} value={sub}>{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">상세 제안 및 건의 내용 *</label>
              <textarea
                required
                rows={5}
                placeholder="질문 개선 의견이나 사이트 내 허위 기재 지적 사항, 또는 애드센스 협약 배너 및 협업 가치를 소상히 남겨 주시면 확인 및 연락드리겠습니다."
                className="w-full text-sm border border-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                id="agree-checkbox"
                type="checkbox"
                className="mt-1 border-slate-200 rounded text-blue-600 focus:ring-0 cursor-pointer"
                checked={form.agreePolicy}
                onChange={(e) => setForm({ ...form, agreePolicy: e.target.checked })}
              />
              <label htmlFor="agree-checkbox" className="text-xs text-gray-500 cursor-pointer select-none leading-normal">
                제안 심사 및 답신 연락 발송을 위한 최소한의 개인정보 파기 수령(이름, 이메일) 및 개인정보처리방침 처리에 온전히 서면 동의합니다. (필수)
              </label>
            </div>

            <button
              type="submit"
              className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
            >
              접수 및 발송하기 <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
