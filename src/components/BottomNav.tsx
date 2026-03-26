import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/', label: 'Beranda', emoji: '🏠' },
  { to: '/kalender', label: 'Kalender', emoji: '📅' },
  { to: '/long-weekend', label: 'Long Weekend', emoji: '🏖️' },
  { to: '/finansial', label: 'Finansial', emoji: '💰' },
  { to: '/profil', label: 'Profil', emoji: '👤' },
];

export default function BottomNav() {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--max-w)',
      background: 'var(--white)',
      borderTop: '1px solid var(--border)',
      display: 'flex',
      zIndex: 100,
      boxShadow: '0 -2px 12px rgba(0,0,0,0.07)',
    }}>
      {TABS.map(tab => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.to === '/'}
          style={({ isActive }) => ({
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 4px 10px',
            textDecoration: 'none',
            color: isActive ? 'var(--red)' : 'var(--text-sub)',
            fontWeight: isActive ? 700 : 500,
            fontSize: 11,
            gap: 3,
            position: 'relative',
          })}
        >
          {({ isActive }) => (
            <>
              <span style={{ fontSize: isActive ? 22 : 18, opacity: isActive ? 1 : 0.6 }}>
                {tab.emoji}
              </span>
              <span>{tab.label}</span>
              {isActive && (
                <span style={{
                  position: 'absolute',
                  bottom: 6,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--red)',
                }} />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
