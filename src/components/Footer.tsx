import React from 'react';
import useFetchData from '../hooks/useFetchData';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string; // Placeholder for now, ideally an icon component
  active: boolean;
}

interface Settings {
  storeName: string;
  // other settings...
}

const Footer: React.FC = () => {
  const socials = useFetchData<SocialLink[]>('/data/socials.json', { activeOnly: true });
  const settings = useFetchData<Settings>('/data/settings.json');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          {/* <Icons.logo className="hidden h-6 w-6 md:inline-block" /> */}
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {currentYear} {settings?.storeName || 'Sousa\'s Calçados'}. Todos os direitos reservados.
          </p>
        </div>
        <div className="flex items-center gap-4">
          {socials?.map(social => (
            <a
              key={social.id}
              href={social.url}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
              className="font-medium underline-offset-4 hover:underline text-sm text-muted-foreground"
            >
              {social.name} {/* Replace with actual icon component if available e.g., <IconComponent name={social.icon} /> */}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

