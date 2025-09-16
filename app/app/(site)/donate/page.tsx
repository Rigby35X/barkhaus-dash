import { EditableElement } from "@/components/editable-element"
import { Button } from "@/components/ui/button"
import { EditableText } from '@/components/editable-text'
import { EditableImage } from '@/components/editable-image'
import { DonationWidget } from '@/components/donation-widget'
import { Heart, Shield, Award } from 'lucide-react'

const amounts = [25, 50, 100, 250]

export default function DonatePage() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-12">
      {/* Hero Section */}
      <div className="grid gap-6 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <EditableText id="donate-page-title" type="text" className="text-4xl font-bold">
            Make a Difference Today
          </EditableText>
          <EditableText id="donate-page-body" type="text" className="text-muted-foreground">
            Your support funds medical care, enrichment, and placement efforts for pets in need.
          </EditableText>
        </div>
        <EditableImage id="donate-image" src="/placeholder.svg?height=360&width=560" alt="Happy adopted dog" className="w-full rounded-lg border" />
      </div>

      {/* Main Donation Widget */}
      <div className="max-w-2xl mx-auto">
        <DonationWidget
          campaignId="main-campaign"
          title="Emergency Medical Fund"
          description="Help us provide life-saving medical care for animals in critical condition. Your donation covers surgeries, medications, and emergency treatments."
          goalAmount={25000}
          currentAmount={18750}
          donorCount={342}
          theme="primary"
          size="large"
          showProgress={true}
          showDonorCount={true}
          customButton="Donate to Save Lives"
        />
      </div>

      {/* Impact Section */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-center mb-8">Your Impact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900">$25</h4>
            <p className="text-sm text-gray-600">Provides food for one animal for a week</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900">$75</h4>
            <p className="text-sm text-gray-600">Covers vaccinations and basic medical care</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-lg font-medium text-gray-900">$200</h4>
            <p className="text-sm text-gray-600">Funds a complete health checkup and treatment</p>
          </div>
        </div>
      </div>

      {/* Quick Donation Options */}
      <div className="rounded-lg border p-6">
        <h3 className="font-semibold mb-4">Quick Donation</h3>
        <div className="flex flex-wrap gap-3">
          {amounts.map((a) => (
            <Button key={a} variant="outline">${a}</Button>
          ))}
          <Button className="ml-auto">Donate</Button>
        </div>
      </div>

      {/* Additional Donation Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DonationWidget
          campaignId="monthly-supporters"
          title="Monthly Supporters"
          description="Join our community of monthly donors and provide ongoing support."
          goalAmount={15000}
          currentAmount={8900}
          donorCount={156}
          theme="light"
          size="medium"
          showProgress={true}
          showDonorCount={true}
          customButton="Become a Monthly Donor"
        />

        <DonationWidget
          campaignId="emergency-fund"
          title="Emergency Fund"
          description="Help us be ready for urgent medical cases and rescue operations."
          goalAmount={5000}
          currentAmount={3200}
          donorCount={89}
          theme="dark"
          size="medium"
          showProgress={true}
          showDonorCount={false}
          customButton="Support Emergency Care"
        />
      </div>
    </div>
  )
}
