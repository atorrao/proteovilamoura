export default function Toast({ msg, color, show }) {
  const colors = { green:'var(--green)', orange:'var(--orange)', red:'var(--red)', blue:'var(--accent)' }
  return (
    <div className={`toast ${show ? 'show' : ''}`}>
      <span className="toast-dot" style={{ background: colors[color] || colors.green }} />
      {msg}
    </div>
  )
}
