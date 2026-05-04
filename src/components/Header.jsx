export default function Header({ session, onLogout, onAdminClick, onAdminHome }) {
 return (
 <header>
 <img
 src="https://proteo-vilamoura.sci-meet.net/img/proteo-vilamoura.sci-meet.net/3e43a443-0406-41ce-874f-826688ab0e5d/Logo-proteovilamoral1.png?q=100&fit=max&crop=2825%2C871%2C0%2C0&s=41b3f5c0a7da78ab26677346af93c84f"
 alt="ProteoVilamoura 2026" className="logo-img"
 onClick={session.role === 'admin' ? onAdminHome : undefined}
 style={{ cursor: session.role === 'admin' ? 'pointer' : 'default' }}
 />
 <div className="header-right">
 {session.user ? (
 <>
 {session.role === 'admin' && (
 <button className="btn btn-ghost btn-sm" onClick={onAdminHome}
 style={{ fontSize: '0.76rem', borderColor: 'rgba(232,160,32,0.3)', color: 'var(--gold)', minHeight: 32 }}>
 Backoffice
 </button>
 )}
 <span className={`badge badge-${session.role}`}>
 {session.role === 'admin' ? 'Admin' : session.role === 'evaluator' ? 'Evaluator' : 'Attendee'}
 </span>
 <button className="btn btn-ghost btn-sm" onClick={onLogout}
 style={{ fontSize: '0.76rem', minHeight: 32 }}>
 Sign out
 </button>
 </>
 ) : (
 <button className="btn btn-ghost btn-sm" onClick={onAdminClick}
 style={{ fontSize: '0.76rem', borderColor: 'rgba(232,160,32,0.3)', color: 'var(--gold)', minHeight: 32 }}>
 Admin
 </button>
 )}
 </div>
 </header>
 )
}
