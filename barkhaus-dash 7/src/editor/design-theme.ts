export function applyDesignToDocument(design:any) {
  if (!design) return
  const root = document.documentElement
  const map: Record<string,string|undefined> = {
    '--primary-color': design.primaryColor || design.primary_color,
    '--secondary-color': design.secondaryColor || design.secondary_color,
    '--background-color': design.backgroundColor || design.background_color,
    '--font-color': design.fontColor || design.textColor || design.font_color,
  }
  Object.entries(map).forEach(([k,v]) => { if (v) root.style.setProperty(k, String(v)) })
  if (design.fontFamily || design.font_family) {
    root.style.setProperty('--font-family', design.fontFamily || design.font_family)
  }
}
