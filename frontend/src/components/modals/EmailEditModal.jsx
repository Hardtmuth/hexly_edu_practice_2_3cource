import { Modal, TextInput, Group, Button, Stack, Alert } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useState, useEffect } from 'react'

export const EmailEditModal = ({ user, opened, onClose, onSave, error, clearError }) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState(user?.email || '')

  useEffect(() => {
    if (opened && user) {
      setEmail(user.email || '')
    }
  }, [opened, user])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave('email', email)
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('modals.profile.editEmail', 'Сменить email')} centered>
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          {error && (
            <Alert variant="light" color="red" title={t('common.error', 'Ошибка')} icon={<IconAlertCircle size={16} />}>
              {error}
            </Alert>
          )}

          <TextInput
            label={t('modals.profile.emailLabel', 'Новый email')}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) clearError()
            }}
            required
            data-autofocus
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={onClose}>{t('common.cancel', 'Отмена')}</Button>
            <Button type="submit">{t('common.save', 'Сохранить')}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
