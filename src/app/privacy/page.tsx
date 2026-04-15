import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy — Strata Listings',
  description:
    'How Strata Listings collects, uses, and protects your personal data. Compliant with Singapore\'s Personal Data Protection Act (PDPA).',
}

const SECTIONS = [
  {
    id: 'collect',
    heading: '1. Information We Collect',
    content: [
      'We collect information you provide directly to us, such as when you create an account, save a listing, submit an inquiry to an agent, or contact our support team. This may include your name, email address, phone number, and any other information you choose to provide. We also collect information about your property preferences and search behaviour to improve our recommendations.',
      'We automatically collect certain technical information when you use our Service, including your IP address, browser type, operating system, referring URLs, device identifiers, and pages visited. We may also collect location data if you grant us permission, in order to surface listings relevant to your area.',
    ],
  },
  {
    id: 'use',
    heading: '2. How We Use Your Information',
    content: [
      'We use the information we collect to operate and improve the Service, to personalise your property search experience, to connect you with relevant CEA-licensed estate agents, to send you notifications about saved listings and price changes, and to respond to your inquiries and support requests. We may also use aggregated, anonymised data for market insights and analytics.',
      'We will not use your personal data for direct marketing purposes without your consent. Where consent is required under the Singapore Personal Data Protection Act 2012 ("PDPA"), we will obtain it before proceeding. You may withdraw your consent at any time by contacting us at privacy@strata-listings.sg.',
    ],
  },
  {
    id: 'sharing',
    heading: '3. Sharing and Disclosure',
    content: [
      'We share your information with CEA-licensed estate agents only when you submit an inquiry or request contact about a specific listing. By doing so, you consent to the agent receiving your name, email address, and phone number for the purpose of responding to your inquiry. Agents are bound by our Partner Terms and the CEA\'s data protection obligations.',
      'We may also disclose your personal data to third-party service providers who assist us in operating the Service (such as cloud hosting, email delivery, and analytics providers), subject to appropriate data processing agreements. We do not sell your personal data to third parties. We may disclose information where required by Singapore law, court order, or regulatory authority.',
    ],
  },
  {
    id: 'security',
    heading: '4. Data Security',
    content: [
      'We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, alteration, disclosure, or destruction. These measures include TLS encryption for data in transit, encryption at rest for sensitive fields, access controls, and regular security reviews.',
      'No method of transmission over the internet or electronic storage is completely secure. While we strive to protect your data, we cannot guarantee absolute security. If we become aware of a data breach that is likely to result in significant harm to you, we will notify you and the Personal Data Protection Commission (PDPC) as required under the PDPA\'s mandatory data breach notification obligations.',
    ],
  },
  {
    id: 'cookies',
    heading: '5. Cookies and Tracking',
    content: [
      'We use cookies and similar tracking technologies to remember your preferences, keep you logged in, understand how you use our Service, and measure the effectiveness of our features. You can control cookies through your browser settings, though disabling certain cookies may affect the functionality of the Service.',
      'We use analytics tools (including anonymised usage analytics) to understand aggregate usage patterns. We do not use cross-site tracking advertising technologies or sell behavioural data to advertising networks.',
    ],
  },
  {
    id: 'rights',
    heading: '6. Your Rights (PDPA)',
    content: [
      'Under the Singapore Personal Data Protection Act 2012, you have the right to request access to the personal data we hold about you, to correct any inaccurate or incomplete data, and to withdraw consent for the collection, use, or disclosure of your personal data for any purpose. To exercise these rights, please contact us at privacy@strata-listings.sg. We will respond to access and correction requests within 30 days.',
      'You also have the right to request that we cease using your personal data for marketing purposes, or to have us review how we are handling your data under a data portability or data protection request. Where we decline a request, we will provide reasons as required under the PDPA. You may also lodge a complaint with the PDPC at pdpc.gov.sg if you believe we have not handled your data in accordance with the PDPA.',
    ],
  },
  {
    id: 'retention',
    heading: '7. Data Retention',
    content: [
      'We retain your personal data for as long as your account is active or as necessary to provide the Service. If you close your account, we will delete or anonymise your personal data within 90 days, except where we are required to retain it by law (for example, for tax or regulatory compliance purposes), or where a legitimate dispute resolution purpose exists.',
      'Aggregated, anonymised data (such as search volume statistics) may be retained indefinitely as it no longer identifies any individual. Inquiry records are retained for up to two years to allow for dispute resolution between parties.',
    ],
  },
  {
    id: 'contact',
    heading: '8. Contact Us',
    content: [
      'If you have questions or concerns about this Privacy Policy, or if you wish to exercise your rights under the PDPA, please contact our Data Protection Officer at privacy@strata-listings.sg. Strata Listings is operated by Uniq Labs Pte Ltd, Singapore.',
      'We take privacy seriously and commit to responding to all data-related requests within the timeframes required by applicable Singapore law. Updates to this Privacy Policy will be posted to this page with a revised "last updated" date.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: 1 April 2026</p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Uniq Labs Pte Ltd is committed to protecting your personal data in accordance with the Singapore Personal Data Protection Act 2012 (PDPA). This policy explains how we collect, use, and safeguard your information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-10">
            {SECTIONS.map(({ id, heading, content }) => (
              <div key={id} id={id}>
                <h2 className="text-lg font-semibold text-slate-900 mb-4">{heading}</h2>
                <div className="flex flex-col gap-4">
                  {content.map((para, i) => (
                    <p key={i} className="text-sm text-slate-600 leading-7">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* PDPC note */}
          <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-900 mb-1">Singapore PDPA Compliance</p>
            <p className="text-sm text-blue-700 leading-relaxed">
              Strata Listings is committed to compliance with the Personal Data Protection Act 2012. Our Data Protection Officer can be reached at{' '}
              <a href="mailto:privacy@strata-listings.sg" className="underline hover:no-underline">
                privacy@strata-listings.sg
              </a>
              . You may also contact the Personal Data Protection Commission at{' '}
              <a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
                pdpc.gov.sg
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
