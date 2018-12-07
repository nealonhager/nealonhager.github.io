function submit() {
  var x = document.querySelectorAll('input');
  var results = document.querySelector('.results');
  var printers = [];

  for (var i = 0; i < x.length/2; i++) {
    var printer = {location:"",status:""};
    printer.location = x[2*i].name;
    printer.status = x[2*i].checked;
    printers[i] = printer;
  }

  document.querySelector('#copybtn').style.display = "block";

  for (var i = 0; i < printers.length; i++) {
    var output = '';
    output += printers[i].location;
    output += ':';
    output += printers[i].status;
    output += '#';
    results.value += output;
  }
}

function copyResults() {
  var text = document.querySelector('.results');
  text.style.display = "block";
  text.select();
  document.execCommand("copy");
}
