import { z } from 'zod'

// Contact Form Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  subject: z.enum(['adoption', 'volunteer', 'donation', 'general', 'other'], {
    required_error: 'Please select a subject'
  }),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  preferredContact: z.enum(['email', 'phone'], {
    required_error: 'Please select preferred contact method'
  }).optional()
})

// Adoption Application Schema - Based on your detailed form
export const adoptionApplicationSchema = z.object({
  // Adoption Readiness
  readyToAdopt: z.enum(['immediately', 'within-week', 'within-month', 'flexible'], {
    required_error: 'Please specify when you will be ready to adopt'
  }),
  interestedIn: z.enum(['adoption'], {
    required_error: 'Please confirm you are interested in adoption'
  }),
  specificPuppy: z.string().optional(),

  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  cellPhone: z.string().min(10, 'Please enter a valid cell phone number'),
  email: z.string().email('Please enter a valid email address'),

  // Address
  addressLine1: z.string().min(5, 'Please enter your street address'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please enter your state'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),

  // Personal Details
  age: z.number().min(18, 'You must be at least 18 years old'),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'domestic-partnership'], {
    required_error: 'Please select your marital status'
  }),
  activityLevel: z.enum(['low', 'moderate', 'high', 'very-high'], {
    required_error: 'Please select your activity level'
  }),
  howDidYouHear: z.string().min(2, 'Please tell us how you heard about us'),

  // Work Information
  occupation: z.string().min(2, 'Please describe your occupation'),
  workSchedule: z.enum(['full-time', 'part-time', 'work-from-home', 'retired', 'unemployed'], {
    required_error: 'Please select your work schedule'
  }),
  workHours: z.string().min(10, 'Please describe your work week and weekend hours'),

  // Household Information
  householdSize: z.number().min(1, 'Please enter the number of people in your household'),
  householdMembers: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number(),
    relationship: z.string(),
    cellPhone: z.string().optional(),
    hoursAway: z.string(),
    petExperience: z.string(),
    agreesWithDog: z.boolean()
  })).optional(),

  // Housing Information
  ownOrRent: z.enum(['own', 'rent'], {
    required_error: 'Please specify if you own or rent'
  }),
  housingType: z.enum(['house', 'apartment', 'condo', 'townhouse', 'mobile-home', 'other'], {
    required_error: 'Please select your housing type'
  }),
  hasDogDoor: z.boolean(),
  dogLocationWhenAway: z.enum(['crate', 'free-roam', 'yard', 'garage', 'basement', 'other'], {
    required_error: 'Please specify where the dog will be when you are not home'
  }),
  hasOtherPets: z.boolean(),
  otherPetsDetails: z.string().optional(),

  // Pet Preferences
  preferredAge: z.enum(['puppy', 'young', 'adult', 'senior', 'no-preference']).optional(),
  preferredSize: z.enum(['small', 'medium', 'large', 'extra-large', 'no-preference']).optional(),
  preferredSex: z.enum(['male', 'female', 'no-preference']).optional(),
  hasAllergies: z.boolean(),
  allergyDetails: z.string().optional(),
  interestedInFostering: z.boolean(),

  // Lifestyle Description
  familyDescription: z.string().min(50, 'Please provide a detailed description of your family and lifestyle'),

  // Social Media Permission
  socialMediaPermission: z.boolean(),

  // Contract Agreements - All required checkboxes
  financialCommitment: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the financial commitment'
  }),
  vaccinationShelter: z.boolean().refine(val => val === true, {
    message: 'You must agree to vaccination and shelter requirements'
  }),
  caringForDog: z.boolean().refine(val => val === true, {
    message: 'You must agree to caring for your dog properly'
  }),
  mealRequirements: z.boolean().refine(val => val === true, {
    message: 'You must agree to meal requirements'
  }),
  kennelingAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to kenneling restrictions'
  }),
  holdHarmlessCurrentPets: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge responsibility for current pets'
  }),
  holdHarmlessClaims: z.boolean().refine(val => val === true, {
    message: 'You must agree to hold harmless agreement'
  }),
  healthAcknowledgment: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge health responsibilities'
  }),
  spayNeuterAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to spay/neuter requirements'
  }),
  relinquishmentPolicy: z.boolean().refine(val => val === true, {
    message: 'You must agree to relinquishment policy'
  }),
  returnPolicy: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the return policy'
  }),
  holdHarmlessMeetGreet: z.boolean().refine(val => val === true, {
    message: 'You must agree to meet and greet hold harmless'
  }),

  // Signature and Date
  signature: z.string().min(2, 'Please provide your signature'),
  signatureDate: z.string().min(8, 'Please provide the date')
})

