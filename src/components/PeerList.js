import React from 'react';
import styled from 'styled-components';
import { FiUser, FiWifi, FiClock } from 'react-icons/fi';

const PeerListContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PeerItem = styled.div`
  background: ${props => props.selected ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.selected ? 'white' : '#333'};
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.selected ? 'transparent' : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const PeerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
`;

const PeerName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const PeerStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  opacity: 0.8;
`;

const PeerInfo = styled.div`
  font-size: 0.85rem;
  opacity: 0.7;
  margin-top: 5px;
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 20px;
  font-style: italic;
`;

const OnlineIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #4CAF50;
  animation: pulse 2s infinite;
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

function PeerList({ peers, selectedPeer, onPeerSelect, userInfo }) {
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Just now';
    const now = new Date();
    const diff = now - new Date(lastSeen);
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <PeerListContainer>
      <Title>
        <FiWifi />
        Connected Peers
      </Title>
      
      {peers.length === 0 ? (
        <EmptyState>
          <FiUser size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
          <div>No peers found</div>
          <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
            Make sure other devices are connected to the same WiFi
          </div>
        </EmptyState>
      ) : (
        peers.map(peer => (
          <PeerItem
            key={peer.id}
            selected={selectedPeer && selectedPeer.id === peer.id}
            onClick={() => onPeerSelect(peer)}
          >
            <PeerHeader>
              <FiUser />
              <PeerName>{peer.name}</PeerName>
              <OnlineIndicator />
            </PeerHeader>
            
            <PeerStatus>
              <FiWifi />
              {peer.ip}
            </PeerStatus>
            
            <PeerInfo>
              <FiClock />
              Last seen: {formatLastSeen(peer.lastSeen)}
            </PeerInfo>
          </PeerItem>
        ))
      )}
    </PeerListContainer>
  );
}

export default PeerList;
