'use client'

import React, { useState } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { AlertCircle, CheckCircle, Loader2, Sparkles, Eye } from 'lucide-react'
import { generateAISite, publishSite } from '../../api/xano'

interface AIGenerationPanelProps {
  tenantId: number
  organizationName: string
  onSiteGenerated?: () => void
}

interface GenerationStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'error'
  message?: string
}

export function AIGenerationPanel({ tenantId, organizationName, onSiteGenerated }: AIGenerationPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [steps, setSteps] = useState<GenerationStep[]>([
    { id: 'plan', name: 'Generate Site Structure', status: 'pending' },
    { id: 'content', name: 'Create Content', status: 'pending' },
    { id: 'publish', name: 'Publish Site', status: 'pending' }
  ])
  const [generationResult, setGenerationResult] = useState<any>(null)

  const updateStep = (stepId: string, status: GenerationStep['status'], message?: string) => {
    setSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status, message } : step
    ))
  }

  const generateSite = async () => {
    setIsGenerating(true)
    setGenerationResult(null)
    
    // Reset all steps
    setSteps(prev => prev.map(step => ({ ...step, status: 'pending' })))

    try {
      // Step 1: Generate site structure and content
      updateStep('plan', 'running', 'Creating site structure with AI...')

      console.log('🤖 Starting AI generation for tenant:', tenantId)
      const aiResult = await generateAISite(tenantId)

      if (aiResult.success && aiResult.data) {
        const result = aiResult.data
        console.log('✅ AI generation successful:', result)

        updateStep('plan', 'completed', `Created ${result.pages_created || result.created_pages?.length || 0} pages`)
        updateStep('content', 'completed', `Generated ${result.sections_updated || result.total_updated || 0} sections`)

        // Step 2: Publish site
        updateStep('publish', 'running', 'Publishing site...')

        const publishResult = await publishSite(tenantId, 'publish')

        if (publishResult.success) {
          updateStep('publish', 'completed', 'Site published successfully')
          setGenerationResult(result)
          onSiteGenerated?.()
        } else {
          updateStep('publish', 'error', publishResult.error || 'Failed to publish site')
        }
      } else {
        console.error('❌ AI generation failed:', aiResult)
        updateStep('plan', 'error', aiResult.error || 'AI generation failed')
      }

    } catch (error) {
      console.error('Generation error:', error)
      updateStep('plan', 'error', 'Failed to generate site')
    } finally {
      setIsGenerating(false)
    }
  }

  const getStepIcon = (status: GenerationStep['status']) => {
    switch (status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
    }
  }

  const completedSteps = steps.filter(step => step.status === 'completed').length
  const progress = (completedSteps / steps.length) * 100

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI Website Generator
        </CardTitle>
        <CardDescription>
          Generate a complete website for {organizationName} using AI
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Generation Button */}
        <div className="flex gap-3">
          <Button 
            onClick={generateSite}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate AI Website'}
          </Button>
          
          {generationResult && (
            <Button variant="outline" asChild>
              <a href={`/happy-paws`} target="_blank" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Preview Site
              </a>
            </Button>
          )}
        </div>

        {/* Progress */}
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {/* Steps */}
        {(isGenerating || generationResult) && (
          <div className="space-y-3">
            <h4 className="font-medium">Generation Steps</h4>
            {steps.map((step) => (
              <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg border">
                {getStepIcon(step.status)}
                <div className="flex-1">
                  <div className="font-medium">{step.name}</div>
                  {step.message && (
                    <div className="text-sm text-gray-600">{step.message}</div>
                  )}
                </div>
                <Badge variant={
                  step.status === 'completed' ? 'default' :
                  step.status === 'error' ? 'destructive' :
                  step.status === 'running' ? 'secondary' : 'outline'
                }>
                  {step.status}
                </Badge>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {generationResult && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-800 mb-2">✅ Site Generated Successfully!</h4>
            <div className="text-sm text-green-700 space-y-1">
              <p>• {generationResult.pages_created} pages created</p>
              <p>• {generationResult.sections_updated} sections generated</p>
              <p>• Success rate: {generationResult.summary?.success_rate}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
