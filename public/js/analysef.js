// Image Upload and Preview Logic
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const startButton = document.getElementById('startButton');

// Function to clear all cookies
function clearCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  }
}

// Function to clear the previously stored image from localStorage
function clearLocalStorage() {
  localStorage.removeItem('uploadedImage');
}

// When the user selects an image, clear previous cookies, localStorage, display the new image, and show the Start Analyzing button
imageUpload.addEventListener('change', function () {
  // Clear previous cookies and localStorage
  clearCookies();
  clearLocalStorage();

  const file = this.files[0];
  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      // Display the uploaded image preview
      imagePreview.style.display = 'block';
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Uploaded Image" style="width:100%; height:auto; border-radius: 15px;">`;
      startButton.classList.remove('hidden');  // Show the "Start Analyzing" button

      // Store the image in localStorage as a base64 string
      localStorage.setItem('uploadedImage', e.target.result);
    };

    reader.readAsDataURL(file);  // Convert image to base64 string
  }
});

// On page load, check if an image is stored in localStorage and display it
// window.addEventListener('load', () => {
//   const storedImage = localStorage.getItem('uploadedImage');
//   if (storedImage) {
//     // Show the stored image in the preview area
//     imagePreview.style.display = 'block';
//     imagePreview.innerHTML = `<img src="${storedImage}" alt="Uploaded Image" style="width:100%; height:auto; border-radius: 15px;">`;
//     startButton.classList.remove('hidden');  // Show the "Start Analyzing" button
//   }
// });

window.addEventListener('load', () => {
  // Clear any existing image storage when page first loads
  clearLocalStorage();
  clearCookies();
  
  // Reset the UI elements
  imagePreview.style.display = 'none';
  imagePreview.innerHTML = '';
  startButton.classList.add('hidden');
  imageUpload.value = ''; // Reset file input
});

// Utility function to set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/`;
}

// Utility function to split large strings into multiple cookies
function setLargeCookie(name, value, days) {
  const maxCookieSize = 4000; // Max size of each cookie part (approximately)
  const numParts = Math.ceil(value.length / maxCookieSize);

  for (let i = 0; i < numParts; i++) {
    const part = value.slice(i * maxCookieSize, (i + 1) * maxCookieSize);
    setCookie(`${name}_part${i}`, part, days);
  }
}

// Function to store JSON feedback in cookies
function storeFeedbackInCookies(feedback) {
  const feedbackString = JSON.stringify(feedback);
  
  if (feedbackString.length > 4000) {
    setLargeCookie('feedback', feedbackString, 2);  // Store as multiple parts if too large
  } else {
    setCookie('feedback', feedbackString, 2);  // Store as one cookie if small enough
  }
}

// Function to get feedback from the server and store it in cookies

// Get the loading overlay and timer elements
const loadingOverlay = document.getElementById('loadingOverlay');
const progressBar = document.getElementById('progressBar');
const timerElement = document.getElementById('timer');
let startTime;
let timerInterval;
let progressInterval;

// Function to start the timer and increment progress bar
function startTimer() {
  startTime = new Date().getTime();
  let elapsedTime = 0;
  let progress = 0;

  // We need to complete the progress in 22 seconds.
  const totalDuration = 22000; // 22 seconds in milliseconds
  const updateInterval = 220; // Update every 220ms for smoothness (22 seconds / 100 updates)

  // Increment progress every 220ms (approx.) to reach 100% in 22 seconds
  progressInterval = setInterval(() => {
    elapsedTime = new Date().getTime() - startTime;

    // Increment progress to match the time elapsed
    progress = (elapsedTime / totalDuration) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    progressBar.textContent = `${Math.floor(Math.min(progress, 100))}%`;

    // Format the timer display (just for reference, no need to match exactly 22 seconds here)
    const seconds = Math.floor(elapsedTime / 1000);
    const formattedTime = `00:${String(seconds).padStart(2, '0')}`;
    timerElement.textContent = formattedTime;

    // Stop the timer once we reach or exceed 22 seconds (100% progress)
    if (elapsedTime >= totalDuration) {
      stopTimer();
      window.location.href = '/preview';
    }
  }, updateInterval); // Update every 220ms
}

// Function to stop the timer and set progress to 100% when analysis is done
function stopTimer() {
  clearInterval(progressInterval); // Stop progress increments
  progressBar.style.width = '100%'; // Set progress to 100%
  progressBar.textContent = '100%'; // Display 100%
  timerElement.textContent = '00:22'; // Set timer display to 00:22 to indicate 22 seconds
}


// Start Analyzing logic when the button is clicked
startButton.addEventListener('click', async () => {
  // Ensure a file is selected
  const file = imageUpload.files[0];
  if (!file) {
    alert('Please upload an image before analyzing.');
    return;
  }

  // Show the loading overlay and start the timer
  loadingOverlay.classList.remove('hidden');
  startTimer(); // Timer starts when analysis begins

  // Upload the image to the server
  const formData = new FormData();
  formData.append('image', file);

});

const quotes = [
  "Critical and Honest AI analyze tool",
  "Use AI Advice and Get Pretty Previlege",
  "Uncover your unique strenghts",
  "Get Unbiased Feedback About Yourself",
  "A Glimpse at Your True Potential",
  "Discover What Makes You Stand Out"
];
let quoteIndex = 0;
const quoteElement = document.getElementById("loadingQuote");

function updateQuote() {
  quoteElement.style.opacity = 0; // Fade out
  setTimeout(() => {
    quoteElement.innerText = quotes[quoteIndex];
    quoteElement.style.opacity = 1; // Fade in
    quoteIndex = (quoteIndex + 1) % quotes.length;
  }, 1000); // Match transition duration
}

setInterval(updateQuote, 4000); // Change quote every 4 seconds
