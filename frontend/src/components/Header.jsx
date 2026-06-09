import { Box, Button, Group, Avatar, ActionIcon, Alert } from '@mantine/core'
import { IconLogout, IconDeviceIpadHorizontal, IconCheck } from '@tabler/icons-react'
import classes from '../../assets/styles/Header.module.css'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { Brand } from './Brand'
import { ColorSchemeSwitcher } from './ColorSchemeSwitcher'
import { logout, updateAccountOnServer, deleteAccountOnServer } from '../slices/authSlice'

import { UserMenu } from './UserMenu'
import { ProfileEditModal } from './modals/ProfileEditModal'
import { ColumnDeleteModal } from './modals/ColumnDeleteModal'
import { EmailEditModal } from './modals/EmailEditModal'
import { PasswordEditModal } from './modals/PasswordEditModal'

export const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)
  const userId = user?.id

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isEmailOpen, setIsEmailOpen] = useState(false)
  const [isPasswordOpen, setIsPasswordOpen] = useState(false)
  const [serverEmailError, setServerEmailError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const handlerLogOut = () => {
    console.log('Пользователь вышел из системы')
    dispatch(logout())
    navigate('/', { replace: true })
  }

  const handlerProjectsList = () => {
    if (!userId) {
      console.error('ID пользователя не найден в состоянии')
      navigate('/')
      return
    }

    console.log(`Переход к списку проектов пользователя: ${userId}`)
    navigate(`/user/${userId}/list`)
  }

  const handleSaveProfile = (column, value) => {
    setServerEmailError(null)

    dispatch(updateAccountOnServer({ column, value }))
      .unwrap()
      .then(() => {
        let msg = t('profile.success.name', 'Имя успешно обновлено!')
        if (column === 'email') msg = t('profile.success.email', 'Email успешно изменен!')
        if (column === 'password') msg = t('profile.success.password', 'Пароль успешно изменен!')

        setSuccessMessage(msg)
        
        setIsEditOpen(false)
        setIsEmailOpen(false)
        setIsPasswordOpen(false)

        setTimeout(() => setSuccessMessage(null), 3000)
      })
      .catch((errorMsg) => {
        if (column === 'email') {
          setServerEmailError(errorMsg)
        } else {
          console.error('Ошибка обновления профиля:', errorMsg)
        }
      })
  }

  const handleConfirmDeleteAccount = () => {
    dispatch(deleteAccountOnServer())
      .unwrap()
      .then(() => {
        setIsDeleteOpen(false)
        navigate('/', { replace: true })
      })
  }

  return (
    <Box pb={30}>
      {successMessage && (
        <Alert 
          variant="filled" 
          color="teal" 
          icon={<IconCheck size={16} />}
          style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, boxShadow: 'var(--mantine-shadow-md)' }}
        >
          {successMessage}
        </Alert>
      )}
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group visibleFrom="sm">
            <Button variant="default" onClick={handlerProjectsList}>
              <Group gap={5}>
                <IconDeviceIpadHorizontal stroke={1} size={20} />
                {t('header.projects')}
              </Group>
            </Button>
          </Group>

          <Brand />

          <Group visibleFrom="sm">
            <UserMenu
              user={user}
              onEditClick={() => setIsEditOpen(true)}
              onDeleteClick={() => setIsDeleteOpen(true)}
              onLogoutClick={handlerLogOut}
              onEmailClick={() => setIsEmailOpen(true)}
              onPasswordClick={() => setIsPasswordOpen(true)}
            />
            <ColorSchemeSwitcher />
            <ActionIcon variant="default" size={36} onClick={handlerLogOut}>
              <IconLogout stroke={1} size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </header>

      <ProfileEditModal key={`name-${user?.id}`} user={user} opened={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={handleSaveProfile} />

      <EmailEditModal 
        key={`email-${user?.id}`} 
        user={user} 
        opened={isEmailOpen} 
        onClose={() => { setIsEmailOpen(false); setServerEmailError(null); }} 
        onSave={handleSaveProfile} 
        error={serverEmailError}
        clearError={() => setServerEmailError(null)}
      />

      <PasswordEditModal opened={isPasswordOpen} onClose={() => setIsPasswordOpen(false)} onSave={handleSaveProfile} />

      <ColumnDeleteModal
        opened={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
        title={t('modals.deleteAccount.title', 'Удаление аккаунта')}
        message={t('modals.deleteAccount.message', 'Вы уверены, что хотите НАВСЕГДА удалить свой аккаунт? Все ваши проекты, доски, колонки и задачи будут безвозвратно стерты из базы данных. Это действие нельзя отменить.')}
      />
    </Box>
  )
}
