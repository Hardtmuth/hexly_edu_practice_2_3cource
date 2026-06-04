import { Text, Group } from '@mantine/core'
import { IconLayoutKanban } from '@tabler/icons-react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'

export const Brand = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handlerBrand = () => {
    console.log('You are going to Start page')
    navigate('/')
  }

  return (
    <Group onClick={handlerBrand} style={{ cursor: 'pointer' }}>
      <IconLayoutKanban size={30} color="var(--mantine-color-indigo-6)" />
      <Text size="xl" c="indigo.6">
        {t('loginPage.brand')}
      </Text>
    </Group>
  )
}
