import Link from "next/link";
import Image from "next/image";

const currentSite = "https://crystalstones.co.in";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <Link className="footer-brand" href="/" aria-label="Crystal Stones — established 1991">
            <Image src="/images/brand/crystal-stones-horizontal-dark.png" alt="" width={660} height={168} />
          </Link>
          <p>Natural stone and architectural surfaces for considered spaces.</p>
          <div className="footer-contact">
            <a href="mailto:info@crystalstones.co.in">info@crystalstones.co.in</a>
            <a href="tel:+917093111580">+91 70931 11580</a>
            <span>Online stone sourcing across India</span>
          </div>
        </div>
        <div className="footer-links"><h2>Explore</h2><Link href="/neolith/">Neolith</Link><Link href="/marble/">Imported natural marble</Link><Link href="/all-materials/">All materials</Link><Link href="/shop/sintered-stone/">Architectural surfaces</Link></div>
        <div className="footer-links"><h2>Crystal Stones</h2><Link href="/about/">About</Link><Link href="/projects/">Projects</Link><Link href="/faq/">FAQ</Link><Link href="/contact-us/">Contact</Link><Link href="/requirement-builder/">Requirement builder</Link></div>
        <div className="footer-links"><h2>Policies</h2><a href={`${currentSite}/privacy-policy/`} target="_blank" rel="noreferrer">Privacy policy <span aria-hidden="true">↗</span></a><a href={`${currentSite}/terms-and-conditions/`} target="_blank" rel="noreferrer">Terms &amp; conditions <span aria-hidden="true">↗</span></a><a href={`${currentSite}/cookie-policy/`} target="_blank" rel="noreferrer">Cookie policy <span aria-hidden="true">↗</span></a></div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Crystal Stones</span><span>Variety imagery is illustrative. Origin, technical details and availability are confirmed by lot.</span></div>
    </footer>
  );
}
