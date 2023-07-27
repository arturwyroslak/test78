const apiKey = "YOUR_OPENAI_API_KEY";

// Function to initialize the extension
function initializeExtension() {
  // Check if the browser supports the Web Speech API
  if (!('webkitSpeechRecognition' in window)) {
    console.log('Web Speech API is not supported by this browser.');
    return;
  }

  // Create a new instance of the SpeechRecognition object
  const recognition = new webkitSpeechRecognition();

  // Set the language for speech recognition
  recognition.lang = 'en-US';

  // Set the maximum number of alternative transcripts to be returned
  recognition.maxAlternatives = 1;

  // Set the continuous property to true to keep listening for speech
  recognition.continuous = true;

  // Set the onresult event handler
  recognition.onresult = function(event) {
    const result = event.results[event.results.length - 1][0].transcript;
    processCommand(result);
  };

  // Start speech recognition
  recognition.start();
}

// Function to process the user command
function processCommand(command) {
  // Send the user command to the OpenAI API for natural language processing
  fetch('https://api.openai.com/v1/engines/gpt-3.5-turbo/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      prompt: command,
      max_tokens: 100,
      temperature: 0.7
    })
  })
  .then(response => response.json())
  .then(data => {
    const generatedCode = data.choices[0].text.trim();
    executeCode(generatedCode);
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Function to execute the generated code
function executeCode(code) {
  try {
    eval(code);
  } catch (error) {
    console.error('Error executing code:', error);
  }
}

// Initialize the extension
initializeExtension();