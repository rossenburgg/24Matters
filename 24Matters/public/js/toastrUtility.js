// Function to display success notifications
function showSuccessToastr(message) {
  toastr.success(message);
  console.log("Success notification displayed: " + message);
}

// Function to display error notifications
function showErrorToastr(message) {
  toastr.error(message);
  console.error("Error notification displayed: " + message);
}

// Function to display info notifications
function showInfoToastr(message) {
  toastr.info(message);
  console.log("Info notification displayed: " + message);
}

// Function to display warning notifications
function showWarningToastr(message) {
  toastr.warning(message);
  console.warn("Warning notification displayed: " + message);
}

// Ensure Toastr configuration is loaded before this script by including toastrConfig.js in the HTML document before this file.
// This file serves as a utility for displaying Toastr notifications throughout the application, leveraging the centralized Toastr configuration for consistent behavior.