// Site background: a static powder-blue gradient (painted in index.css on .bg-host::before).
// Plain CSS, no third-party effect runtime.
export default function Background() {
  return <div className="bg-host" aria-hidden="true" />
}
