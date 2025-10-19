import React from 'react';
import styled from 'styled-components';
import { FiWifi, FiUsers, FiUser } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: #333;
  font-size: 2rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const StatusItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.connected ? '#4CAF50' : '#f44336'};
  font-weight: 500;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.9rem;
`;

const ConnectionStatus = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.connected ? '#4CAF50' : '#f44336'};
  animation: ${props => props.connected ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

function Header({ connected, userInfo, peerCount }) {
  return (
    <HeaderContainer>
      <Title>
        <FiWifi />
        PC-CONN
      </Title>
      
      <StatusContainer>
        <StatusItem connected={connected}>
          <ConnectionStatus connected={connected} />
          {connected ? 'Connected' : 'Disconnected'}
        </StatusItem>
        
        <StatusItem connected={true}>
          <FiUsers />
          {peerCount} peers online
        </StatusItem>
        
        <UserInfo>
          <FiUser />
          {userInfo.name || 'Anonymous'}
        </UserInfo>
      </StatusContainer>
    </HeaderContainer>
  );
}

export default Header;
