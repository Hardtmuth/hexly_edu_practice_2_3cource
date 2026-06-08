import { Box, Button, Group, Avatar, ActionIcon } from '@mantine/core'
import { IconLogout, IconDeviceIpadHorizontal } from '@tabler/icons-react'
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

export const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector(state => state.auth.user)
  const userId = user?.id

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

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
    dispatch(updateAccountOnServer({ column, value }))
    setIsEditOpen(false)
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
            />
            <ColorSchemeSwitcher />
            <ActionIcon variant="default" size={36} onClick={handlerLogOut}>
              <IconLogout stroke={1} size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </header>
      <ProfileEditModal
        key={user?.id || 'empty'}
        user={user}
        opened={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSaveProfile}
      />

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
