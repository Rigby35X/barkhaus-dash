'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { ScrollArea } from './ui/scroll-area'
import { History, RotateCcw, Eye, User, Clock } from 'lucide-react'

interface Version {
  id: string
  timestamp: Date
  user: string
  changes: string[]
  isCurrent: boolean
}

const mockVersions: Version[] = [
  {
    id: 'v1.3',
    timestamp: new Date('2024-01-15T10:30:00'),
    user: 'Sarah Johnson',
    changes: ['Updated hero title', 'Changed CTA button color'],
    isCurrent: true
  },
  {
    id: 'v1.2',
    timestamp: new Date('2024-01-14T15:45:00'),
    user: 'Mike Chen',
    changes: ['Added new service section', 'Updated about text'],
    isCurrent: false
  },
  {
    id: 'v1.1',
    timestamp: new Date('2024-01-13T09:15:00'),
    user: 'Sarah Johnson',
    changes: ['Initial hero section setup'],
    isCurrent: false
  }
]

export function VersionHistory() {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  const handleRevert = (versionId: string) => {
    if (confirm(`Are you sure you want to revert to version ${versionId}? This will overwrite current changes.`)) {
      // Implement revert logic
      console.log('Reverting to version:', versionId)
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Version History
        </CardTitle>
        <CardDescription>
          View and restore previous versions of your website
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-4">
            {mockVersions.map((version) => (
              <div
                key={version.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{version.id}</h3>
                    {version.isCurrent && (
                      <Badge variant="default">Current</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    {version.user}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {version.timestamp.toLocaleString()}
                </div>
                
                <div className="space-y-1">
                  <p className="text-sm font-medium">Changes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {version.changes.map((change, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {!version.isCurrent && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedVersion(version.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevert(version.id)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Revert
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
