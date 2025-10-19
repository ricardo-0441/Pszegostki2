declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number;
    className?: string;
  }

  export type LucideIcon = React.FC<LucideProps>;

  // Exporta los iconos que usas en tu proyecto
  export const ArrowUp: LucideIcon;
  export const Mail: LucideIcon;
  export const Phone: LucideIcon;
  export const MapPin: LucideIcon;
  export const Briefcase: LucideIcon;
  export const X: LucideIcon;

  // Fallback: export por defecto como un mapa de iconos
  const _default: Record<string, LucideIcon>;
  export default _default;
}