# CollabStudy 

### Study Smarter, Together.

CollabStudy is a collaborative study-group platform designed for students at **Addis Ababa University (AAU)**. It aims to help students connect with classmates, form study groups, share academic resources, and work together to achieve their academic goals.

Finding the right study partners can be challenging, especially when students have different schedules, courses, and academic interests. CollabStudy aims to make this process easier by providing a centralized platform where students can discover existing study groups or create their own.

Live Demo

https://collab-study-snowy.vercel.app/

##  Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Running the Application](#-running-the-application)
- [How to Use CollabStudy](#-how-to-use-collabstudy)
- [Development Status](#-development-status)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [Team](#-team)

##  Project Overview

CollabStudy is a university-focused web application developed to encourage collaborative learning among AAU students.

The platform is designed around the idea that studying together can help students understand difficult subjects, exchange knowledge, stay motivated, and prepare more effectively for examinations.

Students will be able to create accounts, find study partners, organize group sessions, communicate with group members, and access AI-powered academic assistance through a single platform.

**Project goals:**

- Make it easier for students to find compatible study partners.
- Simplify the creation and organization of study groups.
- Encourage collaboration and knowledge sharing.
- Provide a convenient space for group communication.
- Explore the use of AI to support students in their learning process.

##  Key Features

### 1. Landing Page
- Introduces the CollabStudy platform and its purpose.
- Highlights the benefits of collaborative learning.
- Explains how students can use the platform.
- Provides navigation to registration and login.

### 2. User Registration
- Provides a signup interface for new users.
- Collects a username, AAU email address, password, department, and academic year.
- Includes client-side form validation.
- Supports the planned AAU email restriction.

### 3. User Login
- Provides a login interface for returning users.
- Validates required fields and email format.
- Designed to connect with the platform's authentication functionality.

### 4. Study Group Creation
- Allows users to enter a group name, course or subject, and description.
- Provides meeting-time options.
- Allows users to select preferred meeting days.
- Includes a maximum-members control.
- Provides an interface for inviting members by email.
- Includes validation for required group information.

### 5. Student Dashboard
- Serves as the planned central workspace for students.
- Provides access to study groups and other platform features.
- Connects the main areas of the application through navigation.

### 6. Group Page and Communication
- Designed to display study-group information and members.
- Provides a planned space for group conversations and collaboration.

### 7. AI Study Assistant
- Includes a dedicated interface for students to interact with an AI assistant.
- Intended to help students ask academic questions and understand difficult concepts.

### 8. User Profile
- Provides a dedicated page for student profile information.
- Intended to help students manage and display their academic details.

> **Note:** The availability of individual features depends on their implementation stage. Interfaces and client-side demonstrations do not necessarily mean that backend services, persistent storage, authentication, real-time messaging, or AI services are fully connected.

##  Technology Stack

### Frontend
- **React** — building the user interface with reusable components.
- **JavaScript (ES6+)** — application logic and interactive behavior.
- **HTML5** — page structure.
- **CSS3** — layouts, styling, and responsive design.
- **React Router** — navigation between application pages.
- **Local Storage** — temporary client-side storage for prototype functionality.

### Backend
The project includes a separate backend directory intended for server-side functionality. The backend technology and implemented services should be documented here as development progresses.

### Development Tools
- **Git** — version control.
- **GitHub** — source-code hosting and team collaboration.
- **Visual Studio Code** — code editing and development.
- **Node.js and npm** — running the React development environment and managing dependencies.

##  Project Structure

The repository is organized into separate frontend and backend directories.

```text
CollabStudy-FullStack/
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── images/
│   │   │
│   │   ├── pages/
│   │   │   ├── Index.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateGroup.jsx
│   │   │   ├── GroupPage.jsx
│   │   │   ├── MyProfile.jsx
│   │   │   └── AI.jsx
│   │   │
│   │   ├── styles/
│   │   │   ├── general.css
│   │   │   ├── index.css
│   │   │   ├── login.css
│   │   │   ├── signup.css
│   │   │   ├── dashboard.css
│   │   │   ├── createGroup.css
│   │   │   ├── groupPage.css
│   │   │   ├── myProfile.css
│   │   │   └── ai.css
│   │   │
│   │   ├── App.js
│   │   └── index.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── backend/
│   └── ...
│
└── README.md
```

*The structure above illustrates the expected organization of the project. Individual files and folders may differ as development continues.*

##  Getting Started

Follow these instructions to run the frontend locally.

### Prerequisites

Make sure the following tools are installed:

- [Node.js](https://nodejs.org/)
- npm, which is included with Node.js
- [Git](https://git-scm.com/)
- [Visual Studio Code](https://code.visualstudio.com/) or another code editor

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/MisganaYonas/CollabStudy-FullStack.git
```

### 2. Open the Frontend Directory

```bash
cd CollabStudy-FullStack/frontend
```

### 3. Install Dependencies

```bash
npm install
```

This installs the dependencies listed in `package.json` and uses the lockfile to resolve their versions.

### 4. Start the Development Server

```bash
npm start
```

The application should open in your browser at:

http://localhost:3000

If it does not open automatically, enter the address manually.

**Important:** Run these commands from the `frontend` directory, where the React application's `package.json` is located.

## 💻 Running the Application

Once the development server is running, you can navigate through the available pages using the application's links and buttons.

The main routes configured in the React application are:

| Page | Route |
|---|---|
| Landing Page | `/` |
| Login | `/login` |
| Signup | `/signup` |
| Dashboard | `/dashboard` |
| Create Study Group | `/createGroup` |
| Group Page | `/groupPage` |
| User Profile | `/myProfile` |
| AI Assistant | `/ai` |

Routes are handled by React Router.

Some features may currently use client-side validation or browser storage rather than a connected backend.

##  How to Use CollabStudy

The intended user journey is:

1. **Register:** Create an account using the required student information.
2. **Log in:** Access the platform through the login page.
3. **Explore:** Navigate to the dashboard and explore study-group options.
4. **Create or join a group:** Specify a course, meeting schedule, and group preferences.
5. **Collaborate:** Connect with other students and use the group workspace.
6. **Get study assistance:** Access the AI assistant interface for academic support.

The exact functionality available at each stage depends on the current development status.

##  Development Status

CollabStudy is a work in progress.

The team is developing the frontend pages and integrating the different components into one React application.

Current development areas include:

- Building and refining the landing, login, and signup pages.
- Developing the study-group creation interface.
- Integrating the dashboard, group page, profile, and AI assistant.
- Maintaining consistent styling and navigation across pages.
- Coordinating shared files and changes through Git and GitHub.
- Preparing the application for backend integration.

The goal is to evolve the current application into a complete, reliable platform for collaborative university learning.

##  Future Improvements

Planned improvements may include:

- Secure user authentication and account management.
- Persistent database storage for users and study groups.
- AAU student email verification.
- Searching and filtering groups by course, department, year, and availability.
- Joining and leaving study groups.
- Member invitation and group-management functionality.
- Real-time group messaging.
- Sharing notes, documents, and other learning resources.
- AI-powered academic assistance through an integrated AI service.
- User profiles and group ratings.
- Improved mobile responsiveness, accessibility, and usability.
- Deployment to a production hosting environment.

##  Contributing

CollabStudy is developed collaboratively using Git and GitHub.

To contribute:

1. Clone the repository.
2. Check out the agreed development branch.
3. Pull the latest changes before starting work.
4. Make changes within your assigned files where possible.
5. Test your changes locally.
6. Review `git status` and inspect your changes before committing.
7. Commit your work with a clear, descriptive message.
8. Coordinate with the team before pushing changes to shared files such as `App.js`, `package.json`, and `package-lock.json`.

Avoid force-pushing to shared branches unless the team has explicitly agreed and the consequences are understood.

##  Team

**CollabStudy Development Team**

Developed as a collaborative software project focused on improving student learning and academic cooperation at Addis Ababa University.

##  License

No license has been specified yet. Unless a license is added to the repository, the project's reuse and redistribution permissions should not be assumed.

---

**CollabStudy — Study Smarter, Together.**
