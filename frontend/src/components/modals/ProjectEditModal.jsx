import { Modal, TextInput, Textarea, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const ProjectEditModal = ({ project, onClose, onSave, onDelete }) => {
  const { t } = useTranslation()
  const [name, setName] = useState(project?.name || '')
  const [description, setDescription] = useState(project?.description || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (project) onSave(project.id, name, description)
  }

  return (
    <Modal opened={project !== null} onClose={onClose} title={t('modals.editProject.title', 'Редактировать проект')}>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput label={t('modals.editProject.name', 'Название')} value={name} onChange={e => setName(e.target.value)} required data-autofocus />
          <Textarea label={t('modals.editProject.desc', 'Описание')} value={description} onChange={e => setDescription(e.target.value)} rows={3} />
          <Group justify="space-between" mt="md">
            <Button
              variant="subtle"
              color="red"
              onClick={() => onDelete(project.id)}
            >
              {t('common.delete', 'Удалить')}
            </Button>
            <Group gap="sm">
              <Button variant="subtle" color="gray" onClick={onClose}>{t('common.cancel', 'Отмена')}</Button>
              <Button type="submit">{t('common.save', 'Сохранить')}</Button>
            </Group>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
