document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    const mainContainer = document.querySelector('.main-container');

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchForBreaches(query);  // البحث باستخدام البريد الإلكتروني أو الدومين
        } else {
            alert('Please enter an email or domain to search.');
        }
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });

    async function searchForBreaches(query) {
        try {
            // تحقق إذا كان المدخل بريد إلكتروني أو دومين
            const isEmail = query.includes('@');
            const url = isEmail
                ? `http://localhost:3000/api/breaches/${query}`  // إذا كان البريد الإلكتروني
                : `http://localhost:3000/api/breaches/domain/${query}`;  // إذا كان الدومين

            const response = await fetch(url);

            // تأكد من أن الاستجابة بتنسيق JSON
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const data = await response.json();  // تحويل البيانات إلى JSON

            // مسح النتائج السابقة
            const existingResults = document.querySelector('.results-container');
            if (existingResults) {
                existingResults.remove();
            }

            // إنشاء حاوية جديدة للنتائج
            const resultsDiv = document.createElement('div');
            resultsDiv.className = 'results-container';
            mainContainer.appendChild(resultsDiv);

            // إنشاء العنوان بناءً على المدخل (إيميل أو دومين)
            const resultsHeading = document.createElement('h2');
            resultsHeading.textContent = isEmail
                ? `Found Leaked Passwords for ${query}`
                : `Found Leaked Data for domain ${query}`;
            resultsDiv.appendChild(resultsHeading);

            // إذا كان الرد يحتوي على بيانات صالحة (مصفوفة من الكائنات)
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach((breach) => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'result-item';
                    resultItem.innerHTML = `<strong>Email:</strong> ${breach.email} <br> <strong>Password:</strong> ${breach.password}`;
                    resultsDiv.appendChild(resultItem);
                });
            } else {
                const noResultsItem = document.createElement('div');
                noResultsItem.className = 'result-item';
                noResultsItem.textContent = 'No breached data found.';
                resultsDiv.appendChild(noResultsItem);
            }

        } catch (error) {
            console.error('Error fetching breach data:', error);
            mainContainer.innerHTML += `<p class="error">${error.message || 'An error occurred while searching. Please try again later.'}</p>`;
        }
    }
});
