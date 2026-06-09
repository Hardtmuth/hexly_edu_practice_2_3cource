import { Modal, TextInput, Group, Button, Stack } from '@mantine/core'
import { useTranslation } from 'react-i18next'

export const ColumnInsertModal = ({ config, onClose, onInsert }) => {
  const { t } = useTranslation()

  const handleSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name')

    if (config) {
      onInsert(config.referenceColumnId, config.direction, name)
    }
    e.currentTarget.reset()
  }

  const getModalTitle = () => {
    if (!config) return ''
    return config.direction === 'left'
      ? t('modals.insertColumn.titleLeft', 'Добавить колонку слева')
      : t('modals.insertColumn.titleRight', 'Добавить колонку справа')
  }

  return (
    <Modal
      opened={config !== null}
      onClose={onClose}
      title={getModalTitle()}
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label={t('modals.insertColumn.nameLabel', 'Название новой колонки')}
            name="name"
            required
            placeholder={t('modals.insertColumn.placeholder', 'Введите название...')}
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
