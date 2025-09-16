"use client"

import { DashPageWrapper } from "@/components/admin/dash-page-wrapper"
import Pets from "@/imported/dash/src/pages/Pets"

export default function AdminPets() {
  return (
    <DashPageWrapper>
      <Pets />
    </DashPageWrapper>
  )
}
