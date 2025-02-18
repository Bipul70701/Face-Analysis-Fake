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

  imagePreview.style.display = 'none';
  imagePreview.innerHTML = '';
  startButton.classList.add('hidden');

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
  // Clear any existing image data when page loads
  clearLocalStorage();
  clearCookies();
  
  // Reset UI elements to default state
  imagePreview.style.display = 'none';
  imagePreview.innerHTML = '';
  startButton.classList.add('hidden');
  imageUpload.value = ''; // Clear the file input
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

// Get the loading overlay element
const progressBar = document.getElementById('progressBar');

// Start Analyzing logic when the button is clicked
startButton.addEventListener('click', async () => {
  // Ensure a file is selected
  const file = imageUpload.files[0];
  if (!file) {
    alert('Please upload an image before analyzing.');
    return;
  }


  // Upload the image to the server
  const formData = new FormData();
  formData.append('image', file);

  try {
    // Step 1: Upload the image to the server
    // const uploadResponse = await fetch('/upload-bait-image', {
    //   method: 'POST',
    //   body: formData,
    // });
    // const uploadData = await uploadResponse.json();
    // const imageUrl = uploadData.imageUrl;

    // Step 2: Analyze the image and store feedback in cookies

    // Step 3: Redirect to results.html after analysis
    window.location.href = '/examplethanks';
  } catch (error) {
    console.error('Error during analysis:', error);
    alert('An error occurred while analyzing the image.');


  }
});
