let quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Believe you can and you're halfway there.", category: "Inspiration" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams" },
    { text: "You miss 100% of the shots you don't take.", category: "Opportunity" },
    { text: "The best way to predict the future is to create it.", category: "Future" }
];

function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- Category: ${quote.category}</p>`;
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
    document.body.appendChild(formDiv);
}

function addQuote() {
    const text = document.getElementById('newQuoteText').value.trim();
    const category = document.getElementById('newQuoteCategory').value.trim();
    if (text && category) {
        quotes.push({ text, category });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    createAddQuoteForm();
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    showRandomQuote(); // Show an initial quote
});