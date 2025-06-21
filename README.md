# Real-Time Chat Application

A modern, real-time chat application built with Node.js, Express, and Socket.io. Features a beautiful, responsive UI with real-time messaging, typing indicators, and user management.

## 🚀 Features

- **Real-time messaging** - Instant message delivery using Socket.io
- **User management** - See who's online and when users join/leave
- **Typing indicators** - Know when someone is typing
- **Modern UI** - Beautiful, responsive design with smooth animations
- **User avatars** - Visual representation of users with initials
- **System messages** - Notifications for user join/leave events
- **Connection status** - Real-time connection indicator
- **Mobile responsive** - Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Real-time**: Socket.io
- **Styling**: Custom CSS with gradients and animations
- **Icons**: Font Awesome

## 📦 Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd realtime-chat-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. **Enter your name** - Type your username in the welcome modal
2. **Join the chat** - Click "Join Chat" to enter the conversation
3. **Start messaging** - Type your message and press Enter or click the send button
4. **See who's online** - View the online users sidebar
5. **Watch for typing** - See when others are typing
6. **Leave when done** - Click "Leave" to exit the chat

## 📁 Project Structure

```
realtime-chat-app/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styles
│   └── script.js       # Client-side JavaScript
├── server.js           # Express server with Socket.io
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔧 Configuration

The application runs on port 3000 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## 🌟 Key Features Explained

### Real-time Communication
- Uses Socket.io for bidirectional communication
- Messages are broadcast to all connected users instantly
- Connection status is monitored and displayed

### User Management
- Tracks all connected users in real-time
- Shows user avatars with initials
- Displays join/leave notifications

### Typing Indicators
- Shows when someone is typing
- Automatically hides after 1 second of inactivity
- Supports multiple users typing simultaneously

### Responsive Design
- Works on desktop, tablet, and mobile
- Adaptive layout that hides sidebar on small screens
- Touch-friendly interface

## 🎨 UI Features

- **Gradient backgrounds** - Modern purple gradient theme
- **Smooth animations** - Message slide-in and button hover effects
- **Custom scrollbars** - Styled scrollbars for better UX
- **Loading states** - Visual feedback for all interactions
- **Error handling** - User-friendly error messages

## 🔒 Security Features

- **XSS Protection** - HTML escaping for user messages
- **Input validation** - Username length and content validation
- **CORS enabled** - Cross-origin resource sharing configured

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Variables
- `PORT` - Server port (default: 3000)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- Font Awesome for icons
- Modern CSS techniques for beautiful UI

## 📞 Support

If you encounter any issues or have questions, please open an issue in the repository.

---

**Happy Chatting! 💬** 