import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import PublicSite from '../pages/PublicSite'
import PetsPage from '../pages/PetsPage'

import AboutPage from '../pages/AboutPage'
import ContactPage from '../pages/ContactPage'
import DonatePage from '../pages/DonatePage'
import ApplicationsPage from '../pages/ApplicationsPage'
import VolunteerPage from '../pages/VolunteerPage'
import AnimalDetailPage from '../pages/AnimalDetailPage'

export default function PublicSiteRouter() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <Routes>
      {/* Home page */}
      <Route path="/" element={<PublicSite />} />
      
      {/* Available pets */}
      <Route path="/pets" element={<PetsPage slug={slug} />} />
      <Route path="/animals" element={<PetsPage slug={slug} />} />
      
      {/* Pet detail */}
      <Route path="/pets/:id" element={<AnimalDetailPage slug={slug} />} />
      <Route path="/animals/:id" element={<AnimalDetailPage slug={slug} />} />
      
      {/* About page */}
      <Route path="/about" element={<AboutPage slug={slug} />} />
      
      {/* Contact page */}
      <Route path="/contact" element={<ContactPage slug={slug} />} />
      
      {/* Donate page */}
      <Route path="/donate" element={<DonatePage slug={slug} />} />

      {/* Applications page */}
      <Route path="/applications" element={<ApplicationsPage slug={slug} />} />
      <Route path="/apply" element={<ApplicationsPage slug={slug} />} />

      {/* Volunteer page */}
      <Route path="/volunteer" element={<VolunteerPage slug={slug} />} />

      {/* Fallback to home for any other routes */}
      <Route path="*" element={<PublicSite />} />
    </Routes>
  )
}
