import { Modal, TextInput, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const ColumnCreateModal = ({ opened, onClose, onCreate }) => {
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    onCreate(name)
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('modals.createColumn.title', 'Создать новую колонку')}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('modals.createColumn.name', 'Название колонки')}
            name="name"
            required
            placeholder={t('modals.createColumn.placeholder', 'Например: Готово к ревью')}
            data-autofocus
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              {t('common.cancel', 'Отмена')}
            </Button>
            <Button type="submit">
              {t('common.create', 'Создать')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
