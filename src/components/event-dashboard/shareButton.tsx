// app/components/ShareLinkButton.tsx or wherever appropriate
'use client';

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ShareLinkButton = () => {
  const handleShareLink = async () => {
    const shareUrl = 'https://evp.republicofengineers.com/';

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Event Overview',
          text: 'Check out my event overview!',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing link:', err);
      alert('Failed to share link.');
    }
  };

  return (
    <Button
      variant="outline"
      className="cursor-pointer bg-black border-none text-white"
      onClick={handleShareLink}
    >
      <Share2 className="mr-2 h-4 w-4" />
      Share
    </Button>
  );
};

export default ShareLinkButton;
