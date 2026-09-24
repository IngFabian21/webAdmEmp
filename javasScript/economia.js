document.addEventListener("DOMContentLoaded", function () {
  var options = {
    series: [
      {
        name: "Gastos",
        data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
      },
      {
        name: "Ingresos",
        data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },
    yaxis: {
      title: {
        text: "$ (miles)",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$ " + val + " mil";
        },
      },
    },
  };

  var chart = new ApexCharts(document.querySelector("#estEco"), options);
  chart.render();
});