// Volunteer Form Schema - Based on your detailed form
export const volunteerFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().optional(),
  todaysDate: z.string().min(8, 'Please provide today\'s date'),

  // Address
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),

  // Volunteer Activities - Multiple selection
  volunteerActivities: z.array(z.enum([
    'animal-transport-20',
    'animal-transport-50',
    'animal-transport-100-200',
    'fundraising-donations',
    'social-media',
    'marketing',
    'website-development',
    'foster-coordinator',
    'event-management',
    'event-assistance',
    'other'
  ])).min(1, 'Please select at least one way you can help'),
  otherVolunteerActivity: z.string().optional(),

  // Background Information
  occupation: z.string().optional(),
  whyVolunteer: z.string().min(10, 'Please explain why you want to volunteer'),
  dogExperience: z.string().min(10, 'Please describe your experience with dogs'),
  currentPets: z.string().optional(),
  canFoster: z.string().optional(),
  howDidYouHear: z.string().optional(),

  // Commitment Agreement
  commitmentAgreement: z.boolean().refine(val => val === true, {
    message: 'You must agree to attend volunteer shifts as scheduled'
  }),
  commitmentSignature: z.string().min(2, 'Please provide your signature'),
  commitmentDate: z.string().min(8, 'Please provide today\'s date'),

  // Volunteer Agreement
  roleUnderstanding: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge the role understanding'
  }),
  physicalActivityRisk: z.boolean().refine(val => val === true, {
    message: 'You must acknowledge physical activity and risk awareness'
  }),
  liabilityRelease: z.boolean().refine(val => val === true, {
    message: 'You must agree to the liability release'
  }),
  medicalTreatment: z.boolean().refine(val => val === true, {
    message: 'You must agree to medical treatment authorization'
  }),
  handbookCompliance: z.boolean().refine(val => val === true, {
    message: 'You must confirm reading the Volunteer Handbook'
  }),
  affirmation: z.boolean().refine(val => val === true, {
    message: 'You must affirm understanding of the agreement'
  }),

  // Final Signature
  finalSignature: z.string().min(2, 'Please provide your signature'),
  finalDate: z.string().min(8, 'Please provide today\'s date')
})

// Foster Form Schema - Based on your detailed form
export const fosterFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  cellPhone: z.string().min(10, 'Please enter a valid cell phone number'),

  // Address
  addressLine1: z.string().min(5, 'Please enter your street address'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'Please enter your city'),
  state: z.string().min(2, 'Please enter your state'),
  zipCode: z.string().min(5, 'Please enter a valid zip code'),
  email: z.string().email('Please enter a valid email address'),

  // Personal Details
  age: z.number().min(18, 'You must be at least 18 years old'),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'domestic-partnership'], {
    required_error: 'Please select your marital status'
  }),

  // Work Information
  occupation: z.string().min(2, 'Please describe your occupation'),
  employmentType: z.array(z.enum([
    'full-time', 'part-time', 'full-time-wfh', 'part-time-wfh',
    'stay-at-home-parent', 'active-duty-military', 'unemployed', 'student', 'retired'
  ])).min(1, 'Please select at least one employment type'),
  hoursAwayFromHome: z.string().min(10, 'Please describe your schedule in detail'),

  // Household Information
  householdSize: z.number().min(1, 'Please enter the number of people in your household'),
  householdMembers: z.array(z.object({
    firstName: z.string(),
    lastName: z.string(),
    age: z.number(),
    relationship: z.string(),
    hoursAway: z.string(),
    petExperience: z.string(),
    agreesWithDog: z.boolean()
  })).optional(),

  // Housing Information
  ownOrRent: z.enum(['own', 'rent'], {
    required_error: 'Please specify if you own or rent'
  }),
  housingType: z.enum(['house', 'apartment', 'condo', 'townhouse', 'mobile-home', 'other'], {
    required_error: 'Please select your housing type'
  }),
  hasDogDoor: z.boolean(),
  hasOtherPets: z.boolean(),
  otherPetsDetails: z.string().optional(),

  // Availability
  availability: z.enum(['full-time-foster', 'part-time-foster'], {
    required_error: 'Please select your availability type'
  }),
  hasAllergies: z.boolean(),
  allergyDetails: z.string().optional(),
  activityLevel: z.enum(['low', 'moderate', 'high'], {
    required_error: 'Please select your activity level'
  }),

  // Foster Types - Multiple selection
  fosterTypes: z.array(z.enum([
    '911-placement',
    'pregnant-mom',
    'whelping-mama-litter',
    'orphaned-litter',
    'quarantined-pups',
    'ready-to-adopt-pups',
    'transportation',
    'other'
  ])).min(1, 'Please select at least one foster type'),
  otherSkills: z.string().optional()
})

// Type exports
export type ContactFormData = z.infer<typeof contactFormSchema>
export type AdoptionApplicationData = z.infer<typeof adoptionApplicationSchema>
export type VolunteerFormData = z.infer<typeof volunteerFormSchema>
export type FosterFormData = z.infer<typeof fosterFormSchema>
