window.onload = function() {

  anime({
    targets: 'h1',
    color: [
      {value: '#ff2600'},
      {value: '#ffaa00'},
      {value: '#ffff00'},
      {value: '#04ff00'},
      {value: '#00bfff'},
      {value: '#a500ff'}
    ],
    duration: 1000,
    direction: 'alternate',
    loop: true,
    easing: 'linear',
    delay: 0
  });

}
