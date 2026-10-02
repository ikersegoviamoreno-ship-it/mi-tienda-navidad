import { announcements } from '@/lib/site';

export function AnnouncementBar() {
  const items = [...announcements, ...announcements];
  return (
    <div className="overflow-hidden bg-pine py-2 text-xs font-medium text-snow" aria-label="Avisos">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap">
        {items.map((a, i) => (
          <span key={i} aria-hidden={i >= announcements.length} className="flex items-center gap-12">
            {a} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
