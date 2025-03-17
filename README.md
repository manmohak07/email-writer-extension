# Email Reply Generator

A complete toolkit for quickly generating contextual email replies, available as both a web application and a Gmail extension.

## What is this?

Ever stared at an email for too long, wondering how to respond? This project makes it easy to generate well-crafted email replies based on the content of the emails you receive. Just paste in the original email, choose a tone (professional, friendly, or casual), and get a thoughtful reply in seconds.

## Features

- **Web Application**: A clean, responsive interface to generate email replies from your browser
- **Gmail Extension**: Integrates directly into Gmail for one-click reply generation
- **Tone Selection**: Customize your replies with different communication styles
- **Dark/Light Mode**: Easy on the eyes, whatever your preference

## Project Structure

The project consists of three main components:

### 1. Backend (Spring Boot)

Located in the `email-writer` folder, this Java-based backend handles the actual email reply generation. It processes the original email text and desired tone, then crafts an appropriate response.

### 2. Web Application (React)

Found in the `email-writer-react` folder, this modern React application provides a user-friendly interface for generating email replies. Features include:

- Simple copy/paste functionality
- Tone selection dropdown
- Light/dark mode toggle
- Mobile-friendly design

### 3. Gmail Extension

Located in the `email-writer-extension` folder, this Chrome extension integrates directly into Gmail, adding an "AI Reply" button and tone selector to your compose window.

## How to Use

### Web Application

1. Open the web application
2. Paste the email you need to reply to in the text box
3. Select your preferred tone (Professional, Friendly, or Casual)
4. Click "Generate Reply"
5. Copy the generated response to your clipboard with one click

### Gmail Extension

1. Install the Chrome extension
2. Open Gmail and start replying to an email
3. Select your preferred tone from the dropdown
4. Click the "AI Reply" button that appears in your compose toolbar
5. The generated reply will be inserted into your compose box

## Getting Started

### Running the Backend

```bash
cd email-writer/email-writer
mvn spring-boot:run
```

The backend service will start on http://localhost:8080.

### Running the Web Application

```bash
cd email-writer-react
npm install
npm run dev
```

The web application will be available at http://localhost:5173.

### Installing the Extension

1. Open Chrome and navigate to chrome://extensions/
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the `email-writer-extension` folder
4. The extension should now be available when you compose emails in Gmail

## Technologies Used

- **Backend**: Java, Spring Boot
- **Frontend**: React, Material UI
- **Extension**: JavaScript, Chrome Extension API

## Why Use This?

- **Save time**: Generate well-structured replies in seconds instead of minutes
- **Maintain consistency**: Ensure a consistent tone in your communications
- **Reduce email stress**: Never stare at a blank reply again

---

Made with ❤️ to make email communication easier for everyone.
