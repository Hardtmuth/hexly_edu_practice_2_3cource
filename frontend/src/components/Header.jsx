import { Box, Button, Group, Avatar, ActionIcon } from '@mantine/core'
import { IconLogout, IconDeviceIpadHorizontal } from '@tabler/icons-react'
import classes from '../../assets/styles/Header.module.css'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'

import { Brand } from './Brand'
import { ColorSchemeSwitcher } from './ColorSchemeSwitcher'
import { logout } from '../slices/authSlice'

export const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const userId = user?.id

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

  const getUserInitials = () => {
    if (!user?.name) return 'US'
    return user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
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
            <Avatar color="indigo" radius="xl">{getUserInitials()}</Avatar>
            <ColorSchemeSwitcher />
            <ActionIcon variant="default" size={36} onClick={handlerLogOut}>
              <IconLogout stroke={1} size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </header>
    </Box>
  )
}
