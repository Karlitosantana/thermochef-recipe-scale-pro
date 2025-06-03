'use client';

import { SignIn } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center px-4">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-xl" />
            <span className="text-2xl font-bold text-white">ThermoChef</span>
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-gray-300">Sign in to your account to continue</p>
        </motion.div>

        {/* Auth Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8"
        >
          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-0 p-0",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-gray-300",
                socialButtonsBlockButton: "bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 rounded-xl",
                socialButtonsBlockButtonText: "text-white font-medium",
                formFieldLabel: "text-gray-300 font-medium",
                formFieldInput: "bg-gray-800/50 border-gray-600 text-white rounded-xl focus:border-emerald-500 focus:ring-emerald-500/20",
                footerActionLink: "text-emerald-400 hover:text-emerald-300",
                identityPreviewEditButton: "text-emerald-400 hover:text-emerald-300",
                formButtonPrimary: "bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl",
                dividerLine: "bg-gray-600",
                dividerText: "text-gray-400",
                formFieldInputShowPasswordButton: "text-gray-400 hover:text-white",
                footerAction: "flex justify-center",
                footer: "bg-transparent",
                formResendCodeLink: "text-emerald-400 hover:text-emerald-300",
                formFieldAction: "text-emerald-400 hover:text-emerald-300",
                alertText: "text-red-400",
                formFieldErrorText: "text-red-400",
                otpCodeFieldInput: "bg-gray-800/50 border-gray-600 text-white rounded-xl",
                formHeaderTitle: "hidden",
                formHeaderSubtitle: "hidden",
              },
              layout: {
                socialButtonsPlacement: "top",
                showOptionalFields: false,
              }
            }}
            path="/sign-in"
            routing="path"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
            afterSignUpUrl="/dashboard"
          />
        </motion.div>

        {/* Footer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign up here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}