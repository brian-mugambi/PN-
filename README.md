# Profile Network

Profile Network is a profile-based social platform built with React, TypeScript, Vite, and Firebase. Users can create a public profile, share their work and posts, connect through messages, and present portfolio or shop content from one place.

Public profiles use the URL format:

`/profile/{username}`

## Features

- Public profiles with shareable links
- Account authentication and profile management
- Posts and conversations
- Inbox and messaging
- Portfolio sections and shop items
- Profile sharing and QR codes
- Responsive interface
- Offline-aware data access
- Installable web app support
- Reporting, legal pages, and onboarding tour

## Built with

- React 18
- TypeScript
- Vite
- Firebase Authentication
- Cloud Firestore
- Vercel

## Getting started

### Requirements

- Node.js
- npm
- A Firebase project

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Vite will print the local URL in your terminal.

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Firebase

Firebase is configured in `src/firebase/profileFirebase.ts`. The app uses Firebase Authentication and Cloud Firestore. Set up your Firebase project and configure the authentication providers and Firestore database for your deployment.

## Routes

| Route | Description |
| --- | --- |
| `/` | Home and dashboard |
| `/profiles` | Home and dashboard |
| `/profile/{username}` | Public profile |
| `/profile/{username}/ad` | Profile advertisement view |

## Project structure

```text
src/
├── App.tsx
├── main.tsx
├── firebase/
│   └── profileFirebase.ts
├── styles/
│   └── index.css
└── profile/
    ├── ProfileNetwork.tsx
    ├── profile.css
    ├── crypto.ts
    ├── validators.ts
    ├── lib/
    ├── ui/
    ├── features/
    │   ├── auth/
    │   ├── dashboard/
    │   ├── public/
    │   ├── posts/
    │   ├── messages/
    │   ├── inbox/
    │   ├── portfolio/
    │   ├── shop/
    │   ├── share/
    │   ├── tour/
    │   └── legal/
    └── styles/
public/
vercel.json
```

## Deployment

The project includes a `vercel.json` configuration for deployment on Vercel.

1. Import the repository into Vercel.
2. Set the build command to `npm run build`.
3. Set the output directory to `dist`.
4. Deploy the project.

Make sure the Firebase project is configured for the deployed domain.
