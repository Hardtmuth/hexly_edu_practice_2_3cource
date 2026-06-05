import { Text, Container, SimpleGrid, Card, Title, Center, ActionIcon, Group, Stack, Tooltip } from '@mantine/core'
import classes from '../../assets/styles/Board.module.css'
import { IconPencil, IconPlus, IconLayoutGridRemove } from '@tabler/icons-react'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import { BoardColMenu } from './BoardColMenu'
import { TaskEditModal } from './modals/TaskEditModal'

const initialBoardData = {
  id: 1,
  name: 'Board 1',
  description: 'Some description text',
  cols: [
    { name: 'backlog', tasks: [{ task_id: 1, task_name: 'Test Task 1', task_description: 'Somr description task text 1' }, { task_id: 2, task_name: 'Test Task 2', task_description: 'Somr description task text 2' }] },
    { name: 'sprint', tasks: [{ task_id: 3, task_name: 'Test Task 3', task_description: 'Somr description task text 3' }] },
    { name: 'doing', tasks: [{ task_id: 5, task_name: 'Test Task 5', task_description: 'Somr description task text 5' }] },
    { name: 'testing', tasks: [] },
    { name: 'done', tasks: [{ task_id: 4, task_name: 'Test Task 4', task_description: 'Somr description task text 4' }] },
  ],
}

export const Board = () => {
  const { t } = useTranslation()
  const [board, setBoard] = useState(initialBoardData)
  const [editingTask, setEditingTask] = useState(null)

  const handleSaveTask = (taskId, newName, newDesc) => {
    setBoard(prev => ({
      ...prev,
      cols: prev.cols.map(col => ({
        ...col,
        tasks: col.tasks.map(task =>
          task.task_id === taskId
            ? { ...task, task_name: newName, task_description: newDesc }
            : task,
        ),
      })),
    }))

    setEditingTask(null)
  }

  const onDragEnd = (result) => {
    const { source, destination } = result

    if (!destination) return

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const newCols = [...board.cols]
    const sourceCol = newCols.find(col => col.name === source.droppableId)
    const destCol = newCols.find(col => col.name === destination.droppableId)

    if (!sourceCol || !destCol) return

    const [movedTask] = sourceCol.tasks.splice(source.index, 1)
    destCol.tasks.splice(destination.index, 0, movedTask)

    setBoard({ ...board, cols: newCols })
  }

  const handlerAddCol = () => {
    console.log('going to add column')
  }

  const renderTasks = (tasksData) => {
    return tasksData.map((task, index) => (
      <Draggable
        key={task.task_id.toString()}
        draggableId={task.task_id.toString()}
        index={index}
      >
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            withBorder
            mb="sm"
            // Объединяем базовый класс интерактивной карточки и класс состояния перетаскивания
            className={`${classes.interactiveCard} ${snapshot.isDragging ? classes.taskDragging : ''}`}
            style={provided.draggableProps.style} // Системные стили DND оставляем
          >
            <Title order={5} pr="xl">{task.task_name}</Title>
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
            <Text c="dimmed" size="sm">{task.task_description}</Text>
          </Card>
        )}
      </Draggable>
    ))
  }

  const renderCols = (colData) => {
    return colData.map(c => (
      <Droppable droppableId={c.name} key={c.name}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.droppableProps}
            shadow="sm"
            withBorder
            // Объединяем класс колонки и класс состояния, когда над ней держат карточку
            className={`${classes.columnCard} ${snapshot.isDraggingOver ? classes.columnDraggingOver : ''}`}
          >
            <Group justify="center" pos="relative" mb="lg">
              <Title order={4}>
                {t(c.name)}
              </Title>

              <BoardColMenu
                onClearColumn={() => console.log(`Очистить ${c.name}`)}
                onDeleteColumn={() => console.log(`Удалить ${c.name}`)}
              />
            </Group>

            {renderTasks(c.tasks)}
            {provided.placeholder}
          </Card>
        )}
      </Droppable>
    ))
  }

  return (
    <Container size="xl">
      <Group justify="space-between" align="center" mb="xl">
        <Stack gap={4}>
          <Title order={4}>
            {initialBoardData.name}
          </Title>
          <Text c="dimmed" size="sm">
            {initialBoardData.description}
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
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 6 }} spacing="md">
          {board.cols.length > 0 // Исправлено чтение из актуального стейта board вместо статического initialBoardData
            ? renderCols(board.cols)
            : <></>}

          <Card
            shadow="sm"
            withBorder
            className={`${classes.interactiveCard} ${classes.addCard}`}
            onClick={handlerAddCol}
          >
            <Center style={{ height: '100%' }}>
              <Text size="sm" c="dimmed" mt="sm">
                <IconPlus size={22} />
              </Text>
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
