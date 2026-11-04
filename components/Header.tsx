import Link from "next/link";
import Image from "next/image";
import { architecturalBrands } from "@/lib/architectural-brands";

export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Crystal Stones home">
          <Image className="brand-logo brand-logo--horizontal" src="/images/brand/crystal-stones-horizontal-light.png" alt="" width={660} height={168} priority />
          <Image className="brand-logo brand-logo--monogram" src="/images/brand/crystal-stones-monogram.png" alt="" width={120} height={123} priority />
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/neolith/">Neolith</Link>
          <details className="nav-dropdown">
            <summary>Architectural surfaces <span aria-hidden="true">⌄</span></summary>
            <div className="nav-dropdown__panel">
              <Link className="nav-dropdown__overview" href="/shop/sintered-stone/">Browse all architectural surfaces <span aria-hidden="true">↗</span></Link>
              {architecturalBrands.filter((brand) => brand.slug !== "neolith").map((brand) => <Link href={brand.href} key={brand.slug}>{brand.name}</Link>)}
            </div>
          </details>
          <Link href="/marble/">Imported marble</Link>
          <Link href="/all-materials/">All materials</Link>
        </nav>

        <details className="mobile-menu">
          <summary aria-label="Open site navigation"><span className="mobile-menu__label">Menu</span><span className="mobile-menu__icon" aria-hidden="true"><i /><i /></span></summary>
          <div className="mobile-menu__panel">
            <nav aria-label="Mobile navigation">
              <Link href="/neolith/">Neolith</Link>
              <Link href="/shop/sintered-stone/">Architectural surfaces</Link>
              {architecturalBrands.filter((brand) => brand.slug !== "neolith").map((brand) => <Link className="mobile-menu__subitem" href={brand.href} key={brand.slug}>{brand.name}</Link>)}
              <Link href="/marble/">Imported natural marble</Link>
              <Link href="/all-materials/">All materials</Link>
              <Link href="/#applications">Browse by application</Link>
            </nav>
          </div>
        </details>

        <Link className="button button-dark header-cta" href="/requirement-builder/" aria-label="Plan a project">
          <span className="header-cta__full">Plan a project</span><span className="header-cta__short">Enquire</span><span aria-hidden="true">↗</span>
        </Link>
      </div>
    </header>
  );
}
