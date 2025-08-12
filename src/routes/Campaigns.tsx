import React from 'react';
import { Video } from 'lucide-react';

interface Campaign {
  id: string;
  title: string;
  media: {
    videos: Array<{
      id: string;
      url: string;
    }>;
  };
}

const Campaigns: React.FC = () => {
  // Mock data for demonstration
  const campaigns: Campaign[] = [
    {
      id: '1',
      title: 'Sample Campaign',
      media: {
        videos: [
          { id: '1', url: 'video1.mp4' },
          { id: '2', url: 'video2.mp4' }
        ]
      }
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      
      <div className="space-y-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-3">{campaign.title}</h2>
            
            <div className="flex gap-2">
              {campaign.media.videos.slice(0, 2).map((video, index) => (
                <div key={index} className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Video className="h-6 w-6 text-gray-400" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaigns;