// ===========================================================
// MAIN SCRIPT 
// ===========================================================

document.addEventListener("DOMContentLoaded", () => {

    // =======================================================
    // 1. TYPEWRITING EFFECT
    // =======================================================
    const roles = ["Web Designer", "Web Developer", "Graphic Designer"];
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const textElement = document.getElementById("text");

    function typeEffect() {
        const currentRole = roles[currentIndex];

        charIndex += isDeleting ? -1 : 1;
        textElement.textContent = currentRole.substring(0, charIndex);

        if (!isDeleting && charIndex === currentRole.length) {
            setTimeout(() => { isDeleting = true; typeEffect(); }, 1000);
            return;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % roles.length;
        }

        setTimeout(typeEffect, isDeleting ? 60 : 100);
    }

    if (textElement) typeEffect();

    // =======================================================
    // 3. HAMBURGER MENU
    // =======================================================

    const hamburger = document.querySelector(".hamburger");
    const navLists = document.querySelector(".nav-lists");

    hamburger.addEventListener("click", () => {
    navLists.classList.toggle("active");
    });


    // =======================================================
    // 2. PORTFOLIO FILTER
    // =======================================================
    const navLinks = document.querySelectorAll(".portfolio-nav a");
    const items = document.querySelectorAll(".portfolio-item");

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            navLinks.forEach(nav => nav.classList.remove("active"));
            link.classList.add("active");

            const category = link.dataset.category;

            items.forEach(item => {
                item.style.display =
                    category === "all" || item.classList.contains(category)
                        ? "block"
                        : "none";
            });
        });
    });

    // =======================================================
    // 4. BACK TO TOP BUTTON (with circular progress)
    // =======================================================
    jQuery(function ($) {

        const progressPath = document.querySelector(".progress-wrap path");
        if (!progressPath) return;

        const pathLength = progressPath.getTotalLength();
        progressPath.style.strokeDasharray = `${pathLength} ${pathLength}`;
        progressPath.style.strokeDashoffset = pathLength;

        const updateProgress = () => {
            const scroll = $(window).scrollTop();
            const height = $(document).height() - $(window).height();
            const progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        };

        updateProgress();

        $(window).on("scroll", function () {
            updateProgress();
            $(".progress-wrap").toggleClass("active-progress", $(this).scrollTop() > 20);
        });

        $(".progress-wrap").on("click", function (event) {
            event.preventDefault();
            $("html, body").animate({ scrollTop: 0 }, 550);
        });
    });


    // =======================================================
    // 5. UNIT CONVERTER (AJAX)
    // =======================================================
    window.calculate = function () {
        let form = $("#myform");
        if (!form.valid()) return;

        let FromValue = document.getElementById("FormValue").value;

        const getCheckedValue = (ids) => {
            for (let id of ids) {
                const el = document.getElementById(id);
                if (el.checked) return el.value;
            }
            return "";
        };

        let FromUnit = getCheckedValue(["cm", "m", "km", "in", "ft", "yd", "mi"]);
        let ToUnit = getCheckedValue(["tocm", "tom", "tokm", "toin", "toft", "toyd", "tomi"]);

        ConvertUnits(FromValue, FromUnit, ToUnit);
    };

    async function ConvertUnits(FromValue, FromUnit, ToUnit) {
        const myURL =
            `https://brucebauer.info/assets/ITEC3650/unitsconversion.php` +
            `?FromValue=${encodeURIComponent(FromValue)}` +
            `&FromUnit=${encodeURIComponent(FromUnit)}` +
            `&ToUnit=${encodeURIComponent(ToUnit)}`;

        const response = await fetch(myURL);
        const result = await response.json();
        document.getElementById("ToValue").innerHTML = result;
    }

    window.clearform = function () {
        document.getElementById("FormValue").value = "";
        document.querySelectorAll("input[type=radio]").forEach(r => r.checked = false);
        document.getElementById("ToValue").innerHTML = "";
    };


    // =======================================================
    // 6. CURRENCY VALUE HISTORY (Polygon API)
    // =======================================================
    let myChart0;

    window.GetCurrency = async function () {
        let form = $("#myform");
        if (!form.valid()) return;

        let BaseCurrency = document.getElementById("BaseCurrency").value;
        let ConvertCurrency = document.getElementById("ConvertCurrency").value;
        let FromDate = document.getElementById("FromDate").value;
        let ToDate = document.getElementById("ToDate").value;

        let apiKey = "1jskOv89X78xC7cODOKkjT916wwZT2qS";
        let myURL = `https://api.polygon.io/v2/aggs/ticker/C:${BaseCurrency}${ConvertCurrency}/range/1/day/${FromDate}/${ToDate}?apiKey=${apiKey}`;

        let response = await fetch(myURL);

        if (!response.ok) {
            alert("Currency data not found! Status: " + response.status);
            return;
        }

        let data = await response.json();

        if (!data.results || data.results.length === 0) {
            alert("No currency data found for the selected dates.");
            return;
        }

        let labels = [];
        let dataPoints = [];

        data.results.forEach(item => {
            let date = new Date(item.t);
            labels.push(`${date.toLocaleString("en-US", { month: "short" })} ${date.getDate()}`);
            dataPoints.push(parseFloat(item.c).toFixed(3));
        });

        let ctx0 = document.getElementById("chartjs-0").getContext("2d");

        if (myChart0) myChart0.destroy();

        myChart0 = new Chart(ctx0, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: `One (${BaseCurrency} to ${ConvertCurrency})`,
                    data: dataPoints,
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        ticks: {
                            callback: value => parseFloat(value).toFixed(3)
                        }
                    }
                }
            }
        });
    };

    window.ClearForm = function () {
        $("#BaseCurrency, #ConvertCurrency, #FromDate, #ToDate").val("");

        if (myChart0) {
            myChart0.destroy();
            myChart0 = null;
        }
    };

});
