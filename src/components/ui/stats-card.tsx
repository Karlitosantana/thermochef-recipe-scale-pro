interface StatsCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  description?: string;
}

export function StatsCard({ title, value, icon, trend, description }: StatsCardProps) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-text-dark">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {description && (
            <p className="text-xs text-text-dark">{description}</p>
          )}
          {trend && (
            <p className={`text-sm ${trend.startsWith('+') ? 'text-success' : 'text-error'}`}>
              {trend} from last month
            </p>
          )}
        </div>
        <span className="text-3xl opacity-50">{icon}</span>
      </div>
    </div>
  );
}