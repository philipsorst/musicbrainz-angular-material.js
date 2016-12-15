(function () {
    'use strict';

    angular.module('ddr.musicbrainz.controllers').controller('ddr.musicbrainz.controller.artist', Controller);

    Controller.$inject = ['$scope', 'Restangular', '$q', '$timeout', '$location', '$routeParams'];

    function Controller($scope, restangular, $q, $timeout, $location, $routeParams) {
        $scope.loading = true;
        restangular.one('artist', $routeParams.id).get()
            .then(function (response) {
                console.log(response);
                $scope.artist = response;
                $scope.setTitle($scope.artist.name);
            })
            .finally(function (response) {
                $scope.loading = false;
            });

        $scope.loadAlbums = function () {
            $scope.albumsLoading = true;
            restangular.one('release-group').get({'artist': $routeParams.id, 'type': 'album', 'limit': 100})
                .then(function (response) {
                    $scope.albums = response['release-groups'];
                })
                .finally(function () {
                    $scope.albumsLoading = false;
                })

        };

        $scope.loadSingles = function () {
            console.log('loadSingles()');
        };
    }
})();