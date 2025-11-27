<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Portfolio Desktop

An interactive portfolio website that mimics a desktop operating system interface. Built with React, TypeScript, and Vite, this project presents professional information through a familiar desktop environment with draggable windows, a taskbar, and multiple applications.

## How It Works

This portfolio is designed as a desktop-like interface where visitors can interact with different "applications" to explore your work and background. The project uses a window management system that allows:

- **Draggable Windows**: Each application opens in its own window that can be moved around the screen
- **Window Controls**: Standard desktop controls (minimize, maximize, close) with macOS-style traffic lights
- **Taskbar**: A bottom taskbar shows all open windows and allows quick switching between applications
- **Desktop Icons**: Clickable icons on the desktop launch different applications
- **Z-Index Management**: Windows can be focused and brought to the front by clicking on them

The interface is built with React components and uses state management to handle window positioning, visibility, and interactions.

## What You'll Find

### Applications

- **Terminal**: An interactive terminal interface showcasing command-line interactions
- **Resume**: A PDF viewer displaying the resume document
- **Browser**: A web browser component for exploring portfolio content
- **Game**: An interactive game application (CTO Quest)
- **Slack**: A team chat interface component

### Components

- **Window System** (`components/os/`): Core window management components including `Window.tsx` and `Taskbar.tsx`
- **Applications** (`components/apps/`): Individual application components for each desktop app
- **Desktop Icons**: Clickable desktop shortcuts that launch applications
- **Background**: Dynamic background with gradient overlays

### Features

- Fully responsive window management
- Drag-and-drop window positioning
- Window state persistence (minimized, maximized, closed)
- Smooth animations and transitions
- Modern UI with glassmorphism effects

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```
