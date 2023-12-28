const firebaseConfig = {
    apiKey: "AIzaSyCqpLV4do4TqpLdmtqlJG2uNI8_aND6zGY",
    authDomain: "clinic-cffe4.firebaseapp.com",
    databaseURL: "https://clinic-cffe4-default-rtdb.firebaseio.com",
    projectId: "clinic-cffe4",
    storageBucket: "clinic-cffe4.appspot.com",
    messagingSenderId: "10463763649",
    appId: "1:10463763649:web:f60d6706b0ec91b99b0840"
    // Your Firebase configuration
};
firebase.initializeApp(firebaseConfig);

function displayAppointments() {
    const appointmentsList = document.getElementById("appointmentsList");
    appointmentsList.innerHTML = ""; // Clear previous appointments

    const appointmentsRef = firebase.database().ref("appointments");
    appointmentsRef.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            const patientId = childSnapshot.key; // Get the patient ID (e.g., "12345")
            const appointmentsData = childSnapshot.val(); // Get the nested appointments object

            for (const appointmentKey in appointmentsData) {
                if (appointmentsData.hasOwnProperty(appointmentKey)) {
                    const appointment = appointmentsData[appointmentKey];
                    const appointmentTime = appointment.appointmentTime;

                    const listItem = document.createElement("li");

                    // Display appointment information
                    listItem.textContent = `Patient ID: ${patientId}, Details: ${appointmentTime}`;

                    // Add a delete button for each appointment
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "Delete";
                    deleteButton.onclick = function() {
                        deleteAppointment(patientId, appointmentKey);
                    };

                    // Append delete button to the list item
                    listItem.appendChild(deleteButton);

                    // Append list item to the appointments list
                    appointmentsList.appendChild(listItem);
                }
            }
        });
    });
}

// Function to delete a specific appointment
function deleteAppointment(patientId, appointmentKey) {
    const appointmentRef = firebase.database().ref("appointments").child(patientId).child(appointmentKey);
    appointmentRef.remove()
        .then(function() {
            alert("Appointment deleted successfully!");
            displayAppointments(); // Refresh the list after deletion
        })
        .catch(function(error) {
            console.error("Error deleting appointment: ", error);
            alert("Error deleting appointment. Please try again.");
        });
}
// Function to search for a patient by unique ID and update treatment
// Function to search for a patient by unique ID and update treatment
// Function to search for a patient by unique ID and update treatment with additional details
// Function to search for a patient by unique ID and update treatment
function searchAndUpdateTreatment() {
    const uniqueId = prompt("Please enter the last 5 digits of the patient's phone number as their unique ID:", "");
    if (uniqueId === null || uniqueId.length !== 5 || isNaN(uniqueId)) {
        alert("Invalid unique ID. Please enter the last 5 digits of the patient's phone number.");
        return;
    }

    const problem = prompt("Please enter the patient's problem:", "");
    if (!problem) {
        alert("Problem is required.");
        return;
    }

    const treatment = prompt("Please enter the treatment for the patient:", "");
    if (!treatment) {
        alert("Treatment is required.");
        return;
    }

    const medications = prompt("Please enter the medications for the patient:", "");
    if (!medications) {
        alert("Medications are required.");
        return;
    }

    const cost = parseFloat(prompt("Please enter the total cost for the treatment:", ""));
    if (isNaN(cost) || cost < 0) {
        alert("Invalid total cost. Please enter a valid amount.");
        return;
    }

    const patientRef = firebase.database().ref("patients").child(uniqueId);
    patientRef.child("medicalHistory").push({
        treatment: treatment,
        medication: medications,
        cost: cost,
        problem: problem,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });

    alert("Treatment updated successfully!");
}

// Display appointments when the page loads
window.addEventListener("load", function() {
    displayAppointments();
});
