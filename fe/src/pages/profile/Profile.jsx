import React, { useEffect } from 'react';
import { Card, Form, Spin } from 'antd';
import { useProfile } from './hooks/useProfile';
import AvatarUpload from './components/AvatarUpload';
import ProfileForm from './components/ProfileForm';

const Profile = () => {
  const [form] = Form.useForm();
  const {
    loading,
    profileLoading,
    currentUser,
    avatarFile,
    avatarUrl,
    updateProfile,
    handleAvatarSelect,
    loadUserProfile
  } = useProfile();

  useEffect(() => {
    if (currentUser) {
      form.setFieldsValue({
        Username: currentUser.username,
        FullName: currentUser.fullName,
        Email: currentUser.email,
        Phone: currentUser.phone
      });
    }
  }, [currentUser, form]);

  if (profileLoading) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <Card title="Thông tin cá nhân">
        <AvatarUpload 
          avatarUrl={avatarUrl}
          avatarFile={avatarFile}
          onAvatarSelect={handleAvatarSelect}
        />
        <ProfileForm 
          form={form}
          currentUser={currentUser}
          loading={loading}
          onSubmit={updateProfile}
        />
      </Card>
    </div>
  );
};

export default Profile;