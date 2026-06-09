import { TextInput, PasswordInput, Button, Anchor, Text, Stack, Alert } from '@mantine/core'
import { useForm, isNotEmpty, hasLength, isEmail, matchesField } from '@mantine/form'
import { IconAt, IconUser, IconAlertCircle } from '@tabler/icons-react'

import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'

import { login, register } from '../slices/authSlice.js'

export const SignInForm = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formType, setFormType] = useState('login')
  const [serverError, setServerError] = useState(null)

  const handleSubmit = (values) => {
    setServerError(null)
    const { _confirmPassword, ...submitValues } = values
    const action = formType === 'login' ? login(submitValues) : register(submitValues)

    dispatch(action)
      .unwrap()
      .then((payload) => {
        const userId = payload.user?.id
        console.log(`Успешно (${formType}), Пользователь ID:`, userId)

        if (!userId) {
          console.error('Критическая ошибка: Бэкенд не прислал ID пользователя!', payload)
          return
        }

        navigate(`/user/${userId}/list`)
      })
      .catch((errorMsg) => {
        console.error(`Ошибка при ${formType}:`, errorMsg)
        setServerError(errorMsg)
      })
  }

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: (value) => {
        if (formType === 'register') {
          return isNotEmpty(t('loginPage.form.nameError', 'Имя не должно быть пустым'))(value)
        }
        return null
      },
      email: isEmail(t('loginPage.form.emailError')),
      password: (value) => {
        const emptyCheck = isNotEmpty(t('loginPage.form.passwordError'))(value)
        const lengthCheck = hasLength({ min: 6, max: 20 })(value)
        if (emptyCheck) return emptyCheck
        if (lengthCheck) return lengthCheck
        return null
      },
      confirmPassword: (value, values) => {
        if (formType === 'register') {
          const emptyCheck = isNotEmpty(t('loginPage.form.passwordError'))(value)
          if (emptyCheck) return emptyCheck

          return matchesField('password', t('loginPage.form.confirmPasswordError', 'Пароли не совпадают'))(value, values)
        }
        return null
      },
    },
  })

  const handleTypeChange = (type) => {
    setFormType(type)
    setServerError(null)
    form.reset()
  }

  return (
    <Stack gap="md">
      <form onSubmit={form.onSubmit(values => handleSubmit(values))}>
        {serverError && (
          <Alert
            variant="light"
            color="red"
            title={t('common.error', 'Ошибка')}
            icon={<IconAlertCircle size={16} />}
            mb="md"
            radius="md"
          >
            {serverError}
          </Alert>
        )}
        {formType === 'register' && (
          <TextInput
            placeholder={t('loginPage.form.namePlaceholder', 'Имя')}
            rightSection={<IconUser size={16} />}
            key={form.key('name')}
            {...form.getInputProps('name')}
            mb="md"
            onChange={(e) => {
              form.getInputProps('name').onChange(e)
              if (serverError) setServerError(null)
            }}
          />
        )}

        <TextInput
          placeholder="Email"
          rightSection={<IconAt size={16} />}
          key={form.key('email')}
          {...form.getInputProps('email')}
          onChange={(e) => {
            form.getInputProps('email').onChange(e)
            if (serverError) setServerError(null)
          }}
        />

        <PasswordInput
          mt="md"
          placeholder="Пароль"
          key={form.key('password')}
          {...form.getInputProps('password')}
          onChange={(e) => {
            form.getInputProps('password').onChange(e)
            if (serverError) setServerError(null)
          }}
        />

        {formType === 'register' && (
          <PasswordInput
            mt="md"
            placeholder={t('loginPage.form.confirmPasswordPlaceholder', 'Подтвердите пароль')}
            key={form.key('confirmPassword')}
            {...form.getInputProps('confirmPassword')}
            onChange={(e) => {
              form.getInputProps('confirmPassword').onChange(e)
              if (serverError) setServerError(null)
            }}
          />
        )}

        <Button
          variant="gradient"
          gradient={{ from: 'pink', to: 'yellow' }}
          mt="lg"
          style={{ width: '100%' }}
          type="submit"
        >
          {formType === 'login' ? t('loginPage.form.button') : t('loginPage.form.registerButton', 'Зарегистрироваться')}
        </Button>
      </form>

      <Text ta="center" size="sm" mt="xs" component="span" style={{ display: 'block' }}>
        {formType === 'login'
          ? (
              <>
                <Text component="span" c="orange">
                  {t('loginPage.noAccount', 'Ещё нет аккаунта? ')}
                </Text>
                <Anchor component="button" type="button" onClick={() => handleTypeChange('register')}>
                  {t('loginPage.linkRegister', 'Зарегистрироваться')}
                </Anchor>
              </>
            )
          : (
              <>
                <Text component="span" c="orange">
                  {t('loginPage.hasAccount', 'Уже есть аккаунт? ')}
                </Text>
                <Anchor component="button" type="button" onClick={() => handleTypeChange('login')}>
                  {t('loginPage.linkLogin', 'Войти')}
                </Anchor>
              </>
            )}
      </Text>
    </Stack>
  )
}
