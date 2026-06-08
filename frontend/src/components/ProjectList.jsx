import { Container, Title, Card, Text, SimpleGrid, Center, ActionIcon } from '@mantine/core'
import { IconPlus, IconPencil } from '@tabler/icons-react'

import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import classes from '../../assets/styles/Board.module.css'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { fetchProjects, createProjectOnServer, updateProjectOnServer, deleteProjectOnServer } from '../slices/projectsSlice.js'

import { ProjectCreateModal } from './modals/ProjectCreateModal'
import { ProjectEditModal } from './modals/ProjectEditModal'
import { ColumnDeleteModal } from './modals/ColumnDeleteModal'

export const ProjectList = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { projects } = useSelector(state => state.projects)

  const { isAuthenticated, token } = useSelector(state => state.auth)
  const { userId } = useParams()

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [projectToDeleteId, setProjectToDeleteId] = useState(null)

  useEffect(() => {
    if (userId && userId !== 'undefined' && (isAuthenticated || token || localStorage.getItem('token'))) {
      dispatch(fetchProjects(userId))
    }
  }, [dispatch, userId, isAuthenticated, token])

  const handleCreateProject = (name, description) => {
    dispatch(createProjectOnServer({ userId: parseInt(userId, 10), name, description }))
    setIsCreateOpen(false)
  }

  const handleSaveProject = (id, name, description) => {
    dispatch(updateProjectOnServer({ id, name, description }))
    setEditingProject(null)
  }

  const handlerCard = (cardInfo) => {
    const boardId = cardInfo.id
    console.log(`Переход на доску: ${cardInfo.title} (ID: ${boardId})`)
    navigate(`/user/${userId}/board/${boardId}`)
  }

  const handleDeleteTrigger = (projectId) => {
    setProjectToDeleteId(projectId)
  }

  const handleConfirmDeleteProject = () => {
    if (projectToDeleteId) {
      dispatch(deleteProjectOnServer(projectToDeleteId))
      setProjectToDeleteId(null)
      setEditingProject(null)
    }
  }

  const renderCards = (boardList) => {
    return boardList.map(b => (
      <Card
        key={b.name}
        shadow="sm"
        withBorder
        className={classes.interactiveCard}
        onClick={() => handlerCard(b)}
        style={{ position: 'relative' }}
      >
        <Title order={4}>
          {b.name}
        </Title>

        <ActionIcon
          className={classes.taskActions}
          pos="absolute"
          top={12}
          right={12}
          variant="subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation()
            setEditingProject(b)
          }}
        >
          <IconPencil size={16} />
        </ActionIcon>

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
          onClick={() => setIsCreateOpen(true)}
        >
          <Center style={{ height: '100%' }}>
            <Text size="sm" c="dimmed" mt="sm">
              <IconPlus size={22} />
            </Text>
          </Center>
        </Card>
      </SimpleGrid>

      <ProjectCreateModal
        opened={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateProject}
      />

      <ProjectEditModal
        key={editingProject?.id || 'empty'}
        project={editingProject}
        onClose={() => setEditingProject(null)}
        onSave={handleSaveProject}
        onDelete={handleDeleteTrigger}
      />

      <ColumnDeleteModal
        opened={projectToDeleteId !== null}
        onClose={() => setProjectToDeleteId(null)}
        onConfirm={handleConfirmDeleteProject}
        title={t('modals.deleteProject.title', 'Удаление проекта')}
        message={t('modals.deleteProject.message', 'Вы уверены, что хотите окончательно удалить этот проект? Все вложенные колонки и задачи будут стерты навсегда. Это действие нельзя отменить.')}
      />
    </Container>
  )
}
