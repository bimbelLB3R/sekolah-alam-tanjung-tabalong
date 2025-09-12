import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr'],
  datasets: [
    {
      label: 'Sales',
      data: [30, 50, 40, 70],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4
    }
  ]
};

export default function SalesChart() {
  return (
    <div className="bg-white p-4 rounded shadow">
      <Line data={data} />
    </div>
  );
}
