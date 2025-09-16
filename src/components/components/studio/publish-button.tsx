// components/studio/publish-button.tsx
'use client';
import { useState } from 'react';

export function PublishButton({ snapshot, orgId }:{ snapshot:any; orgId:string|number }) {
  const [busy, setBusy] = useState(false);
  async function onPublish() {
    setBusy(true);
    await fetch('/api/publish', { method:'POST', body: JSON.stringify({ snapshot, orgId }) });
    setBusy(false);
    alert('Published!');
  }
  return <button onClick={onPublish} disabled={busy}>{busy ? 'Publishing…' : 'Publish'}</button>;
}
