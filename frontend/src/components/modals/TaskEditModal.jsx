import { Modal, TextInput, Textarea, Group, Button } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const TaskEditModal = ({ task, onClose, onSave, onDelete }) => {
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const newName = formData.get('name')
    const newDesc = formData.get('description')

    onSave(task.id, newName, newDesc)
  }

  return (
    <Modal
      opened={task !== null}
      onClose={onClose}
      title={t('modals.editTask.title')}
    >
      {task && (
        <form onSubmit={handleSubmit}>
          <TextInput
            label={t('modals.editTask.name')}
            name="name"
            defaultValue={task.name}
            required
            mb="md"
            data-autofocus
          />

          <Textarea
            label={t('modals.editTask.description')}
            name="description"
            defaultValue={task.description} 
            rows={4}
            mb="xl"
          />

          <Group justify="flex-end">
            <Button
              variant="subtle"
              color="red"
              onClick={() => onDelete(task.id)} 
            >
              {t('modals.editTask.btnDelete')}
            </Button>
            <Button variant="subtle" color="gray" onClick={onClose}>
              {t('modals.editTask.btnCancel')}
            </Button>
            <Button type="submit">
              {t('modals.editTask.btnSave')}
            </Button>
          </Group>
        </form>
      )}
    </Modal>
  )
}
