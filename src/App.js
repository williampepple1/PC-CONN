import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import io from 'socket.io-client';
import ConnectionManager from './components/ConnectionManager';
import FileBrowser from './components/FileBrowser';
import PeerList from './components/PeerList';
import Header from './components/Header';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  height: calc(100vh - 100px);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    height: auto;
  }
`;

const LeftPanel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const CenterPanel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
`;

const RightPanel = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [peers, setPeers] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [files, setFiles] = useState([]);
  const [userInfo, setUserInfo] = useState({
    name: '',
    id: '',
    ip: ''
  });

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Get user info
    const getUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/user-info');
        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error('Failed to get user info:', error);
      }
    };

    getUserInfo();

    // Socket event listeners
    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      setConnected(false);
      console.log('Disconnected from server');
    });

    newSocket.on('peers-updated', (peerList) => {
      setPeers(peerList);
    });

    newSocket.on('files-updated', (fileList) => {
      setFiles(fileList);
    });

    newSocket.on('file-received', (fileData) => {
      // Handle incoming file
      const blob = new Blob([fileData.content], { type: fileData.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.name;
      a.click();
      URL.revokeObjectURL(url);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handlePeerSelect = (peer) => {
    setSelectedPeer(peer);
    if (socket) {
      socket.emit('request-files', peer.id);
    }
  };

  const handleFileSend = (file, targetPeer) => {
    if (socket) {
      const reader = new FileReader();
      reader.onload = (e) => {
        socket.emit('send-file', {
          targetPeer: targetPeer.id,
          file: {
            name: file.name,
            size: file.size,
            type: file.type,
            content: e.target.result
          }
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <AppContainer>
      <Header 
        connected={connected} 
        userInfo={userInfo}
        peerCount={peers.length}
      />
      <MainContent>
        <LeftPanel>
          <PeerList 
            peers={peers}
            selectedPeer={selectedPeer}
            onPeerSelect={handlePeerSelect}
            userInfo={userInfo}
          />
        </LeftPanel>
        
        <CenterPanel>
          <FileBrowser 
            files={files}
            selectedPeer={selectedPeer}
            onFileSend={handleFileSend}
            socket={socket}
          />
        </CenterPanel>
        
        <RightPanel>
          <ConnectionManager 
            connected={connected}
            userInfo={userInfo}
            onUserInfoUpdate={setUserInfo}
          />
        </RightPanel>
      </MainContent>
    </AppContainer>
  );
}

export default App;
