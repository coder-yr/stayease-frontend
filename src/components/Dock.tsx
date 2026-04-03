import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

interface DockItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  mouseX: any;
}

const DockItem: React.FC<DockItemProps> = ({ icon, label, onClick, mouseX }) => {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      onClick={onClick}
      className="aspect-square rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer group relative"
    >
      <div className="text-white group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-primary/90 text-white text-[10px] font-bold uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
        {label}
      </span>
    </motion.div>
  );
}

interface DockProps {
  items: { icon: React.ReactNode; label: string; onClick?: () => void }[];
}

export default function Dock({ items }: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto flex h-16 items-end gap-4 rounded-2xl bg-brand-primary/20 backdrop-blur-xl border border-white/10 px-4 pb-3 shadow-2xl"
    >
      {items.map((item, i) => (
        <DockItem key={i} mouseX={mouseX} icon={item.icon} label={item.label} onClick={item.onClick} />
      ))}
    </motion.div>
  );
}
