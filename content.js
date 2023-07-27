// content.js

// This script will be injected into the web page when the extension is activated.

// Listen for voice commands using the Web Speech API
const recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = function(event) {
  const command = event.results[event.results.length - 1][0].transcript;
  processCommand(command);
};

recognition.onerror = function(event) {
  console.error('Speech recognition error:', event.error);
};

// Process the voice command
function processCommand(command) {
  // Send the command to the background script for further processing
  chrome.runtime.sendMessage({ command: command }, function(response) {
    console.log('Response from background script:', response);
  });
}

// Start listening for voice commands
recognition.start();