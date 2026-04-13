import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service — Strata Listings',
  description:
    'Read the Terms of Service for Strata Listings — the rules governing your use of Singapore\'s trusted property marketplace.',
}

const SECTIONS = [
  {
    id: 'acceptance',
    heading: '1. Acceptance of Terms',
    content: [
      'By accessing or using the Strata Listings website, mobile applications, or any related services (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you must not use the Service. These Terms constitute a legally binding agreement between you and Strata Listings Pte Ltd, a company incorporated in Singapore.',
      'We may update these Terms from time to time. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms. We will make reasonable efforts to notify you of material changes by email or by a prominent notice on the Service.',
    ],
  },
  {
    id: 'use',
    heading: '2. Use of Service',
    content: [
      'You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service in any way that violates applicable Singapore law or regulations, infringes on the rights of any third party, transmits any unsolicited commercial communications, or attempts to gain unauthorised access to any part of the Service or its infrastructure.',
      'We reserve the right to terminate or restrict your access to the Service at any time, without notice, for conduct that we determine violates these Terms or is harmful to other users, us, or third parties.',
    ],
  },
  {
    id: 'accounts',
    heading: '3. User Accounts',
    content: [
      'Certain features of the Service require you to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately at hello@strata-listings.sg of any unauthorised use of your account or any other security breach.',
      'You agree to provide accurate, current, and complete information when creating your account. Strata Listings reserves the right to suspend or terminate accounts found to contain false or misleading information.',
    ],
  },
  {
    id: 'listings',
    heading: '4. Listings and Content',
    content: [
      'All property listings on the Service are posted by CEA-licensed estate agents. Strata Listings does not independently verify the accuracy of all listing details, including but not limited to floor area, price per square foot, amenities, or TOP dates. Buyers and renters are encouraged to verify all material information independently before entering into any property transaction.',
      'Users who submit content to the Service — including inquiries, reviews, or comments — grant Strata Listings a non-exclusive, royalty-free licence to use, reproduce, and display that content in connection with the Service. You represent that you have all necessary rights to grant this licence.',
    ],
  },
  {
    id: 'agents',
    heading: '5. Agent Responsibilities',
    content: [
      'All estate agents listing properties on the Service must hold a valid CEA licence and comply with the CEA Code of Ethics and Professional Client Care. Agents are solely responsible for the accuracy and completeness of their listings, for responding to inquiries in a timely manner, and for complying with all applicable Singapore property laws and regulations.',
      'Strata Listings acts as a marketplace intermediary only. We are not party to any transaction between a buyer, seller, landlord, or tenant, and we accept no liability for the outcome of any property transaction facilitated through the Service.',
    ],
  },
  {
    id: 'ip',
    heading: '6. Intellectual Property',
    content: [
      'The Service and its original content, features, and functionality are owned by Strata Listings Pte Ltd and are protected by Singapore and international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any part of the Service without our prior written consent.',
      'Any feedback, suggestions, or ideas you provide to us regarding the Service may be used by Strata Listings without obligation to you. You waive any claim that such use requires compensation or attribution.',
    ],
  },
  {
    id: 'disclaimers',
    heading: '7. Disclaimers',
    content: [
      'The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. Strata Listings does not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components. Market data, valuations, and insights provided through the Service are for informational purposes only and should not be construed as professional financial or property advice.',
      'You acknowledge that property prices, availability, and market conditions can change rapidly. Any reliance on information obtained through the Service is at your sole risk. We strongly recommend engaging a licensed estate agent and conducting independent due diligence before making any property decision.',
    ],
  },
  {
    id: 'liability',
    heading: '8. Limitation of Liability',
    content: [
      'To the fullest extent permitted by Singapore law, Strata Listings Pte Ltd, its directors, employees, agents, and licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or other intangible losses, arising out of or relating to your use of or inability to use the Service.',
      'In no event shall our total aggregate liability to you for all claims arising out of or relating to the Service exceed the greater of (a) the amount you paid to us in the twelve months preceding the claim, or (b) SGD 100.',
    ],
  },
  {
    id: 'governing',
    heading: '9. Governing Law',
    content: [
      'These Terms shall be governed by and construed in accordance with the laws of the Republic of Singapore, without regard to its conflict of law provisions. You agree to submit to the exclusive jurisdiction of the courts of Singapore for any dispute arising out of or relating to these Terms or the Service.',
      'If any provision of these Terms is found by a court of competent jurisdiction to be invalid or unenforceable, the remaining provisions will continue in full force and effect.',
    ],
  },
  {
    id: 'changes',
    heading: '10. Changes to Terms',
    content: [
      'We reserve the right to modify these Terms at any time. We will provide at least 14 days\' notice before any material changes take effect, either by email to the address associated with your account or by posting a prominent notice on the Service. Your continued use of the Service after the effective date of any changes constitutes acceptance of the new Terms.',
      'If you do not agree to the revised Terms, you must stop using the Service and, if applicable, close your account. For any questions about these Terms, please contact us at legal@strata-listings.sg.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-100">
        <div className="mx-auto max-w-3xl px-4 pt-14 pb-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm text-slate-500">Last updated: 1 April 2026</p>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Please read these Terms of Service carefully before using Strata Listings. By accessing or using our Service, you agree to these terms.
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

          {/* Footer note */}
          <div className="mt-12 rounded-xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm text-slate-500 leading-relaxed">
              <strong className="text-slate-700">Questions?</strong> If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:legal@strata-listings.sg" className="text-primary hover:underline">
                legal@strata-listings.sg
              </a>{' '}
              or write to Strata Listings Pte Ltd, 1 Raffles Place #40-01, Singapore 048616.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
