import React from 'react';
import { Upload, Avatar, Button } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';

const AvatarUpload = ({ avatarUrl, avatarFile, onAvatarSelect }) => {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <Avatar 
        size={100} 
        src={avatarUrl || null}
        icon={<UserOutlined />} 
      />
      <div style={{ marginTop: 16 }}>
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={onAvatarSelect}
        >
          <Button icon={<UploadOutlined />}>Chọn avatar mới</Button>
        </Upload>
        {avatarFile && (
          <div style={{ marginTop: 8, color: '#666', fontSize: '12px' }}>
            Đã chọn: {avatarFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvatarUpload;