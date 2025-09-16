import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSiteData, logAnalyticsEvent } from '../api/xano'
import { HeaderSection } from '../components/sections/HeaderSection'
import { FooterSection } from '../components/sections/FooterSection'

interface DonatePageProps {
  slug?: string
}

export default function DonatePage({ slug }: DonatePageProps) {
  const params = useParams()
  const [siteData, setSiteData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState('')
  const [donationType, setDonationType] = useState<'one-time' | 'monthly'>('one-time')

  const currentSlug = slug || params.slug || 'happy-paws'

  const donationAmounts = [25, 50, 100, 250, 500, 1000]

  useEffect(() => {
    loadData()
  }, [currentSlug])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await fetchSiteData(currentSlug, '/donate')
      
      if (result.success && result.data && !result.data.error) {
        setSiteData(result.data)
      } else {
        // Fallback to mock data
        setSiteData({
          organization: {
            name: 'Happy Paws Rescue',
            slug: 'happy-paws',
            tax_id: '12-3456789'
          },
          design: {
            primary_color: '#3B82F6',
            background_color: '#FFFFFF',
            font_color: '#1F2937'
          },
          site_content: {
            donation_info: {
              impact_text: 'Your donation directly helps us provide medical care, food, shelter, and love to animals in need.',
              tax_deductible: true,
              impact_examples: [
                { amount: 25, description: 'Provides vaccinations for one animal' },
                { amount: 50, description: 'Covers food for one animal for a month' },
                { amount: 100, description: 'Helps with spay/neuter surgery' },
                { amount: 250, description: 'Covers emergency medical care' }
              ]
            }
          }
        })
      }
    } catch (err) {
      setError('Failed to load donation information')
      console.error('Error loading donation data:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setSelectedAmount(null)
  }

  const handleDonate = async () => {
    const amount = selectedAmount || parseFloat(customAmount)
    
    if (!amount || amount <= 0) {
      alert('Please select or enter a valid donation amount')
      return
    }

    // Log analytics event
    if (siteData?.organization?.tenant_id) {
      await logAnalyticsEvent(siteData.organization.tenant_id, {
        event_type: 'donation_initiated',
        page_path: `/${currentSlug}/donate`,
        element: `donate-${amount}-${donationType}`,
        user_agent: navigator.userAgent
      })
    }

    // In a real app, this would redirect to a payment processor
    alert(`Thank you for your ${donationType} donation of $${amount}! This would redirect to a secure payment processor.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading donation information...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Page</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={loadData}
            className="text-blue-600 hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const primaryColor = siteData?.design?.primary_color || '#3B82F6'
  const organization = siteData?.organization || {}
  const donationInfo = siteData?.site_content?.donation_info || {}

  return (
    <div className="min-h-screen" style={{ backgroundColor: siteData?.design?.background_color || '#FFFFFF' }}>
      {/* Header */}
      <HeaderSection
        data={{
          type: 'header',
          links: [
            { label: 'Home', href: '/' },
            { label: 'Available Pets', href: '/pets' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          showDonate: true
        }}
        design={siteData?.design || {}}
        organization={siteData?.organization || {}}
      />

      <main className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 
          className="text-4xl md:text-5xl font-bold mb-6"
          style={{ color: primaryColor }}
        >
          Support {organization.name}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          {donationInfo.impact_text || 'Your donation helps us save more lives and provide better care for animals in need.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Donation Form */}
        <div>
          <div className="bg-white p-8 rounded-lg shadow-lg border">
            <h2 
              className="text-2xl font-bold mb-6"
              style={{ color: primaryColor }}
            >
              Make a Donation
            </h2>

            {/* Donation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Donation Type
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => setDonationType('one-time')}
                  className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                    donationType === 'one-time'
                      ? 'text-white'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: donationType === 'one-time' ? primaryColor : 'transparent',
                    borderColor: donationType === 'one-time' ? primaryColor : undefined
                  }}
                >
                  One-time
                </button>
                <button
                  onClick={() => setDonationType('monthly')}
                  className={`flex-1 py-2 px-4 rounded-lg border font-medium transition-colors ${
                    donationType === 'monthly'
                      ? 'text-white'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                  style={{
                    backgroundColor: donationType === 'monthly' ? primaryColor : 'transparent',
                    borderColor: donationType === 'monthly' ? primaryColor : undefined
                  }}
                >
                  Monthly
                </button>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {donationAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-3 px-4 rounded-lg border font-medium transition-colors ${
                      selectedAmount === amount
                        ? 'text-white'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                    style={{
                      backgroundColor: selectedAmount === amount ? primaryColor : 'transparent',
                      borderColor: selectedAmount === amount ? primaryColor : undefined
                    }}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              
              <div>
                <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="custom-amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              className="w-full text-white py-3 px-6 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity"
              style={{ backgroundColor: primaryColor }}
            >
              Donate {donationType === 'monthly' ? 'Monthly' : 'Now'}
            </button>

            {/* Tax Deductible Notice */}
            {donationInfo.tax_deductible && (
              <p className="text-sm text-gray-600 mt-4 text-center">
                Your donation is tax-deductible. Tax ID: {organization.tax_id || '12-3456789'}
              </p>
            )}
          </div>
        </div>

        {/* Impact Information */}
        <div>
          <h2 
            className="text-2xl font-bold mb-6"
            style={{ color: primaryColor }}
          >
            Your Impact
          </h2>

          {/* Impact Examples */}
          {donationInfo.impact_examples && donationInfo.impact_examples.length > 0 && (
            <div className="space-y-4 mb-8">
              {donationInfo.impact_examples.map((example: any, index: number) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold"
                    style={{ backgroundColor: primaryColor }}
                  >
                    ${example.amount}
                  </div>
                  <div>
                    <p className="text-gray-700">{example.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other Ways to Help */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 
              className="text-xl font-semibold mb-4"
              style={{ color: primaryColor }}
            >
              Other Ways to Help
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Volunteer your time</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Foster animals in need</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Donate supplies and food</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>Spread awareness on social media</span>
              </div>
            </div>
            
            <div className="mt-6">
              <a
                href={`/${currentSlug}/contact`}
                className="inline-block text-white py-2 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="mt-16 text-center py-12 px-6 rounded-lg" style={{ backgroundColor: `${primaryColor}10` }}>
        <h2 
          className="text-3xl font-bold mb-6"
          style={{ color: primaryColor }}
        >
          Thanks to Donors Like You
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              2,000+
            </div>
            <div className="text-gray-600">Animals Rescued</div>
          </div>
          <div className="text-center">
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              1,850+
            </div>
            <div className="text-gray-600">Successful Adoptions</div>
          </div>
          <div className="text-center">
            <div 
              className="text-4xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              $500K+
            </div>
            <div className="text-gray-600">In Medical Care Provided</div>
          </div>
        </div>
      </div>
      </main>

      {/* Footer */}
      <FooterSection
        data={{
          type: 'footer',
          ein: '12-3456789',
          links: [
            { label: 'Home', href: '/' },
            { label: 'About', href: '/about' },
            { label: 'Contact', href: '/contact' }
          ],
          socials: []
        }}
        design={siteData?.design || {}}
        organization={siteData?.organization || {}}
        site_content={siteData?.site_content || {}}
      />
    </div>
  )
}
