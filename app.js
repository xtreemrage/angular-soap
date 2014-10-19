(function () {
    "use strict";

    var app = angular.module("app", ["ngActivityIndicator"]);

    app.controller("AppController", function ($scope, WeatherService) {
        $scope.weatherList = [];

        $scope.refresh = function () {
            WeatherService.create().then(function (data) {
                $scope.weatherList = data.WeatherDescription;
            });
        };

        $scope.refresh();
    });

    app.factory("WeatherService", function ($q, $activityIndicator) {
        function create() {
            var deferred = $q.defer();
            $activityIndicator.startAnimating();

            $.soap({
                url: 'http://wsf.cdyne.com/WeatherWS/Weather.asmx/',
                namespaceQualifier: "weat",
                method: 'GetWeatherInformation',
                namespaceURL: "http://ws.cdyne.com/WeatherWS/",

                data: {}
            }).done(function (result) {
                var data = $.xml2json(result);

                deferred.resolve(data);

                $activityIndicator.stopAnimating();
            }).fail(function (results) {
                deferred.reject(results);

                $activityIndicator.stopAnimating();
            });

            return deferred.promise;
        }

        return {
            create: create
        }
    })
}());