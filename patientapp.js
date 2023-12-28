


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

// Function to generate a static unique ID for each patient
function generateUniqueId() {
    const timestamp = new Date().getTime(); // Current timestamp
    const random = Math.floor(Math.random() * 10000); // Random number
    return `${timestamp}${random}`; // Combine timestamp and random number
}

// Function to create patient profile
function createPatientProfile(name, uniqueId) {
    const userId = firebase.auth().currentUser.uid;
    const patientRef = firebase.database().ref("patients").child(userId);
    patientRef.set({
        name: name,
        uniqueId: uniqueId,
        treatments: [],
        appointments: []
    });
    console.log("Patient profile created.");

    // Display the unique ID to the patient
    document.getElementById("patientUniqueId").textContent = uniqueId;
    document.getElementById("uniqueIdDisplay").style.display = "block";
}

// Function to book an appointment
function bookAppointment() {
    const userId = firebase.auth().currentUser.uid;
    const appointmentTime = document.getElementById("appointmentTime").value;

    const patientRef = firebase.database().ref("patients").child(userId);
    patientRef.child("appointments").push({
        time: appointmentTime,
        bookedBy: "patient",
        bookedAt: new Date().toLocaleString()
    });

    console.log("Appointment booked:", appointmentTime);
}

// Function to handle profile form submission
document.getElementById("profileForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const patientName = document.getElementById("patientName").value;
    const patientUniqueId = generateUniqueId();
    createPatientProfile(patientName, patientUniqueId);
});

// Function to check user authentication
firebase.auth().onAuthStateChanged(function(user) {
    if (!user) {
        // Redirect to login page if user is not authenticated
        window.location.href = "login.html";
    }
});
// Function to show the appointment form
function showAppointmentForm() {
    const uniqueId = prompt("Please enter the last 5 digits of your phone number as your unique ID:", "");
    if (uniqueId === null || uniqueId.length !== 5 || isNaN(uniqueId)) {
        alert("Invalid unique ID. Please enter the last 5 digits of your phone number.");
        return;
    }

    const name = prompt("Please enter your name:", "");
    if (!name) {
        alert("Name is required.");
        return;
    }

    const appointmentTime = prompt("Please enter your name , contact number and the date you want appointment for (separate all these with commas) ", "");
    if (!appointmentTime) {
        alert("name , date , contact information is required.");
        return;
    }

    // Save the appointment details to the database (You can modify this part)
    saveAppointmentToDatabase(uniqueId, name, appointmentTime);

    const userId = uniqueId; // For simplicity, using uniqueId as userId
    const appointmentRef = firebase.database().ref("appointments").child(userId);

    appointmentRef.push({
        name: name,
        appointmentTime: appointmentTime,
        bookedAt: firebase.database.ServerValue.TIMESTAMP // Timestamp of booking
    });


    alert("Appointment request sent successfully! our staff will contact you soon..");
}

