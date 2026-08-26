# 💖 LoveProposal & Gift Hub (BestFriend)

An interactive, customizable Next.js web application designed to create unforgettable proposal moments and personalized digital gift experiences. 

![LoveProposal Banner](public/banner.jpg)

---

## ✨ Features

- **💌 Interactive Proposal Screen**: A playful proposal interface featuring a dodging "No" button, playful micro-interactions, and a grand confetti explosion upon saying "Yes!".
- **🎁 Gift Hub**: A central hub unlocking three personalized gift experiences after proposal acceptance.
- **📸 Photo Memories Gallery**: Interactive photo slideshow and gallery to showcase cherished memories.
- **🎵 Music Player View**: Integrated music player supporting custom YouTube video soundtracks.
- **✉️ Love Letter Experience**: An animated envelope that opens to reveal a heart-felt, customizable love letter.
- **🪄 Instant Customization & URL Sharing**: Built-in modal to customize names, letters, music, and photos on the fly. Generates a self-contained, shareable link with encoded payload parameters (no database required!).
- **☁️ Cloudinary Integration**: Support for instant, unsigned image uploads via Cloudinary to easily add memory photos.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Media Upload**: [Cloudinary Unsigned API](https://cloudinary.com/)

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js (v18.x or later) and npm installed.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RishabhMalviya75/BestFriend.git
   cd BestFriend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables (Optional for Cloudinary photo upload):**
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Cloudinary credentials if enabling image upload:
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
   NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📂 Project Structure

```
BestFriend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styling & Tailwind directives
│   │   ├── layout.tsx           # App layout wrapper & metadata
│   │   └── page.tsx             # Main page state manager & router
│   ├── components/
│   │   ├── ProposalState.tsx    # Interactive proposal view
│   │   ├── GiftHubState.tsx     # Central gift selection hub
│   │   ├── PhotoMemoriesView.tsx# Photo gallery component
│   │   ├── MusicPlayerView.tsx  # Music & YouTube player component
│   │   ├── LoveLetterView.tsx   # Interactive animated letter component
│   │   ├── CreateModal.tsx      # Customization & share link generator
│   │   └── CuteStickers.tsx     # Decorative UI stickers
│   └── lib/
│       ├── giftData.ts          # Gift data structure & URL encoder/decoder
│       └── cloudinary.ts        # Cloudinary image upload utility
├── public/                      # Static assets & images
├── package.json
└── README.md
```

---

## 📝 Available Scripts

In the project directory, you can run:

- `npm run dev`: Runs the app in development mode at [http://localhost:3000](http://localhost:3000).
- `npm run build`: Builds the production application for deployment.
- `npm run start`: Starts the Next.js production server.
- `npm run lint`: Runs ESLint check across project files.

---

## 💖 Customization & Sharing Guide

1. Click the **"Customize & Share ✏️"** button in the header.
2. Enter your partner's name, personalized love letter, YouTube music link, and photo URLs (or upload via Cloudinary).
3. Click **"Apply Changes & Preview Now"** to test your gift.
4. Copy the generated link to send a customized version directly to your special someone!

---

## 📄 License

This project is licensed under the ISC License.

Made with ❤️ by Rishabh Malviya.
