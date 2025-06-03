import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - ThermoChef',
  description: 'Terms of Service for ThermoChef Recipe Scale Pro',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50">
          <h1 className="text-4xl font-bold text-white mb-8">Terms of Service</h1>
          <p className="text-gray-300 mb-8">Last updated: December 2024</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-300 mb-4">
                By accessing and using ThermoChef Recipe Scale Pro ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p className="text-gray-300 mb-4">
                ThermoChef is a recipe conversion and management platform that helps users adapt recipes for Thermomix devices. Our service includes:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Recipe conversion for Thermomix models (TM5, TM6, TM7)</li>
                <li>Recipe storage and organization</li>
                <li>Meal planning and shopping list generation</li>
                <li>AI-powered recipe optimization</li>
                <li>Image generation for recipes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <p className="text-gray-300 mb-4">
                To access certain features of the Service, you must create an account. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Maintaining the confidentiality of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Providing accurate and current information</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Subscription and Billing</h2>
              <p className="text-gray-300 mb-4">
                ThermoChef offers both free and paid subscription plans:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Free Plan: Limited conversions and basic features</li>
                <li>Pro Plan: Unlimited conversions and premium features</li>
                <li>Family Plan: Pro features for up to 5 family members</li>
              </ul>
              <p className="text-gray-300 mb-4">
                Paid subscriptions are billed annually. You may cancel at any time, and your subscription will remain active until the end of your current billing period.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Acceptable Use</h2>
              <p className="text-gray-300 mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious content or spam</li>
                <li>Reverse engineer or attempt to access our systems</li>
                <li>Use the service for commercial purposes without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Intellectual Property</h2>
              <p className="text-gray-300 mb-4">
                The Service and its original content, features, and functionality are owned by ThermoChef and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
              <p className="text-gray-300 mb-4">
                You retain ownership of recipes you upload, but grant us a license to use, modify, and display them as necessary to provide the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Privacy Policy</h2>
              <p className="text-gray-300 mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Disclaimers</h2>
              <p className="text-gray-300 mb-4">
                The Service is provided "as is" without warranties of any kind. We do not guarantee that:
              </p>
              <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2">
                <li>The Service will be error-free or uninterrupted</li>
                <li>Recipe conversions will be perfect or safe</li>
                <li>The Service will meet your specific requirements</li>
                <li>Data will be preserved indefinitely</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-300 mb-4">
                In no event shall ThermoChef be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Termination</h2>
              <p className="text-gray-300 mb-4">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms of Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Changes to Terms</h2>
              <p className="text-gray-300 mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any changes by posting the new Terms of Service on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Contact Information</h2>
              <p className="text-gray-300 mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p className="text-gray-300">
                Email: legal@thermochef.com<br />
                Address: [Your Business Address]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}