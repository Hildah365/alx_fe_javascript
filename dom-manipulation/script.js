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

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- Category: ${quote.category}</p>`;
    // Store last viewed quote in session storage
    sessionStorage.setItem('lastQuote', JSON.stringify(quote));
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
    
    document.body.appendChild(formDiv);
}

function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
        quotes.push({ text, category });
        saveQuotes(); // Save to local storage
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

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadQuotes(); // Load quotes from local storage
    createAddQuoteForm();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    showRandomQuote(); // Show an initial quote
});