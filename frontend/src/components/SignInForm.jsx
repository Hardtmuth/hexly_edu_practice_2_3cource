import { TextInput, PasswordInput, Button, Card, Text } from '@mantine/core'
import { useForm, isNotEmpty, hasLength, isEmail } from '@mantine/form'
import { IconAt } from '@tabler/icons-react'

// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'

// import { login } from '../slices/authSlice.js'

export const SignInForm = () => {
  const { t } = useTranslation()
  // const dispatch = useDispatch()
  // const navigate = useNavigate()
  // const { loading, error } = useSelector((state) => state.auth)

  /*
  const handleSubmit = (values) => {
    dispatch(login(values))
      .unwrap()
      .then(() => {
        console.log('Успешная авторизация')
        navigate('/user')
      })
      .catch((errorMsg) => {
        console.error('Ошибка:', errorMsg)
      })
  }
  */

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },

    validate: {
      email: isEmail(t('loginPage.form.emailError')),
      password: (value) => {
        const emptyCheck = isNotEmpty(t('loginPage.form.passwordError'))(value)
        const lengthCheck = hasLength({ min: 6, max: 20 })(value)
        if (emptyCheck) return emptyCheck
        if (lengthCheck) return lengthCheck
        return null
      },
    },
  })

  return (
    <form onSubmit={form.onSubmit(values => console.log(values))}>
      <TextInput
        styles={{
          input: {
            backgroundColor: 'var(--mantine-color-indigo-8)',
            borderColor: 'var(--mantine-color-indigo-9)',
          },
        }}
        mt="md"
        placeholder="Email"
        rightSection={<IconAt size={16} />}
        key={form.key('email')}
        {...form.getInputProps('email')}
      />
      <PasswordInput
        styles={{
          input: {
            backgroundColor: 'var(--mantine-color-indigo-8)',
            borderColor: 'var(--mantine-color-indigo-9)',
          },
        }}
        mt="md"
        placeholder="Password"
        key={form.key('password')}
        {...form.getInputProps('password')}
      />
      <Button
        variant="gradient"
        gradient={{ from: 'pink', to: 'yellow' }}
        mt="lg"
        style={{ width: '100%' }}
      >
        {t('loginPage.form.button')}
      </Button>
    </form>
  )
}
