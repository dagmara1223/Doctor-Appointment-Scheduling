# ✉️ Healthcare Management & Appointment System  
The application was built with a strong focus on usability, role separation, and real-time data management. It reflects how modern healthcare platforms operate, where multiple user roles interact with shared data while having different permissions and responsibilities.   

The system supports: <br>
🙋‍♀️ Patients  <br>
🧑‍⚕️ Doctors <br>
👨‍💻 Admins <br> 

The frontend is implemented in React, providing a dynamic and responsive user interface. Firebase is used as the backend infrastructure, handling authentication, database storage, and real-time data synchronization.   

## 📅 Main View   
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/e364f019-dc58-4e3c-9692-4dddee1beb79" /> <br>

Upon entering the application, patients are greeted with a **home page** that includes a 
- **login & registration navigation**: <br>
<img width="600" height="700" alt="image" src="https://github.com/user-attachments/assets/122ee060-0fe2-4158-bc81-918fc9b0296e" />    

- **quick health-related quiz**: <br>
<img width="600" height="700" alt="image" src="https://github.com/user-attachments/assets/20fb9db3-48a9-4772-b64d-228656b684d1" /> <br>
The quiz helps engage users and provides a simple self-assessment of their current health condition before booking a visit. <br>

## 📅 Patient View 
Patients have access to a user-friendly interface that allows them to manage their healthcare appointments efficiently. <br> 
### HomeScreen
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/2f05cacf-1a0e-4133-8f86-644498b988e1" /> <br> 
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/aaff0c19-7373-459d-a8cb-9f48d697b03a" />

### List of Doctors  <br>
<img width="700" height="733" alt="image" src="https://github.com/user-attachments/assets/5965d736-e2ef-41ad-bd3b-d12ff90d29c6" />

### Making a reservation <br>
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/44f4320d-310b-49f5-8d41-c03e5e03e74f" /> <br> 

<img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/748bcca9-02d3-478c-9014-e6e52798c7ea" /> <br> 

<img width="600" height="600" alt="image" src="https://github.com/user-attachments/assets/bf0c5aff-222f-4af1-9b2b-4d1120744539" /> <br>

### Cart and Payments List <br>
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/987a53e4-f51b-4cd9-848a-1c23a31c9260" /> <br> 
<br>
🤧 Patients can: <br>
- Book medical appointments
- Cancel scheduled visits
- Leave reviews and ratings for doctors
- Pay for visits immediately or defer payment for later
- View appointment history and visit details

## 📅 Doctor View <br>
Doctors can fully manage their schedules and patient interactions through a dedicated dashboard. <br>

### HomeScreen  <br>
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/f434e9bb-d5a0-496d-908b-10609b680a9a" /> <br> 

### My Schedule <br>
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/6b0642a9-1c41-472d-8f2a-0601290afdac" /> <br>

### Schedule Management <br>
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/6466e54c-e4b4-4be7-b6d5-fdfe53d8e702" /> <br> 

- Availability <br>
<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/6b3948ab-db01-4168-9a14-5cb2cc3b0a30" /> <br>

- Absence <br>
<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/946e8014-6a7c-43ee-9ace-15176fa0dd96" /> <br>

🥼 Doctors can: <br>
- Define availability as **single (one-time)** or **recurring**    
- Add whole day absences (Patient will be notified)    
- Respond to patient reviews    
- Remove a booked patient from the schedule if necessary    
- Manage upcoming and past appointments

## 📅 Admin View  
Administrators oversee the entire system and ensure data quality and user safety. <br>
### Admin Panel  
<img width="700" height="700" alt="image" src="https://github.com/user-attachments/assets/526d3151-e1b8-45da-965f-028970dbd990" /> <br>

💫 Admins can: <br>
- Add and manage doctors in the system
- Approve newly registered doctors  
  > A doctor does **not** gain system access until approved by an admin
- Remove inappropriate reviews (e.g. offensive language)
- Ban users for policy violations
- Maintain overall system integrity

## Data & Technology  
<img width="320" height="274" alt="image" src="https://github.com/user-attachments/assets/fdd4b4ab-024b-437c-8f94-d22d64af3793" /> <br>

All application data is securely stored and managed using **Firebase (Google)** services.
### Tech stack highlights:
- **React** – modern, responsive frontend
- **Firebase Authentication** – secure user login and role-based access
- **Firebase Database** – real-time data storage and synchronization
- **Firebase Hosting / Cloud Services** – scalable and reliable backend infrastructure   <br>

## 🔧 How to run    

1. Clone the repository <br>
```
git clone https://github.com/dagmara1223/Doctor-Appointment-Scheduling.git 
cd Doctor-Appointment-Scheduling 
```
2. Install dependencies <br>
```
npm install
```
3. Set up your Firebase project <br>
- Go to Firebase Console and create a new project.
- Enable the following services: <br>
-- Authentication (Email/Password)<br>
-- Firestore Database<br>
-- (Optional) Firebase Hosting if you want to deploy <br>

Obtain your Firebase configuration (API keys and identifiers) from your project settings. <br>
4. 


 














