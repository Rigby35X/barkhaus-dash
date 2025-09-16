"use client"

import { DashPageWrapper } from "@/components/admin/dash-page-wrapper"
import Campaigns from "@/imported/dash/src/pages/Campaigns"

export default function AdminCampaigns() {
  return (
    <DashPageWrapper>
      <Campaigns />
    </DashPageWrapper>
  )
}
