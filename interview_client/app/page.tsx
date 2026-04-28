/**
 * @file page.tsx (interview_client)
 * @description Entry page for the candidate interview experience.
 *
 * Route: /?tokenId=<candidate-access-token>
 *
 * This is a Server Component that reads the `tokenId` query parameter:
 * - If `tokenId` is present and valid → renders the InterviewUI component.
 * - If `tokenId` is missing → renders the InvalidLinkPage error state.
 *
 * The BrandNavbar is always shown as a consistent header element.
 * The InvalidLinkPage provides helpful error messaging and support contact links.
 */

import InterviewUI from "@/components/InterviewUI";

const BRAND_HOME_URL = "https://hiremintora.com";

function BrandNavbar() {
  return (
    <header className="w-full bg-white/70 backdrop-blur-md border-b border-slate-100 z-50 sticky top-0">
      <div 
        style={{ maxWidth: '1024px', width: '100%', margin: '0 auto', padding: '0 24px' }} 
        className="h-16 flex items-center justify-between"
      >
        <a href={BRAND_HOME_URL} className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <div className="w-9 h-9 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7H4C2.9 7 2 7.9 2 9v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z"/>
              <path d="M16 3H8L6 7h12l-2-4z"/>
            </svg>
          </div>
          <span className="text-[19px] font-bold tracking-tight bg-slate-900 bg-clip-text text-transparent">HireMintora</span>
        </a>
        <span className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.2em] hidden sm:block">
          Interview Platform
        </span>
      </div>
    </header>
  );
}

function InvalidLinkPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      <BrandNavbar />
      <main className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-5xl animate-slide-up">
          {/* Main Structural Card */}
          <div className="bg-white rounded-[48px] border border-slate-100 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col md:flex-row min-h-[500px]">
            
            {/* Left Column: Visual Error Branding */}
            <div className="md:w-[40%] bg-rose-50/40 border-r border-slate-50 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 rounded-[32px] bg-white shadow-[0_8px_25px_rgba(244,63,94,0.1)] flex items-center justify-center mb-8">
                <svg className="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight">
                Invalid<br/>Interview Link
              </h1>
              <div className="w-12 h-1.5 bg-rose-200 rounded-full mt-6 opacity-60"></div>
            </div>

            {/* Right Column: Information & Solutions */}
            <div className="md:w-[60%] p-12 md:p-16 flex flex-col items-center justify-center text-center">
              <div className="max-w-[480px] flex flex-col items-center">
                <h2 className="text-[26px] font-bold text-slate-800 mb-6 tracking-tight">
                  Verification Failed
                </h2>
                <div className="space-y-6 mb-12">
                  <p className="text-slate-500 text-[17px] leading-relaxed font-medium">
                    We were unable to verify your interview session. This usually happens if the link has reached its expiration date or was manually deactivated.
                  </p>
                  <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100 flex flex-col items-center gap-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm flex-shrink-0">
                       <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <p className="text-slate-400 text-[14px] leading-relaxed">
                      Please double-check your invitation email for a newer link, or contact your hiring coordinator for assistance.
                    </p>
                  </div>
                </div>

                {/* Actions Container */}
                <div className="w-full space-y-4">
                  <p className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Recommended Actions</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <a
                      href={BRAND_HOME_URL}
                      className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4.5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_12px_25px_-10px_rgba(16,185,129,0.5)] hover:-translate-y-0.5 text-[15px]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Go to Home
                    </a>
                    <a
                      href="mailto:support@hiremintora.com"
                      className="bg-white hover:bg-slate-50 text-slate-600 font-bold py-4.5 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all border border-slate-200 hover:border-slate-300 text-[15px]"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Get Support
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <div className="flex items-center justify-between mt-10 px-4">
             <p className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em]">
                &copy; {new Date().getFullYear()} HireMintora AI Interview Platform
             </p>
             <div className="flex gap-6">
                <a href="#" className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:text-slate-400">Privacy</a>
                <a href="#" className="text-[11px] font-bold text-slate-300 uppercase tracking-[0.2em] hover:text-slate-400">Terms</a>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default async function InterviewPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const tokenId = typeof params.tokenId === "string" ? params.tokenId : null;

  if (!tokenId) {
    return <InvalidLinkPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <BrandNavbar />
      <InterviewUI tokenId={tokenId} />
    </div>
  );
}


