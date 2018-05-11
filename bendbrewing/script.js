$(document).ready(function(){
  $('.toggle').click(function(){
    $(this).toggleClass('empty sat')
  })
})

$('html, body').on('touchmove', function(e){
     //prevent native touch activity like scrolling
     e.preventDefault();
});
