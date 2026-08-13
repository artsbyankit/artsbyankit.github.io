import { Link } from 'react-router-dom'

export default function ProjectCard({ project }) {
  return (
    <Link to={`/work/${project.slug}`} className="card reveal">
      <div className="card-cover" style={{ background: project.gradient }}>
        <span className="cover-emoji">{project.emoji}</span>
        <span className="cover-title">{project.title}</span>
      </div>
      <div className="card-body">
        <div className="card-tags">
          <span className="tag">{project.category}</span>
          <span className="tag">{project.year}</span>
          {project.inProgress && <span className="tag tag-live">In progress</span>}
        </div>
        <h3>{project.title}</h3>
        <p>{project.cs ? project.cs.tagline : project.excerpt}</p>
        {project.cs && (
          <div className="card-chips">
            {project.cs.chips.slice(0, 3).map((chip) => (
              <span className="chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        )}
        <span className="card-more">
          View case study <span>→</span>
        </span>
      </div>
    </Link>
  )
}
