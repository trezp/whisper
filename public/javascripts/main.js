
$(document).ready(function(){

  $('.destroy').on('submit', function(event){
    return confirm("Are you sure you want to delete this entry?");
  });

  $('.entry-body').each(function(){
    var desiredPostLength = 250;
    var contentLength = $(this).text().length;
    $(this).next('a').hide();
    if (contentLength > desiredPostLength) {
      $(this).next('a').show();
      $(this).text(function(){
        return $(this).text().substr(0, desiredPostLength) + "...";
      });

    }
  });


});
