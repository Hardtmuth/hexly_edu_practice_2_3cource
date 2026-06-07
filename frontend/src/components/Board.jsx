import { Text, Container, SimpleGrid, Card, Title, Center, ActionIcon, Group, Stack, Tooltip } from '@mantine/core'
import classes from '../../assets/styles/Board.module.css'
import { IconPencil, IconPlus, IconLayoutGridRemove } from '@tabler/icons-react'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { useDispatch, useSelector } from 'react-redux'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { fetchBoard, clearBoard } from '../slices/boardSlice'
import { BoardColMenu } from './BoardColMenu'
import { TaskEditModal } from './modals/TaskEditModal'

export const Board = () => {
  const { t } = useTranslation()
  const { boardId } = useParams()
  const dispatch = useDispatch()

  const { boardData, loading, error } = useSelector((state) => state.board)
  const [editingTask, setEditingTask] = useState(null)

  useEffect(() => {
    if (boardId) {
      dispatch(fetchBoard(boardId))
    }
    return () => {
      dispatch(clearBoard())
    }
  }, [dispatch, boardId])

  const handleSaveTask = (taskId, newName, newDesc) => {
    console.log('Сохранение задачи:', { taskId, newName, newDesc })
    // dispatch(updateTask({ taskId, name: newName, description: newDesc }))
    setEditingTask(null)
  }

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    console.log('Задача перемещена:', {
      taskId: result.draggableId,
      fromColumnId: source.droppableId,
      toColumnId: destination.droppableId,
      newIndex: destination.index
    })

    // dispatch(moveTask({ ... }))
  }

  const handlerAddCol = () => {
    console.log('Открытие модалки создания колонки')
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
                  onClearColumn={() => console.log(`Очистить колонку ${c.id}`)}
                  onDeleteColumn={() => console.log(`Удалить колонку ${c.id}`)}
                />
              </Group>

              {renderTasks(c.tasks)}
              {provided.placeholder}
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
          label={t('board.tooltip')}
          withArrow
          position="top"
          openDelay={300}
        >
          <ActionIcon variant="light" size="lg" color="gray">
            <IconLayoutGridRemove size={20} />
          </ActionIcon>
        </Tooltip>
      </Group>

      <DragDropContext onDragEnd={onDragEnd}>
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 5 }} spacing="md">
          {boardData.cols && boardData.cols.length > 0 ? renderCols(boardData.cols) : null}

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
        </SimpleGrid>
      </DragDropContext>

      <TaskEditModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveTask}
      />
    </Container>
  )
}
