import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function WordPieChart ({ dataset }) {
  const data = Object.entries(dataset).map(([name, value]) => ({
    name,
    value,
  }));

  const colors = ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99'];

  return (
    <PieChart width={320} height={450}>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={80}
        innerRadius={40}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
}

WordPieChart.propTypes = {
    dataset: PropTypes.object || PropTypes.number
}