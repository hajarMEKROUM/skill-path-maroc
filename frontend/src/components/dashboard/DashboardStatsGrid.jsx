import React, { useMemo } from 'react';
import StatsCard from './StatsCard';

const formatStatValue = (value) => {
  if (value == null || value === '') return '0';
  if (typeof value === 'number') return value.toLocaleString();
  return String(value);
};

const DashboardStatsGrid = ({ stats = [], columns = 3 }) => {
  const gridClass = useMemo(() => {
    const map = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'lg:grid-cols-4 md:grid-cols-2',
    };
    return map[columns] || 'md:grid-cols-3';
  }, [columns]);

  return (
    <div className={`grid grid-cols-1 ${gridClass} gap-6`}>
      {stats.map((stat) => (
        <StatsCard
          key={stat.key || stat.title}
          title={stat.title}
          value={formatStatValue(stat.value)}
          icon={stat.icon}
          trend={stat.trend}
          trendValue={stat.trendValue}
          colorClass={stat.colorClass}
          subtitle={stat.subtitle}
        />
      ))}
    </div>
  );
};

export default DashboardStatsGrid;
