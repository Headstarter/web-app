$(document).ready(function () {
    $(".subscribe-with-email").submit(function (e) {
        //stop submitting the form 
        e.preventDefault();
        return true;
    });
});