// Function to save appointment details to the database
function saveAppointmentToDatabase(uniqueId, name, appointmentTime) {
    // Here, you can use Firebase or any other database logic to save the appointment details
    // For the sake of example, let's log the details to the console
    console.log("Unique ID:", uniqueId);
    console.log("Name:", name);
    console.log("Appointment Time:", appointmentTime);
}
// Function to show the medical history in a timeline format
// Function to show the medical history in a timeline format
// Function to show the medical history in a timeline format with treatment titles and timestamps
function showMedicalHistory() {
    const uniqueId = prompt("Please enter the last 5 digits of your phone number as your unique ID:", "");
    if (uniqueId === null || uniqueId.length !== 5 || isNaN(uniqueId)) {
        alert("Invalid unique ID. Please enter the last 5 digits of your phone number.");
        return;
    }

    const patientRef = firebase.database().ref("patients").child(uniqueId);
    patientRef.child("medicalHistory").once("value").then(function(snapshot) {
        // Clear previous medical history entries
        const medicalHistoryList = document.getElementById("medicalHistoryTimeline");
        medicalHistoryList.innerHTML = "";

        snapshot.forEach(function(childSnapshot) {
            const treatment = childSnapshot.val();
            const treatmentTitle = treatment.treatment;
            const treatmentTimestamp = new Date(treatment.timestamp).toLocaleString(); // Convert timestamp to a readable date and time

            // Create a timeline item container
            const timelineItem = document.createElement("div");
            timelineItem.classList.add("timeline-item");

            // Add the treatment title
            const timelineContent = document.createElement("div");
            timelineContent.classList.add("timeline-content");
            timelineContent.textContent = treatmentTitle;

            // Add the "More Details" button
            const moreDetailsBtn = document.createElement("button");
            moreDetailsBtn.classList.add("more-details-btn");
            moreDetailsBtn.textContent = "More Details";
            moreDetailsBtn.onclick = function () {
                showMoreDetails(treatment); // Function to display more details
            };
            timelineContent.appendChild(moreDetailsBtn);

            // Add the treatment timestamp to the right side with bold style
            const timestampSpan = document.createElement("span");
            timestampSpan.classList.add("timeline-timestamp");
            timestampSpan.classList.add("bold-text");
            timestampSpan.textContent = treatmentTimestamp;
            timelineItem.appendChild(timelineContent);
            timelineItem.appendChild(timestampSpan);

            // Append the timeline item to the medical history list
            medicalHistoryList.appendChild(timelineItem);
        });

        // Add the "Generate Bill" button at the bottom
        const generateBillBtn = document.createElement("button");
        generateBillBtn.classList.add("generate-bill-btn");
        generateBillBtn.textContent = "Generate Bill";
        generateBillBtn.onclick = function () {
            generateBill(uniqueId);
        };
        medicalHistoryList.appendChild(generateBillBtn);

        // Show the medical history section
        const medicalHistorySection = document.getElementById("medicalHistorySection");
        medicalHistorySection.style.display = "block";
    });
}
// Function to show the medical history in a timeline format with treatment titles and timestamps
function showMedicalHistory() {
    const uniqueId = prompt("Please enter the last 5 digits of your phone number as your unique ID:", "");
    if (uniqueId === null || uniqueId.length !== 5 || isNaN(uniqueId)) {
        alert("Invalid unique ID. Please enter the last 5 digits of your phone number.");
        return;
    }

    const patientRef = firebase.database().ref("patients").child(uniqueId);
    patientRef.child("medicalHistory").once("value").then(function(snapshot) {
        // Clear previous medical history entries
        const medicalHistoryList = document.getElementById("medicalHistoryTimeline");
        medicalHistoryList.innerHTML = "";

        snapshot.forEach(function(childSnapshot) {
            const treatment = childSnapshot.val();
            const treatmentTitle = treatment.treatment;
            const treatmentTimestamp = new Date(treatment.timestamp).toLocaleString(); // Convert timestamp to a readable date and time

            // Create a timeline item container
            const timelineItem = document.createElement("div");
            timelineItem.classList.add("timeline-item");

            // Add the treatment title
            const timelineContent = document.createElement("div");
            timelineContent.classList.add("timeline-content");
            timelineContent.textContent = treatmentTitle;

            // Add the "More Details" button
            const moreDetailsBtn = document.createElement("button");
            moreDetailsBtn.classList.add("more-details-btn");
            moreDetailsBtn.textContent = "";
            moreDetailsBtn.onclick = function () {
                showMoreDetails(treatment); // Function to display more details
            };
            timelineContent.appendChild(moreDetailsBtn);

            // Add the treatment timestamp to the right side with bold style
            const timestampSpan = document.createElement("span");
            timestampSpan.classList.add("timeline-timestamp");
            timestampSpan.classList.add("bold-text");
            timestampSpan.textContent = treatmentTimestamp;
            timelineItem.appendChild(timelineContent);
            timelineItem.appendChild(timestampSpan);

            // Append the timeline item to the medical history list
            medicalHistoryList.appendChild(timelineItem);
        });

        // Add the "Generate Bill" button at the bottom
        const generateBillBtn = document.createElement("button");
        generateBillBtn.classList.add("generate-bill-btn");
        generateBillBtn.textContent = "Generate Bill";
        generateBillBtn.onclick = function () {
            generateBill(uniqueId);
        };
        medicalHistoryList.appendChild(generateBillBtn);

        // Show the medical history section
        const medicalHistorySection = document.getElementById("medicalHistorySection");
        medicalHistorySection.style.display = "block";
    });
}

