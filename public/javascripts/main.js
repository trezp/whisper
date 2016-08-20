
$(document).ready(function(){

  $('.destroy').on('submit', function(event){
    return confirm("Are you sure you want to delete this entry?");
  });

  $('.entry-body').each(function(){
    var desiredPostLength = 300;
    var contentLength = $(this).text().length;
    $('.read-more').hide();
    if (contentLength > desiredPostLength) {
      $(this).css("color", "blue")
      $(this).find('a').show();
      $(this).text().substr(desiredPostLength, contentLength);
    }
  })


});
