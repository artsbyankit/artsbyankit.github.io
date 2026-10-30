import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="notfound container">
      <h1>404</h1>
      <p>That page doesn't exist.</p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  )
}
