; (function () {
  let myMap;

  const init = () => {
    myMap = new ymaps.Map("map", {
      center: [55.749784, 37.597054],
      zoom: 14,
      controls: []
    });

    const coords = [
      [55.749819, 37.603958],
      [55.757152, 37.580243],
      [55.740968, 37.589596]
    ];

    myCollection = new ymaps.GeoObjectCollection({}, {
      draggable: false,
      iconLayout: 'default#image',
      iconImageHref: "../img/point.png",
      iconImageSize: [46, 57],
      iconImageOffset: [-35, -52]
    });

    coords.forEach(coord => {
      myCollection.add(new ymaps.Placemark(coord));
    })

    myMap.geoObjects.add(myCollection);

    myMap.behaviors.disable('scrollZoom');
  }

  ymaps.ready(init);
})()