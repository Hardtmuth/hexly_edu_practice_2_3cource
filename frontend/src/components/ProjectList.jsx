import { Container, Title, Card, Text, SimpleGrid, Center } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import classes from '../../assets/styles/Board.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { fetchProjects } from '../slices/projectsSlice.js'

export const ProjectList = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projects } = useSelector(state => state.projects)

  const { isAuthenticated, token } = useSelector(state => state.auth)
  const { userId } = useParams()

  useEffect(() => {
    if (userId && userId !== 'undefined' && (isAuthenticated || token || localStorage.getItem('token'))) {
      dispatch(fetchProjects(userId))
    }
  }, [dispatch, userId, isAuthenticated, token])

  const handlerCard = (cardInfo) => {
    const boardId = cardInfo.id
    console.log(`Переход на доску: ${cardInfo.title} (ID: ${boardId})`)
    navigate(`/user/${userId}/board/${boardId}`)
  }

  const handlerAddCard = () => {
    console.log('going to add card')
  }

  const renderCards = (boardList) => {
    return boardList.map(b => (
      <Card
        key={b.name}
        shadow="sm"
        withBorder
        className={classes.interactiveCard}
        onClick={() => handlerCard(b)}
      >
        <Title order={4}>
          {b.name}
        </Title>
        <Text size="sm" c="dimmed" mt="sm">
          {b.description}
        </Text>
      </Card>
    ))
  }

  return (
    <Container size="xl">
      <Title order={2} mb="lg">
        {t('projectList.my')}
      </Title>

      <SimpleGrid cols={5}>
        {renderCards(projects)}
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
