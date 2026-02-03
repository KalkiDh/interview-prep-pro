# InterviewIQ 🎯

**AI Interview Practice Platform**

An AI-powered interview simulator that analyzes your speech, body language, and answers in real-time to help you ace job interviews through personalized feedback and progress tracking.

## 🌟 Features

### Current Features (MVP)
- 🎤 **Real-time Interview Sessions** - Practice with AI-generated questions tailored to your industry
- 📹 **Video Recording** - Record your responses and review your performance
- 🗣️ **Speech-to-Text** - Automatic transcription of your answers using Web Speech API
- 🤖 **AI-Powered Feedback** - Get detailed analysis and suggestions on your responses
- 📊 **Performance Metrics** - Track speech pace, filler words, and answer quality
- 💼 **Industry-Specific Questions** - Choose from Tech, Finance, Marketing, Healthcare, and more
- 📝 **Downloadable Reports** - Save your performance summaries for future reference

### Upcoming Features
- 👁️ Eye contact and facial expression analysis
- 🧍 Body language and posture tracking
- 📈 Long-term progress tracking dashboard
- 🎯 Company-specific interview prep (FAANG, startups, etc.)
- 👥 Peer review and community feedback
- 📱 Mobile app companion
- 🏆 Achievement system and badges

## 🚀 Demo

🔗 **Live Demo:** [Coming Soon]

![Demo GIF](https://via.placeholder.com/800x450/667eea/ffffff?text=Demo+Video+Coming+Soon)

## 🛠️ Tech Stack

### Frontend
- **Framework:** React.js / Next.js
- **Styling:** Tailwind CSS / shadcn/ui
- **Video/Audio:** MediaRecorder API, WebRTC
- **Speech Recognition:** Web Speech API

### Backend
- **Runtime:** Node.js / Python FastAPI
- **AI Integration:** Anthropic Claude API / OpenAI API
- **Real-time:** WebSocket

### Database & Storage
- **Database:** PostgreSQL / MongoDB
- **Cache:** Redis
- **File Storage:** AWS S3 / Cloudflare R2
- **Local Storage:** Browser localStorage (MVP)

### AI/ML
- **Question Generation:** Claude API
- **Answer Analysis:** Claude API
- **Future:** TensorFlow.js / MediaPipe for facial/pose detection

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Anthropic API key (get it from [Anthropic Console](https://console.anthropic.com/))

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interviewiq.git
   cd interviewiq
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
   VITE_APP_URL=http://localhost:5173
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## 🎮 Usage

1. **Select Your Industry**
   - Choose from Tech, Finance, Marketing, Healthcare, etc.

2. **Choose Interview Type**
   - Behavioral: Focus on past experiences and situations
   - Technical: Industry-specific technical questions
   - Mixed: Combination of both

3. **Set Duration**
   - 5, 10, or 15 minutes practice sessions

4. **Start Interview**
   - Answer AI-generated questions
   - Your video and audio will be recorded
   - Responses are transcribed in real-time

5. **Review Feedback**
   - Watch your performance
   - Read AI analysis of your answers
   - Check metrics (speech pace, filler words, etc.)
   - Download your report

## 📁 Project Structure

```
interviewiq/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Landing/     # Landing page components
│   │   ├── Setup/       # Interview setup components
│   │   ├── Session/     # Active interview components
│   │   └── Feedback/    # Results and feedback components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   │   ├── ai.js        # AI service (Claude API)
│   │   └── speech.js    # Speech recognition service
│   ├── utils/           # Utility functions
│   ├── styles/          # Global styles
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── README.md           # This file
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write clear commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

## 🐛 Known Issues

- [ ] Speech recognition may not work on all browsers (best on Chrome/Edge)
- [ ] Video recording has size limits in localStorage (working on cloud storage)
- [ ] Mobile browser support is limited in current version

## 📝 Roadmap

- [x] Basic interview session with AI questions
- [x] Video recording and playback
- [x] Speech-to-text transcription
- [x] AI feedback generation
- [ ] User authentication and accounts
- [ ] Progress tracking dashboard
- [ ] Facial expression analysis
- [ ] Body language tracking
- [ ] Mobile app development
- [ ] Company-specific question banks
- [ ] Community features and peer review

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Anthropic Claude API for AI-powered question generation and feedback
- Web Speech API for speech recognition
- MediaRecorder API for video/audio recording
- The open-source community for amazing tools and libraries

## 📧 Contact & Support

Have questions or suggestions? Feel free to:
- Open an issue
- Submit a pull request
- Email me at your.email@example.com

---

⭐ **If you find this project helpful, please give it a star!** ⭐

Made with ❤️ for job seekers everywhere
