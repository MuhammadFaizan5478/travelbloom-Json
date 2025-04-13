function FormValidation() {

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameError = document.getElementById('nameError');
    const emailError = document.getElementById('emailError');
    const messageError = document.getElementById('messageError');
    const successAlert = document.getElementById('successAlert');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        nameError.textContent = '';
        emailError.textContent = '';
        messageError.textContent = '';
        
        let isValid = true;
        
        // Validate name
        if (nameInput.value.trim() === '') {
            nameError.textContent = 'Name is required';
            isValid = false;
        } else if (nameInput.value.trim().length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        }
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required';
            isValid = false;
        } else if (!emailRegex.test(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        // Validate message
        if (messageInput.value.trim() === '') {
            messageError.textContent = 'Message is required';
            isValid = false;
        } else if (messageInput.value.trim().length < 10) {
            messageError.textContent = 'Message must be at least 10 characters';
            isValid = false;
        }
        
        // Submit form if valid
        if (isValid) {
            // Show success alert
            successAlert.style.display = 'block';
            
            // Reset form
            contactForm.reset();
            
            // Hide alert after 5 seconds
            setTimeout(function() {
                successAlert.style.display = 'none';
            }, 5000);
        }
    });
});
}



FormValidation();


function recivingData(){

    document.querySelector('.btn-search').addEventListener('click', async () => {
        const searchValue = document.getElementById('searchinput').value.trim().toLowerCase();
        const searchSection = document.getElementById('search-message');
        searchSection.style.display = 'block';
        searchSection.innerHTML = '';
    
        try {
            const response = await fetch('./travel_recommendation_api.json');
            const data = await response.json();
            let found = false;
    
            // 1. Check for country match first (important)
            const matchedCountry = data.countries.find(c => c.name.toLowerCase() === searchValue);
            if (matchedCountry) {
                matchedCountry.cities.forEach(city => {
                    searchSection.innerHTML += `
                        <div class="item">            
                            <img src="${city.imageUrl}" alt="${city.name}" />
                            <h3>${city.name}</h3>
                            <p>${city.description}</p>
                            <button href="#">View More</button>
                        </div>
                    `;
                });
                found = true;
            }
    
            // 2. If not a country, check for specific city match
            if (!found) {
                for (let country of data.countries) {
                    const matchedCity = country.cities.find(city =>
                        city.name.toLowerCase().includes(searchValue)
                    );
                    if (matchedCity) {
                        searchSection.innerHTML += `
                            <div class="item">
                                <img src="${matchedCity.imageUrl}" alt="${matchedCity.name}" />
                                <h3>${matchedCity.name}</h3>
                                <p>${matchedCity.description}</p>
                                <button href="#">View More</button>
                            </div>
                        `;
                        found = true;
                        break;
                    }
                }
            }
    
            // 3. Check for keyword: beach
            if (!found && searchValue.includes('beach')) {
                data.beaches.forEach(beach => {
                    searchSection.innerHTML += `
                        <div class="item">
                            <img src="${beach.imageUrl}" alt="${beach.name}" />
                            <h3>${beach.name}</h3>
                            <p>${beach.description}</p>
                            <button href="#">View More</button>
                        </div>
                    `;
                });
                found = true;
            }
    
            // 4. Check for keyword: temple
            if (!found && searchValue.includes('temple')) {
                data.temples.forEach(temple => {
                    searchSection.innerHTML += `
                        <div class="item">
                            <img src="${temple.imageUrl}" alt="${temple.name}" />
                            <h3>${temple.name}</h3>
                            <p>${temple.description}</p>
                            <button href="#">View More</button>
                        </div>
                    `;
                });
                found = true;
            }
    
            // 5. If still not found
            if (!found) {
                searchSection.innerHTML = `<p class="no-found">Not found in our data.</p>`;
            }
    
        } catch (error) {
            console.error('Error fetching data:', error);
            searchSection.innerHTML = `<p>Error fetching data.</p>`;
        }
    });
    
    // Clear button
    document.querySelector('.btn-clear').addEventListener('click', () => {
        document.getElementById('searchinput').value = '';
        const searchSection = document.getElementById('search-message');
        searchSection.style.display = 'none';
        searchSection.innerHTML = '';
    });
    
    }




recivingData();