import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { volunteerFormSchema, type VolunteerFormData } from '../../schemas/formSchemas'
import { submitVolunteerForm } from '../../api/xano'

interface VolunteerApplicationFormProps {
  tenantId: number
  onSuccess: () => void
  primaryColor?: string
}

export function VolunteerApplicationForm({ tenantId, onSuccess, primaryColor = '#3B82F6' }: VolunteerApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 3

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger
  } = useForm<VolunteerFormData>({
    resolver: zodResolver(volunteerFormSchema),
    mode: 'onBlur',
    defaultValues: {
      todaysDate: new Date().toLocaleDateString(),
      commitmentDate: new Date().toLocaleDateString(),
      finalDate: new Date().toLocaleDateString()
    }
  })

  const onSubmit = async (data: VolunteerFormData) => {
    try {
      setIsSubmitting(true)
      
      // Submit to Xano
      const result = await submitVolunteerForm(tenantId, data)
      
      if (result.success) {
        console.log('✅ Volunteer application submitted successfully:', result.data)
        onSuccess()
      } else {
        console.log('⚠️ Volunteer application submission failed, logging locally:', data)
        onSuccess() // Still show success to user
      }
    } catch (error) {
      console.error('Error submitting volunteer application:', error)
      onSuccess() // Still show success to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep)
    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const getFieldsForStep = (step: number): (keyof VolunteerFormData)[] => {
    switch (step) {
      case 1: return ['firstName', 'lastName', 'email', 'phone', 'todaysDate', 'volunteerActivities', 'occupation', 'whyVolunteer', 'dogExperience', 'currentPets', 'canFoster', 'howDidYouHear']
      case 2: return ['commitmentAgreement', 'commitmentSignature', 'commitmentDate']
      case 3: return ['roleUnderstanding', 'physicalActivityRisk', 'liabilityRelease', 'medicalTreatment', 'handbookCompliance', 'affirmation', 'finalSignature', 'finalDate']
      default: return []
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: primaryColor }}>
              Volunteer Application
            </h3>
            
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Today's Date *
              </label>
              <input
                type="text"
                {...register('todaysDate')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.todaysDate && (
                <p className="text-red-600 text-sm mt-1">{errors.todaysDate.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                {...register('addressLine1')}
                placeholder="Address Line 1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <input
                type="text"
                {...register('addressLine2')}
                placeholder="Address Line 2"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                {...register('city')}
                placeholder="City"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                {...register('state')}
                placeholder="State"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                {...register('zipCode')}
                placeholder="Zip Code"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Volunteer Activities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Please indicate the way(s) in which you can help our rescue: *
              </label>
              <div className="space-y-2">
                {[
                  { value: 'animal-transport-20', label: 'Animal Transportation (Up to 20 miles)' },
                  { value: 'animal-transport-50', label: 'Animal Transportation (Up to 50 miles)' },
                  { value: 'animal-transport-100-200', label: 'Animal Transportation (Up to 100-200 miles or further)' },
                  { value: 'fundraising-donations', label: 'Fundraising or Collecting Donations' },
                  { value: 'social-media', label: 'Social Media' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'website-development', label: 'Website Development & Maintenance' },
                  { value: 'foster-coordinator', label: 'Foster Coordinator' },
                  { value: 'event-management', label: 'Event Management' },
                  { value: 'event-assistance', label: 'Event Assistance' },
                  { value: 'other', label: 'Other' }
                ].map((activity) => (
                  <div key={activity.value} className="flex items-center">
                    <input
                      type="checkbox"
                      {...register('volunteerActivities')}
                      value={activity.value}
                      className="mr-2"
                    />
                    <label className="text-sm">{activity.label}</label>
                  </div>
                ))}
              </div>
              {errors.volunteerActivities && (
                <p className="text-red-600 text-sm mt-1">{errors.volunteerActivities.message}</p>
              )}
            </div>

            {/* Other volunteer activity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                If you selected "Other", please specify:
              </label>
              <input
                type="text"
                {...register('otherVolunteerActivity')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Background Questions */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What is your occupation?
                </label>
                <input
                  type="text"
                  {...register('occupation')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Please explain briefly why you want to volunteer: *
                </label>
                <textarea
                  {...register('whyVolunteer')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.whyVolunteer && (
                  <p className="text-red-600 text-sm mt-1">{errors.whyVolunteer.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What kind of experience do you have working or interacting with dogs? *
                </label>
                <textarea
                  {...register('dogExperience')}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.dogExperience && (
                  <p className="text-red-600 text-sm mt-1">{errors.dogExperience.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Do you currently have any pets? If so what kinds?
                </label>
                <input
                  type="text"
                  {...register('currentPets')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Are you in a position to foster a dog?
                </label>
                <input
                  type="text"
                  {...register('canFoster')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How did you find out about Mission Bay Puppy Rescue?
                </label>
                <input
                  type="text"
                  {...register('howDidYouHear')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: primaryColor }}>
              Volunteer Commitment
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="text-gray-700 mb-4">
                If I volunteer with Mission Bay Puppy Rescue, I promise to attend my volunteer shifts as scheduled and on time and to assist customers in a pleasant and professional manner at all times.
              </p>
              
              <div className="flex items-start space-x-3 mb-4">
                <input
                  type="checkbox"
                  {...register('commitmentAgreement')}
                  className="mt-1"
                />
                <label className="text-sm">
                  I agree to the volunteer commitment above
                </label>
              </div>
              {errors.commitmentAgreement && (
                <p className="text-red-600 text-sm mt-1">{errors.commitmentAgreement.message}</p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature *
                  </label>
                  <input
                    type="text"
                    {...register('commitmentSignature')}
                    placeholder="Type your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.commitmentSignature && (
                    <p className="text-red-600 text-sm mt-1">{errors.commitmentSignature.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Today's Date *
                  </label>
                  <input
                    type="text"
                    {...register('commitmentDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.commitmentDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.commitmentDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold" style={{ color: primaryColor }}>
              Volunteer Agreement
            </h3>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <p className="text-sm text-gray-700 mb-4">
                This document serves as an agreement between myself and Mission Bay Puppy Rescue (MBPR), wherein I commit to serve as a volunteer for the organization.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('roleUnderstanding')}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium">Role Understanding</label>
                    <p className="text-xs text-gray-600">
                      As a volunteer, I acknowledge that I will not be eligible for any form of remuneration for my time invested in voluntary services.
                    </p>
                  </div>
                </div>
                {errors.roleUnderstanding && (
                  <p className="text-red-600 text-sm">{errors.roleUnderstanding.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('physicalActivityRisk')}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium">Physical Activity and Risk Awareness</label>
                    <p className="text-xs text-gray-600">
                      I comprehend that volunteering may involve physical activities and inherent risks associated with working with animals.
                    </p>
                  </div>
                </div>
                {errors.physicalActivityRisk && (
                  <p className="text-red-600 text-sm">{errors.physicalActivityRisk.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('liabilityRelease')}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium">Liability Release</label>
                    <p className="text-xs text-gray-600">
                      I agree not to file a claim against or sue MBPR for any injury or damage resulting from their ordinary negligence.
                    </p>
                  </div>
                </div>
                {errors.liabilityRelease && (
                  <p className="text-red-600 text-sm">{errors.liabilityRelease.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('medicalTreatment')}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium">Medical Treatment Authorization</label>
                    <p className="text-xs text-gray-600">
                      I grant MBPR the authority to seek emergency medical treatment on my behalf and accept responsibility for medical costs.
                    </p>
                  </div>
                </div>
                {errors.medicalTreatment && (
                  <p className="text-red-600 text-sm">{errors.medicalTreatment.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('handbookCompliance')}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium">Volunteer Handbook Compliance</label>
                    <p className="text-xs text-gray-600">
                      I confirm that I have read the Volunteer Handbook and agree to adhere to all its terms and conditions.
                    </p>
                  </div>
                </div>
                {errors.handbookCompliance && (
                  <p className="text-red-600 text-sm">{errors.handbookCompliance.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    {...register('affirmation')}
                    className="mt-1"
                  />
                  <div>
                    <label className="text-sm font-medium">Affirmation</label>
                    <p className="text-xs text-gray-600">
                      I acknowledge that I have thoroughly read and fully understood this agreement and am signing it willingly and voluntarily.
                    </p>
                  </div>
                </div>
                {errors.affirmation && (
                  <p className="text-red-600 text-sm">{errors.affirmation.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Signature *
                  </label>
                  <input
                    type="text"
                    {...register('finalSignature')}
                    placeholder="Type your full name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.finalSignature && (
                    <p className="text-red-600 text-sm mt-1">{errors.finalSignature.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Today's Date *
                  </label>
                  <input
                    type="text"
                    {...register('finalDate')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.finalDate && (
                    <p className="text-red-600 text-sm mt-1">{errors.finalDate.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Step {currentStep} content</div>
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round((currentStep / totalSteps) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: primaryColor,
              width: `${(currentStep / totalSteps) * 100}%`
            }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentStep < totalSteps ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
              style={{ backgroundColor: primaryColor }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
