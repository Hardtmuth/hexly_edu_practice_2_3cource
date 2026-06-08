import { Modal, TextInput, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const ProfileEditModal = ({ user, opened, onClose, onSave }) => {
  const { t } = useTranslation()
  const [name, setName] = useState(user?.name || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave('name', name)
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('modals.profile.editTitle', 'Редактировать профиль')}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('modals.profile.nameLabel', 'Ваше имя')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            data-autofocus
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>
              {t('common.cancel', 'Отмена')}
            </Button>
            <Button type="submit">
              {t('common.save', 'Сохранить')}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
