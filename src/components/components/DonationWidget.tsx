// components/DonationWidget.tsx
'use client';
import { useEffect } from 'react';

export default function DonationWidget({ campaignId }:{ campaignId:string }) {
  useEffect(() => {
    // load Givebutter widgets script once if needed
    // or include via <Script src="...widgets.js" />
  }, []);
  return <div data-givebutter-widget data-givebutter-campaign={campaignId} />;
}
