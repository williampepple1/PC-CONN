# PC-CONN - WiFi File Sharing App

A modern React-based application that allows computers on the same WiFi network to connect and share files seamlessly.

## Features

- 🔗 **Real-time peer discovery** - Automatically find other devices on the same network
- 📁 **Drag & drop file sharing** - Easy file transfer with modern UI
- 🎨 **Beautiful, responsive design** - Works on desktop and mobile devices
- ⚡ **WebSocket communication** - Fast, real-time file transfers
- 🔒 **Local network only** - Secure file sharing within your WiFi network
- 📱 **Cross-platform** - Works on Windows, Mac, Linux, and mobile devices

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Devices connected to the same WiFi network

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd PC-CONN
   ```

2. **Install dependencies**
   ```bash
   # Install React app dependencies
   npm install
   
   # Install server dependencies
   cd server
   npm install
   cd ..
   ```

3. **Start the application**
   ```bash
   # Terminal 1: Start the backend server
   cd server
   npm start
   
   # Terminal 2: Start the React app
   npm start
   ```

4. **Open in browser**
   - Navigate to `http://localhost:3000`
   - The app will automatically connect to the backend server

### Usage

1. **Connect to the network**
   - Make sure all devices are connected to the same WiFi
   - Open the app in your browser on each device

2. **Discover peers**
   - The app will automatically show other connected devices
   - Each device gets a unique name and ID

3. **Share files**
   - Select a peer from the left panel
   - Drag and drop files into the center area
   - Files will be sent instantly to the selected peer

4. **Receive files**
   - Incoming files will appear in your file browser
   - Click download to save files to your device

## Project Structure

```
PC-CONN/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── PeerList.js
│   │   ├── FileBrowser.js
│   │   └── ConnectionManager.js
│   ├── App.js
│   ├── index.js
│   └── index.css
├── server/
│   ├── index.js
│   └── package.json
├── package.json
└── README.md
```

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Styled Components** - CSS-in-JS styling
- **React Dropzone** - Drag & drop file handling
- **Socket.io Client** - Real-time communication
- **React Icons** - Beautiful icon set

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.io** - WebSocket communication
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3001
NODE_ENV=development
```

### Network Configuration

The app automatically detects your local IP address. If you need to specify a different server:

1. Update the socket connection in `src/App.js`
2. Change the server URL from `http://localhost:3001` to your server's IP

## Troubleshooting

### Common Issues

1. **Peers not showing up**
   - Ensure all devices are on the same WiFi network
   - Check firewall settings
   - Try refreshing the page

2. **Files not transferring**
   - Check browser console for errors
   - Ensure WebSocket connection is established
   - Try smaller file sizes first

3. **Connection issues**
   - Verify the backend server is running on port 3001
   - Check if the port is blocked by firewall
   - Try accessing `http://localhost:3001` directly

### Development

To run in development mode:

```bash
# Backend with auto-reload
cd server
npm run dev

# Frontend with hot-reload
npm start
```

## Security Notes

- This app is designed for local network use only
- Files are transferred directly between devices
- No data is stored on external servers
- Use only on trusted networks

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the troubleshooting section
- Open an issue on GitHub
- Review the browser console for error messages

---

**Enjoy seamless file sharing on your local network! 🚀**
