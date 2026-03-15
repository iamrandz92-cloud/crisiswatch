import { CircleCheck as CheckCircle2, Clock, TriangleAlert as AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerificationBadgeProps {
  status: 'confirmed' | 'developing' | 'unverified';
  className?: string;
}

export function VerificationBadge({ status, className }: VerificationBadgeProps) {
  const config = {
    confirmed: {
      icon: CheckCircle2,
      label: 'Confirmed',
      className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    developing: {
      icon: Clock,
      label: 'Developing',
      className: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    unverified: {
      icon: AlertTriangle,
      label: 'Unverified',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  };

  const { icon: Icon, label, className: statusClass } = config[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        statusClass,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  );
}
