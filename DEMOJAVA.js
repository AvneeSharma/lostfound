// DEMO JAVA
const list =document.querySelectorAll('.list');

function activeLink(){
   list.forEach((item) =>
   item.classList.remove('active'));
   this.classList.add('active');
}
list.forEach((item) =>
item.addEventListener('click',activeLink));

document.addEventListener('DOMContentLoaded', function() {
   // Get the URL parameters
   const urlParams = new URLSearchParams(window.location.search);
   const success = urlParams.get('success');

   // Find the "Lost" option on the navbar
   const lostOption = document.querySelector('a[href="http://127.0.0.1:5501/cartoonL.html"]');

   // If the success parameter is true, enable clicking on the "Lost" option
   if (success === 'true') {
       lostOption.addEventListener('click', function(event) {
           // Allow navigation to the "Lost" page
       });
   } else {
       // If the success parameter is false or not present, prevent clicking on the "Lost" option
       lostOption.addEventListener('click', function(event) {
           event.preventDefault();
           alert('Please sign in to access the Lost option.');
       });
   }
});
