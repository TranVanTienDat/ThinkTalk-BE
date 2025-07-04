# WebSocket API Documentation

## Kết nối WebSocket với Authentication

Để kết nối với WebSocket server, bạn cần có JWT token từ API login. Có 3 cách để gửi token:

### Cách 1: Qua handshake auth (Khuyến nghị)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  auth: {
    token: 'your-jwt-token-here',
  },
});
```

### Cách 2: Qua query parameters

```javascript
const socket = io('http://localhost:3000?token=your-jwt-token-here');
```

### Cách 3: Qua headers

```javascript
const socket = io('http://localhost:3000', {
  extraHeaders: {
    authorization: 'Bearer your-jwt-token-here',
  },
});
```

## Lấy JWT Token

Trước khi kết nối WebSocket, bạn cần đăng nhập để lấy token:

```javascript
// Đăng nhập để lấy token
const loginResponse = await fetch('/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    device_token: 'device-token',
    type: 'web',
  }),
});

const { user } = await loginResponse.json();
const token = user.accessToken;

// Kết nối WebSocket với token
const socket = io('http://localhost:3000', {
  auth: { token },
});
```

## Các Event có sẵn

### 1. Tạo nhóm chat (`create-group`)

**Emit:**

```javascript
socket.emit('create-group', {
  name: 'Nhóm bạn bè',
  type: 'group',
  chatMembers: [
    { userId: 'user-1', role: 'member' },
    { userId: 'user-2', role: 'member' },
    { userId: 'user-3', role: 'member' },
  ],
});
```

**Lưu ý:** Người tạo nhóm sẽ tự động được thêm vào nhóm với role `admin`.

**Listen:**

```javascript
socket.on('group-created', (response) => {
  if (response.success) {
    console.log('Nhóm đã được tạo:', response.chat);
  } else {
    console.error('Lỗi tạo nhóm:', response.error);
  }
});

// Thông báo cho thành viên mới
socket.on('new-group-created', (data) => {
  console.log('Bạn đã được thêm vào nhóm:', data.chat.name);
  console.log('Người tạo:', data.createdBy);
});
```

### 2. Cập nhật nhóm (`update-group`)

**Emit:**

```javascript
socket.emit('update-group', {
  chatId: 'chat-123',
  updateData: {
    name: 'Tên nhóm mới',
    // các trường khác cần cập nhật
  },
});
```

**Lưu ý:** Chỉ admin mới có quyền cập nhật nhóm.

**Listen:**

```javascript
socket.on('group-updated', (response) => {
  if (response.success) {
    console.log('Nhóm đã được cập nhật:', response.chat);
  } else {
    console.error('Lỗi cập nhật:', response.message);
  }
});

socket.on('group-updated', (data) => {
  console.log('Nhóm đã được cập nhật:', data.message);
  console.log('Người cập nhật:', data.updatedBy);
});
```

### 3. Xóa nhóm (`delete-group`)

**Emit:**

```javascript
socket.emit('delete-group', {
  chatId: 'chat-123',
});
```

**Lưu ý:** Chỉ admin mới có quyền xóa nhóm.

**Listen:**

```javascript
socket.on('group-deleted', (response) => {
  if (response.success) {
    console.log('Nhóm đã được xóa:', response.chatId);
  } else {
    console.error('Lỗi xóa:', response.message);
  }
});

socket.on('group-deleted', (data) => {
  console.log('Nhóm đã bị xóa:', data.message);
  console.log('Người xóa:', data.deletedBy);
});
```

### 4. Lấy thông tin cuộc trò chuyện (`get-conversation`)

**Emit:**

```javascript
socket.emit('get-conversation', {
  chatId: 'chat-123',
});
```

**Listen:**

```javascript
socket.on('conversation-retrieved', (response) => {
  if (response.success) {
    console.log('Thông tin cuộc trò chuyện:', response.conversation);
  } else {
    console.error('Lỗi:', response.message);
  }
});
```

### 5. Tham gia phòng chat (`join-room`)

**Emit:**

```javascript
socket.emit('join-room', {
  chatId: 'chat-123',
});
```

**Listen:**

```javascript
socket.on('room-joined', (response) => {
  console.log('Đã tham gia phòng:', response.roomId);
});

