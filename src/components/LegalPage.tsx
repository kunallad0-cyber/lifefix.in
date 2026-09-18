type LegalPageType = 'privacy' | 'terms' | 'contact';

const LAST_UPDATED = 'September 18, 2026';

export function LegalPage({ type }: { type: LegalPageType }) {
  const title = type === 'privacy' ? 'Privacy Policy' : type === 'terms' ? 'Terms of Service' : 'Contact LifeFix AI';

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-800 sm:px-6">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200 sm:p-10">
        <a href="/" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800">← Back to LifeFix AI</a>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>

        {type === 'privacy' && <PrivacyContent />}
        {type === 'terms' && <TermsContent />}
        {type === 'contact' && <ContactContent />}
      </article>
    </main>
  );
}

function PrivacyContent() {
  return (
    <div className="prose prose-slate mt-8 max-w-none">
      <p>LifeFix AI helps people understand everyday problems, suspicious messages, household issues, and safety information. This policy explains what information we collect and how we use it.</p>
      <h2>Information you provide</h2>
      <p>When you use an AI tool, you may provide text, images, voice input, location details, or saved preferences. Please do not submit passwords, one-time codes, payment card numbers, or highly sensitive medical information.</p>
      <h2>Location information</h2>
      <p>With your permission, LifeFix AI may use your approximate device location to provide regional advisories. You can deny permission or disable location access in your browser settings. Location data is used to provide the requested feature and is not sold.</p>
      <h2>How information is used</h2>
      <p>We use submitted information to provide, maintain, secure, and improve the service, respond to support requests, and prevent abuse. AI-generated results may be processed by our service providers to produce a response.</p>
      <h2>Cookies and advertising</h2>
      <p>We may use cookies and similar technologies for essential functionality, analytics, and advertising. Google and its partners may use cookies to serve ads based on a user's prior visits to this or other websites. Where required, you can manage consent through the cookie controls provided on the site or your browser.</p>
      <h2>Retention and security</h2>
      <p>We retain information only as long as reasonably necessary for the purposes described above and use reasonable safeguards. No online service can guarantee absolute security.</p>
      <h2>Children</h2>
      <p>LifeFix AI is not directed to children under 13, and we do not knowingly collect personal information from children.</p>
      <h2>Your choices</h2>
      <p>You may stop using the service, revoke browser permissions, and request help with personal information by contacting us.</p>
      <h2>Contact</h2>
      <p>For privacy questions, email <a href="mailto:support@lifefix.in">support@lifefix.in</a>.</p>
    </div>
  );
}

function TermsContent() {
  return (
    <div className="prose prose-slate mt-8 max-w-none">
      <p>By using LifeFix AI, you agree to these terms. If you do not agree, please do not use the service.</p>
      <h2>Informational service only</h2>
      <p>LifeFix AI provides general information and AI-generated suggestions. It is not a doctor, lawyer, financial adviser, emergency service, electrician, or other licensed professional. Do not rely on it for emergencies or replace professional advice with an AI response.</p>
      <h2>Safety and accuracy</h2>
      <p>AI responses can be incomplete, outdated, or incorrect. For an immediate danger, contact local emergency services. Verify legal, medical, financial, utility, and government information with an authoritative source before acting.</p>
      <h2>Acceptable use</h2>
      <p>Do not use the service to upload unlawful, harmful, infringing, or confidential material; attempt to access another person's information; abuse APIs; or interfere with the service.</p>
      <h2>Third-party services</h2>
      <p>The service may link to or rely on third-party services, including AI, maps, advertising, and local providers. Their availability and policies are outside our control.</p>
      <h2>Changes</h2>
      <p>We may update these terms as the service changes. Continued use after an update means you accept the revised terms.</p>
      <h2>Contact</h2>
      <p>Questions about these terms can be sent to <a href="mailto:support@lifefix.in">support@lifefix.in</a>.</p>
    </div>
  );
}

function ContactContent() {
  return (
    <div className="prose prose-slate mt-8 max-w-none">
      <p>For support, privacy requests, advertising questions, or feedback about LifeFix AI, contact us by email.</p>
      <p><a href="mailto:support@lifefix.in">support@lifefix.in</a></p>
      <p>We aim to respond within a reasonable time. Do not email passwords, OTPs, payment details, or emergency reports. For immediate danger, contact your local emergency services.</p>
    </div>
  );
}
