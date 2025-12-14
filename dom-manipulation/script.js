let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "You miss 100% of the shots you don't take.", category: "Opportunity" },
    { text: "The best way to predict the future is to create it.", category: "Future" }
];

function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function loadQuotes() {
    const stored = localStorage.getItem('quotes');
    if (stored) {
        quotes = JSON.parse(stored);
    }
}

function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(q => q.category))];
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '';
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat === 'all' ? 'All Categories' : cat;
        select.appendChild(option);
    });
    // Restore last selected filter
    const lastFilter = localStorage.getItem('lastCategoryFilter') || 'all';
    select.value = lastFilter;
}

function displayQuotes(quotesToShow) {
    const container = document.getElementById('quotesContainer');
    container.innerHTML = '';
    quotesToShow.forEach(quote => {
        const div = document.createElement('div');
        div.innerHTML = `<p>"${quote.text}"</p><p>- Category: ${quote.category}</p><hr>`;
        container.appendChild(div);
    });
}

function filterQuotes() {
    const selected = document.getElementById('categoryFilter').value;
    localStorage.setItem('lastCategoryFilter', selected);
    const filtered = selected === 'all' ? quotes : quotes.filter(q => q.category === selected);
    displayQuotes(filtered);
}

function showQuotes() {
    displayQuotes(quotes);
}

function createAddQuoteForm() {
    const formDiv = document.createElement('div');
    const textInput = document.createElement('input');
    textInput.id = 'newQuoteText';
    textInput.type = 'text';
    textInput.placeholder = 'Enter a new quote';
    const categoryInput = document.createElement('input');
    categoryInput.id = 'newQuoteCategory';
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter quote category';
    const addButton = document.createElement('button');
    addButton.textContent = 'Add Quote';
    addButton.onclick = addQuote;
    formDiv.appendChild(textInput);
    formDiv.appendChild(categoryInput);
    formDiv.appendChild(addButton);
    
    // Add export button
    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export Quotes to JSON';
    exportButton.onclick = exportQuotes;
    formDiv.appendChild(exportButton);
    
    // Add import file input
    const importInput = document.createElement('input');
    importInput.type = 'file';
    importInput.id = 'importFile';
    importInput.accept = '.json';
    importInput.onchange = importFromJsonFile;
    formDiv.appendChild(importInput);
    
    // Add sync button
    const syncButton = document.createElement('button');
    syncButton.textContent = 'Sync with Server';
    syncButton.onclick = syncWithServer;
    formDiv.appendChild(syncButton);
    
    document.body.appendChild(formDiv);
}

function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes(); // Save to local storage
        populateCategories(); // Update categories if new
        displayQuotes(quotes); // Refresh display
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'quotes.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (file) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            try {
                const importedQuotes = JSON.parse(event.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes.push(...importedQuotes);
                    saveQuotes();
                    populateCategories();
                    displayQuotes(quotes);
                    alert('Quotes imported successfully!');
                } else {
                    alert('Invalid JSON format. Please upload a valid quotes JSON file.');
                }
            } catch (e) {
                alert('Error parsing JSON file.');
            }
        };
        fileReader.readAsText(file);
    }
}

function showNotification(message) {
    const notif = document.getElementById('notification');
    notif.textContent = message;
    notif.style.display = 'block';
    setTimeout(() => notif.style.display = 'none', 5000);
}

function syncWithServer() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            const serverQuotes = data.slice(0, 10).map(post => ({ text: post.title, category: 'Server' }));
            // Check for conflicts: if local quotes differ from server
            const hasConflict = quotes.length !== serverQuotes.length || 
                !quotes.every((q, i) => q.text === serverQuotes[i]?.text);
            if (hasConflict) {
                // Server takes precedence
                quotes = serverQuotes;
                saveQuotes();
                populateCategories();
                displayQuotes(quotes);
                showNotification('Data synced with server. Local changes were overwritten due to conflict.');
            } else {
                showNotification('Data is up to date with server.');
            }
        })
        .catch(error => {
            console.error('Sync error:', error);
            showNotification('Failed to sync with server.');
        });
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadQuotes(); // Load quotes from local storage
    populateCategories(); // Populate category filter
    createAddQuoteForm();
    document.getElementById('newQuote').addEventListener('click', showQuotes);
    showQuotes(); // Show all quotes initially
    filterQuotes(); // Apply initial filter
    // Periodic sync every 30 seconds
    setInterval(syncWithServer, 30000);
});