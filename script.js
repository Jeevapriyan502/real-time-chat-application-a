// DOM Elements
const welcomeModal = document.getElementById('welcomeModal');
const chatContainer = document.getElementById('chatContainer');
const usernameInput = document.getElementById('usernameInput');
const joinBtn = document.getElementById('joinBtn');
const leaveBtn = document.getElementById('leaveBtn');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');
const usersList = document.getElementById('usersList');
const userCount = document.getElementById('userCount');
const connectionStatus = document.getElementById('connectionStatus');
const typingIndicator = document.getElementById('typingIndicator');
const typingUsers = document.getElementById('typingUsers');

// Global variables
let socket;
let currentUsername = '';
let typingTimeout;
let typingUsersSet = new Set();

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    focusUsernameInput();
});

// Event Listeners
function initializeEventListeners() {
    // Join chat
    joinBtn.addEventListener('click', joinChat);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') joinChat();
    });

    // Send message
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Leave chat
    leaveBtn.addEventListener('click', leaveChat);

    // Typing indicators
    messageInput.addEventListener('input', handleTyping);
    messageInput.addEventListener('blur', stopTyping);
}

// Focus username input on load
function focusUsernameInput() {
    usernameInput.focus();
}

// Join Chat Function
function joinChat() {
    const username = usernameInput.value.trim();
    
    if (!username) {
        showError('Please enter a username');
        return;
    }
    
    if (username.length < 2) {
        showError('Username must be at least 2 characters long');
        return;
    }
    
    currentUsername = username;
    initializeSocket();
    showChatInterface();
}

// Initialize Socket.io connection
function initializeSocket() {
    socket = io();
    
    // Connection events
    socket.on('connect', () => {
        updateConnectionStatus(true);
        socket.emit('user-join', currentUsername);
    });
    
    socket.on('disconnect', () => {
        updateConnectionStatus(false);
    });
    
    // Chat events
    socket.on('chat-message', handleIncomingMessage);
    socket.on('user-joined', handleUserJoined);
    socket.on('user-left', handleUserLeft);
    socket.on('users-list', updateUsersList);
    socket.on('user-typing', handleUserTyping);
}

// Show chat interface
function showChatInterface() {
    welcomeModal.classList.add('hidden');
    chatContainer.classList.remove('hidden');
    messageInput.focus();
    
    // Add welcome message
    addSystemMessage(`Welcome to the chat, ${currentUsername}! 👋`);
}

// Update connection status
function updateConnectionStatus(connected) {
    const statusElement = connectionStatus;
    const icon = statusElement.querySelector('i');
    
    if (connected) {
        statusElement.textContent = 'Connected';
        statusElement.className = 'connection-status connected';
        icon.style.color = '#4ade80';
    } else {
        statusElement.textContent = 'Disconnected';
        statusElement.className = 'connection-status disconnected';
        icon.style.color = '#f87171';
    }
}

// Send message
function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    if (socket && socket.connected) {
        socket.emit('chat-message', { message });
        addMessage(message, currentUsername, 'own');
        messageInput.value = '';
        stopTyping();
    }
}

// Handle incoming messages
function handleIncomingMessage(data) {
    if (data.username !== currentUsername) {
        addMessage(data.message, data.username, 'other');
    }
}

// Add message to chat
function addMessage(message, username, type) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    
    const timestamp = new Date().toLocaleTimeString();
    
    messageElement.innerHTML = `
        <div class="message-header">
            <span class="message-author">${username}</span>
            <span class="message-time">${timestamp}</span>
        </div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    
    messages.appendChild(messageElement);
    scrollToBottom();
}

// Add system message
function addSystemMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'message system';
    messageElement.textContent = message;
    
    messages.appendChild(messageElement);
    scrollToBottom();
}

// Handle user joined
function handleUserJoined(data) {
    addSystemMessage(`${data.username} joined the chat 🎉`);
    updateUserCount();
}

// Handle user left
function handleUserLeft(data) {
    addSystemMessage(`${data.username} left the chat 👋`);
    updateUserCount();
}

// Update users list
function updateUsersList(users) {
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<p class="no-users">No users online</p>';
        return;
    }
    
    users.forEach(username => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        
        const avatar = document.createElement('div');
        avatar.className = 'user-avatar';
        avatar.textContent = username.charAt(0).toUpperCase();
        
        const nameElement = document.createElement('span');
        nameElement.className = 'user-name';
        nameElement.textContent = username;
        
        userElement.appendChild(avatar);
        userElement.appendChild(nameElement);
        usersList.appendChild(userElement);
    });
    
    updateUserCount();
}

// Update user count
function updateUserCount() {
    const userItems = usersList.querySelectorAll('.user-item');
    userCount.textContent = userItems.length;
}

// Handle typing indicators
function handleTyping() {
    if (socket && socket.connected) {
        socket.emit('typing-start');
        
        clearTimeout(typingTimeout);
        typingTimeout = setTimeout(() => {
            stopTyping();
        }, 1000);
    }
}

function stopTyping() {
    if (socket && socket.connected) {
        socket.emit('typing-stop');
    }
    clearTimeout(typingTimeout);
}

// Handle user typing
function handleUserTyping(data) {
    if (data.username === currentUsername) return;
    
    if (data.isTyping) {
        typingUsersSet.add(data.username);
    } else {
        typingUsersSet.delete(data.username);
    }
    
    updateTypingIndicator();
}

// Update typing indicator
function updateTypingIndicator() {
    if (typingUsersSet.size > 0) {
        const users = Array.from(typingUsersSet);
        const userText = users.length === 1 ? users[0] : `${users.slice(0, -1).join(', ')} and ${users[users.length - 1]}`;
        
        typingUsers.textContent = userText;
        typingIndicator.classList.remove('hidden');
    } else {
        typingIndicator.classList.add('hidden');
    }
}

// Leave chat
function leaveChat() {
    if (socket) {
        socket.disconnect();
    }
    
    // Reset state
    currentUsername = '';
    messages.innerHTML = '';
    usersList.innerHTML = '<p class="no-users">No users online</p>';
    userCount.textContent = '0';
    typingUsersSet.clear();
    updateTypingIndicator();
    
    // Show welcome modal
    chatContainer.classList.add('hidden');
    welcomeModal.classList.remove('hidden');
    usernameInput.value = '';
    focusUsernameInput();
}

// Scroll to bottom of messages
function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}

// Show error message
function showError(message) {
    // Create a temporary error message
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ef4444;
        color: white;
        padding: 1rem;
        border-radius: 8px;
        z-index: 1001;
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    document.body.appendChild(errorDiv);
    
    // Remove after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add CSS animation for error messages
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (socket) {
        socket.disconnect();
    }
});

// Auto-scroll to bottom when new messages arrive
const messagesObserver = new MutationObserver(() => {
    scrollToBottom();
});

// Start observing messages container
setTimeout(() => {
    if (messages) {
        messagesObserver.observe(messages, {
            childList: true,
            subtree: true
        });
    }
}, 100); 