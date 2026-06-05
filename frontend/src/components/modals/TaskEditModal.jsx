import { Modal, TextInput, Textarea, Group, Button, Title } from '@mantine/core'

import { useTranslation } from 'react-i18next'

export const TaskEditModal = ({ task, onClose, onSave }) => {
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const newName = formData.get('task_name')
    const newDesc = formData.get('task_description')

    onSave(task.task_id, newName, newDesc)
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
            name="task_name"
            defaultValue={task.task_name}
            required
            mb="md"
            data-autofocus
          />

          <Textarea
            label={t('modals.editTask.description')}
            name="task_description"
            defaultValue={task.task_description}
            rows={4}
            mb="xl"
          />

          <Group justify="flex-end">
            <Button
              variant="subtle"
              color="red"
              onClick={() => console.log('Удалить задачу', task.task_id)}
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
