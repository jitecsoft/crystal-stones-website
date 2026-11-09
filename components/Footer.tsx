import Image from "next/image";
import Link from "next/link";

const currentSite = "https://crystalstones.co.in";
const whatsappUrl = "https://wa.me/917093111580?text=Hello%20Crystal%20Stones%2C%20I%E2%80%99d%20like%20help%20sourcing%20a%20stone%20for%20my%20project.";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="footer-cta__copy">
          <p className="eyebrow">Start a conversation</p>
          <h2>Tell us what the space needs.</h2>
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
            <a href="mailto:info@crystalstones.co.in">info@crystalstones.co.in</a>
            <a href="tel:+917093111580">+91 70931 11580</a>
            <span>Online stone sourcing across India</span>
          </div>
        </div>

        <div className="footer-links">
          <h2>Explore</h2>
          <Link href="/neolith/">Neolith</Link>
          <Link href="/marble/">Imported natural marble</Link>
          <Link href="/all-materials/">All materials</Link>
          <Link href="/shop/sintered-stone/">Architectural surfaces</Link>
          <Link href="/requirement-builder/">Requirement builder</Link>
        </div>

        <div className="footer-links">
          <h2>Marble by origin</h2>
          <Link href="/marble/origin/italy/">Italian marble</Link>
          <Link href="/marble/origin/turkey/">Turkish marble</Link>
          <Link href="/marble/origin/spain/">Spanish marble</Link>
          <Link href="/marble/origin/greece/">Greek marble</Link>
          <Link href="/marble/origin/portugal/">Portuguese marble</Link>
          <Link href="/marble/origin/other/">Other origins</Link>
        </div>

        <div className="footer-links">
          <h2>Crystal Stones</h2>
          <Link href="/about/">About</Link>
          <Link href="/how-it-works/">How it works</Link>
          <Link href="/projects/">Projects</Link>
          <Link href="/faq/">FAQ</Link>
          <Link href="/contact-us/">Contact</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Crystal Stones · Est. 1991</span>
        <span>Variety imagery is illustrative. Origin, technical details and availability are confirmed by lot.</span>
        <span className="footer-legal">
          <a href={`${currentSite}/privacy-policy/`} target="_blank" rel="noreferrer">Privacy</a>
          <a href={`${currentSite}/terms-and-conditions/`} target="_blank" rel="noreferrer">Terms</a>
          <a href={`${currentSite}/cookie-policy/`} target="_blank" rel="noreferrer">Cookies</a>
        </span>
      </div>
    </footer>
  );
}
