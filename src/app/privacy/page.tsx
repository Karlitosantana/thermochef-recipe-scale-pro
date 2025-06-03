import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy - ThermoChef',
  description: 'Privacy Policy for ThermoChef Recipe Scale Pro',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          <p className="text-gray-300 mb-8">Last updated: December 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">Personal Information</h3>
              <p className="text-gray-300 mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Email address and name</li>
                <li>Profile information (cooking level, preferences, dietary restrictions)</li>
                <li>Payment information (processed securely by Stripe)</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Recipes you create, convert, or save</li>
                <li>Device models and settings you use</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-300 mb-4">
                We use your information to:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Provide and improve our recipe conversion services</li>
                <li>Personalize recipe recommendations</li>
                <li>Process payments and manage subscriptions</li>
                <li>Send service updates and support communications</li>
                <li>Analyze usage patterns to improve our platform</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Information Sharing</h2>
              <p className="text-gray-300 mb-4">
                We do not sell your personal information. We may share information with:
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Service Providers</h3>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Clerk (authentication services)</li>
                <li>Stripe (payment processing)</li>
                <li>OpenAI (recipe analysis and conversion)</li>
                <li>Replicate (image generation)</li>
                <li>Railway (hosting and infrastructure)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Legal Requirements</h3>
              <p className="text-gray-300 mb-4">
                We may disclose information when required by law or to protect our rights, users, or the public.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Data Security</h2>
              <p className="text-gray-300 mb-4">
                We implement appropriate security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure payment processing (PCI DSS compliant)</li>
                <li>Regular backups and disaster recovery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Your Rights and Choices</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3">Access and Control</h3>
              <p className="text-gray-300 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Access and download your personal data</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Object to certain data processing</li>
                <li>Data portability (export your recipes)</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3">Communication Preferences</h3>
              <p className="text-gray-300 mb-4">
                You can manage your email preferences in your account settings or unsubscribe from marketing emails at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies and Tracking</h2>
              <p className="text-gray-300 mb-4">
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Authentication and session management</li>
                <li>Remembering your preferences</li>
                <li>Analytics and performance monitoring</li>
                <li>Security and fraud prevention</li>
              </ul>
              <p className="text-gray-300 mb-4">
                You can control cookies through your browser settings, but some features may not work properly if cookies are disabled.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Data Retention</h2>
              <p className="text-gray-300 mb-4">
                We retain your information for as long as necessary to provide our services. Specifically:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Account data: Until you delete your account</li>
                <li>Recipes and conversions: Until you delete them or your account</li>
                <li>Usage logs: Up to 2 years for analytics</li>
                <li>Payment records: As required by law (typically 7 years)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-300 mb-4">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we discover we have collected such information, we will delete it immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. International Data Transfers</h2>
              <p className="text-gray-300 mb-4">
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with applicable privacy laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-300 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our service, and update the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contact Us</h2>
              <p className="text-gray-300 mb-4">
                If you have questions about this Privacy Policy or want to exercise your rights, please contact us:
              </p>
              <p className="text-gray-300">
                Email: privacy@thermochef.com<br />
                Address: [Your Business Address]<br />
                Data Protection Officer: [DPO Contact if required]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}