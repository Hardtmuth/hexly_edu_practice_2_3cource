import { Box, Button, Group, Avatar, ActionIcon } from '@mantine/core'
import { IconLogout, IconDeviceIpadHorizontal  } from '@tabler/icons-react'
import classes from '../../assets/styles/Header.module.css'

import { Brand } from './Brand'
import { ColorSchemeSwitcher } from './ColorSchemeSwitcher'

export const Header = () => {
  return (
    <Box pb={120}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%">
          <Group visibleFrom="sm">
            <Button variant="default">
              <Group gap={5}>
                <IconDeviceIpadHorizontal stroke={1} size={20} />
                Проекты
              </Group>
            </Button>
          </Group>

          <Brand />

          <Group visibleFrom="sm">
            <Avatar color="indigo" radius="xl">US</Avatar>
            <ColorSchemeSwitcher />
            <ActionIcon variant="default" size={36}>
              <IconLogout stroke={1} size={20} />
            </ActionIcon>
          </Group>
        </Group>
      </header>
    </Box>
  )
}