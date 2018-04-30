var initializing = true;

var currencyId = 'BTC';
var endDate = new Date();
var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 12);
var chart = null;

$("#currencyPicker").on("change", function(){
    currencyId = $('#currencyPicker').val();
    RepopulateData();
});

$("#startDatePicker").on("changeDate", function(){
    startDate = $('#startDatePicker').datepicker('getDate');
    RepopulateData();
});

$("#endDatePicker").on("changeDate", function(){
    endDate = $('#endDatePicker').datepicker('getDate');
    RepopulateData();
});

$(document).ready(function () {
    initializeCurrencyPicker();
    initializeDatePickers();
    initializeChart();

    initializing = false;
    RepopulateData();
});

function initializeCurrencyPicker(){
    $("#currencyPicker").val(currencyId);
}

function initializeDatePickers(){
    $('#startDatePicker').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
    }).datepicker("setDate", startDate);

    $('#endDatePicker').datepicker({
        format: "dd/mm/yyyy",
        autoclose: true
    }).datepicker("setDate", endDate);
}

function initializeChart(){
    var chartCanvas = document.getElementById("chartCanvas");
    chartCanvas.style.backgroundColor = 'rgba(40, 40, 40, 0.7)';
    chart = new Chart(chartCanvas, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Price (US Dollars)',

                yAxisID: 'price',
                data: [],
                borderColor: 'rgba(246, 174, 45, 1)'
            }, {
                label: 'Google Trend',
                yAxisID: 'google',
                data: [],
                borderColor: 'rgba(65,179,249,1)'
            }]
        },
        options: {
            legend: {
                labels: {
                    fontColor: "rgba(255,255,255,1)",
                    fontSize: 20
                }
            },
            scales: {
                yAxes: [{
                    id: 'price',
                    type: 'linear',
                    position: 'left',
                    ticks:{
                        fontColor: 'rgba(246, 174, 45, 1)',
                    },
                    gridLines:{
                        color: "white"
                    }
                }, {
                    id: 'google',
                    type: 'linear',
                    position: 'right',
                    ticks: {
                        fontColor: 'rgba(65,179,249, 1)',
                        max: 100,
                        min: 0
                    }
                }],
                xAxes: [{
                    ticks: {
                        fontColor: 'rgba(120, 120, 120, 1)'
                    }
                }]
            }
        }
    });
}

function RepopulateData(){
    if(initializing)
        return;

    const startUTC = startDate.toUTCString();
    const endUTC = endDate.toUTCString();

    $.get( "get_data", { startDate: startUTC, endDate: endUTC, currencyId: currencyId } )
        .done(function(data) {
            console.log(data);
            if(data == null || data[0] == null || data[0].formattedDate == null){
                initializeChart();
                return;
            }

            var labels = data.map(x => x.formattedDate);
            var price = data.map(x => x.price);
            var googleActivity = data.map(x => x.googleActivity);

            chart.data.labels = labels;
            chart.data.datasets[0].data = price;
            chart.data.datasets[1].data = googleActivity;
            chart.update();
        });
}