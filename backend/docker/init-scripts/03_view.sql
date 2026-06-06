CREATE OR REPLACE VIEW board AS
SELECT
  p.id,
  p.name AS title,
  p.description,
  json_agg(
    json_build_object(
      'id', c.id,
      'position', c.position,
      'name', c.name,
      'tasks', COALESCE(tc.tasks, '[]'::json)
    )
    ORDER BY c.position
  ) AS cols
FROM projects p
LEFT JOIN columns c ON c.project_id = p.id
LEFT JOIN (
  SELECT
    t.column_id,
    json_agg(
      json_build_object(
        'id', t.id,
        'position', t.position,
        'status', t.status,
        'name', t.title,
        'description', t.description
      )
      ORDER BY t.position
    ) AS tasks
  FROM tasks t
  GROUP BY t.column_id
) tc ON tc.column_id = c.id
GROUP BY p.id, p.name, p.description
ORDER BY p.id;
