import { Menu, ActionIcon } from '@mantine/core'
import {
  IconTrash,
  IconDots,
  IconTicket,
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarRightCollapse,
  IconEdit,
} from '@tabler/icons-react'

import { useTranslation } from 'react-i18next'

export const BoardColMenu = ({
  onAddTask,
  onRename,
  onMoveLeft,
  onMoveRight,
  onAddLeft,
  onAddRight,
  onDeleteColumn,
  onClearColumn,
}) => {
  const { t } = useTranslation()

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="transparent" c="gray" pos="absolute" right={0}>
          <IconDots />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item leftSection={<IconTicket size={14} />} onClick={onAddTask}>
          {t('board.menu.addTask')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconEdit size={14} />} onClick={onRename}>
          {t('board.menu.rename')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconLayoutSidebarLeftCollapse size={14} />} onClick={onMoveLeft}>
          {t('board.menu.moveColLeft')}
        </Menu.Item>

        <Menu.Item leftSection={<IconLayoutSidebarRightCollapse size={14} />} onClick={onMoveRight}>
          {t('board.menu.moveColRight')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item leftSection={<IconLayoutSidebarLeftCollapse size={14} />} onClick={onAddLeft}>
          {t('board.menu.addColLeft')}
        </Menu.Item>

        <Menu.Item leftSection={<IconLayoutSidebarRightCollapse size={14} />} onClick={onAddRight}>
          {t('board.menu.addColRight')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={onClearColumn}>
          {t('board.menu.emptyCol')}
        </Menu.Item>

        <Menu.Item color="red" leftSection={<IconTrash size={14} />} onClick={onDeleteColumn}>
          {t('board.menu.deleteCol')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
