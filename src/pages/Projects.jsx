import ProjectCard from '../components/ProjectCard'
import projects from '../data/projects'

export default function Projects() {
  return (
    <section className="section">
      <div className="container">
        <div className="page-head">
          <div className="eyebrow">Portfolio</div>
          <h1>Selected work & case studies</h1>
          <p>
            A collection of projects spanning mobile apps, web platforms, design systems,
            and e-commerce. Each case study covers the problem, my process, and the
            measurable outcome.
          </p>
        </div>

        <div className="work-grid">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
