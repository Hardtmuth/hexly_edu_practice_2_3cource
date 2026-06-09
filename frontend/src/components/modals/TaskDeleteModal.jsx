import { Modal, Text, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const TaskDeleteModal = ({ opened, onClose, onConfirm }) => {
  const { t } = useTranslation()

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('modals.deleteTask.title', 'Удаление задачи')}
      size="sm"
      radius="md"
      zIndex={3000}
    >
      <Stack gap="md">
        <Text size="sm">
          {t('modals.deleteTask.message', 'Вы уверены, что хотите окончательно удалить эту задачу? Это действие нельзя отменить.')}
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            {t('modals.deleteTask.btnCancel', 'Отмена')}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {t('modals.deleteTask.btnConfirm', 'Удалить')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
