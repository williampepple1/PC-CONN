import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiDownload, FiFile, FiFolder, FiSend, FiX } from 'react-icons/fi';

const FileBrowserContainer = styled.div`
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

const DropZone = styled.div`
  border: 2px dashed ${props => props.isDragActive ? '#667eea' : '#ddd'};
  border-radius: 10px;
  padding: 40px;
  text-align: center;
  background: ${props => props.isDragActive ? 'rgba(102, 126, 234, 0.1)' : '#f8f9fa'};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
  }
`;

const DropZoneText = styled.div`
  color: #666;
  font-size: 1.1rem;
  margin-bottom: 10px;
`;

const DropZoneSubtext = styled.div`
  color: #999;
  font-size: 0.9rem;
`;

const FileList = styled.div`
  flex: 1;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  background: white;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
  
  &:hover {
    background: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const FileIcon = styled.div`
  margin-right: 15px;
  color: #667eea;
`;

const FileInfo = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
`;

const FileSize = styled.div`
  color: #666;
  font-size: 0.9rem;
`;

const FileActions = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  background: ${props => props.primary ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.primary ? 'white' : '#333'};
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #666;
  padding: 40px 20px;
  font-style: italic;
`;

const SelectedPeerInfo = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PeerName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const CloseButton = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

function FileBrowser({ files, selectedPeer, onFileSend, socket }) {
  const [uploadingFiles, setUploadingFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    if (!selectedPeer) {
      alert('Please select a peer first');
      return;
    }

    acceptedFiles.forEach(file => {
      setUploadingFiles(prev => [...prev, file]);
      onFileSend(file, selectedPeer);
    });
  }, [selectedPeer, onFileSend]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(extension)) {
      return <FiFile style={{ color: '#e74c3c' }} />;
    } else if (['mp4', 'avi', 'mov', 'wmv', 'flv'].includes(extension)) {
      return <FiFile style={{ color: '#9b59b6' }} />;
    } else if (['mp3', 'wav', 'flac', 'aac'].includes(extension)) {
      return <FiFile style={{ color: '#f39c12' }} />;
    } else if (['pdf'].includes(extension)) {
      return <FiFile style={{ color: '#e74c3c' }} />;
    } else if (['doc', 'docx'].includes(extension)) {
      return <FiFile style={{ color: '#3498db' }} />;
    } else if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) {
      return <FiFolder style={{ color: '#95a5a6' }} />;
    }
    return <FiFile style={{ color: '#95a5a6' }} />;
  };

  return (
    <FileBrowserContainer>
      <Title>
        <FiFile />
        File Browser
      </Title>

      {selectedPeer ? (
        <SelectedPeerInfo>
          <PeerName>Sharing with: {selectedPeer.name}</PeerName>
          <CloseButton onClick={() => window.location.reload()}>
            <FiX />
          </CloseButton>
        </SelectedPeerInfo>
      ) : (
        <div style={{ 
          background: '#fff3cd', 
          color: '#856404', 
          padding: '15px', 
          borderRadius: '10px', 
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          Select a peer to start sharing files
        </div>
      )}

      <DropZone {...getRootProps()} isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <FiUpload size={48} style={{ color: '#667eea', marginBottom: '10px' }} />
        <DropZoneText>
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to select'}
        </DropZoneText>
        <DropZoneSubtext>
          Files will be sent to {selectedPeer ? selectedPeer.name : 'selected peer'}
        </DropZoneSubtext>
      </DropZone>

      <FileList>
        {files.length === 0 ? (
          <EmptyState>
            <FiFile size={48} style={{ opacity: 0.3, marginBottom: '10px' }} />
            <div>No files available</div>
            <div style={{ fontSize: '0.9rem', marginTop: '5px' }}>
              Upload files to share with {selectedPeer ? selectedPeer.name : 'peers'}
            </div>
          </EmptyState>
        ) : (
          files.map((file, index) => (
            <FileItem key={index}>
              <FileIcon>
                {getFileIcon(file.name)}
              </FileIcon>
              <FileInfo>
                <FileName>{file.name}</FileName>
                <FileSize>{formatFileSize(file.size)}</FileSize>
              </FileInfo>
              <FileActions>
                <ActionButton
                  primary
                  onClick={() => onFileSend(file, selectedPeer)}
                  disabled={!selectedPeer}
                >
                  <FiSend />
                  Send
                </ActionButton>
                <ActionButton>
                  <FiDownload />
                  Download
                </ActionButton>
              </FileActions>
            </FileItem>
          ))
        )}
      </FileList>
    </FileBrowserContainer>
  );
}

export default FileBrowser;