socket.on('room-join-failed', (response) => {
  console.error('Không thể tham gia phòng:', response.message);
});
```

### 6. Rời khỏi phòng chat (`leave-room`)

**Emit:**

```javascript
socket.emit('leave-room', {
  chatId: 'chat-123',
});
```

**Listen:**

```javascript
socket.on('room-left', (response) => {
  console.log('Đã rời khỏi phòng:', response.roomId);
});
```

### 7. Gửi tin nhắn (`send-message`)

**Emit:**

```javascript
socket.emit('send-message', {
  chatId: 'chat-123',
  message: 'Xin chào mọi người!',
  messageType: 'text', // optional, default: 'text'
});
```

**Lưu ý:** Không cần gửi `senderId` vì server sẽ tự động lấy từ token.

**Listen:**

```javascript
socket.on('new-message', (data) => {
  console.log('Tin nhắn mới:', {
    chatId: data.chatId,
    message: data.message,
    senderId: data.senderId,
    senderEmail: data.senderEmail,
    timestamp: data.timestamp,
  });
});

socket.on('message-send-failed', (response) => {
  console.error('Không thể gửi tin nhắn:', response.message);
});
```

## Ví dụ sử dụng hoàn chỉnh

```javascript
import { io } from 'socket.io-client';

class ChatClient {
  constructor(token) {
    this.socket = io('http://localhost:3000', {
      auth: { token },
    });
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Lắng nghe các event từ server
    this.socket.on('group-created', this.handleGroupCreated.bind(this));
    this.socket.on('new-group-created', this.handleNewGroupCreated.bind(this));
    this.socket.on('new-message', this.handleNewMessage.bind(this));
    this.socket.on('room-joined', this.handleRoomJoined.bind(this));
    this.socket.on('room-join-failed', this.handleRoomJoinFailed.bind(this));
    this.socket.on(
      'message-send-failed',
      this.handleMessageSendFailed.bind(this),
    );
  }

  createGroup(groupData) {
    this.socket.emit('create-group', groupData);
  }

  joinRoom(chatId) {
    this.socket.emit('join-room', { chatId });
  }

  sendMessage(chatId, message, messageType = 'text') {
    this.socket.emit('send-message', {
      chatId,
      message,
      messageType,
    });
  }

  handleGroupCreated(response) {
    if (response.success) {
      console.log('Nhóm đã được tạo thành công:', response.chat);
    } else {
      console.error('Lỗi tạo nhóm:', response.error);
    }
  }

  handleNewGroupCreated(data) {
    console.log('Bạn đã được thêm vào nhóm:', data.chat.name);
    console.log('Người tạo:', data.createdBy);
  }

  handleNewMessage(data) {
    console.log('Tin nhắn mới từ', data.senderEmail, ':', data.message);
  }

  handleRoomJoined(response) {
    console.log('Đã tham gia phòng:', response.roomId);
  }

  handleRoomJoinFailed(response) {
    console.error('Không thể tham gia phòng:', response.message);
  }

  handleMessageSendFailed(response) {
    console.error('Không thể gửi tin nhắn:', response.message);
  }
}

// Sử dụng
async function initChat() {
  // Đăng nhập để lấy token
  const loginResponse = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'user@example.com',
      password: 'password123',
      device_token: 'web-device',
      type: 'web',
    }),
  });

  const { user } = await loginResponse.json();

  // Khởi tạo chat client với token
  const chatClient = new ChatClient(user.accessToken);

  // Tạo nhóm
  chatClient.createGroup({
    name: 'Nhóm bạn bè',
    type: 'group',
    chatMembers: [
      { userId: 'user-1', role: 'member' },
      { userId: 'user-2', role: 'member' },
    ],
  });

  // Tham gia phòng và gửi tin nhắn
  chatClient.joinRoom('chat-123');
  chatClient.sendMessage('chat-123', 'Xin chào!');
}

initChat();
```

## Lưu ý quan trọng

1. **Authentication bắt buộc**: Tất cả WebSocket connections đều cần JWT token hợp lệ.
2. **Token tự động**: Server sẽ tự động lấy thông tin user từ token, không cần gửi `senderId`.
3. **Quyền truy cập**: Chỉ thành viên trong nhóm mới có thể tham gia phòng và gửi tin nhắn.
4. **Quyền admin**: Chỉ admin mới có thể cập nhật hoặc xóa nhóm.
5. **Xử lý lỗi**: Luôn kiểm tra `response.success` để xử lý lỗi từ server.
6. **Ngắt kết nối**: Server sẽ tự động xóa thông tin user khi ngắt kết nối.
7. **Reconnection**: Khi reconnect, cần gửi lại token để xác thực.
