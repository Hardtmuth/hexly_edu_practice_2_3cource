import { Button, Container, Text, Title, Grid, Group } from '@mantine/core'
import classes from '../../assets/styles/LoginPage.module.css'
import { IconLayoutKanban } from '@tabler/icons-react'

import { useTranslation } from 'react-i18next'

import { SignInForm } from '../components/SignInUpForm'

export const LoginPage = () => {
  const { t } = useTranslation()

  return (
    <div className={classes.root}>
      <Container size="xl">
        <Grid>
          <Grid.Col span={6}>
            <div className={classes.inner}>
              <div className={classes.content}>
                <Title className={classes.title}>
                  <Text
                    component="span"
                    inherit
                    variant="gradient"
                    gradient={{ from: 'pink', to: 'yellow' }}
                  >
                    {t('loginPage.title.part1')}
                  </Text>
                  {' '}
                  {t('loginPage.title.part2')}
                </Title>

                <Text className={classes.description} mt={30}>
                  {t('loginPage.description')}
                </Text>

              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={3}>
          </Grid.Col>
          <Grid.Col span={2} mt={80}>
            <Group mb="lg">
              <IconLayoutKanban size={30} color="var(--mantine-color-indigo-6)" />
              <Text size="xl" c="indigo.6">
                {t('loginPage.brand')}
              </Text>
            </Group>
            <SignInForm />
          </Grid.Col>
        </Grid>
      </Container>
    </div>
  )
}