// Function to display more details of a specific treatment
function showMoreDetails(treatment) {
    // Create a popup container
    const popupContainer = document.createElement("div");
    popupContainer.classList.add("popup-container");

    // Create a close button for the popup
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.onclick = function () {
        document.body.removeChild(popupContainer);
    };

    // Create a div for treatment details
    const detailsDiv = document.createElement("div");
    detailsDiv.classList.add("treatment-details");

    // Add treatment details to the div
    detailsDiv.innerHTML = `
        <p><strong>Treatment:</strong> ${treatment.treatment}</p>
        <p><strong>Medication:</strong> ${treatment.medication}</p>
        <p><strong>Cost:</strong> ${treatment.cost}</p>
    `;

    // Append close button and details to the popup container
    popupContainer.appendChild(closeButton);
    popupContainer.appendChild(detailsDiv);

    // Append the popup container to the body or any other container
    document.body.appendChild(popupContainer);
}


// Function to save appointment details to the database (used in generateBill function)
function saveAppointmentToDatabase(uniqueId, name, appointmentTime) {
    // Here, you can use Firebase or any other database logic to save the appointment details
    // For the sake of example, let's log the details to the console
    console.log("Unique ID:", uniqueId);
    console.log("Name:", name);
    console.log("Appointment Time:", appointmentTime);
}

// Function to generate a bill using medical history


// Modify the generateBill function to apply styles
// Modify the generateBill function to apply styles
function generateBill(uniqueId) {
    const patientRef = firebase.database().ref("patients").child(uniqueId);
    patientRef.child("medicalHistory").limitToLast(1).once("value").then(function(snapshot) {
        // Check if there is any treatment in the medical history
        if (snapshot.exists()) {
            // Get the last treatment from the object
            const lastTreatment = Object.values(snapshot.val())[0];
            const treatmentDate = new Date(lastTreatment.timestamp).toLocaleDateString();

            const billContainer = document.createElement("div");
            billContainer.classList.add("bill-container");

            // Create a section for the last treatment in the bill
            const treatmentSection = document.createElement("div");
            treatmentSection.classList.add("treatment-section");

            // Add treatment details to the section
            treatmentSection.innerHTML = `
                <div class="bill-header">Patient Medical Bill</div>
                <div class="bill-date">Date: ${treatmentDate}</div>
                <div class="problem">Problem: ${lastTreatment.problem}</div>
                <div class="treatment">Treatment: ${lastTreatment.treatment}</div>
                <div class="medications">Medications: ${lastTreatment.medication}</div>
                <div class="cost">Cost: ${lastTreatment.cost}</div>
            `;

            // Append the treatment section to the bill container
            billContainer.appendChild(treatmentSection);

            // Delay execution of html2canvas
            setTimeout(function () {
                html2canvas(billContainer).then(function (canvas) {
                    // Convert canvas to data URL
                    const imageDataUrl = canvas.toDataURL("image/png");

                    // Create a link to download the image
                    const downloadLink = document.createElement("a");
                    downloadLink.href = imageDataUrl;
                    downloadLink.download = "patient_bill.png";
                    downloadLink.click();
                });
            }, 500); // Adjust the delay time as needed

            // Append the billContainer to the body or any other container
            document.body.appendChild(billContainer);
        } else {
            alert("No treatment found in the medical history.");
        }
    });
}
