# Numal – AI-Guided Mindfulness App 🧘‍♂️✨

Numal is a mobile mindfulness application that combines **AI-guided voice conversations**, **immersive visual sessions**, and **session summaries** to help users build a consistent mindfulness practice.

The app is built using **Expo + React Native**, integrates **real-time AI voice conversations**, and persists user session history using **Appwrite**.

---

## 🚀 Features

- 🎧 **AI-guided voice meditation**
  - Real-time conversational sessions powered by ElevenLabs
  - Adaptive responses based on session context

- 🌄 **Immersive session experiences**
  - Visual meditation themes (Forest View, Sunrise Sky, Mountain Path, etc.)
  - Parallax scrolling and gradient overlays for a calm UX

- 🧠 **Session summaries**
  - Automatically generated call summaries and transcripts
  - Duration, token usage, and metadata tracking

- 👤 **User authentication**
  - Secure authentication using Clerk
  - Session history scoped per user

- 📊 **Session history**
  - Persisted using Appwrite
  - View recent sessions and summaries directly in the app

---

## 🛠 Tech Stack

**Frontend**
- Expo (Development Build)
- React Native
- TypeScript
- Expo Router
- Reanimated (for parallax & animations)

**Backend / Services**
- ElevenLabs (AI voice conversations)
- Appwrite (Database & session persistence)
- Clerk (Authentication)

**Native / Platform**
- iOS (Prebuilt Expo project)
- Hermes engine
- LiveKit WebRTC (audio streaming)

---

## 📱 Screens & UX Highlights

- Parallax header with animated scaling
- Gradient-based visual feedback during active conversations
- Graceful handling of connection failures and session termination
- Optimized for iOS devices

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/numal-mindfulness.git
cd numal-mindfulness
