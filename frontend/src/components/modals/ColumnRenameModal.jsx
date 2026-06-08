import { Modal, TextInput, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

export const ColumnRenameModal = ({ column, onClose, onRename }) => {
  const { t } = useTranslation()

  const [name, setName] = useState(column?.name || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (column) {
      onRename(column.id, name)
    }
  }

  return (
    <Modal
      opened={column !== null}
      onClose={onClose}
      title={t('modals.renameColumn.title', 'Переименовать колонку')}
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('modals.renameColumn.label', 'Новое название')}
            value={name}
            onChange={e => setName(e.target.value)}
            required
            data-autofocus
          />
          <Group justify="flex-end">
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
