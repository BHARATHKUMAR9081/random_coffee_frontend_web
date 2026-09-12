import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-24 text-center">
      <p className="text-sm font-semibold text-gold-500">404</p>
      <h1 className="text-2xl font-semibold text-navy-950">Page not found</h1>
      <p className="text-sm text-navy-900/55">The page you're looking for doesn't exist or may have moved.</p>
      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
