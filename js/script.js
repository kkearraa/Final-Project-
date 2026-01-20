document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. სექციების ანიმაცია (Reveal) ---
    const initReveal = () => {
        const revealElements = document.querySelectorAll(".reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach((el) => observer.observe(el));
    };
    initReveal();


    // --- 2. COOKIES NOTIFICATION ---
    const cookieNotice = document.getElementById('cookie-notice');
    const acceptBtn = document.getElementById('accept-cookies');

    if (cookieNotice && acceptBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            cookieNotice.style.display = 'block';
        }
        acceptBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieNotice.style.display = 'none';
        });
    }


    // --- 3. ავტორიზაციის ფორმა (Login) ---
    const loginForm = document.getElementById("loginForm");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (togglePassword && passwordInput) {
        togglePassword.addEventListener("click", function () {
            const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
            passwordInput.setAttribute("type", type);
            this.classList.toggle("fa-eye-slash");
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email");
            const password = document.getElementById("password");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

            let isValid = true;

            if (!emailRegex.test(email.value)) {
                showError("email", "Please enter a valid email address");
                isValid = false;
            } else {
                clearError("email");
            }

            if (!passwordRegex.test(password.value)) {
                showError("password", "Password: 8+ chars, letter & number");
                isValid = false;
            } else {
                clearError("password");
            }

            if (isValid) {
                alert("Form submitted successfully!");
                loginForm.reset();
            }
        });
    }


    // --- 4. ძებნის ფორმა (Search) ---
    const searchForm = document.getElementById("searchForm");
    const resultsContainer = document.getElementById("results-container");

    if (searchForm && resultsContainer) {
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(searchForm);
            const destination = formData.get("destination");

            resultsContainer.innerHTML = "<p style='color: #666;'>Searching for best deals...</p>";

            try {
                const response = await fetch("https://jsonplaceholder.typicode.com/users?_limit=3");
                const data = await response.json();
                resultsContainer.innerHTML = "";
                resultsContainer.className = "results-grid";

                data.forEach((item) => {
                    const hotelCard = `
                        <div class="hotel-card">
                            <div class="hotel-info">
                                <h4>Hotel ${item.name}</h4>
                                <p>Location: ${destination} | Free WiFi</p>
                                <span class="price-tag">$${Math.floor(Math.random() * 200) + 100} / night</span>
                            </div>
                            <a href="contact.html">
                            <button class="book-btn">Book Now</button>
                            </a>
                            </div>`;
                    resultsContainer.innerHTML += hotelCard;
                });
            } catch (error) {
                resultsContainer.innerHTML = "<p style='color: red;'>Connection error. Please try again.</p>";
            }
        });
    }

    // --- 5. სრულყოფილი ბურგერ მენიუს ლოგიკა ---
    const burger = document.getElementById('burger');
    const nav = document.querySelector('.ul-navigation');
    const navLinks = document.querySelectorAll('.ul-navigation li a');

    if (burger && nav) {
        burger.addEventListener('click', () => {
            nav.classList.toggle('nav-active');
            burger.classList.toggle('toggle');

            if (nav.classList.contains('nav-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'initial';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                document.body.style.overflow = 'initial';
            });
        });
    }

    // --- 6. TRAVEL SLIDER LOGIC ---
    const eventData = [
        {
            title: "Bali - Indonesia",
            description: "Bali is a world-renowned tropical paradise in Indonesia famous for its lush rice terraces, volcanic mountains, and iconic beaches.",
            image: "./images/event_bg 1.png"
        },
        {
            title: "Raja Ampat - Indonesia",
            description: 'Raja Ampat is a breathtaking archipelago known as the "Crown Jewel of the Ocean", where emerald jungle islands rise from the world’s most vibrant turquoise waters.',
            image: "./images/Raja Ampat, Indonesia.jpg" 
        },
        {
            title: "Yogyakarta - Indonesia",
            description: "Step into the soulful heart of Java, where ancient majestic temples like Borobudur meet a vibrant world of royal palaces and street art.",
            image: "./images/Yogyakarta, Indonesia.jpg"
        },
        {
            title: "Komodo Island - Indonesia",
            description: "Venture into a prehistoric world where the legendary Komodo dragons roam free across a dramatic landscape of rugged hills and pink sand beaches.",
            image: "./images/Komodo Island, Indonesia.jpg"
        }
    ];

    let currentIndex = 0;

    // Define changeSlide as a global function so the HTML 'onclick' can see it
    window.changeSlide = function(direction) {
        const bgImage = document.getElementById('main-bg');
        const titleEl = document.getElementById('event-title');
        const descEl = document.getElementById('event-desc');

        if (!bgImage || !titleEl || !descEl) return;

        // 1. Start Fade
        bgImage.classList.add('fade-out');

        setTimeout(() => {
            // 2. Update Index
            currentIndex += direction;
            if (currentIndex >= eventData.length) currentIndex = 0;
            if (currentIndex < 0) currentIndex = eventData.length - 1;

            const currentEvent = eventData[currentIndex];

            // 3. Update Content
            titleEl.innerText = currentEvent.title;
            descEl.innerText = currentEvent.description;
            bgImage.src = currentEvent.image;

            // 4. End Fade
            bgImage.classList.remove('fade-out');
        }, 500); 
    };


    // --- დამხმარე ფუნქციები ვალიდაციისთვის ---
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorDisplay = document.getElementById(`${fieldId}Error`);
        if (field && errorDisplay) {
            field.classList.add("error-border");
            errorDisplay.innerText = message;
        }
    }

    function clearError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorDisplay = document.getElementById(`${fieldId}Error`);
        if (field && errorDisplay) {
            field.classList.remove("error-border");
            errorDisplay.innerText = "";
        }
    }
});