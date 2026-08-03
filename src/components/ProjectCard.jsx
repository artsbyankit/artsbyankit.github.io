import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="card">
      <div className="card-cover" style={{ background: project.gradient }}>
        <span className="cover-emoji">{project.emoji}</span>
        <span className="cover-title">{project.title}</span>
      </div>
      <div className="card-body">
        <div className="card-tags">
          <span className="tag">{project.category}</span>
          <span className="tag">{project.year}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.excerpt}</p>
        <span className="card-more">
          View case study <span>→</span>
        </span>
      </div>
    </Link>
  )
}
