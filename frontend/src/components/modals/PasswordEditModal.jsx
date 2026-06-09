import { Modal, PasswordInput, Group, Button, Stack } from '@mantine/core'
import { useForm, isNotEmpty, hasLength, matchesField } from '@mantine/form'
import { useTranslation } from 'react-i18next'

export const PasswordEditModal = ({ opened, onClose, onSave }) => {
  const { t } = useTranslation()

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { password: '', confirmPassword: '' },
    validate: {
      password: (value) => {
        const empty = isNotEmpty(t('loginPage.form.passwordError'))(value)
        const length = hasLength({ min: 6, max: 20 })(value)
        return empty || length || null
      },
      confirmPassword: (value, values) => {
        const empty = isNotEmpty(t('loginPage.form.passwordError'))(value)
        if (empty) return empty
        return matchesField('password', t('loginPage.form.confirmPasswordError', 'Пароли не совпадают'))(value, values)
      }
    }
  })

  const handleSubmit = (values) => {
    onSave('password', values.password)
    form.reset()
  }

  return (
    <Modal opened={opened} onClose={onClose} title={t('modals.profile.editPassword', 'Изменить пароль')} centered>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <PasswordInput label={t('modals.profile.passLabel', 'Новый пароль')} key={form.key('password')} {...form.getInputProps('password')} data-autofocus />
          <PasswordInput label={t('modals.profile.confirmPassLabel', 'Подтвердите пароль')} key={form.key('confirmPassword')} {...form.getInputProps('confirmPassword')} />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" color="gray" onClick={() => { form.reset(); onClose(); }}>{t('common.cancel', 'Отмена')}</Button>
            <Button type="submit">{t('common.save', 'Сохранить')}</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  )
}
