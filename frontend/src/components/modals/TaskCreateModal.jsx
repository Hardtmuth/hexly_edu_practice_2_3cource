import { Modal, TextInput, Textarea, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const TaskCreateModal = ({ columnId, onClose, onCreate }) => {
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')
    const description = formData.get('description')

    onCreate(columnId, name, description)
    e.currentTarget.reset()
  }

  return (
    <Modal
      opened={columnId !== null}
      onClose={onClose}
      title={t('modals.createTask.title', 'Создать задачу')}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('modals.createTask.name', 'Название')}
            name="name"
            required
            placeholder={t('modals.createTask.namePlaceholder', 'Что нужно сделать?')}
            data-autofocus
          />

          <Textarea
            label={t('modals.createTask.description', 'Описание')}
            name="description"
            rows={3}
            placeholder={t('modals.createTask.descPlaceholder', 'Детали задачи...')}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              {t('modals.createTask.btnCancel', 'Отмена')}
            </Button>
            <Button type="submit">
              {t('modals.createTask.btnCreate', 'Создать')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
