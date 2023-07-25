$(document).ready(()=>{
    let list = []
    list.push("NLP Researcher");
    list.push("Full Stack developer");
    list.push("Flutter developer");
    list.push("Android developer");

    // alert($('#typewriter').length);

    let typ = new TypeIt("#typewriter", {
        strings: list,
        typeSpeed: 100,
        breakLines: false,
        loop: true
   }); 

   typ.go();

   new jBox('Tooltip', {
        attach: '.tooltip-js',
    });



    let form = document.getElementById("my-form");    
    if (form) form.addEventListener("submit", handleSubmit);
});

async function handleSubmit(event) {
    event.preventDefault();
    let status = document.getElementById("my-form-status");
    let data = new FormData(event.target);
    let but = $('#my-form-button');
    but.empty().append('<div class="loader-primary"></div>');
    fetch(event.target.action, {
      method: form.method,
      body: data,
      headers: {
          'Accept': 'application/json'
      }
    }).then(response => {
      but.empty().append('Submit');
      status.innerHTML = "Thanks for your submission!";
      form.reset()
    }).catch(error => {
      but.empty().append('Submit');
      status.innerHTML = "Oops! There was a problem submitting your form"
    });
  }