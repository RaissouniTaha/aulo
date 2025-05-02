import React from 'react';

interface StatItem {
  value: string;
  title: string;
  subtitle: string;
}

const statistics: StatItem[] = [
  {
    value: "5.2K+",
    title: "Building Permits",
    subtitle: "Issued annually"
  },
  {
    value: "120+",
    title: "Urban Projects",
    subtitle: "Completed successfully"
  },
  {
    value: "98%",
    title: "Compliance Rate",
    subtitle: "With urban regulations"
  },
  {
    value: "250K+",
    title: "Citizens Served",
    subtitle: "Through our planning efforts"
  }
];

const StatisticsSection: React.FC = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            For over three decades, we've been shaping communities and improving urban environments.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {statistics.map((stat, index) => (
            <div key={index} className="p-4">
              <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
              <div className="text-lg font-medium mb-1">{stat.title}</div>
              <div className="text-sm opacity-75">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
