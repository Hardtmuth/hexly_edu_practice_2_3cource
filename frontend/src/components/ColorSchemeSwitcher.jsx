import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core'
import { IconSunHigh, IconMoon } from '@tabler/icons-react'
import cx from 'clsx'
import classes from '../../assets/styles/ColorSchemeSwitcher.module.css'

export const ColorSchemeSwitcher = () => {
  const { setColorScheme } = useMantineColorScheme()
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true })

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      size={36}
    >
      <IconSunHigh stroke={1} className={cx(classes.icon, classes.light)} />
      <IconMoon stroke={1} className={cx(classes.icon, classes.dark)} />
    </ActionIcon>
  )
}
