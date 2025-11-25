document.addEventListener("DOMContentLoaded", () => {
  const roles = ["Web Designer", "Web Developer", "Graphic Designer"];
  let currentIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const textElement = document.getElementById("text");

  function typeEffect() {
    const currentRole = roles[currentIndex];
    
    if (isDeleting) {
      charIndex--;
    } else {
      charIndex++;
    }

    textElement.textContent = currentRole.substring(0, charIndex);

    if (!isDeleting && charIndex === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 1000); // pause before deleting
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % roles.length;
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  typeEffect(); // Start the typing effect

   // Get nav links and portfolio items
  const navLinks = document.querySelectorAll('.portfolio-nav a');
  const items = document.querySelectorAll('.portfolio-item');

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // active class
    navLinks.forEach(nav => nav.classList.remove('active'));
    link.classList.add('active');

    const category = link.dataset.category; // ← use data-category

    items.forEach(item => {
      if (category === 'all' || item.classList.contains(category)) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

});



/*
document.addEventListener("DOMContentLoaded", () => {
  const skillsSection = document.querySelector(".skills");
  const skillBars = [
    { id: "skill-html", percentage: 90 },
    { id: "skill-css", percentage: 80 },
    { id: "skill-js", percentage: 55 }
  ];

  let hasAnimated = false;

  function animateSkillBars() {
    if (hasAnimated) return;
    if (isElementInViewport(skillsSection)) {
      skillBars.forEach((skill) => {
        const elem = document.getElementById(skill.id);
        let width = 0;
        const interval = setInterval(() => {
          if (width >= skill.percentage) {
            clearInterval(interval);
          } else {
            width++;
            elem.style.width = width + "%";
          }
        }, 10);
      });
      hasAnimated = true;
    }
  }

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top <= window.innerHeight - 100 &&
      rect.bottom >= 0
    );
  }

  window.addEventListener("scroll", animateSkillBars);
});*/

 
function calculate() {
    "use strict";

    // Get a reference to the form using jQuery
    let form = $("#myform");

    // If all form elements are valid, get the form values
    if (form.valid()) {
        
        // From Value
        let FromValue = document.getElementById("FormValue").value;

        // From Unit
        let FromUnit = "";
        if (document.getElementById("cm").checked) {
            FromUnit = document.getElementById("cm").value;
        }
        if (document.getElementById("m").checked) {
            FromUnit = document.getElementById("m").value;
        }
        if (document.getElementById("km").checked) {
            FromUnit = document.getElementById("km").value;
        }
        if (document.getElementById("in").checked) {
            FromUnit = document.getElementById("in").value;
        }
        if (document.getElementById("ft").checked) {
            FromUnit = document.getElementById("ft").value;
        }
        if (document.getElementById("yd").checked) {
            FromUnit = document.getElementById("yd").value;
        }
        if (document.getElementById("mi").checked) {
            FromUnit = document.getElementById("mi").value;
        }

        // To Unit
        let ToUnit = "";
        if (document.getElementById("tocm").checked) {
            ToUnit = document.getElementById("tocm").value;
        }
        if (document.getElementById("tom").checked) {
            ToUnit = document.getElementById("tom").value;
        }
        if (document.getElementById("tokm").checked) {
            ToUnit = document.getElementById("tokm").value;
        }
        if (document.getElementById("toin").checked) {
            ToUnit = document.getElementById("toin").value;
        }
        if (document.getElementById("toft").checked) {
            ToUnit = document.getElementById("toft").value;
        }
        if (document.getElementById("toyd").checked) {
            ToUnit = document.getElementById("toyd").value;
        }
        if (document.getElementById("tomi").checked) {
            ToUnit = document.getElementById("tomi").value;
        }

        ConvertUnits(FromValue, FromUnit, ToUnit);
    }
}

async function ConvertUnits(FromValue, FromUnit, ToUnit) {
    "use strict";

    // URL and method used with AJAX Call
    let myURL = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";
    myURL = myURL + "?FromValue=" + encodeURIComponent(FromValue) + "&FromUnit=" + encodeURIComponent(FromUnit) + "&ToUnit=" + encodeURIComponent(ToUnit);

    /* fetch the results */
    let response = await fetch(myURL);
    let result = await response.json();

    document.getElementById("ToValue").innerHTML = result;
}

function clearform() {
    "use strict";

    // Set all of the form values to blank or false
    document.getElementById("FormValue").value = "";

    // Uncheck all "From Unit" radio buttons
    document.getElementById("cm").checked = false;
    document.getElementById("m").checked = false;
    document.getElementById("km").checked = false;
    document.getElementById("in").checked = false;
    document.getElementById("ft").checked = false;
    document.getElementById("yd").checked = false;
    document.getElementById("mi").checked = false;

    // Uncheck all "To Unit" radio buttons
    document.getElementById("tocm").checked = false;
    document.getElementById("tom").checked = false;
    document.getElementById("tokm").checked = false;
    document.getElementById("toin").checked = false;
    document.getElementById("toft").checked = false;
    document.getElementById("toyd").checked = false;
    document.getElementById("tomi").checked = false;

    // Clear the output value
    document.getElementById("ToValue").innerHTML = "";
}

// Initialize jQuery form validation
$("#myform").validate({});


$(document).ready(function () {
    $("#DisplayCurrency").click(GetCurrency);
    $("#Clear").click(ClearForm);
});

let myChart0; 

async function GetCurrency() {
    "use strict";

    let form = $("#myform");

    if (form.valid()) {
        let BaseCurrency = document.getElementById("BaseCurrency").value;
        let ConvertCurrency = document.getElementById("ConvertCurrency").value;
        let apiKey = "1jskOv89X78xC7cODOKkjT916wwZT2qS";
        let FromDate = document.getElementById("FromDate").value;
        let ToDate = document.getElementById("ToDate").value;

        let myURL = `https://api.polygon.io/v2/aggs/ticker/C:${BaseCurrency}${ConvertCurrency}/range/1/day/${FromDate}/${ToDate}?apiKey=${apiKey}`;
        let response = await fetch(myURL);

        if (response.ok) {
            let data = await response.json();

            if (!data.results || data.results.length === 0) {
                alert("No currency data found for the selected dates.");
                return;
            }

            /* Prepare data for Chart.js */
            let labels = [];
            let dataPoints = [];

            data.results.forEach(item => {
                let date = new Date(item.t);
                labels.push(`${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`);
                dataPoints.push(parseFloat(item.c).toFixed(3));
            });

            let ctx0 = document.getElementById("chartjs-0").getContext('2d');

            // Destroy old chart instance if exists
            if (myChart0) {
                myChart0.destroy();
            }

            // Create new chart
            myChart0 = new Chart(ctx0, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: `One (${BaseCurrency} to ${ConvertCurrency})`,
                        data: dataPoints,
                        fill: false,
                        borderColor: "rgb(75, 192, 192)",
                        lineTension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    title: {
                        display: true,
                        text: `${BaseCurrency} to ${ConvertCurrency}`
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: `${ConvertCurrency}`
                            },
                            ticks: {
                                callback: function (value) {
                                    return parseFloat(value).toFixed(3);
                                }
                            }
                        }]
                    }
                }
            });

        } else {
            alert("Currency data not found! Status: " + response.status);
        }
    }
}

function ClearForm() {
    "use strict";

    $("#BaseCurrency").val("");
    $("#ConvertCurrency").val("");
    $("#FromDate").val("");
    $("#ToDate").val("");
    

    if (myChart0) {
        myChart0.destroy();
        myChart0 = null;
    }
}
