import React, { useState } from 'react';
import styled from 'styled-components';
import { FiSettings, FiWifi, FiUser, FiRefreshCw } from 'react-icons/fi';

const ConnectionContainer = styled.div`
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

const StatusCard = styled.div`
  background: ${props => props.connected ? 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)' : 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)'};
  color: white;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
`;

const StatusText = styled.div`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 10px;
`;

const StatusSubtext = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const InfoCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
`;

const InfoTitle = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e0e0e0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const InfoValue = styled.div`
  color: #333;
  font-weight: 500;
  font-family: monospace;
  font-size: 0.9rem;
`;

const ActionButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  margin-bottom: 10px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const RefreshButton = styled.button`
  background: #f8f9fa;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    background: #e9ecef;
    transform: translateY(-1px);
  }
`;

const InputGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  color: #333;
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

function ConnectionManager({ connected, userInfo, onUserInfoUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userInfo.name || '');

  const handleNameUpdate = () => {
    if (editName.trim()) {
      onUserInfoUpdate(prev => ({ ...prev, name: editName.trim() }));
      setIsEditing(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <ConnectionContainer>
      <Title>
        <FiSettings />
        Connection
      </Title>

      <StatusCard connected={connected}>
        <StatusText>
          {connected ? 'Connected to Network' : 'Disconnected'}
        </StatusText>
        <StatusSubtext>
          {connected 
            ? 'Ready to share files with peers' 
            : 'Check your WiFi connection and try again'
          }
        </StatusSubtext>
      </StatusCard>

      <InfoCard>
        <InfoTitle>
          <FiUser />
          Your Information
        </InfoTitle>
        
        <InfoItem>
          <InfoLabel>Name:</InfoLabel>
          {isEditing ? (
            <Input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleNameUpdate}
              onKeyPress={(e) => e.key === 'Enter' && handleNameUpdate()}
              autoFocus
            />
          ) : (
            <InfoValue onClick={() => setIsEditing(true)} style={{ cursor: 'pointer' }}>
              {userInfo.name || 'Click to set name'}
            </InfoValue>
          )}
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Device ID:</InfoLabel>
          <InfoValue>{userInfo.id || 'Generating...'}</InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>IP Address:</InfoLabel>
          <InfoValue>{userInfo.ip || 'Detecting...'}</InfoValue>
        </InfoItem>
      </InfoCard>

      <ActionButton onClick={handleRefresh}>
        <FiRefreshCw />
        Refresh Connection
      </ActionButton>

      <RefreshButton onClick={() => setIsEditing(!isEditing)}>
        <FiUser />
        {isEditing ? 'Cancel Edit' : 'Edit Name'}
      </RefreshButton>
    </ConnectionContainer>
  );
}

export default ConnectionManager;
