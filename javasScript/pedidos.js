document.addEventListener("DOMContentLoaded", function () {
  var options = {
    series: [
      {
        name: "Ref 1",
        data: [44, 55, 41, 37, 22, 43, 21],
      },
      {
        name: "Ref 2",
        data: [53, 32, 33, 52, 13, 43, 32],
      },
      {
        name: "Ref 3",
        data: [12, 17, 11, 9, 15, 11, 20],
      },
      {
        name: "Ref 4",
        data: [9, 7, 5, 8, 6, 9, 4],
      },
      {
        name: "Ref 5",
        data: [25, 12, 19, 32, 25, 24, 10],
      },
    ],
    chart: {
      type: "bar",
      height: 350,
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetX: 0,
            style: {
              fontSize: "13px",
              fontWeight: 900,
            },
          },
        },
      },
    },
    stroke: {
      width: 1,
      colors: ["#fff"],
    },
    title: {
      text: "Ventas mensuales por referencia",
    },
    xaxis: {
      categories: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
      
    },
    yaxis: {
      title: {
        text: undefined,
      },
    },
    
    fill: {
      opacity: 1,
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      offsetX: 40,
    },
  };

  var chart = new ApexCharts(document.querySelector("#estPedidos"), options);
  chart.render();
});
