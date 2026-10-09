# Orchidify — Management Web Portal

The management frontend for **Orchidify**, a graduation capstone developed by a five-member team in 2024 at FPT University.

Orchidify supports the organisation and delivery of **in-person orchid care courses** through connected web and mobile applications and shared backend services. “Offline courses” refers to face-to-face learning, rather than offline application functionality.

This repository contains the management website. The backend and mobile applications are maintained in separate repositories.

## Project Scope

- **Course and Class Management:** Organising courses, classes, schedules, and related learning activities.
- **Learner Workflows:** Course enrollment, payments, attendance, assignments, and progress tracking.
- **Instructor and Staff Workflows:** Supporting teaching activities, garden management, instructor payouts, and reporting.
- **Web, Mobile, and API:** Connecting the management website and mobile applications through shared backend services.

These describe the overall team project. The features below describe this management frontend specifically.

## Management Features

- Dashboard and management statistics.
- Course catalog, course packages, sessions, and learning resources.
- Class records and class-opening requests.
- Learner and instructor records.
- Staff and garden manager administration.
- Garden information and scheduling.
- Instructor recruitment and payout requests.
- Transaction records and reporting.
- Role-based navigation for Admin, Staff, and Garden Manager accounts.

Available screens and actions depend on the signed-in user's role and the connected API.

## My Contributions

**Nguyen Thi Thanh Hao**

- Collaborated on requirements analysis, Software Requirements Specification (SRS) documentation, and system design diagrams.
- Took primary responsibility for UI design and frontend development of the management web modules.
- Integrated REST APIs and implemented interfaces supporting management workflows.
- Participated in system testing across the management website, learner website, and learner mobile application, and fixed frontend defects.

Orchidify is a team project. The responsibilities above describe my individual contributions; other team members contributed to the backend services and other application clients.

## Technology Stack

| Area                  | Technologies                                 |
| --------------------- | -------------------------------------------- |
| Frontend              | React 18, TypeScript                         |
| Development and build | Vite                                         |
| UI and styling        | Material UI, Emotion                         |
| Routing               | React Router                                 |
| API integration       | Axios                                        |
| Code quality          | ESLint, Prettier                             |
| External integrations | Cloudinary uploads, Firebase Cloud Messaging |

## Running Locally

### Prerequisites

- Node.js and npm compatible with the project's Vite version.
- A running Orchidify API.
- A management account provisioned by the backend.
- Configuration for the Firebase and Cloudinary integrations used by the application.

### 1. Install dependencies

After cloning this repository, open its root directory and run:

```bash
npm ci
```

### 2. Configure environment variables

Create a `.env.local` file in the project root. Use `.sample.env` as a reference and provide the values required by your environment:

```dotenv
VITE_API_URL=https://your-orchidify-api.example.com

VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset

VITE_FIREBASE_API_KEY=your-firebase-web-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
VITE_FIREBASE_VAPID_KEY=your-public-web-push-key
```

Use the API base URL expected by the backend, including any configured path prefix. Restart the development server after changing environment variables.

Variables prefixed with `VITE_` are included in the browser build. Do not place database credentials, private service-account keys, or backend secrets in them.

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite.

Management features require a reachable backend and a valid account. The API must allow requests from the frontend origin through its CORS configuration.

## Available Commands

| Command            | Purpose                                                        |
| ------------------ | -------------------------------------------------------------- |
| `npm run dev`      | Start the development server                                   |
| `npm run build`    | Run TypeScript build checks and generate the production bundle |
| `npm run preview`  | Preview the production build locally                           |
| `npm run lint`     | Run ESLint                                                     |
| `npm run lint:fix` | Apply automatic ESLint fixes                                   |
| `npm run prettier` | Format the configured source files                             |

## Deployment

Build the frontend:

```bash
npm run build
```

Deploy the generated `dist` directory to a static hosting provider.

- Set the required environment variables before building.
- Configure routing fallback to `index.html` for client-side routes.
- Allow the deployed frontend origin in the API's CORS configuration.
- Keep the backend available for login and data-dependent workflows.

Deploying this frontend does not deploy the API or database.

## Related Repositories

- [Management Web](https://github.com/Deco-Team/orchidify-management)
- [Backend API](https://github.com/Deco-Team/orchidify-api)
- [Learner Mobile](https://github.com/Deco-Team/orchidify-mobile-learner)
- [Instructor Mobile](https://github.com/Deco-Team/orchidify-instructor)

## Academic and Portfolio Context

This repository presents university team project experience and my contributions to requirements analysis, UI design, frontend development, API integration, and testing.

- **Project type:** Graduation capstone
- **University:** FPT University
- **Year:** 2024
- **Team size:** 5 members
- **Development period:** Approximately 4 months
- **Personal GitHub:** [haonguyenn929](https://github.com/haonguyenn929)

The application was developed as an academic project. Portfolio demonstrations should use demonstration data and dedicated demo accounts.
