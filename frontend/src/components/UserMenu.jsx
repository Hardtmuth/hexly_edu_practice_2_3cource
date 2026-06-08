import { Menu, Avatar, Text } from '@mantine/core'
import { IconLogout, IconTrash, IconSettings } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const UserMenu = ({ user, onEditClick, onDeleteClick, onLogoutClick }) => {
  const { t } = useTranslation()

  const getInitials = () => {
    if (!user?.name) return 'US'
    return user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Menu shadow="md" width={220} position="bottom-end" radius="md">
      <Menu.Target>
        <Avatar color="indigo" radius="xl" style={{ cursor: 'pointer' }}>
          {getInitials()}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>
          <Text size="xs" fw={700} c="dimmed" style={{ wordBreak: 'break-all' }}>
            {user?.email}
          </Text>
        </Menu.Label>

        <Menu.Divider />

        <Menu.Item
          leftSection={<IconSettings size={16} />}
          onClick={onEditClick}
        >
          {t('header.menu.editProfile', 'Редактировать')}
        </Menu.Item>

        <Menu.Item
          leftSection={<IconLogout size={16} />}
          onClick={onLogoutClick}
        >
          {t('header.menu.logout', 'Выйти')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item
          color="red"
          leftSection={<IconTrash size={16} />}
          onClick={onDeleteClick}
        >
          {t('header.menu.deleteAccount', 'Удалить аккаунт')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
