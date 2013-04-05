/*global require, jQuery */
(function ($) {
	"use strict";
	require(["dojo/on", "esri/map", "esri/geometry/webMercatorUtils", "esri/geometry/Point", "dojo/domReady!"], function (on, Map, webMercatorUtils, Point) {
		var map, basemap;

		function resizeMap(e) {
			/// <summary>Resizes the map and container to fill screen.</summary>
			/// <param name="e" type="Event">Event object</param>
			var screenHeight, titleHeight, newHeight, mapContainer, padding;
				

			function getPaddingHeight() {
				var pxRe = /^\d+(?=px)/, mapContainer = $("#mapContainer"), top, bottom;
				top = mapContainer.css("padding-top").match(pxRe);
				bottom = mapContainer.css("padding-bottom").match(pxRe);

				return top && bottom ? Number(top[0]) + Number(bottom[0]) : null;
			}

			screenHeight = e ? e.target.innerHeight : $("html")[0].clientHeight;
			titleHeight = $("#header")[0].clientHeight;
				
			padding = getPaddingHeight();

			newHeight = screenHeight - titleHeight - padding;

			$("#map").css("height", newHeight);

			map.resize();
			map.reposition();
		}

		function moveToCurrentPosition(location) {
			var pt = webMercatorUtils.geographicToWebMercator(new Point(location.coords.longitude, location.coords.latitude));
			map.centerAndZoom(pt, 16);
		}

		function handleLocationError(error) {
			console.error(error);
		}

		map = new Map("map", {
			basemap: "streets"
		});

		////// TODO: for debugging, set map as a global variable.  Remove when moved to production.
		////window.esriMap = map;

		on(window, "resize", resizeMap);

		on(map, "load", function () {
			resizeMap();

			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(moveToCurrentPosition, handleLocationError);
			}

			$(document).bind("pagechange", function (event, data) {
				var id;
				if (data.toPage) {
					id = data.toPage.attr("id");
					if (id === "mainpage") {
						resizeMap();
					}
				}
			});
		});
	});
}(jQuery));