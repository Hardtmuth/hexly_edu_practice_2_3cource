import { Text, Container, SimpleGrid, Card, Title, Center, ActionIcon, Group, Stack, Tooltip } from '@mantine/core'
import classes from '../../assets/styles/Board.module.css'
import { IconPencil, IconPlus, IconLayoutGrid, IconLayoutGridRemove } from '@tabler/icons-react'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { fetchBoard, clearBoard, moveTaskOptimistic, moveTask, updateTaskOnServer, deleteTaskOnServer, createTaskOnServer, createColumnOnServer, deleteColumnOnServer } from '../slices/boardSlice'
import { BoardColMenu } from './BoardColMenu'
import { TaskEditModal } from './modals/TaskEditModal'
import { TaskDeleteModal } from './modals/TaskDeleteModal'
import { TaskCreateModal } from './modals/TaskCreateModal'
import { ColumnCreateModal } from './modals/ColumnCreateModal'

export const Board = () => {
  const { t } = useTranslation()
  const { boardId } = useParams()
  const dispatch = useDispatch()

  const { boardData, loading, error } = useSelector((state) => state.board)
  const [editingTask, setEditingTask] = useState(null)
  const [taskToDeleteId, setTaskToDeleteId] = useState(null)
  const [activeColumnForNewTask, setActiveColumnForNewTask] = useState(null)
  const [hideControls, setHideControls] = useState(false)
  const [isNewColModalOpen, setIsNewColModalOpen] = useState(false)
  const [columnToDeleteId, setColumnToDeleteId] = useState(null)

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoard(boardId))
    }
    return () => {
      dispatch(clearBoard())
    }
  }, [dispatch, boardId])

  const handleCreateTask = (columnId, name, description) => {
    dispatch(createTaskOnServer({ columnId, name, description }))
    setActiveColumnForNewTask(null)
  }

  const handleSaveTask = (taskId, newName, newDesc) => {
    dispatch(updateTaskOnServer({ taskId, name: newName, description: newDesc }))
    setEditingTask(null)
  }

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    dispatch(moveTaskOptimistic({ source, destination }))

    dispatch(moveTask({
      taskId: parseInt(draggableId, 10),
      fromColumnId: parseInt(source.droppableId, 10),
      toColumnId: parseInt(destination.droppableId, 10),
      newIndex: destination.index
    }))
  }

  const handleDeleteTrigger = (taskId) => {
    setTaskToDeleteId(taskId)
  }

  const handleConfirmDelete = () => {
    if (taskToDeleteId) {
      dispatch(deleteTaskOnServer(taskToDeleteId))
      setTaskToDeleteId(null)
      setEditingTask(null)
    }
  }

  const handleDeleteTask = (taskId) => {
    if (window.confirm(t('modals.editTask.confirmDelete', 'Вы уверены, что хотите удалить эту задачу?'))) {
      dispatch(deleteTaskOnServer(taskId))
      setEditingTask(null)
    }
  }

  const handleCreateColumn = (name) => {
  console.log('2. handleCreateColumn вызван в Board.jsx с именем:', name)
  
  if (!boardId) {
    console.error('Ошибка: boardId из useParams равен undefined!')
    return
  }

  dispatch(createColumnOnServer({ 
    projectId: parseInt(boardId, 10), 
    name 
  }))
  
  setIsNewColModalOpen(false)
}

  const handleConfirmDeleteColumn = () => {
    if (columnToDeleteId) {
      dispatch(deleteColumnOnServer(columnToDeleteId))
      setColumnToDeleteId(null)
    }
  }

  const handlerAddCol = () => {
    setIsNewColModalOpen(true)
  }

  const renderTasks = (tasksData) => {
    if (!tasksData || tasksData.length === 0) return null

    return tasksData.map((task, index) => (
      <Draggable
        key={task.id.toString()}
        draggableId={task.id.toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            withBorder
            mb="sm"
            className={`${classes.interactiveCard} ${snapshot.isDragging ? classes.taskDragging : ''}`}
            style={provided.draggableProps.style}
          >

            <Title order={5} pr="xl">{task.name}</Title>

            <ActionIcon
              className={classes.taskActions}
              pos="absolute"
              top={8}
              right={8}
              variant="subtle"
              color="gray"
              onClick={() => setEditingTask(task)}
            >
              <IconPencil size={16} />
            </ActionIcon>

            <Text c="dimmed" size="sm" mt="xs">{task.description}</Text>
          </Card>
        )}
      </Draggable>
    ))
  }

  const renderCols = (colData) => {
    return colData.map((c) => {
      if (!c.id) return null

      return (
        <Droppable droppableId={c.id.toString()} key={c.id.toString()}>
          {(provided, snapshot) => (
            <Card
              ref={provided.innerRef}
              {...provided.droppableProps}
              shadow="sm"
              withBorder
              className={`${classes.columnCard} ${snapshot.isDraggingOver ? classes.columnDraggingOver : ''}`}
            >
              <Group justify="space-between" pos="relative" mb="lg" wrap="nowrap">
                <Title order={4} style={{ wordBreak: 'break-word' }}>
                  {c.name}
                </Title>

                <BoardColMenu
                  onAddTask={() => setActiveColumnForNewTask(c.id)}
                  onClearColumn={() => console.log(`Очистить колонку ${c.id}`)}
                  onDeleteColumn={() => setColumnToDeleteId(c.id)}
                />
              </Group>

              <div style={{ flexGrow: 1 }}>
                {renderTasks(c.tasks)}
                {provided.placeholder}
              </div>
              {!hideControls && (
                <Card
                  mt="xs"
                  p="xs"
                  withBorder
                  className={`${classes.interactiveCard} ${classes.addCard}`}
                  style={{ borderStyle: 'dashed', minHeight: '40px' }}
                  onClick={() => setActiveColumnForNewTask(c.id)}
                >
                  <Center>
                    <Group gap={6}>
                      <IconPlus size={16} style={{ color: 'var(--mantine-color-gray-5)' }} />
                      <Text size="xs" c="dimmed">{t('board.column.addTaskBtn', 'Новая задача')}</Text>
                    </Group>
                  </Center>
                </Card>
              )}
            </Card>
          )}
        </Droppable>
      )
    })
  }

  if (loading) return <Center mt="xl"><Text size="lg">Загрузка доски...</Text></Center>
  if (error) return <Center mt="xl"><Text color="red" size="lg">Ошибка: {error}</Text></Center>
  if (!boardData) return <Center mt="xl"><Text size="lg">Доска не найдена</Text></Center>

  return (
    <Container size="xl">
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={4}>
          <Title order={4}>
            {boardData.title}
          </Title>
          <Text c="dimmed" size="sm">
            {boardData.description}
          </Text>
        </Stack>

        <Tooltip
          label={hideControls ? t('board.tooltip.show', 'Показать элементы управления') : t('board.tooltip.hide', 'Скрыть элементы управления')}
          withArrow
          position="top"
          openDelay={300}
        >
          <ActionIcon 
            variant={hideControls ? 'filled' : 'light'}
            size="lg" 
            color={hideControls ? 'indigo' : 'gray'}
            onClick={() => setHideControls(prev => !prev)}
          >
            {hideControls ? <IconLayoutGrid size={20} /> : <IconLayoutGridRemove size={20} />}
          </ActionIcon>
        </Tooltip>
      </Group>

      <DragDropContext onDragEnd={onDragEnd}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: hideControls ? 4 : 5 }} spacing="md">
          {boardData.cols && boardData.cols.length > 0 ? renderCols(boardData.cols) : null}
          {!hideControls && (
            <Card
              shadow="sm"
              withBorder
              className={`${classes.interactiveCard} ${classes.addCard}`}
              onClick={handlerAddCol}
            >
              <Center style={{ height: '100%' }}>
                <Stack align="center" gap="xs">
                  <IconPlus size={24} style={{ color: 'var(--mantine-color-gray-5)' }} />
                  <Text size="xs" c="dimmed">{t('board.addColumn', 'Добавить колонку')}</Text>
                </Stack>
              </Center>
            </Card>
          )}
        </SimpleGrid>
      </DragDropContext>

      <TaskEditModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
        onDelete={handleDeleteTrigger}
      />

      <TaskCreateModal
        columnId={activeColumnForNewTask}
        onClose={() => setActiveColumnForNewTask(null)}
        onCreate={handleCreateTask}
      />

      <ColumnCreateModal
        opened={isNewColModalOpen}
        onClose={() => setIsNewColModalOpen(false)}
        onCreate={handleCreateColumn}
      />

      <TaskDeleteModal
        opened={columnToDeleteId !== null}
        onClose={() => setColumnToDeleteId(null)}
        onConfirm={handleConfirmDeleteColumn}
      />
    </Container>
  )
}
