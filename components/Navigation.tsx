'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Navigation.module.scss';

const links = [
  { href: '/', label: 'Home' },
  { href: '/benchmarks', label: 'Benchmarks' },
  { href: '/crossover', label: 'Crossover' },
  { href: '/team', label: 'Team' },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
          <span className={styles.logoBracket}>[</span>
          GPU<span className={styles.logoVs}>vs</span>CPU
          <span className={styles.logoBracket}>]</span>
        </Link>

        <button
          type="button"
          className={styles.hamburger}
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
          <span className={`${styles.bar} ${open ? styles.barOpen : ''}`} />
        </button>

        <nav className={`${styles.nav} ${open ? styles.navOpen : ''}`}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${isActive(link.href) ? styles.linkActive : ''}`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
