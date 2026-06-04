import { Text, Group } from '@mantine/core'
import { IconLayoutKanban } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

export const Brand = () => {
  const { t } = useTranslation()
  return (
    <Group>
      <IconLayoutKanban size={30} color="var(--mantine-color-indigo-6)" />
      <Text size="xl" c="indigo.6">
        {t('loginPage.brand')}
      </Text>
    </Group>
  )
}
