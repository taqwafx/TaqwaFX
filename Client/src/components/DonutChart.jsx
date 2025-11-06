import React, { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { formatRupee } from "../utils/helper.js";


const DonutChart = ({ overallStats, planWiseData }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  const chartColors = [
    "#22c55e",
    "#3b82f6",
    "#facc15",
    "#a855f7",
    "#ef4444",
    "#14b8a6",
    "#ec4899",
    "#8b5cf6",
    "#f97316",
    "#0ea5e9",
  ];

  useEffect(() => {
    if (!planWiseData?.length) return;

    const ctx = chartRef.current.getContext("2d");

    // Destroy old instance if exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // ✅ Calculate total investment
    const totalInvestment = formatRupee(overallStats?.totalFund);

    // ✅ Plugin to draw only center text (value)
    const centerValuePlugin = {
      id: "centerValue",
      afterDraw(chart) {
        const {
          ctx,
          chartArea: { top, bottom, left, right },
        } = chart;
        ctx.save();

        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 1.9;

        // 💰 Draw only the investment value
        // ctx.fillStyle = "#22c55e"; // Green text (you can change)
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 20px 'Poppins', sans-serif"; // 👈 custom font & size
        ctx.fillText(totalInvestment.toLocaleString("en-IN"), centerX, centerY);

        ctx.restore();
      },
    };

    // ✅ Create chart
    chartInstance.current = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: planWiseData.map((plan) => plan.planName),
        datasets: [
          {
            label: "Overall Fund",
            data: planWiseData.map((plan) => plan.totalFund),
            backgroundColor: chartColors.slice(0, planWiseData.length),
            hoverOffset: 7,
          },
        ],
      },
      options: {
        cutout: "70%",
        plugins: {
          legend: {
            position: "bottom",
          },
        },
      },
      plugins: [centerValuePlugin],
    });
  }, [overallStats, planWiseData]);

  return (
    <div className="lg:max-w-sm w-full bg-white rounded-lg shadow-sm p-4 md:p-6 flex flex-col">
      <div className="flex justify-between mb-3">
        <div className="flex justify-center items-center">
          <h5 className="text-xl font-bold leading-none text-gray-900  pe-1">
            Overall Fund
          </h5>
        </div>
      </div>

      {/* <!-- Donut Chart --> */}
      <div className="w-min mx-auto flex items-center justify-center h-full my-3 lg:my-0">
        <div className="w-min mx-auto max-[321px]:ml-[-22px]">
          <canvas ref={chartRef} />
        </div>
      </div>
    </div>
  );
};

export default DonutChart