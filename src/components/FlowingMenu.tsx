import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";

interface MenuItem {
  link: string;
  text: string;
  image: string;
}

interface FlowingMenuProps {
  items: MenuItem[];
}

export default function FlowingMenu({ items }: FlowingMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    const menuItems = menuRef.current.querySelectorAll(".menu__item");
    
    menuItems.forEach((item) => {
      const image = item.querySelector(".menu__item-img") as HTMLElement;
      const text = item.querySelector(".menu__item-text") as HTMLElement;

      const onMouseEnter = () => {
        gsap.to(image, {
          duration: 0.5,
          opacity: 1,
          scale: 1,
          ease: "power2.out",
        });
        gsap.to(text, {
          duration: 0.5,
          x: 20,
          color: "var(--color-brand-accent)",
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(image, {
          duration: 0.5,
          opacity: 0,
          scale: 0.8,
          ease: "power2.inOut",
        });
        gsap.to(text, {
          duration: 0.5,
          x: 0,
          color: "currentColor",
          ease: "power2.inOut",
        });
      };

      const onMouseMove = (e: MouseEvent) => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        gsap.to(image, {
          duration: 0.8,
          x: x - image.offsetWidth / 2,
          y: y - image.offsetHeight / 2,
          ease: "power2.out",
        });
      };

      item.addEventListener("mouseenter", onMouseEnter as any);
      item.addEventListener("mouseleave", onMouseLeave as any);
      item.addEventListener("mousemove", onMouseMove as any);

      return () => {
        item.removeEventListener("mouseenter", onMouseEnter as any);
        item.removeEventListener("mouseleave", onMouseLeave as any);
        item.removeEventListener("mousemove", onMouseMove as any);
      };
    });
  }, [items]);

  return (
    <nav ref={menuRef} className="flex flex-col w-full max-w-4xl mx-auto py-20">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className="menu__item relative flex items-center py-8 border-b border-brand-primary/10 group overflow-visible"
        >
          <span className="menu__item-text text-4xl md:text-6xl font-serif italic tracking-tight transition-colors duration-300">
            {item.text}
          </span>
          <div 
            className="menu__item-img absolute pointer-events-none opacity-0 scale-75 w-64 h-40 rounded-xl overflow-hidden z-10 shadow-2xl"
            style={{ backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          />
          <span className="ml-auto text-sm uppercase tracking-widest opacity-30 group-hover:opacity-100 transition-opacity">
            Explore 0{index + 1}
          </span>
        </Link>
      ))}
    </nav>
  );
}
