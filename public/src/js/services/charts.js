'use strict';

angular.module('insight.chart')
    .factory('StatisticChart', function(gettextCatalog, $filter) {

        function StatisticChart(days) {

            this.days = days;
            this.chartOptions = {
                series : ['Test'],
                datasetOverride : [{
                    defaultFontFamily: 'Ubuntu,sans-serif',
                    yAxisID: 'y-axis-1' ,
                    borderColor: '#ffffff',
                    borderWidth: 1,
                    pointBorderColor: '#ffffff',
                    pointBackgroundColor: '#ffffff',
                    pointBorderWidth: 0,
                    pointRadius: 0,
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#ffffff',
                    pointHoverBorderWidth: 1,
                    pointHitRadius: 10,
                    pointStyle: 'rect',
                    lineTension: 0
                }],
                options : {
                    tooltips:{
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        titleFontFamily: 'Ubuntu,sans-serif',
                        titleFontSize: 12,
                        titleFontStyle: '500',
                        titleFontColor: '#ffffff',
                        bodyFontFamily: 'Ubuntu,sans-serif',
                        bodyFontSize: 12,
                        bodyFontStyle: '400',
                        bodyFontColor: '#ffffff',
                        caretSize: 5,
                        cornerRadius: 3,
                        displayColors: false,
                        callbacks: { }
                    },
                    layout: {
                        padding: {
                            left: 5
                        }
                    },
                    scales: {
                        yAxes: [{
                            id: 'y-axis-1',
                            type: 'linear',
                            display: true,
                            position: 'left',
                            gridLines: {
                                color: '#ffffff',
                                drawBorder: false,
                                offsetGridLines: true,
                                zeroLineColor: '#ffffff'
                            },
                            ticks: {
                                fontColor:'#ffffff',
                                fontFamily: 'Ubuntu,sans-serif',
                                fontSize: 14,
                                padding: 20
                            }
                        }],
                        xAxes: [{
                            type: 'time',
                            time: {
                                unit: days > 60 || days == 'all' ? 'month' : 'day',
                                displayFormats: {
                                    month: "MMM'DD",
                                    day: "MMM'DD"
                                },
                                max: Date.now()
                            },
                            gridLines: {
                                color: '#ffffff',
                                drawBorder: false,
                                drawOnChartArea: false,
                                drawTicks: true,
                                zeroLineColor: '#ffffff'
                            },
                            ticks: {
                                fontColor: '#ffffff',
                                fontSize: 10,
                                fontFamily: 'Ubuntu,sans-serif'
                            }
                        }]
                    }
                }
            };

            this.daysButtons = [
                {
                    days: 30,
                    name: '30 ' + gettextCatalog.getString('Days')
                },
                {
                    days: 60,
                    name: '60 ' + gettextCatalog.getString('Days')
                },
                {
                    days: 180,
                    name: '180 ' + gettextCatalog.getString('Days')
                },
                {
                    days: 365,
                    name: '1 ' + gettextCatalog.getString('Year')
                },
                {
                    days: 730,
                    name: '2 ' + gettextCatalog.getString('Years')
                },
                {
                    days: 'all',
                    name:  gettextCatalog.getString('All Time')
                }
            ];

            this.chartStats = [];

        }

        StatisticChart.prototype.changeChartColor = function(chart){

            var ctx = chart.chart.ctx;
            var gradient = ctx.createLinearGradient(0, 0, 0, 600);

            gradient.addColorStop(0, 'rgba(1, 45, 136,0.9686274509803922)');
            gradient.addColorStop(1, 'rgba(0, 0, 0,0.001)');
            // chart.chart.config.data.datasets[0].backgroundColor = gradient;
        };

        StatisticChart.prototype.load = function (factory, itemField, itemName, fill) {
            var self = this;

            factory.query({
                days : self.days
            }, function(response){

                if (fill) {
                    while(response.length < self.days){

                        var emptyItem = {};

                        emptyItem.date = moment().subtract(self.days - (self.days - response.length), 'days').format('YYYY-MM-DD');
                        emptyItem[ itemField ] = 0;

                        response.push(emptyItem);
                    }
                }


                response.reverse();

                self.chartOptions.labels = response.map(function(item) {

                    return item.date;
                });
                self.chartOptions.data = response.map(function(item) {

                    return item[ itemField ];
                });

                self.chartOptions.options.scales.yAxes[0].ticks.callback = function(value){

                    if (value > 999) {
                        return $filter('numeraljs')(value, '0,0');
                    }

                    return parseFloat(value.toFixed(6));
                };

                self.chartOptions.series = [ itemName ];

                self.chartOptions.options.tooltips.callbacks.beforeTitle = function(text) {

                    text[0].yLabel = itemName.charAt(0).toUpperCase() + itemName.substr(1) + ': ' + $filter('numeraljs')(text[0].yLabel, '0,0.[00000000]');
                };

                self.chartStats = response;

            });

        };

        return StatisticChart;

});
