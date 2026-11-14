import Image from "next/image";
import Link from "next/link";
import { BackToTop } from "./BackToTop";
import { FooterSubscribe } from "./FooterSubscribe";

const currentSite = "https://crystalstones.co.in";
const whatsappUrl = "https://wa.me/917093111580?text=Hello%20Crystal%20Stones%2C%20I%E2%80%99d%20like%20help%20sourcing%20a%20stone%20for%20my%20project.";

const linkColumns = [
  {
    title: "Explore",
    links: [
      { href: "/architectural-surfaces/brands/techlam/", label: "Techlam" },
      { href: "/marble/", label: "Imported natural marble" },
      { href: "/all-materials/", label: "All materials" },
      { href: "/shop/sintered-stone/", label: "Architectural surfaces" },
      { href: "/requirement-builder/", label: "Requirement builder" }
    ]
  },
  {
    title: "Marble by origin",
    links: [
      { href: "/marble/origin/italy/", label: "Italian marble" },
      { href: "/marble/origin/turkey/", label: "Turkish marble" },
      { href: "/marble/origin/spain/", label: "Spanish marble" },
      { href: "/marble/origin/greece/", label: "Greek marble" },
      { href: "/marble/origin/portugal/", label: "Portuguese marble" }
    ]
  },
  {
    title: "Crystal Stones",
    links: [
      { href: "/about/", label: "About" },
      { href: "/how-it-works/", label: "How it works" },
      { href: "/projects/", label: "Projects" },
      { href: "/faq/", label: "FAQ" },
      { href: "/contact-us/", label: "Contact" }
    ]
  }
];

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="footer-cta__copy">
          <p className="eyebrow">Start a conversation</p>
          <h2>Tell us what <em>the space needs.</em></h2>
          <p>Share the application, approximate area and the direction you have in mind. We will help refine the next step.</p>
        </div>
        <div className="footer-cta__actions">
          <Link className="button button-light" href="/requirement-builder/">Open the requirement builder <span aria-hidden="true">↗</span></Link>
          <a className="footer-cta__link" href={whatsappUrl} target="_blank" rel="noreferrer">WhatsApp the team <span aria-hidden="true">↗</span></a>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="footer-brand" href="/" aria-label="Crystal Stones — established 1991">
            <Image src="/images/brand/crystal-stones-horizontal-dark.png" alt="" width={660} height={168} />
          </Link>
          <p>Natural stone and architectural surfaces for considered spaces. Sourcing online across India since 1991.</p>
          <div className="footer-contact">
            <a className="footer-mail" href="mailto:info@crystalstones.co.in">info@crystalstones.co.in</a>
            <span>Online stone sourcing across India · Est. 1991</span>
          </div>
          <div className="footer-social">
            <a className="footer-social__instagram" href="https://www.instagram.com/stones.crystal/" target="_blank" rel="noreferrer" aria-label="Crystal Stones on Instagram">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <rect x="2.5" y="2.5" width="19" height="19" rx="5.2" />
                <circle cx="12" cy="12" r="4.4" />
                <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
              </svg>
              <span>Instagram</span>
            </a>
            <a className="footer-social__whatsapp" href={whatsappUrl} target="_blank" rel="noreferrer" aria-label="WhatsApp Crystal Stones on +91 70931 11580">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2Zm0 18.02c-1.48 0-2.94-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.06 8.06 0 0 1-1.24-4.26c0-4.47 3.64-8.1 8.11-8.1 4.47 0 8.1 3.64 8.1 8.11s-3.63 8.11-8.1 8.11h.12Zm4.45-6.07c-.24-.12-1.44-.71-1.66-.79-.22-.08-.39-.12-.55.12-.16.24-.63.79-.77.95-.14.16-.28.18-.52.06-.24-.12-1.03-.38-1.96-1.21-.72-.64-1.21-1.44-1.35-1.68-.14-.24-.02-.37.1-.49.11-.11.24-.28.37-.43.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.43-.06-.12-.55-1.32-.75-1.81-.2-.47-.4-.41-.55-.41h-.47c-.16 0-.43.06-.65.3-.22.24-.85.83-.85 2.03s.87 2.36 1 2.52c.12.16 1.72 2.62 4.16 3.68.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.44-.59 1.64-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {linkColumns.map((column) => (
          <nav className="footer-links" key={column.title} aria-label={column.title}>
            <h2>{column.title}</h2>
            {column.links.map((link) => (
              <Link href={link.href} key={link.href}>{link.label}<em aria-hidden="true">↗</em></Link>
            ))}
          </nav>
        ))}
      </div>

      <FooterSubscribe />

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} | Designed &amp; Developed by <a href="https://jitecsoft.com" target="_blank" rel="noreferrer">JitecSoft</a></span>
        <span>Variety imagery is illustrative. Origin, technical details and availability are confirmed by lot.</span>
        <span className="footer-legal">
          <a href={`${currentSite}/privacy-policy/`} target="_blank" rel="noreferrer">Privacy</a>
          <a href={`${currentSite}/terms-and-conditions/`} target="_blank" rel="noreferrer">Terms</a>
          <a href={`${currentSite}/cookie-policy/`} target="_blank" rel="noreferrer">Cookies</a>
        </span>
        <div className="footer-bottom__end">
          <BackToTop />
        </div>
      </div>
    </footer>
  );
}
