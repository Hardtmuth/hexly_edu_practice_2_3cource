import { Container, Title, Card, Text, SimpleGrid, Center } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import { useTranslation } from 'react-i18next'

import classes from '../../assets/styles/Board.module.css'

const boards = [
  { title: 'Default', description: 'Some Description text' },
  { title: 'Board 1', description: 'Board 1 Description text' },
  { title: 'Test', description: 'Test Description text' },
]

const handlerCard = (cardInfo) => {
  console.log('going to', cardInfo.title)
}

const handlerAddCard = () => {
  console.log('going to add card')
}

const renderCards = (boardList) => {
  return boardList.map(b => (
    <Card
      key={b.title}
      shadow="sm"
      withBorder
      className={classes.interactiveCard}
      onClick={() => handlerCard(b)}
    >
      <Title order={4}>
        {b.title}
      </Title>
      <Text size="sm">
        {b.description}
      </Text>
    </Card>
  ))
}

export const ProjectList = () => {
  const { t } = useTranslation()
  return (
    <Container size="xl">
      <Title order={2} mb="lg">
        {t('projectList.my')}
      </Title>

      <SimpleGrid cols={5}>
        {renderCards(boards)}
        <Card
          shadow="sm"
          withBorder
          className={`${classes.interactiveCard} ${classes.addCard}`}
          onClick={handlerAddCard}
        >
          <Center style={{ height: '100%' }}>
            <Text size="sm" c="dimmed" mt="sm">
              <IconPlus size={22} />
            </Text>
          </Center>
        </Card>
      </SimpleGrid>
    </Container>
  )
}
