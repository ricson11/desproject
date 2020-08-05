$(".custom-file-input").on("change", function(){
    var fileName =
    $(this). val().split("\\").pop();
    $(this).siblings(".custom-file-label").addClass("selected").html
    (fileName);

});


var removebtn = document.querySelector('.remove');
var addbtn = document.querySelector('.add');
var navigation = document.querySelector('.navigation');


addbtn.addEventListener('click', function(){
    navigation.style.display="block";
    removebtn.style.display="block";
    addbtn.style.display="none";


});
removebtn.addEventListener('click', function(){
    navigation.style.display="none";
    addbtn.style.display="block";
    removebtn.style.display="none";


});

var count = documents.querySelector('.count')

$('.count').each(function(){
    $(this).prop('counter', 0).animate({
        counter:$(this).text()
    },{
     duration:4000,
     easing: 'swing',
     step: function(now){
    $(this).text(Math.ceil(now));
     }
 })
})