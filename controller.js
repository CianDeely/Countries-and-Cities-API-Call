var form = "<div class='form-container'><div class='image-holder'></div><form id='signupForm' onsubmit='formSubmitted()'><h2 class='text-center' style='color: var(--bs-white);'><strong>Signup </strong>below.</h2><div class='mb-3'><input class='form-control' type='text' name='firstName' placeholder='First Name' required></div><div class='mb-3'><input class='form-control' type='text' name='lastName' placeholder='Last Name' required></div><div class='mb-3'><input class='form-control' type='email' name='email' placeholder='Email' required></div><div class='d-flex mb-3'><select class='form-select' aria-label='Country' name='countryDropdown' id='countryDropdown' onchange='countryChanged()' required><option disabled selected>Country</option></select></div><div class='d-flex mb-3'><select class='form-select' aria-label='City' name='cityDropdown' id='cityDropdown' required><option disabled selected>City</option></select></div><div class='mb-3'><button class='btn btn-primary d-block w-100' type='submit'>Sign Up</button></div></form></div>";
var panel = "<div class='form-container'><div class='image-holder'></div><form id='resultsForm' onsubmit='goBack()'><h2 class='text-center' style='color: var(--bs-white);'><strong>Thanks for Signing Up</strong></h2><div class='mb-3'><input class='form-control' type='text' name='firstName' id='firstName' placeholder='First Name' readonly></div><div class='mb-3'><input class='form-control' type='text' name='lastName' id='lastName' placeholder='Last Name' readonly></div><div class='mb-3'><input class='form-control' type='email' name='email' id='email' placeholder='Email' readonly></div><div class='mb-3'><input class='form-control' type='text' name='country' id='country' placeholder='Country' readonly></div><div class='mb-3'><input class='form-control' type='text' name='city' id='city' placeholder='City' readonly></div><button class='btn btn-primary d-block w-100' type='submit'>Go Back</button></div></form></div>";
//HTML for the form and the submitted panel are contained as string literals within these vars

var listOfCountries; 

$(document).ready(() => { //Upon loading of document, retrieve the form and display it to the user
    var main = document.getElementById('main');
    main.innerHTML = form;
    getCountries();//Call the getCountries function to populate the dropdown with the list of countries
});

function getCountries() {//Function that makes an API call to retrieve the country and  cities data
    var countryDropdown = document.getElementById('countryDropdown');
    $.get( 'https://countriesnow.space/api/v0.1/countries', function( data ) {
        $( ".result" ).html( data );
        listOfCountries = data.data; //API data is stored in listOfCountries var
        $.each(listOfCountries, function(index, element) {//Iterate through list of countries
            var option = document.createElement('option');
            option.appendChild(document.createTextNode(element.country));
            option.value = element.country;
            countryDropdown.appendChild(option);//Add each country to the countries dropdown
        });
    }).catch((e) => {
        console.log(e);//In the case of an error, catch the error and print it to console
    });
}

function countryChanged(){ //Function adds relevant cities to city dropdown upon country dropdown being changed
    var countryDropdown = document.getElementById('countryDropdown');
    var selectedCountry = countryDropdown.value;
    $.each(listOfCountries, function(index, element) {//Loop that removes every value from cities dropdown before adding in new ones
      if(element.country == selectedCountry){
          var cityDropdown = document.getElementById('cityDropdown');
          while(cityDropdown.firstChild) {
              cityDropdown.removeChild(cityDropdown.firstChild);
          }
          $.each(element.cities, function(index, city) {//Loop adds relevant cities to cities dropdown
              var option = document.createElement('option');
              option.appendChild(document.createTextNode(city));
              option.value = city;
              cityDropdown.appendChild(option);
          });
      }
   });
}

function formSubmitted() {//Function that is called upon form being submitted
    var signupForm = document.getElementById('signupForm');
    var formData = new FormData(signupForm);//Form data variable being initialized to the signup form
    if(formData.get('countryDropdown') != null) {//Check that user selected a country
        var main = document.getElementById('main');
        main.innerHTML = panel;//Change the html from the form to the panel
        var firstName = document.getElementById('firstName');//Assign panel fields to variables
        firstName.value = formData.get('firstName');//Retrieve users form input value and assign to panel fields
        var lastName = document.getElementById('lastName');
        lastName.value = formData.get('lastName');
        var email = document.getElementById('email');
        email.value = formData.get('email');
        var country = document.getElementById('country');
        country.value = formData.get('countryDropdown');
        var city = document.getElementById('city');
        city.value = formData.get('cityDropdown');
    } else {//If user did not select a country, do not submit and prompt user 
        window.alert("Please select a country");
    }
}

function goBack() {//Function that is called upon user selecting the go back button the panel
    var main = document.getElementById('main');//Retrieve main form and display it instead of the panel
    main.innerHTML = form;
    getCountries();//Retrieve all countries again
}
