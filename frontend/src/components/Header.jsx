import { Box, Button, Group, Avatar, ActionIcon } from '@mantine/core'
import { IconLogout, IconDeviceIpadHorizontal } from '@tabler/icons-react'
import classes from '../../assets/styles/Header.module.css'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

import { Brand } from './Brand'
import { ColorSchemeSwitcher } from './ColorSchemeSwitcher'

export const Header = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handlerLogOut = () => {
    console.log('You are logged out')
    navigate('/')
  }

  const handlerProjectsList = () => {
    console.log('You are going to Project List')
    navigate('/list')
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
            <Avatar color="indigo" radius="xl">US</Avatar>
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
