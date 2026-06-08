import { Modal, Text, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const ColumnDeleteModal = ({
  opened,
  onClose,
  onConfirm,
  title, // Принимаем кастомный заголовок (например, для очистки)
  message, // Принимаем кастомный текст сообщения
}) => {
  const { t } = useTranslation()

  // Определяем итоговый текст: если проп передан — берем его, если нет — дефолтный для удаления
  const modalTitle = title || t('modals.deleteColumn.title', 'Удаление колонки')
  const modalMessage = message || t('modals.deleteColumn.message', 'Вы уверены, что хотите удалить эту колонку? Все задачи внутри этой колонки также будут удалены окончательно. Это действие нельзя отменить.')

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={modalTitle} // Используем готовую переменную
      centered
      size="sm"
      radius="md"
      zIndex={3000}
    >
      <Stack gap="md">
        <Text size="sm">
          {modalMessage}
          {' '}
          {/* Используем готовую переменную */}
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="subtle" color="gray" onClick={onClose}>
            {t('common.cancel', 'Отмена')}
          </Button>
          <Button color="red" onClick={onConfirm}>
            {t('common.delete', 'Подтвердить')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
