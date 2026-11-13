/** 線條圖示（裝飾用，aria-hidden）。 */
const paths: Record<string, React.ReactNode> = {
  market: <><path d="M3 9h18l-1.5-5h-15z" /><path d="M5 9v10h14V9" /><path d="M9 19v-5h6v5" /></>,
  harbor: <><path d="M12 3v14" /><path d="M8 7h8" /><path d="M3 15c3 4 15 4 18 0" /><path d="M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0" /></>,
  tide: <><path d="M2 14c2 2 4 2 6 0s4-2 6 0 4 2 6 0" /><path d="M2 19c2 2 4 2 6 0s4-2 6 0 4 2 6 0" /><circle cx="17" cy="7" r="3" /><path d="M6 10c0-3 2-5 2-5s2 2 2 5" /></>,
  table: <><path d="M4 11h16a8 8 0 0 1-16 0z" /><path d="M8 7c0-1 1-2 1-3M12 7c0-1 1-2 1-3M16 7c0-1 1-2 1-3" /></>,
  fish: <><path d="M3 12c3-5 10-6 15 0-5 6-12 5-15 0z" /><path d="M18 12l3-3v6z" /><circle cx="8" cy="11" r="0.8" fill="currentColor" /></>,
  hook: <><path d="M12 2v12a4 4 0 1 1-8 0" /><path d="M4 14l2-2" /></>,
  star: <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />,
  book: <><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 21V5" /></>,
  hands: <><path d="M7 11V6a1.5 1.5 0 0 1 3 0v5" /><path d="M10 10V4.5a1.5 1.5 0 0 1 3 0V10" /><path d="M13 10V6a1.5 1.5 0 0 1 3 0v6" /><path d="M7 11l-1.5-1.5a1.5 1.5 0 0 0-2 2.2L8 17a5 5 0 0 0 4 2h1a5 5 0 0 0 5-5v-2" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  download: <><path d="M12 3v12M7 10l5 5 5-5" /><path d="M4 21h16" /></>,
  check: <path d="M4 12l5 5L20 6" />,
  menu: <path d="M3 6h18M3 12h18M3 18h18" />,
  close: <path d="M5 5l14 14M19 5L5 19" />,
  share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4" /></>,
};
export function Icon({ name, className = "h-6 w-6" }: { name: keyof typeof paths | string; className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name] ?? paths.fish}
    </svg>
  );
}
