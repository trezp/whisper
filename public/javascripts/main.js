
$(document).ready(function(){
  $('.destroy').on('submit', function(event){
    return confirm("Are you sure you want to delete this entry?");
  });
});
