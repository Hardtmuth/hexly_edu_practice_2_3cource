import { Modal, TextInput, Textarea, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const ProjectCreateModal = ({ opened, onClose, onCreate }) => {
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    onCreate(formData.get('name'), formData.get('description'))
    e.currentTarget.reset()
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('modals.createProject.title', 'Создать проект')} centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput label={t('modals.createProject.name', 'Название')} name="name" required placeholder={t('modals.createProject.namePl', 'Введите название проекта')} data-autofocus />
          <Textarea label={t('modals.createProject.desc', 'Описание')} name="description" rows={3} placeholder={t('modals.createProject.descPl', 'Краткое описание...')} />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>{t('common.cancel', 'Отмена')}</Button>
            <Button type="submit">{t('common.create', 'Создать')}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
