"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { architecturalBrands } from "@/lib/architectural-brands";

const primaryLinks = [
  { href: "/neolith/", label: "Neolith" },
  { href: "/marble/", label: "Imported marble" },
  { href: "/all-materials/", label: "All materials" },
];

function isActive(pathname: string, href: string) {
  const base = href.replace(/\/$/, "") || "/";
  return pathname === base || (base !== "/" && pathname.startsWith(`${base}/`));
}

export function Header() {
  const pathname = usePathname();
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBrandsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBrandsOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBrandsOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", mobileOpen);
    return () => document.body.classList.remove("menu-open");
  }, [mobileOpen]);

  const architecturalBrandsList = architecturalBrands.filter((brand) => brand.slug !== "neolith");

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Crystal Stones home">
          <Image className="brand-logo brand-logo--horizontal" src="/images/brand/crystal-stones-horizontal-dark.png" alt="" width={660} height={168} priority />
          <Image className="brand-logo brand-logo--monogram" src="/images/brand/crystal-stones-monogram.png" alt="" width={120} height={123} priority />
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          {primaryLinks.slice(0, 1).map((item) => (
            <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "is-active" : undefined} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}

          <div
            className={`nav-dropdown ${brandsOpen ? "is-open" : ""}`}
            ref={dropdownRef}
            onMouseEnter={() => setBrandsOpen(true)}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button
              type="button"
              className="nav-dropdown__trigger"
              aria-expanded={brandsOpen}
              aria-haspopup="true"
              aria-controls="architectural-surfaces-menu"
              onClick={() => setBrandsOpen((current) => !current)}
            >
              Architectural surfaces <span className="nav-dropdown__chevron" aria-hidden="true">⌄</span>
            </button>
            <div className="nav-dropdown__panel" id="architectural-surfaces-menu">
              <Link className="nav-dropdown__overview" href="/shop/sintered-stone/">
                <span><strong>Browse all architectural surfaces</strong><small>Neolith, Dekton, Laminam, Stonelam</small></span>
                <span aria-hidden="true">↗</span>
              </Link>
              <div className="nav-dropdown__list">
                {architecturalBrandsList.map((brand) => (
                  <Link href={brand.href} key={brand.slug}>
                    <span><strong>{brand.name}</strong><small>{brand.category}</small></span>
                    <span aria-hidden="true">↗</span>
                  </Link>
                ))}
              </div>
              <p className="nav-dropdown__note">Brand references for discovery. Current range and availability are confirmed on enquiry.</p>
            </div>
          </div>

          {primaryLinks.slice(1).map((item) => (
            <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "is-active" : undefined} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <a className="header-phone" href="tel:+917093111580">
            <span className="header-phone__label">Talk to us</span>
            <span>+91 70931 11580</span>
          </a>
          <Link className="button button-light header-cta" href="/requirement-builder/" aria-label="Plan a project">
            <span className="header-cta__full">Plan a project</span>
            <span className="header-cta__short">Enquire</span>
            <span aria-hidden="true">↗</span>
          </Link>
          <button
            type="button"
            className={`menu-toggle ${mobileOpen ? "is-open" : ""}`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((current) => !current)}
          >
            <span className="menu-toggle__text">{mobileOpen ? "Close" : "Menu"}</span>
            <span className="menu-toggle__icon" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>

      <div className={`mobile-drawer ${mobileOpen ? "is-open" : ""}`} id="mobile-navigation" aria-hidden={!mobileOpen}>
        <div className="mobile-drawer__inner">
          <div className="mobile-drawer__primary">
            <p className="mobile-drawer__eyebrow">Explore</p>
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "is-active" : undefined} onClick={() => setMobileOpen(false)}>
                <span>{item.label}</span><span aria-hidden="true">↗</span>
              </Link>
            ))}
            <Link href="/shop/sintered-stone/" onClick={() => setMobileOpen(false)}><span>Architectural surfaces</span><span aria-hidden="true">↗</span></Link>
          </div>

          <div className="mobile-drawer__brands">
            <p className="mobile-drawer__eyebrow">Surface brands</p>
            <div>
              {architecturalBrandsList.map((brand) => (
                <Link href={brand.href} key={brand.slug} onClick={() => setMobileOpen(false)}>{brand.name}</Link>
              ))}
            </div>
          </div>

          <div className="mobile-drawer__footer">
            <div>
              <span>Email</span>
              <a href="mailto:info@crystalstones.co.in">info@crystalstones.co.in</a>
              <span>Call or WhatsApp</span>
              <a href="tel:+917093111580">+91 70931 11580</a>
            </div>
            <Link className="button button-light" href="/requirement-builder/" onClick={() => setMobileOpen(false)}>
              Plan a project <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
