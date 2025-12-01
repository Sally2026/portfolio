// TypeWriting 
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
      }, 1000);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      currentIndex = (currentIndex + 1) % roles.length;
    }

    setTimeout(typeEffect, isDeleting ? 60 : 100);
  }

  typeEffect();

  // Portfolio filter
  const navLinks = document.querySelectorAll('.portfolio-nav a');
  const items = document.querySelectorAll('.portfolio-item');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      navLinks.forEach(nav => nav.classList.remove('active'));
      link.classList.add('active');

      const category = link.dataset.category;

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

// Calculator AJAX
function calculate() {
    "use strict";

    let form = $("#myform");

    if (form.valid()) {

        let FromValue = document.getElementById("FormValue").value;

        let FromUnit = "";
        if (document.getElementById("cm").checked) FromUnit = document.getElementById("cm").value;
        if (document.getElementById("m").checked) FromUnit = document.getElementById("m").value;
        if (document.getElementById("km").checked) FromUnit = document.getElementById("km").value;
        if (document.getElementById("in").checked) FromUnit = document.getElementById("in").value;
        if (document.getElementById("ft").checked) FromUnit = document.getElementById("ft").value;
        if (document.getElementById("yd").checked) FromUnit = document.getElementById("yd").value;
        if (document.getElementById("mi").checked) FromUnit = document.getElementById("mi").value;

        let ToUnit = "";
        if (document.getElementById("tocm").checked) ToUnit = document.getElementById("tocm").value;
        if (document.getElementById("tom").checked) ToUnit = document.getElementById("tom").value;
        if (document.getElementById("tokm").checked) ToUnit = document.getElementById("tokm").value;
        if (document.getElementById("toin").checked) ToUnit = document.getElementById("toin").value;
        if (document.getElementById("toft").checked) ToUnit = document.getElementById("toft").value;
        if (document.getElementById("toyd").checked) ToUnit = document.getElementById("toyd").value;
        if (document.getElementById("tomi").checked) ToUnit = document.getElementById("tomi").value;

        ConvertUnits(FromValue, FromUnit, ToUnit);
    }
}

// Currency AJAX
async function ConvertUnits(FromValue, FromUnit, ToUnit) {
    "use strict";

    let myURL = "https://brucebauer.info/assets/ITEC3650/unitsconversion.php";
    myURL += "?FromValue=" + encodeURIComponent(FromValue);
    myURL += "&FromUnit=" + encodeURIComponent(FromUnit);
    myURL += "&ToUnit=" + encodeURIComponent(ToUnit);

    let response = await fetch(myURL);
    let result = await response.json();

    document.getElementById("ToValue").innerHTML = result;
}

function clearform() {
    "use strict";

    document.getElementById("FormValue").value = "";

    document.getElementById("cm").checked = false;
    document.getElementById("m").checked = false;
    document.getElementById("km").checked = false;
    document.getElementById("in").checked = false;
    document.getElementById("ft").checked = false;
    document.getElementById("yd").checked = false;
    document.getElementById("mi").checked = false;

    document.getElementById("tocm").checked = false;
    document.getElementById("tom").checked = false;
    document.getElementById("tokm").checked = false;
    document.getElementById("toin").checked = false;
    document.getElementById("toft").checked = false;
    document.getElementById("toyd").checked = false;
    document.getElementById("tomi").checked = false;

    document.getElementById("ToValue").innerHTML = "";
}

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

            let labels = [];
            let dataPoints = [];

            data.results.forEach(item => {
                let date = new Date(item.t);
                labels.push(`${date.toLocaleString('en-US', { month: 'short' })} ${date.getDate()}`);
                dataPoints.push(parseFloat(item.c).toFixed(3));
            });

            let ctx0 = document.getElementById("chartjs-0").getContext('2d');

            if (myChart0) {
                myChart0.destroy();
            }

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

// Hamburger Menu
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navList = document.querySelector('.nav-lists');
    const navItems = document.querySelectorAll('.nav-lists li a'); // all nav links

    // Toggle menu on hamburger click
    hamburger.addEventListener('click', () => {
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when a nav item is clicked
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
});


// Back to Top Button
document.addEventListener('DOMContentLoaded', () => {
    jQuery(document).ready(function($) {
        var progressPath = document.querySelector('.progress-wrap path');
        var pathLength = progressPath.getTotalLength();

        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';

        var updateProgress = function () {
            var scroll = $(window).scrollTop();
            var height = $(document).height() - $(window).height();
            var progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        };

        updateProgress();

        $(window).scroll(function () {
            updateProgress();
            if ($(this).scrollTop() > 20) {
                $('.progress-wrap').addClass('active-progress');
            } else {
                $('.progress-wrap').removeClass('active-progress');
            }
        });

        $('.progress-wrap').on('click', function (event) {
            event.preventDefault();
            $('html, body').animate({ scrollTop: 0 }, 550);
            return false;
        });
    });
});
