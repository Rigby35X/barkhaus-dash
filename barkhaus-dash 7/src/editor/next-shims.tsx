import * as React from 'react'
import { Link as RRLink, LinkProps as RRLinkProps } from 'react-router-dom'

type ImgProps = React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }
export function Image(props: ImgProps) {
  const { fill, ...rest } = props
  // ignore "fill" (Next.js prop) and pass through
  return <img {...rest} />
}
export default Image

export function Link(props: any) {
  const { href, ...rest } = props
  return <RRLink to={href ?? rest.to} {...rest} />
}
export { RRLink as RouterLink }
