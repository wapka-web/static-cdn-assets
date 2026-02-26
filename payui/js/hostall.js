$('.dropdown-el').click(function(e) {
  $(this).toggleClass('expanded');
});

$(".selectBox").on("click", function(e) {
  $(this).toggleClass("show");
  var dropdownItem = e.target;
  var container = $(this).find(".selectBox__value");
  container.text(dropdownItem.text);
  $(dropdownItem)
    .addClass("active")
    .siblings()
    .removeClass("active");
});


document.addEventListener("DOMContentLoaded", function() {
        window.addEventListener('scroll', function() {
          if (window.scrollY > 500) {
            document.getElementById('navbar_top').classList.add('sticky-top');
            // add padding top to show content behind navbar
            navbar_height = document.querySelector('.navbar').offsetHeight;
            document.body.style.paddingTop = navbar_height + 'px';
          } else {
            document.getElementById('navbar_top').classList.remove('sticky-top');
            // remove padding top from body
            document.body.style.paddingTop = '0';
          }
        });
});