'use client';

import { useState } from 'react';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButton({ title, url, description }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareData = {
    title,
    text: description || title,
    url,
  };

  const handleNativeShare = async () => {
    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      setIsOpen(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard');
    }
  };

  const shareToSocial = (platform: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || title);

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedDescription}`,
      whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    };

    window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleNativeShare}
        className="p-2 rounded-lg hover:bg-background-light transition-colors"
        title="Share"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-4 left-4 right-4 z-50 sm:left-auto sm:right-4 sm:w-80">
            <div className="card">
              <h3 className="font-semibold mb-4">Share "{title}"</h3>
              
              <div className="grid grid-cols-4 gap-3 mb-4">
                <button
                  onClick={() => shareToSocial('twitter')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <span className="text-xl">🐦</span>
                  <span className="text-xs">Twitter</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('facebook')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <span className="text-xl">📘</span>
                  <span className="text-xs">Facebook</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('whatsapp')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <span className="text-xl">💬</span>
                  <span className="text-xs">WhatsApp</span>
                </button>
                
                <button
                  onClick={() => shareToSocial('email')}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-background transition-colors"
                >
                  <span className="text-xl">✉️</span>
                  <span className="text-xs">Email</span>
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={url}
                  readOnly
                  className="input flex-1 text-sm"
                />
                <button
                  onClick={copyToClipboard}
                  className="btn-outline btn-sm"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}