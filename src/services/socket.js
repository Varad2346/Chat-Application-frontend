let socket;
import io from "socket.io-client"
export const connectSocket = () => {

  socket = io('https://chat-application-dvs1.onrender.com', {
    auth: {
      token: localStorage.getItem('token')
    }
  });
  socket.emit();
  socket.on('connection', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });

  return socket;
};

// Utility function to check status
export const isSocketConnected = () => {
  return socket?.connected || false;
};